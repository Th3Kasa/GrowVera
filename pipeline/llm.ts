import Anthropic from "@anthropic-ai/sdk";
import { RATES, FALLBACK_RATE, USD_TO_AUD, PROVIDER, type ModelId } from "./config";

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

function track(model: string, u: Usage) {
  const t = (totals[model] ??= { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
  t.input += u.input;
  t.output += u.output;
  t.cacheRead += u.cacheRead;
  t.cacheWrite += u.cacheWrite;
}

export interface ImageInput {
  mediaType: "image/png" | "image/jpeg";
  base64: string;
}

export interface CompleteOpts {
  model: ModelId;
  system: string;
  prompt: string;
  images?: ImageInput[];
  maxTokens?: number;
  cacheSystem?: boolean;
}

/**
 * One completion through the active provider (cheapest-first). OpenRouter (open
 * models) by default; Anthropic only as the frontier opt-in. Same interface for
 * both so callers never care which model answered.
 */
export async function complete(opts: CompleteOpts): Promise<string> {
  return PROVIDER === "anthropic" ? anthropicComplete(opts) : openrouterComplete(opts);
}

/** OpenRouter — OpenAI-compatible chat completions. No SDK needed; one key
 * reaches every open model. Images go as data-URI image_url parts. */
async function openrouterComplete(opts: CompleteOpts): Promise<string> {
  const { model, system, prompt, images, maxTokens = 8000 } = opts;

  const userContent: Record<string, unknown>[] = [{ type: "text", text: prompt }];
  for (const img of images ?? []) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:${img.mediaType};base64,${img.base64}` },
    });
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://growvera.com.au",
      "X-Title": "GrowVera Pipeline",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const u = data.usage ?? {};
  track(model, {
    input: u.prompt_tokens ?? 0,
    output: u.completion_tokens ?? 0,
    cacheRead: 0,
    cacheWrite: 0,
  });

  return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Anthropic frontier path (opt-in). Caches the stable system prefix (design
 * system / rubric) so repeat builds bill that prefix at ~0.1x input.
 */
async function anthropicComplete(opts: CompleteOpts): Promise<string> {
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

  track(model, {
    input: res.usage.input_tokens ?? 0,
    output: res.usage.output_tokens ?? 0,
    cacheRead: res.usage.cache_read_input_tokens ?? 0,
    cacheWrite: res.usage.cache_creation_input_tokens ?? 0,
  });

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
    const rate = RATES[model] ?? FALLBACK_RATE;
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
