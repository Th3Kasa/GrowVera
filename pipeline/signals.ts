import "./env";
import path from "node:path";
import { extractSignalsFromReport } from "./signalScout";

/**
 * Turn a last30days research report into pipeline/research/signals.json that the
 * scout reads. Run last30days first and save its markdown to
 * pipeline/research/last30days.md (or pass a path):
 *
 *   npx tsx pipeline/signals.ts [path/to/report.md]
 */
async function main() {
  const reportPath = process.argv[2] || path.join(process.cwd(), "pipeline", "research", "last30days.md");
  const n = await extractSignalsFromReport(reportPath);
  console.log(`Done. ${n} signals ready for the scout.`);
}

main().catch((err) => {
  console.error("Signal extraction failed:", err);
  process.exitCode = 1;
});
