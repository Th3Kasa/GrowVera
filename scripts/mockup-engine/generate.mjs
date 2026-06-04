/**
 * GrowVera Mock-Up Engine
 * lead data -> Claude-written copy -> premium template -> deployable static site
 *
 * Usage:
 *   node scripts/mockup-engine/generate.mjs \
 *     --business="Western Sydney Plumbing" --suburb="Penrith" \
 *     --niche="plumber" --phone="0412 345 678" --rating=4.7 --reviews=92
 *
 * Output:  scripts/mockup-engine/output/<slug>/index.html
 * Preview: open that file in a browser.
 * Deploy:  cd into the output folder and run `vercel --prod` (see README).
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { THEMES, resolveTheme } from "./themes.mjs";
import { writeCopy } from "./copy.mjs";
import { renderElite } from "./template-elite.mjs";
import { slopGate } from "./slop-gate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "output");

const args = {};
process.argv.slice(2).forEach((a) => {
  const [k, v] = a.replace(/^--/, "").split(/=(.*)/s);
  args[k] = v ?? "true";
});

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);

/** Generate a bespoke hero image via Pollinations (free, no API key). */
async function fetchHero(prompt, outPath, seed = Math.floor(Math.random() * 9999)) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1600&height=1100&nologo=true&model=flux&seed=${seed}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Pollinations returned ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return buf.length;
}

async function main() {
  const businessName = args.business;
  if (!businessName) {
    console.log(`Usage: node scripts/mockup-engine/generate.mjs --business="Business Name" --suburb="Suburb" --niche="plumber" [--phone="04..."] [--rating=4.7] [--reviews=92] [--heroImage=URL]`);
    process.exit(1);
  }

  const niche = args.niche || "";
  const themeKey = resolveTheme(niche);
  const theme = THEMES[themeKey];

  const lead = {
    businessName,
    suburb: args.suburb || "Sydney",
    niche: niche || theme.label,
    phone: args.phone || "",
    rating: args.rating || null,
    reviewCount: args.reviews || null,
    heroImage: args.heroImage || null,
  };

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  GrowVera Mock-Up Engine`);
  console.log(`  ${lead.businessName} · ${lead.suburb}`);
  console.log(`  Trade: ${lead.niche}  →  theme: ${themeKey}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  console.log(`\n🤖 Claude is writing the copy...`);
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const copy = await writeCopy(lead, theme, anthropic);
  console.log(`  ✓ Headline: "${copy.heroHeadline}"`);
  console.log(`  ✓ ${copy.services.length} services written`);

  const slug = slugify(`${businessName}-${lead.suburb}`);
  const siteDir = path.join(OUT_DIR, slug);
  const imgDir = path.join(siteDir, "images");
  fs.mkdirSync(imgDir, { recursive: true });

  console.log(`\n🖼️  Generating bespoke hero image (free, Pollinations)...`);
  let heroBytes = 0;
  try {
    heroBytes = await fetchHero(args.heroPrompt || theme.heroPrompt, path.join(imgDir, "hero.jpg"));
    console.log(`  ✓ Hero generated (${Math.round(heroBytes / 1024)} KB)`);
  } catch (e) {
    console.log(`  ⚠️  Image generation failed (${e.message}) — site will still render, regenerate later.`);
  }

  console.log(`\n🎨 Building the site (elite template)...`);
  const html = renderElite({ lead, copy, theme, heroPath: "images/hero.jpg" });

  console.log(`\n🚦 Running the slop gate...`);
  const gate = slopGate(html, { heroBytes });
  if (!gate.pass) {
    throw new Error(`SLOP GATE FAILED:\n   - ${gate.violations.join("\n   - ")}`);
  }
  console.log(`  ✓ Passed — no slop detected.`);

  const outPath = path.join(siteDir, "index.html");
  fs.writeFileSync(outPath, html);

  // Save the lead+copy record alongside, so a mock-up is reproducible/auditable.
  fs.writeFileSync(path.join(siteDir, "mockup.json"), JSON.stringify({ lead, theme: themeKey, copy, createdAt: new Date().toISOString() }, null, 2));

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ✅ Mock-up ready.`);
  console.log(`  📄 Preview: ${outPath}`);
  console.log(`  🚀 Deploy:  cd "${siteDir}" && vercel --prod`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch((e) => { console.error(`\n❌ ${e.message}\n`); process.exit(1); });
