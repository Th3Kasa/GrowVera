/**
 * GrowVera autonomous pipeline — orchestrator.
 *
 *   npx tsx pipeline/run.ts --region "Cronulla NSW" --category Plumber --limit 3
 *
 * Runs the full loop: Prospect → Gather → Build → Deploy → Review → Pitch,
 * writing every prospect and its state into the CRM. Runs fully offline with
 * bundled sample data + a template builder. Set OPENROUTER_API_KEY for the cheap
 * open-model build + vision review (default, ~35x cheaper, off the metered Claude
 * pool), or ANTHROPIC_API_KEY for the frontier path. Add GOOGLE_PLACES_API_KEY
 * for live prospecting.
 */
import "./env"; // must be first — loads .env before config reads process.env
import { PROVIDER, hasLLM, hasGooglePlaces, OUTPUT_DIR } from "./config";
import { costReport } from "./llm";
import { createCrm } from "./crmFactory";
import { prospect } from "./prospector";
import { gather } from "./gatherer";
import { buildSite } from "./builder";
import { deploy } from "./deployer";
import { review } from "./reviewer";
import { pitch } from "./pitcher";
import { scoutSignals } from "./signalScout";
import { runOutreach } from "./outreach";
import { getTargetIndex, setTargetIndex } from "../lib/settings";
import targets from "./targets.json";
import type { Business } from "./types";

function arg(name: string, def: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://growvera.com.au").replace(/\/$/, "");
}

async function main() {
  let region = arg("region", process.env.REGION ?? "*");
  let category = arg("category", process.env.CATEGORY ?? "*");
  const limit = parseInt(arg("limit", process.env.LIMIT ?? "5"), 10);

  // Auto-pick a target suburb × trade from the rotation list when no explicit
  // region/category is provided. Advances the index in Airtable Settings so each
  // scheduled run covers a fresh area.
  if (region === "*" || category === "*") {
    const idx = await getTargetIndex();
    const target = targets[idx % targets.length] as { region: string; category: string };
    region = target.region;
    category = target.category;
    await setTargetIndex(idx + 1);
    console.log(`   auto-target [${idx % targets.length}/${targets.length - 1}]: ${region} · ${category}`);
  }

  console.log("\n🌱 GrowVera autonomous pipeline");
  console.log(`   region=${region} · category=${category} · limit=${limit}`);
  const engine = hasLLM() ? PROVIDER.toUpperCase() : "OFF (template mode)";
  const deployMode = process.env.DEPLOY_TARGET ?? "local";
  console.log(`   engine: ${engine} · Places ${hasGooglePlaces() ? "ON" : "OFF (sample data)"} · deploy: ${deployMode}\n`);

  const crm = createCrm();
  await crm.init();

  // Warm leads first (intent signals from last30days research), then cold (Places).
  console.log("① Scouting…");
  const signals = await scoutSignals(region, category, limit);
  const signalById = new Map(signals.map((s) => [s.business.id, s.signal]));
  const cold = await prospect(region, category, limit);
  // Warm signal leads lead the queue; cap the merged list at `limit`.
  const merged: Business[] = [...signals.map((s) => s.business), ...cold]
    .filter((b, i, arr) => arr.findIndex((x) => x.id === b.id) === i)
    .slice(0, limit);
  console.log(`   ${signals.length} warm signal lead(s) · ${cold.length} cold no-website lead(s) → working ${merged.length}\n`);

  let built = 0;
  for (const found of merged) {
    if (crm.has(found.id)) {
      console.log(`   ↷ skip ${found.name} (already in CRM)`);
      continue;
    }
    crm.add(found);
    const signal = signalById.get(found.id);
    if (signal) crm.update(found.id, { signal });

    const business = gather(found);
    console.log(`▸ ${business.name} — ${business.category}, ${business.region} (score ${business.score})`);

    // Build + deploy
    crm.setStatus(business.id, "built");
    let artifact = await buildSite(business);
    let dep = await deploy({ ...artifact });
    artifact = { ...artifact, ...dep };
    // In hosted mode, store the HTML so /demo/[id] can serve it from Airtable.
    crm.update(business.id, {
      site: { slug: artifact.slug, path: dep.path, url: dep.url },
      ...(dep.html ? { demoHtml: dep.html } : {}),
    });
    console.log(`   ② built (${artifact.generatedBy}) → ${dep.url}`);

    // Review (vision QA) — one revision if it fails
    crm.setStatus(business.id, "reviewing");
    let verdict = await review(artifact, business);
    console.log(`   ③ review: ${verdict.reviewedBy === "skipped" ? "skipped" : `${verdict.passed ? "PASS" : "REVISE"} (score ${verdict.score})`}`);
    if (verdict.reviewedBy === "ai" && !verdict.passed && verdict.issues.length) {
      console.log(`      ↻ revising: ${verdict.issues.slice(0, 3).join("; ")}`);
      artifact = await buildSite(business, verdict.issues.join("\n"));
      dep = await deploy(artifact);
      artifact = { ...artifact, ...dep };
      crm.update(business.id, {
        site: { slug: artifact.slug, path: dep.path, url: dep.url },
        ...(dep.html ? { demoHtml: dep.html } : {}),
      });
      verdict = await review(artifact, business);
      console.log(`      re-review: ${verdict.passed ? "PASS" : "still flagged"} (score ${verdict.score})`);
    }
    // Price-gated offer page (demo + prices + booking) is the outreach link.
    const offerUrl = `${siteBase()}/offer/${business.id}`;
    crm.update(business.id, { review: verdict, offerUrl });

    // Draft the personalised pitch (references the signal, links the offer page).
    const message = await pitch(business, offerUrl, signal);
    // status "ready" = drafted & queued; the outreach pass sends and flips to "pitched".
    crm.update(business.id, { pitch: message, status: "ready", touches: 0 });
    console.log(`   ④ drafted:\n      ${message.replace(/\n/g, "\n      ")}\n`);
    built++;
  }

  // Autonomous outreach — capped, suppression-checked, kill-switch gated.
  console.log("⑤ Outreach…");
  const out = await runOutreach(crm);
  console.log(
    out.reason
      ? `   skipped: ${out.reason}`
      : `   sent ${out.sent} · queued ${out.queued} (no email / over cap) · skipped ${out.skipped} (suppressed)`,
  );

  const lapsed = crm.markLapsed();
  await crm.save();

  const cost = costReport();
  console.log("─".repeat(56));
  console.log(`Done. ${built} new sites built · ${out.sent} sent · ${lapsed} leads marked lapsed.`);
  console.log(`Sites written to: ${OUTPUT_DIR}`);
  if (cost.lines.length) {
    console.log("\nClaude usage:");
    cost.lines.forEach((l) => console.log(l));
    console.log(`Total: $${cost.usd.toFixed(4)} USD ≈ $${cost.aud.toFixed(2)} AUD  (~$${(cost.aud / Math.max(built, 1)).toFixed(2)} AUD/site)`);
  }
  console.log("─".repeat(56) + "\n");
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exitCode = 1;
});
