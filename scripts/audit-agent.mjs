/**
 * GrowVera Audit Agent
 * Uncle David's pipeline: scrape → analyse with Claude → generate PDF → notify Basem → send on approval
 *
 * Usage:
 *   node scripts/audit-agent.mjs --business="Parramatta Dental Clinic" --suburb="Parramatta" --email="info@parramattadental.net" --name="Michael"
 *   node scripts/audit-agent.mjs --approve=audit-123456   (sends approved report to client)
 */

import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PENDING_FILE = path.join(__dirname, "pending-audits.json");

// ─── Config ──────────────────────────────────────────────────────────────────

const SMTP = {
  host: "smtp.zoho.com.au",
  port: 587,
  secure: false,
  auth: { user: "admin@growvera.com.au", pass: process.env.ZOHO_SMTP_PASS || "bcCEEeQ7DQcW" },
};

const BASEM_EMAIL = "admin@growvera.com.au";
const FROM = '"Basem from GrowVera" <admin@growvera.com.au>';

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = {};
process.argv.slice(2).forEach((a) => {
  const [k, v] = a.replace(/^--/, "").split(/=(.*)/s);
  args[k] = v ?? "true";
});

// ─── Pending audit store ─────────────────────────────────────────────────────

function loadPending() {
  if (!fs.existsSync(PENDING_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(PENDING_FILE, "utf-8")); } catch { return {}; }
}
function savePending(data) {
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2));
}

// ─── STEP 1: Scrape Google data ───────────────────────────────────────────────

