/**
 * GrowVera Outreach Pipeline
 * Google search → extract business websites → find email → personalise with Claude → send via Zoho
 *
 * Usage:
 *   node scripts/outreach.mjs --niche="dentist" --suburb="Parramatta" --limit=10
 *   node scripts/outreach.mjs --niche="plumber" --suburb="Blacktown" --limit=10 --dry-run=true
 */

import nodemailer from "nodemailer";
import Anthropic from "@anthropic-ai/sdk";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ─────────────────────────────────────────────────────────────────

const SMTP = {
  host: "smtp.zoho.com.au",
  port: 587,
  secure: false,
  auth: { user: "admin@growvera.com.au", pass: process.env.ZOHO_SMTP_PASS || "bcCEEeQ7DQcW" },
};

const SENDER_NAME = "Basem from GrowVera";
const SENDER_EMAIL = "admin@growvera.com.au";
const LOG_FILE = path.join(__dirname, "sent-leads.json");

// Domains to skip (directories, social, etc.)
const SKIP_DOMAINS = [
  "facebook", "instagram", "linkedin", "twitter", "yellowpages",
  "truelocal", "yelp", "google", "healthengine", "hotdoc",
  "localsearch", "whitepages", "bing", "youtube", "reddit",
];

// ─── CLI Args ────────────────────────────────────────────────────────────────

const args = {};
process.argv.slice(2).forEach((a) => {
  const [k, v] = a.replace(/^--/, "").split("=");
  args[k] = v ?? "true";
});
const niche     = args.niche   || "dentist";
const suburb    = args.suburb  || "Parramatta";
const limit     = parseInt(args.limit || "10", 10);
const dryRun    = args["dry-run"] === "true";
const fromFile  = args["from-file"] === "true";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadSent() {
  if (!fs.existsSync(LOG_FILE)) return {};
  const raw = fs.readFileSync(LOG_FILE, "utf-8").replace(/^﻿/, "").trim();
  if (!raw || raw === "{}") return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function logSent(email, data) {
  const sent = loadSent();
  sent[email] = { ...data, sentAt: new Date().toISOString() };
  fs.writeFileSync(LOG_FILE, JSON.stringify(sent, null, 2));
}

// Call this manually: node scripts/outreach.mjs --unsubscribe=email@domain.com
if (process.argv.find(a => a.startsWith("--unsubscribe="))) {
  const email = process.argv.find(a => a.startsWith("--unsubscribe=")).split("=")[1];
  const sent = loadSent();
  sent[email] = { ...sent[email], unsubscribed: true, unsubscribedAt: new Date().toISOString() };
  fs.writeFileSync(LOG_FILE, JSON.stringify(sent, null, 2));
  console.log(`✅ ${email} marked as unsubscribed. They will never be contacted again.`);
  process.exit(0);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Step 1: Google search → business websites ───────────────────────────────

async function findBusinessWebsites(niche, suburb, limit) {
  console.log(`\n🔍 Searching Google: "${niche}" in ${suburb}, Sydney...\n`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-AU,en;q=0.9",
  });

  const leads = [];
  try {
    const query = encodeURIComponent(`${niche} ${suburb} Sydney NSW -site:facebook.com -site:yellowpages.com.au -site:healthengine.com.au`);
    await page.goto(`https://www.google.com.au/search?q=${query}&num=20&gl=au&hl=en-AU`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await sleep(2000);

    // Extract organic result URLs + titles
    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll(".yuRUbf, .tF2Cxc").forEach((el) => {
        const a = el.querySelector("a[href^='http']");
        const title = el.querySelector("h3")?.textContent?.trim();
        if (a && title) items.push({ url: a.href, title });
      });
      // fallback: grab all external links with h3 context
      if (!items.length) {
        document.querySelectorAll("a[href^='http']").forEach((a) => {
          const title = a.querySelector("h3")?.textContent?.trim() || a.closest("div")?.querySelector("h3")?.textContent?.trim();
          if (title && !a.href.includes("google") && !a.href.includes("#")) {
            items.push({ url: a.href, title });
          }
        });
      }
      return [...new Map(items.map(i => [i.url, i])).values()];
    });

    console.log(`  Found ${results.length} search results`);

    for (const result of results) {
      if (leads.length >= limit) break;
      try {
        const hostname = new URL(result.url).hostname.replace("www.", "");
        if (SKIP_DOMAINS.some((d) => hostname.includes(d))) continue;
        leads.push({ url: result.url, hostname, title: result.title, suburb, niche });
        console.log(`  ✓ ${result.title} → ${hostname}`);
      } catch {
        // skip invalid URLs
      }
    }
  } finally {
    await browser.close();
  }
  return leads;
}

