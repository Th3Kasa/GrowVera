import path from "node:path";

/**
 * Model routing — cheapest-first. The #1 cost lever.
 *
 * All programmatic delivery defaults to OPEN models via OpenRouter (one key
 * reaches every model, OpenAI-compatible). This is ~35x cheaper than frontier
 * Claude and keeps the pipeline OFF the metered Claude pool entirely. Frontier
 * Claude is opt-in only — used when OpenRouter isn't configured, or when you
 * explicitly set USE_FRONTIER=1 for a rare high-stakes run.
 *
 * Within a run we still tier by task: a cheap model for extraction/scoring, the
 * design model for the build, a vision model only for the QA review pass.
 */

export type Role = "cheap" | "build" | "review";
export type ModelId = string;

export const hasOpenRouter = () => !!process.env.OPENROUTER_API_KEY;
export const hasAnthropic = () => !!process.env.ANTHROPIC_API_KEY;
/** Force the frontier (Anthropic) path even when OpenRouter is configured. */
export const useFrontier = () => process.env.USE_FRONTIER === "1";

export type Provider = "openrouter" | "anthropic" | "none";

/** Active provider for all programmatic work (cheapest-first). */
export const PROVIDER: Provider =
  hasOpenRouter() && !useFrontier() ? "openrouter" : hasAnthropic() ? "anthropic" : "none";

/** True when any LLM is configured; otherwise the builder falls back to the
 * high-quality static template so the pipeline always produces a real site. */
export const hasLLM = () => PROVIDER !== "none";

/**
 * Open models via OpenRouter. Ids are env-overridable so you can point at the
 * current best/cheapest model without touching code — GLM for build/design,
 * DeepSeek for cheap extraction, a vision model for the screenshot QA pass.
 */
const OPENROUTER_MODELS: Record<Role, string> = {
  cheap: process.env.OPENROUTER_MODEL_CHEAP ?? "deepseek/deepseek-chat",
  build: process.env.OPENROUTER_MODEL_BUILD ?? "z-ai/glm-4.6",
  review: process.env.OPENROUTER_MODEL_REVIEW ?? "qwen/qwen2.5-vl-72b-instruct",
};

/** Frontier (Anthropic) — opt-in only, the rare high-stakes pass. */
const ANTHROPIC_MODELS: Record<Role, string> = {
  cheap: "claude-haiku-4-5",
  build: "claude-sonnet-4-6",
  review: "claude-opus-4-8",
};

export const MODELS: Record<Role, string> =
  PROVIDER === "anthropic" ? ANTHROPIC_MODELS : OPENROUTER_MODELS;

/** USD per million tokens (input/output) for live cost reporting. OpenRouter
 * figures are indicative; if you override a model id, costs use FALLBACK_RATE. */
export const RATES: Record<string, { in: number; out: number }> = {
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-opus-4-8": { in: 5, out: 25 },
  "deepseek/deepseek-chat": { in: 0.28, out: 0.42 },
  "z-ai/glm-4.6": { in: 1.4, out: 4.4 },
  "qwen/qwen2.5-vl-72b-instruct": { in: 0.8, out: 0.8 },
};
/** Used when a model id (e.g. an env override) isn't in RATES. */
export const FALLBACK_RATE = { in: 1, out: 3 };

export const USD_TO_AUD = 1.42;

export const ROOT = process.cwd();
export const OUTPUT_DIR = path.join(ROOT, "pipeline", "output");
export const CRM_PATH = path.join(ROOT, "pipeline", ".crm.json");

export const hasGooglePlaces = () => !!process.env.GOOGLE_PLACES_API_KEY;