async function scrapeBusinessData(businessName, suburb) {
  console.log(`\n🔍 Scraping Google data for "${businessName}" in ${suburb}...`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-AU,en;q=0.9",
  });

  const data = { businessName, suburb, rankings: [], competitors: [], rating: null, reviewCount: null };

  try {
    // Only fetch competitor context — don't try to detect website/photos/hours (unreliable in headless)
    const niche = businessName.toLowerCase().includes("dental") ? "dentist"
      : businessName.toLowerCase().includes("physio") ? "physiotherapist"
      : businessName.toLowerCase().includes("law") || businessName.toLowerCase().includes("legal") ? "lawyer"
      : businessName.toLowerCase().includes("plumb") ? "plumber"
      : "local business";

    const q = encodeURIComponent(`${niche} ${suburb} Sydney`);
    await page.goto(`https://www.google.com.au/search?q=${q}&gl=au`, { waitUntil: "domcontentloaded", timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    const compData = await page.evaluate(() => {
      const t = document.body.innerText;
      const ratings = [...t.matchAll(/(\d\.\d)\s*\(([\d,]+)/g)]
        .map(m => ({ rating: parseFloat(m[1]), reviews: parseInt(m[2].replace(",","")) }))
        .filter(c => c.rating >= 3.5 && c.reviews > 5)
        .slice(0, 5);
      return { competitors: ratings };
    });

    data.competitors = compData.competitors;
    data.niche = niche;
    console.log(`  ✓ Competitors: ${compData.competitors.length} found`);

  } finally {
    await browser.close();
  }

  return data;
}

// ─── STEP 2: Claude analyses via JSON (parse-safe, no leaking labels) ────────

async function analyseWithClaude(data, anthropic) {
  console.log(`\n🤖 Claude is analysing and writing the audit...`);

  const compAvg = data.competitors.length
    ? (data.competitors.reduce((a, b) => a + b.rating, 0) / data.competitors.length).toFixed(1)
    : null;
  const compAvgReviews = data.competitors.length
    ? Math.round(data.competitors.reduce((a, b) => a + b.reviews, 0) / data.competitors.length)
    : null;

  const prompt = `You are writing a Google audit report for a small Sydney business owner — a dentist, tradie, or local professional. They are NOT technical. Write like you're explaining it to a friend over coffee.

VERIFIED DATA (use only these numbers):
- Business: ${data.businessName}, ${data.suburb}, Sydney
- Google rating: ${data.rating}★ (${data.reviewCount} reviews)
- Competitor average: ${compAvg || "N/A"}★ (${compAvgReviews || "N/A"} reviews avg)
- Niche: ${data.niche}

BANNED WORDS AND PHRASES — never use these: "local pack", "ranking signals", "NAP", "citations", "algorithm", "click-through rate", "velocity", "local SEO", "search visibility", "local relevance", "perceived authority", "local search", "SERP", "local results", "organic", "indexing", "crawl".

Write plain English a busy business owner understands immediately. Use simple words. Focus on what it means for their phone ringing and new customers walking in.

Respond with ONLY a valid JSON object — no text before or after. No markdown. No code fences:

{
  "summary": "2 sentences. Tell them where they stand vs competitors in plain terms — what's strong and what's holding them back.",
  "rating_analysis": "2 sentences. Explain what their star rating means for new customers choosing them. Make it real — e.g. people picking you vs your competitor.",
  "review_analysis": "2 sentences. Explain the review count gap in simple terms. Tell them exactly how many new reviews per month they need to catch up.",
  "action1": "One sentence. A specific, simple action to get more reviews — what to do, when, and how.",
  "action2": "One sentence. A specific, simple action about replying to their existing reviews — why it matters in plain terms.",
  "action3": "One sentence. A simple way to track their progress — nothing technical.",
  "outcome": "2 sentences. What they can realistically expect in 60 days. Talk about more calls and more patients, not metrics."
}`;

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  // Parse JSON — if it fails, we know exactly what went wrong
  let parsed;
  try {
    const raw = msg.content[0].text.trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Claude returned invalid JSON. Raw output:\n${msg.content[0].text}`);
  }

  // Hard validation — fabrication guard
  const FORBIDDEN = ["no website","no photos","no hours","missing hours","not linked",
    "no images","no description","no services","unclaimed","not claimed","business hours","opening hours",
    "local pack","nap consistency","ranking signal","click-through rate","review velocity",
    "local seo","search visibility","local relevance","serp","indexing"];
  const allText = Object.values(parsed).join(" ").toLowerCase();
  const violations = FORBIDDEN.filter(f => allText.includes(f));
  if (violations.length > 0) {
    throw new Error(`AUDIT REJECTED — fabricated claims detected: "${violations.join('", "')}"`);
  }

  // Score
  const rating = parseFloat(data.rating || "3.5");
  const reviews = parseInt(data.reviewCount || "0");
  let score = 30;
  if (rating >= 4.8) score += 35; else if (rating >= 4.5) score += 28; else if (rating >= 4.0) score += 20; else if (rating >= 3.5) score += 10;
  if (reviews >= 200) score += 35; else if (reviews >= 100) score += 28; else if (reviews >= 50) score += 20; else if (reviews >= 20) score += 12; else score += 4;

  const sections = {
    ...parsed,
    SCORE: Math.min(score, 100),
    COMP_AVG: compAvg,
    COMP_AVG_REVIEWS: compAvgReviews,
  };

  console.log(`  ✓ Audit written. Score: ${sections.SCORE}/100`);
  return sections;
}

// ─── STEP 3: Generate HTML report (measured to fit exactly 2 A4 pages) ────────

function generateReportHTML(data, sections, clientName) {
  const score = sections.SCORE;
  const sc = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const sl = score >= 75 ? "Good" : score >= 50 ? "Needs Work" : "Critical";
  const ratingBad = data.rating && sections.COMP_AVG && parseFloat(data.rating) < parseFloat(sections.COMP_AVG);
  const today = new Date().toLocaleDateString("en-AU", { day:"numeric", month:"long", year:"numeric", timeZone:"Australia/Sydney" });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>GrowVera Audit — ${data.businessName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  /* Print setup — exactly 2 A4 pages, no margins */
  @page { size: A4; margin: 0; }
  @media print {
    html, body { width: 210mm; }
    .cover { page-break-after: always; }
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #fff;
    color: #0D0D0B;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 12px;
    width: 210mm;
  }

  /* ── PAGE 1: COVER — fills full A4 ── */
  .cover {
    background: #0D0D0B;
    width: 210mm;
    height: 297mm;
    padding: 48px 52px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    break-after: page;
  }
  .logo { font-size: 19px; font-weight: 800; color: #fff; letter-spacing: -0.04em; }
  .logo span { color: #4ade80; }
  .cover-eyebrow { font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,0.35); margin-bottom: 18px; }
  .cover-h1 { font-size: 50px; font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 0.93; margin-bottom: 16px; }
  .cover-biz { font-size: 19px; font-weight: 700; color: #4ade80; margin-bottom: 5px; }
  .cover-meta { font-size: 11px; color: rgba(255,255,255,0.32); }
  .cover-rule { height: 1px; background: rgba(255,255,255,0.1); margin: 36px 0 28px; }
  .cover-tagline { font-size: 13px; color: rgba(255,255,255,0.4); max-width: 320px; line-height: 1.6; }

  /* ── PAGE 2: REPORT — must fit within 297mm ── */
  .report { width: 210mm; }

  /* Score + summary — compact */
  .top-row { display: grid; grid-template-columns: 160px 1fr; background: #F4F3EF; border-bottom: 2px solid #E2E1DC; }
  .score-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 18px; border-right: 1px solid #E2E1DC; gap: 3px; }
  .score-num { font-size: 48px; font-weight: 900; color: ${sc}; line-height: 1; letter-spacing: -0.04em; }
  .score-denom { font-size: 12px; color: #9E9E9A; font-weight: 500; }
  .score-pill { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #fff; background: ${sc}; padding: 3px 9px; border-radius: 99px; margin-top: 5px; }
  .summary-box { padding: 14px 20px; }
  .summary-box h2 { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: #1A5C3A; margin-bottom: 6px; }
  .summary-box p { font-size: 11.5px; line-height: 1.6; color: #3A3A38; }

  /* Stats strip */
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid #E2E1DC; }
  .stat { padding: 13px 18px; border-right: 1px solid #E2E1DC; }
  .stat:last-child { border-right: none; }
  .stat-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 600; color: #9E9E9A; margin-bottom: 4px; }
  .stat-val { font-size: 24px; font-weight: 900; letter-spacing: -0.03em; line-height: 1; }
  .stat-sub { font-size: 10px; color: #6B6B68; margin-top: 2px; }
  .red { color: #dc2626; } .green { color: #16a34a; }

  /* Two-column analysis */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #E2E1DC; }
  .col { padding: 9px 16px; }
  .col:first-child { border-right: 1px solid #E2E1DC; }
  .col-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700; color: #1A5C3A; margin-bottom: 3px; }
  .col-title { font-size: 12.5px; font-weight: 800; color: #0D0D0B; letter-spacing: -0.02em; margin-bottom: 5px; }
  .col-body { font-size: 11px; line-height: 1.6; color: #4B4B48; }

  /* Priority actions */
  .actions-section { padding: 9px 16px; border-bottom: 1px solid #E2E1DC; }
  .sec-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700; color: #1A5C3A; margin-bottom: 3px; }
  .sec-title { font-size: 12.5px; font-weight: 800; color: #0D0D0B; letter-spacing: -0.02em; margin-bottom: 7px; }
  .actions { display: flex; flex-direction: column; gap: 5px; }
  .action { display: flex; gap: 9px; align-items: flex-start; }
  .action-num { width: 19px; height: 19px; border-radius: 5px; background: #1A5C3A; color: #fff; font-size: 9.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .action-text { font-size: 11px; line-height: 1.58; color: #0D0D0B; font-weight: 500; }

  /* Bottom row: plan + outcome */
  .bottom-row { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #E2E1DC; }
  .plan-col { padding: 9px 16px; border-right: 1px solid #E2E1DC; }
  .outcome-col { padding: 9px 16px; }
  .weeks { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 8px; }
  .week { background: #F4F3EF; border-radius: 5px; padding: 7px 9px; }
  .week-label { font-size: 7px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700; color: #1A5C3A; margin-bottom: 2px; }
  .week-title { font-size: 10.5px; font-weight: 700; color: #0D0D0B; margin-bottom: 1px; }
  .week-desc { font-size: 9.5px; color: #6B6B68; line-height: 1.38; }

  /* CTA */
  .cta { background: #1A5C3A; padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; }
  .cta-left h3 { font-size: 13px; font-weight: 800; color: #fff; letter-spacing: -0.02em; margin-bottom: 3px; }
  .cta-left p { font-size: 11px; color: rgba(255,255,255,0.6); max-width: 340px; line-height: 1.45; }
  .cta-right { text-align: right; flex-shrink: 0; margin-left: 16px; }
  .cta-right span { display: block; font-size: 11px; font-weight: 600; color: #4ade80; line-height: 1.8; }

  /* Footer */
  .footer { background: #F4F3EF; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; }
  .footer-logo { font-size: 13px; font-weight: 800; color: #0D0D0B; letter-spacing: -0.03em; }
  .footer-logo span { color: #1A5C3A; }
  .footer-meta { font-size: 9px; color: #9E9E9A; text-align: right; line-height: 1.6; }
</style>
</head>
<body>

<!-- ══ PAGE 1: COVER ══ -->
<div class="cover">
  <div class="logo">Grow<span>Vera</span></div>
  <div>
    <div class="cover-eyebrow">Google Business Profile Audit</div>
    <div class="cover-h1">Your Google<br/>presence,<br/>analysed.</div>
    <div class="cover-biz">${data.businessName}</div>
    <div class="cover-meta">Prepared for ${clientName || "the business owner"} &nbsp;·&nbsp; ${data.suburb}, Sydney &nbsp;·&nbsp; ${today}</div>
    <div class="cover-rule"></div>
    <div class="cover-tagline">This report covers your Google rating and review position, with the three most impactful actions to improve your local visibility.</div>
  </div>
</div>

<!-- ══ PAGE 2: REPORT ══ -->
<div class="report">

  <!-- Score + Summary -->
  <div class="top-row">
    <div class="score-box">
      <div class="score-num">${score}</div>
      <div class="score-denom">/100</div>
      <div class="score-pill">${sl}</div>
    </div>
    <div class="summary-box">
      <h2>Executive Summary</h2>
      <p>${sections.summary || ""}</p>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat">
      <div class="stat-label">Google Rating</div>
      <div class="stat-val ${ratingBad ? "red" : "green"}">${data.rating || "N/A"}★</div>
      <div class="stat-sub">Competitors avg: ${sections.COMP_AVG || "N/A"}★</div>
    </div>
    <div class="stat">
      <div class="stat-label">Google Reviews</div>
      <div class="stat-val">${data.reviewCount || "0"}</div>
      <div class="stat-sub">Competitors avg: ${sections.COMP_AVG_REVIEWS || "N/A"}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Visibility Score</div>
      <div class="stat-val" style="color:${sc}">${score}/100</div>
      <div class="stat-sub">${sl}</div>
    </div>
  </div>

  <!-- Analysis -->
  <div class="two-col">
    <div class="col">
      <div class="col-label">Rating Analysis</div>
      <div class="col-title">What your star rating means</div>
      <div class="col-body">${sections.rating_analysis || ""}</div>
    </div>
    <div class="col">
      <div class="col-label">Review Analysis</div>
      <div class="col-title">Review count vs competitors</div>
      <div class="col-body">${sections.review_analysis || ""}</div>
    </div>
  </div>

  <!-- Actions -->
  <div class="actions-section">
    <div class="sec-label">Priority Actions</div>
    <div class="sec-title">The 3 things to do first</div>
    <div class="actions">
      ${[sections.action1, sections.action2, sections.action3].filter(Boolean).map((a, i) => `
      <div class="action">
        <div class="action-num">${i + 1}</div>
        <div class="action-text">${a}</div>
      </div>`).join("")}
    </div>
  </div>

  <!-- Delivery + Outcome -->
  <div class="bottom-row">
    <div class="plan-col">
      <div class="sec-label">What GrowVera Does</div>
      <div class="sec-title">4-week delivery plan</div>
      <div class="weeks">
        <div class="week"><div class="week-label">Week 1</div><div class="week-title">Profile Optimisation</div><div class="week-desc">Categories, description, photos, Q&A.</div></div>
        <div class="week"><div class="week-label">Week 2</div><div class="week-title">25 Citations</div><div class="week-desc">Listed on 25 major Australian directories.</div></div>
        <div class="week"><div class="week-label">Week 3</div><div class="week-title">Review System</div><div class="week-desc">Automated review requests after each visit.</div></div>
        <div class="week"><div class="week-label">Week 4+</div><div class="week-title">25 More + Reports</div><div class="week-desc">50 citations. Monthly progress reports.</div></div>
      </div>
    </div>
    <div class="outcome-col">
      <div class="sec-label">Expected Outcome</div>
      <div class="sec-title">What to expect in 60 days</div>
      <div class="col-body" style="margin-top:10px">${sections.outcome || ""}</div>
    </div>
  </div>

  <!-- CTA -->
  <div class="cta">
    <div class="cta-left">
      <h3>Want us to handle this for you?</h3>
      <p>Reply to this email if you'd like us to handle it.</p>
    </div>
    <div class="cta-right">
      <span>admin@growvera.com.au</span>
      <span>growvera.com.au</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-logo">Grow<span>Vera</span></div>
    <div class="footer-meta">Sydney, Australia &nbsp;·&nbsp; ABN 50 329 139 726</div>
  </div>

</div>
</body>
</html>`;
}

// ─── STEP 4: Render HTML to PDF using Playwright ──────────────────────────────

async function renderToPDF(html, outputPath) {
  console.log(`\n📄 Rendering PDF...`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`  ✓ PDF saved: ${outputPath}`);
}

// ─── STEP 5: Email Basem for approval ─────────────────────────────────────────

async function notifyBasem(auditId, data, sections, pdfPath, clientEmail, clientName) {
  console.log(`\n📧 Notifying Basem for approval...`);
  const transporter = nodemailer.createTransport(SMTP);

  const score = sections.SCORE;
  const compAvg = sections.COMP_AVG;

  await transporter.sendMail({
    from: '"GrowVera Audit Agent" <admin@growvera.com.au>',
    to: BASEM_EMAIL,
    subject: `✅ REVIEW NEEDED — Audit ready for ${data.businessName} (Score: ${score}/100)`,
    text: `AUDIT READY FOR YOUR REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Business:    ${data.businessName}
Location:    ${data.suburb}, Sydney
Client:      ${clientName || "Business owner"}
Email:       ${clientEmail}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SUMMARY:
Score: ${score}/100
Rating: ${data.rating || "N/A"}★ (competitors avg: ${compAvg || "N/A"}★)
Reviews: ${data.reviewCount || "0"} (competitors avg: ${sections.COMP_AVG_REVIEWS || "N/A"})

${sections.EXECUTIVE_SUMMARY || ""}

The full audit PDF is attached to this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TO SEND THIS REPORT TO THE CLIENT:

Run this command:
node scripts/audit-agent.mjs --approve=${auditId}

Or to reject and redo:
node scripts/audit-agent.mjs --reject=${auditId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    attachments: [
      { filename: `GrowVera-Audit-${data.businessName.replace(/\s+/g, "-")}.pdf`, path: pdfPath },
    ],
  });

  console.log(`  ✓ Basem notified. Audit ID: ${auditId}`);
}

// ─── STEP 6: Send approved report to client ───────────────────────────────────

async function sendApprovedReport(auditId) {
  const pending = loadPending();
  const audit = pending[auditId];
  if (!audit) { console.log(`❌ Audit ${auditId} not found.`); return; }
  if (audit.sent) { console.log(`⚠️  Audit ${auditId} already sent.`); return; }

  console.log(`\n📤 Sending approved audit to ${audit.clientEmail}...`);
  const transporter = nodemailer.createTransport(SMTP);

  await transporter.sendMail({
    from: FROM,
    to: audit.clientEmail,
    subject: `Your free Google audit — ${audit.businessName}`,
    text: `Hi ${audit.clientName || "there"},

Your audit is attached — scored ${audit.score}/100. Three specific actions inside.

If you'd like us to implement it, reply and I'll send a quote.

Basem
GrowVera — admin@growvera.com.au

To opt out reply 'unsubscribe'`,
    attachments: [
      { filename: `GrowVera-Audit-${audit.businessName.replace(/\s+/g, "-")}.pdf`, path: audit.pdfPath },
    ],
  });

  pending[auditId].sent = true;
  pending[auditId].sentAt = new Date().toISOString();
  savePending(pending);
  console.log(`  ✅ Audit sent to ${audit.clientEmail}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Handle approval
  if (args.approve) { await sendApprovedReport(args.approve); return; }

  // Handle rejection
  if (args.reject) {
    const pending = loadPending();
    delete pending[args.reject];
    savePending(pending);
    console.log(`🗑  Audit ${args.reject} rejected and removed.`);
    return;
  }

  // Run new audit
  const businessName = args.business;
  const suburb = args.suburb || "Sydney";
  const clientEmail = args.email;
  const clientName = args.name || "";
  const knownRating = args.rating || null;
  const knownReviews = args.reviews || null;
  const knownCompAvg = args.compavg || null;

  if (!businessName || !clientEmail) {
    console.log("Usage: node scripts/audit-agent.mjs --business=\"Business Name\" --suburb=\"Suburb\" --email=\"client@email.com\" --name=\"Client Name\" [--rating=4.1] [--reviews=138] [--compavg=4.7]");
    return;
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  GrowVera Audit Agent`);
  console.log(`  Business: ${businessName} | ${suburb}`);
  console.log(`  Client email: ${clientEmail}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Run pipeline
  let data = await scrapeBusinessData(businessName, suburb);

  // Override with known real data if provided (more accurate than headless scraping)
  if (knownRating) data.rating = knownRating;
  if (knownReviews) data.reviewCount = knownReviews;
  if (knownCompAvg) data.competitors = [{ rating: parseFloat(knownCompAvg), reviews: 200 }];
  const sections = await analyseWithClaude(data, anthropic);
  const html = generateReportHTML(data, sections, clientName);

  // Save PDF
  const auditId = `audit-${Date.now()}`;
  const pdfDir = path.join(__dirname, "reports");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
  const pdfPath = path.join(pdfDir, `${auditId}.pdf`);
  await renderToPDF(html, pdfPath);

  // Save pending record
  const pending = loadPending();
  pending[auditId] = { businessName, suburb, clientEmail, clientName, score: sections.SCORE, pdfPath, createdAt: new Date().toISOString(), sent: false };
  savePending(pending);

  // Notify Basem
  await notifyBasem(auditId, data, sections, pdfPath, clientEmail, clientName);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ✅ Audit complete.`);
  console.log(`  📋 Audit ID: ${auditId}`);
  console.log(`  📧 Report PDF sent to your inbox for review.`);
  console.log(`  👉 To send to client: node scripts/audit-agent.mjs --approve=${auditId}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