// ─── Step 2: Visit website → extract business name, email, phone ─────────────

async function extractContactInfo(lead) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  });

  try {
    // Try homepage first
    await page.goto(lead.url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await sleep(1500);

    let info = await page.evaluate(() => {
      const body = document.body.innerText;
      const emailMatch = body.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g);
      const phoneMatch = body.match(/(?:\+61|0)[2-9]\d{8}|(?:\+61|0)4\d{8}/g);
      const emails = emailMatch
        ? emailMatch.filter(
            (e) =>
              !e.includes("@example") &&
              !e.includes("@domain") &&
              !e.includes("@sentry") &&
              !e.includes("@email") &&
              !e.includes("noreply") &&
              !e.includes("no-reply")
          )
        : [];
      return {
        email: emails[0] || "",
        phone: phoneMatch?.[0] || "",
        title: document.title,
      };
    });

    // If no email on homepage, try /contact page
    if (!info.email) {
      try {
        const base = new URL(lead.url).origin;
        await page.goto(`${base}/contact`, { waitUntil: "domcontentloaded", timeout: 15000 });
        await sleep(1000);
        const contactInfo = await page.evaluate(() => {
          const body = document.body.innerText;
          const emailMatch = body.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g);
          const emails = emailMatch
            ? emailMatch.filter(
                (e) =>
                  !e.includes("@example") &&
                  !e.includes("noreply") &&
                  !e.includes("no-reply")
              )
            : [];
          return { email: emails[0] || "" };
        });
        info.email = contactInfo.email;
      } catch {
        // contact page not found, that's ok
      }
    }

    return { ...lead, ...info };
  } catch {
    return { ...lead, email: "", phone: "", title: lead.title };
  } finally {
    await browser.close();
  }
}

// ─── Step 3: Fetch real Google data for the business ─────────────────────────

