import Anthropic from "@anthropic-ai/sdk";
import { RATES, USD_TO_AUD, type ModelId } from "./config";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

const totals: Record<string, Usage> = {};

function track(model: string, u: Anthropic.Usage) {
  const t = (totals[model] ??= { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
  t.input += u.input_tokens ?? 0;
  t.output += u.output_tokens ?? 0;
  t.cacheRead += u.cache_read_input_tokens ?? 0;
  t.cacheWrite += u.cache_creation_input_tokens ?? 0;
}

export interface ImageInput {
  mediaType: "image/png" | "image/jpeg";
  base64: string;
}

/**
 * Single Claude call with optional cached system prefix (the design system /
 * rubric) and optional images. Caching the stable prefix bills repeat input at
 * ~0.1x — the biggest per-site saving across many builds.
 */
export async function complete(opts: {
  model: ModelId;
  system: string;
  prompt: string;
  images?: ImageInput[];
  maxTokens?: number;
  cacheSystem?: boolean;
}): Promise<string> {
  const { model, system, prompt, images, maxTokens = 8000, cacheSystem = true } = opts;

  const content: Anthropic.ContentBlockParam[] = [];
  for (const img of images ?? []) {
    content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } });
  }
  content.push({ type: "text", text: prompt });

  const res = await getClient().messages.create({
    model,
    max_tokens: maxTokens,
    system: [
      {
        type: "text",
        text: system,
        ...(cacheSystem ? { cache_control: { type: "ephemeral" as const } } : {}),
      },
    ],
    messages: [{ role: "user", content }],
  });

  track(model, res.usage);

  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

/** Best-effort extraction of a JSON object/array from a model response. */
export function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.search(/[[{]/);
  if (start === -1) return null;
  const end = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
  if (end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

export function costReport(): { usd: number; aud: number; lines: string[] } {
  let usd = 0;
  const lines: string[] = [];
  for (const [model, u] of Object.entries(totals)) {
    const rate = RATES[model] ?? { in: 0, out: 0 };
    const c =
      (u.input * rate.in +
        u.cacheWrite * rate.in * 1.25 +
        u.cacheRead * rate.in * 0.1 +
        u.output * rate.out) /
      1_000_000;
    usd += c;
    lines.push(
      `  ${model}: ${u.input + u.cacheRead + u.cacheWrite} in (${u.cacheRead} cached) / ${u.output} out → $${c.toFixed(4)} USD`,
    );
  }
  return { usd, aud: usd * USD_TO_AUD, lines };
}
