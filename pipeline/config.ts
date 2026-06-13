import path from "node:path";

/**
 * Model tiering — the #1 cost lever. Cheap model for extraction/scoring,
 * mid-tier for the build, top-tier (vision) only for the QA review pass.
 */
export const MODELS = {
  cheap: "claude-haiku-4-5",
  build: "claude-sonnet-4-6",
  review: "claude-opus-4-8",
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

/** USD per million tokens (input/output), used for live cost reporting. */
export const RATES: Record<string, { in: number; out: number }> = {
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-opus-4-8": { in: 5, out: 25 },
};

export const USD_TO_AUD = 1.42;

export const ROOT = process.cwd();
export const OUTPUT_DIR = path.join(ROOT, "pipeline", "output");
export const CRM_PATH = path.join(ROOT, "pipeline", ".crm.json");

export const hasAnthropic = () => !!process.env.ANTHROPIC_API_KEY;
export const hasGooglePlaces = () => !!process.env.GOOGLE_PLACES_API_KEY;
