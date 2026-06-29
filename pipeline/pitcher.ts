import { MODELS, hasLLM } from "./config";
import { complete } from "./llm";
import type { Business } from "./types";

const PITCH_SYSTEM = `You write short, high-converting cold outreach emails for an Australian web agency called GrowVera. Tone: friendly, direct, Australian, no hype, no emojis, no buzzwords. The hook is that we have ALREADY built the business a real, live website and we include the link.

Rules: 70–120 words. Plain text only (no markdown). Structure: greeting using the business name; one line noting they don't appear to have a website; one line that we already built them one and they can view it live; the link on its own line; a soft CTA to reply if they'd like it made theirs; sign off as "The GrowVera team". Do not invent facts about the business.`;

/** Draft a personalised outreach email referencing the live site. Uses Claude
 * when configured, otherwise a solid template. */
export async function pitch(business: Business, siteUrl: string): Promise<string> {
  if (!hasLLM()) {
    return `Hi ${business.name},\n\nWe noticed your business doesn't have a website yet — so we went ahead and built you one. You can see it live here:\n${siteUrl}\n\nIf you'd like it as your own, just reply and we'll point it at your domain.\n\nThe GrowVera team`;
  }
  return complete({
    model: MODELS.build,
    system: PITCH_SYSTEM,
    prompt: `Business: ${business.name}, a ${business.category} in ${business.region}. Live site URL: ${siteUrl}. Write the outreach email.`,
    maxTokens: 500,
    cacheSystem: true,
  });
}
