import { MODELS, hasLLM } from "./config";
import { complete } from "./llm";
import type { Business } from "./types";

const PITCH_SYSTEM = `You write short, high-converting cold outreach for an Australian web agency called GrowVera. Tone: friendly, direct, Australian, no hype, no emojis, no buzzwords. The hook: we have ALREADY built the business a real, live website and we include a link to a page where they can view it AND see the price.

Rules: 70–120 words. Plain text only (no markdown). Structure: greeting using the business name; if an intent signal is supplied, open by referencing it naturally (do not quote it verbatim or sound like you've been spying); one line that we already built them a site they can view; the link on its own line; a soft CTA to book a quick call if they'd like it made theirs; sign off as "The GrowVera team". Do not invent facts about the business. Do not state a price (the linked page shows it).`;

/**
 * Draft a personalised outreach message. Links the price-gated /offer/[id] page
 * (demo + prices + booking) so anyone who books has already seen the price — a
 * warm, qualified lead. References the intent signal when present.
 */
export async function pitch(business: Business, offerUrl: string, signal?: string): Promise<string> {
  if (hasLLM()) {
    try {
      const message = await complete({
        model: MODELS.build,
        system: PITCH_SYSTEM,
        prompt: `Business: ${business.name}, a ${business.category} in ${business.region}.${signal ? `\nIntent signal (what they said / their situation): ${signal}` : ""}\nOffer page URL (shows the demo site + price + booking): ${offerUrl}.\nWrite the outreach message.`,
        // Headroom over the ~120-word target: reasoning-capable open models
        // (e.g. GLM) spend hidden tokens first, and a tight budget can leave the
        // visible content empty. 900 keeps the message from being truncated/blank.
        maxTokens: 900,
        cacheSystem: true,
      });
      // Never persist a blank pitch — fall through to the deterministic template
      // if the model returned nothing usable.
      if (message.trim().length >= 40) return message.trim();
      console.warn(`  [pitcher] model returned a blank/short pitch for ${business.name}; using template.`);
    } catch (err) {
      console.warn(`  [pitcher] AI pitch failed (${(err as Error).message}); using template.`);
    }
  }
  const opener = signal
    ? `We saw you're looking to bring in more work`
    : `We noticed your business could stand out more online`;
  return `Hi ${business.name},\n\n${opener} — so we went ahead and built you a website to show what's possible. You can see it (and exactly what it'd cost) here:\n${offerUrl}\n\nIf you like it, book a quick 15-minute call from that page and we'll make it yours.\n\nThe GrowVera team`;
}