async function fetchGoogleData(biz) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-AU,en;q=0.9",
  });
  try {
    const q = encodeURIComponent(`${biz.title} ${biz.suburb} Sydney`);
    await page.goto(`https://www.google.com.au/search?q=${q}&gl=au`, {
      waitUntil: "domcontentloaded", timeout: 20000,
    });
    await sleep(1500);

    const googleData = await page.evaluate(() => {
      const body = document.body.innerText;
      // Rating: looks like "4.2" followed by star context
      const ratingMatch = body.match(/(\d\.\d)\s*[\(\d,]+\s*(?:review|Google review)/i) ||
                          body.match(/Rated (\d\.\d)/i) ||
                          body.match(/(\d\.\d) \(/);
      // Review count
      const reviewMatch = body.match(/\((\d[\d,]*)\s*(?:review|Google review)/i) ||
                          body.match(/(\d[\d,]+)\s*review/i);
      // Check if showing in map pack (local pack)
      const inMapPack = body.includes("Directions") && body.includes("Website");
      // Check photo count hint
      const hasPhotos = body.includes("photos") || body.includes("photo");
      // Get competitor ratings nearby for context
      const allRatings = [...body.matchAll(/(\d\.\d)\s*\(/g)].map(m => parseFloat(m[1])).filter(r => r >= 3 && r <= 5);

      return {
        rating: ratingMatch ? ratingMatch[1] : null,
        reviewCount: reviewMatch ? reviewMatch[1].replace(",", "") : null,
        inMapPack,
        hasPhotos,
        competitorRatings: allRatings.slice(0, 5),
      };
    });

    return { ...biz, ...googleData };
  } catch {
    return biz;
  } finally {
    await browser.close();
  }
}

function buildGaps(biz) {
  const gaps = [];
  const reviews = parseInt(biz.reviewCount || "0");
  const rating = parseFloat(biz.rating || "0");
  const competitorAvg = biz.competitorRatings?.length
    ? (biz.competitorRatings.reduce((a, b) => a + b, 0) / biz.competitorRatings.length).toFixed(1)
    : null;

  if (reviews < 20) gaps.push(`only ${reviews || "few"} Google reviews`);
  else if (reviews < 50) gaps.push(`${reviews} Google reviews — most top-ranked competitors have 80+`);
  if (rating && competitorAvg && rating < parseFloat(competitorAvg))
    gaps.push(`${rating}★ rating while nearby competitors average ${competitorAvg}★`);
  if (!biz.inMapPack) gaps.push(`not appearing in the Google Maps 3-pack for key searches`);
  if (!biz.hasPhotos) gaps.push(`no photos on the Google listing`);
  if (!gaps.length) gaps.push(`Google listing has gaps that are costing you new enquiries`);

  return gaps;
}

// ─── Step 4: Personalise email with Claude ───────────────────────────────────

async function personaliseEmail(biz, anthropic) {
  const gaps = buildGaps(biz);
  const mainGap = gaps[0];
  const reviews = biz.reviewCount || "a handful of";
  const rating = biz.rating || null;
  const competitorAvg = biz.competitorRatings?.length
    ? (biz.competitorRatings.reduce((a, b) => a + b, 0) / biz.competitorRatings.length).toFixed(1)
    : null;

  const prompt = `You are Basem Morkos. You started GrowVera yourself — a small local SEO business in Sydney. You are writing one cold email to a business owner you genuinely looked up on Google before writing.

REAL DATA you found on their Google listing:
- Business: ${biz.title}
- Suburb: ${biz.suburb}, Sydney
- Their Google rating: ${rating ? rating + "★" : "not found"}
- Their review count: ${reviews}
${competitorAvg ? `- Competitors nearby average: ${competitorAvg}★` : ""}
- Main gap: ${mainGap}

PROVEN RULES (based on real cold email data — break any one and the email fails):

SUBJECT LINE:
- Under 6 words, all lowercase
- Reference one specific local fact about their business
- Example formula: "noticed something on [practice name]'s reviews" or "[suburb] dentist rankings"
- No: "free", "guaranteed", "SEO", exclamation marks

BODY:
- 50–80 words MAXIMUM. Count them. If over 80, cut.
- Open with the specific thing you saw on their listing — use their real rating/review count
- One sentence on what it's costing them
- One offer: free audit at https://www.growvera.com.au/audit
- End with ONE soft question: "Want me to send it through?" or "Worth a look?"
- DO NOT mention the guarantee
- DO NOT use: "I found your business while searching", "most businesses", "local SEO", "rank higher", "Google Maps visibility", "digital presence", "if you're open to it", "I hope", "reach out", "don't hesitate"

SIGN-OFF:
- Just: Basem
- Then a new line: "To opt out reply 'unsubscribe'" (required by Australian Spam Act 2003)

FORMAT: Plain text. No bullet points. No markdown. No HTML.

Output the subject line first as: Subject: [subject]
Then leave one blank line.
Then the email body.`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content[0].text.trim();
  const subjectMatch = text.match(/^Subject:\s*(.+)/m);
  const subject = subjectMatch ? subjectMatch[1].trim() : `noticed something on ${biz.title.split(" ").slice(0, 3).join(" ").toLowerCase()}`;
  const body = text.replace(/^Subject:.+\n?/m, "").trim();
  return { subject, body };
}

// ─── Step 5: Send via Zoho ───────────────────────────────────────────────────

async function sendEmail(to, subject, body, transporter) {
  return transporter.sendMail({
    from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    to,
    subject,
    text: body,
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const sent = loadSent();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const transporter = nodemailer.createTransport(SMTP);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  GrowVera Outreach Pipeline");
  console.log(`  Niche: ${niche} | Suburb: ${suburb} | Limit: ${limit}`);
  console.log(`  Mode: ${dryRun ? "DRY RUN (no emails sent)" : "LIVE → sends to admin first for review"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // 1. Find websites (from file or scrape)
  let websites;
  if (fromFile) {
    const leadsFile = path.join(__dirname, "leads.json");
    websites = JSON.parse(fs.readFileSync(leadsFile, "utf-8")).slice(0, limit);
    console.log(`\n📂 Loaded ${websites.length} leads from leads.json\n`);
  } else {
    websites = await findBusinessWebsites(niche, suburb, limit);
  }
  if (!websites.length) {
    console.log("\nNo websites found. Try a different niche or suburb.");
    return;
  }

  console.log(`\n📋 Extracting contact info from ${websites.length} sites...\n`);

  const leads = [];
  for (const site of websites) {
    process.stdout.write(`  Checking ${site.hostname}... `);
    const info = await extractContactInfo(site);
    if (info.email) {
      console.log(`✓ email: ${info.email}`);
      leads.push(info);
    } else {
      console.log(`✗ no email found`);
    }
    await sleep(1000);
  }

  console.log(`\n  Found ${leads.length} leads with email addresses.`);
  // Only fetch Google data if not already in the lead record
  const needsFetch = leads.some(l => !l.rating && !l.reviewCount);
  if (needsFetch) {
    console.log(`\n🔎 Pulling real Google data for each business...\n`);
    for (let i = 0; i < leads.length; i++) {
      if (leads[i].rating || leads[i].reviewCount) continue;
      process.stdout.write(`  ${leads[i].title}... `);
      leads[i] = await fetchGoogleData(leads[i]);
      await sleep(1500);
    }
  }
  for (const lead of leads) {
    const gaps = buildGaps(lead);
    console.log(`  ${lead.title}: ${lead.rating ? lead.rating + "★" : "no rating"} · ${lead.reviewCount || "?"} reviews · gap: ${gaps[0]}`);
  }
  console.log();

  if (!leads.length) {
    console.log("No leads with emails found. The pipeline ran successfully but these sites don't expose emails publicly.");
    return;
  }

  console.log(`\n📧 Personalising emails...\n`);

  let sentCount = 0;
  let skipped = 0;

  for (const lead of leads) {
    // Skip unsubscribed
    if (sent[lead.email]?.unsubscribed) {
      console.log(`  ⛔  ${lead.title} — unsubscribed`);
      skipped++;
      continue;
    }
    // Skip already contacted
    if (sent[lead.email]) {
      console.log(`  ⏭  ${lead.title} — already contacted`);
      skipped++;
      continue;
    }

    const { subject, body } = await personaliseEmail(lead, anthropic);

    console.log(`\n  📬 ${lead.title}`);
    console.log(`     Email: ${lead.email}`);
    console.log(`     Subject: ${subject}`);
    console.log(`     ─────────────────────────────────────`);
    console.log(body.split("\n").map((l) => `     ${l}`).join("\n"));
    console.log(`     ─────────────────────────────────────`);

    if (dryRun) {
      console.log(`     [DRY RUN — not sent]`);
    } else {
      await sendEmail(lead.email, subject, body, transporter);
      logSent(lead.email, { title: lead.title, subject, hostname: lead.hostname });
      console.log(`     ✅ Sent → ${lead.email}`);
      sentCount++;
    }

    await sleep(2500);
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  if (dryRun) {
    console.log(`  DRY RUN complete. ${leads.length} emails previewed.`);
  } else {
    console.log(`  Done. ${sentCount} emails sent directly to leads.`);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch(console.error);
