import { promises as fs } from "node:fs";
import path from "node:path";
import { MODELS, hasLLM } from "./config";
import { complete, extractJson } from "./llm";
import { clamp, stableId } from "./util";
import type { Business } from "./types";

/**
 * Warm-lead scout. Cold prospecting (Google Places) finds businesses with no
 * website; the signal scout finds businesses/people *actively expressing intent*
 * in the last 30 days ("need more leads", "my website's rubbish", "how do I get
 * more jobs") — a warmer signal. It reads structured signals from
 * pipeline/research/signals.json (produced from a last30days run, see
 * extractSignalsFromReport) and turns them into scored leads carrying the
 * original quote + source link for genuinely personalised outreach.
 *
 * No signals.json → returns [] (the pipeline falls back to Places/sample). We
 * never fabricate leads.
 */

export interface SignalLead {
  business: Business;
  /** The intent quote + source link that warmed this lead. */
  signal: string;
}

interface RawSignal {
  business?: string; // business name if identifiable
  category: string; // trade/industry
  region: string; // suburb / area
  quote: string; // what they actually said
  url?: string; // source link (reddit/x/etc.)
  phone?: string;
  website?: string | null;
}

const RESEARCH_DIR = path.join(process.cwd(), "pipeline", "research");
const SIGNALS_PATH = path.join(RESEARCH_DIR, "signals.json");

/** Intent is warmer than a cold no-website lead, so it starts higher. */
function scoreSignal(b: Business): number {
  let s = 62; // warm baseline (vs 50 cold)
  if (b.phone) s += 8;
  if (typeof b.rating === "number") s += clamp((b.rating - 3.5) * 10, 0, 14);
  if (b.website) s -= 6; // they have a site, slightly lower opportunity
  return Math.round(clamp(s));
}

function matches(s: RawSignal, region: string, category: string): boolean {
  const regionOk = region === "*" || s.region.toLowerCase().includes(region.toLowerCase()) || region.toLowerCase().includes(s.region.toLowerCase());
  const catOk = category === "*" || s.category.toLowerCase() === category.toLowerCase();
  return regionOk && catOk;
}

export async function scoutSignals(region = "*", category = "*", limit = 5): Promise<SignalLead[]> {
  let raw: RawSignal[];
  try {
    raw = JSON.parse(await fs.readFile(SIGNALS_PATH, "utf8")) as RawSignal[];
  } catch {
    return []; // no signals file yet — nothing to scout
  }

  const out: SignalLead[] = [];
  for (const s of raw) {
    if (!s.quote || !s.category || !s.region) continue;
    if (!matches(s, region, category)) continue;
    const name = s.business?.trim() || `${s.category} (${s.region})`;
    const business: Business = {
      id: stableId(name, s.region),
      name,
      category: s.category,
      region: s.region,
      phone: s.phone,
      website: s.website ?? null,
      photos: [],
      source: "signal",
    };
    business.score = scoreSignal(business);
    const signal = s.url ? `${s.quote} — ${s.url}` : s.quote;
    out.push({ business, signal });
  }

  return out.sort((a, b) => (b.business.score ?? 0) - (a.business.score ?? 0)).slice(0, limit);
}

const EXTRACT_SYSTEM = `You extract structured B2B lead signals from research about a local market. Return ONLY a JSON array. Each item: {"business": string|null, "category": string, "region": string, "quote": string, "url": string|null, "phone": string|null}. Include ONLY signals showing a local business need (wanting more customers/leads, a poor or missing website, marketing struggles). Use the person's/business's own words for "quote". Do not invent businesses, phone numbers, or URLs — use null when unknown. Australian context.`;

/**
 * Turn a last30days markdown report into signals.json using the cheap model.
 * Lets the scheduled research routine feed the scout automatically.
 */
export async function extractSignalsFromReport(reportPath: string): Promise<number> {
  if (!hasLLM()) {
    console.warn("[signalScout] no LLM configured — cannot extract signals.");
    return 0;
  }
  const report = await fs.readFile(reportPath, "utf8");
  const text = await complete({
    model: MODELS.cheap,
    system: EXTRACT_SYSTEM,
    prompt: `Extract lead signals from this research:\n\n${report.slice(0, 30000)}`,
    maxTokens: 4000,
  });
  const signals = extractJson<RawSignal[]>(text) ?? [];
  await fs.mkdir(RESEARCH_DIR, { recursive: true });
  await fs.writeFile(SIGNALS_PATH, JSON.stringify(signals, null, 2), "utf8");
  console.log(`[signalScout] wrote ${signals.length} signals → ${SIGNALS_PATH}`);
  return signals.length;
}
