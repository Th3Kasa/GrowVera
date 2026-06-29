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
import { Crm } from "./crm";
import { prospect } from "./prospector";
import { gather } from "./gatherer";
import { buildSite } from "./builder";
import { deploy } from "./deployer";
import { review } from "./reviewer";
import { pitch } from "./pitcher";

function arg(name: string, def: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

async function main() {
  const region = arg("region", process.env.REGION ?? "*");
  const category = arg("category", process.env.CATEGORY ?? "*");
  const limit = parseInt(arg("limit", "3"), 10);

  console.log("\n🌱 GrowVera autonomous pipeline");
  console.log(`   region=${region} · category=${category} · limit=${limit}`);
  const engine = hasLLM() ? PROVIDER.toUpperCase() : "OFF (template mode)";
  console.log(`   engine: ${engine} · Places ${hasGooglePlaces() ? "ON" : "OFF (sample data)"}\n`);

  const crm = new Crm();
  await crm.init();

  console.log("① Prospecting…");
  const businesses = await prospect(region, category, limit);
  console.log(`   found ${businesses.length} businesses with no website\n`);

  let built = 0;
  for (const found of businesses) {
    if (crm.has(found.id)) {
      console.log(`   ↷ skip ${found.name} (already in CRM)`);
      continue;
    }
    crm.add(found);

    const business = gather(found);
    console.log(`▸ ${business.name} — ${business.category}, ${business.region} (score ${business.score})`);

    // Build + deploy
    crm.setStatus(business.id, "built");
    let artifact = await buildSite(business);
    let dep = await deploy({ ...artifact });
    artifact = { ...artifact, ...dep };
    crm.update(business.id, { site: { slug: artifact.slug, path: dep.path, url: dep.url } });
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
      crm.update(business.id, { site: { slug: artifact.slug, path: dep.path, url: dep.url } });
      verdict = await review(artifact, business);
      console.log(`      re-review: ${verdict.passed ? "PASS" : "still flagged"} (score ${verdict.score})`);
    }
    crm.update(business.id, { review: verdict, status: "ready" });

    // Pitch
    const message = await pitch(business, dep.url);
    crm.update(business.id, { pitch: message, status: "pitched", touches: 1 });
    console.log(`   ④ pitched:\n      ${message.replace(/\n/g, "\n      ")}\n`);
    built++;
  }

  const lapsed = crm.markLapsed();
  await crm.save();

  const cost = costReport();
  console.log("─".repeat(56));
  console.log(`Done. ${built} new sites built & pitched · ${lapsed} leads marked lapsed.`);
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
