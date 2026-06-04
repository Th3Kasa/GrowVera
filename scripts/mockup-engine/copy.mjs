/**
 * Claude writes the tailored, on-brand copy for a mock-up.
 * Same discipline as the audit agent: ask for strict JSON, then run a
 * fabrication guard so we never publish invented qualifications or claims.
 */

const BANNED = [
  // Claims we cannot verify about a stranger's business — never fabricate these.
  "award-winning", "award winning", "number one", "#1", "best in", "voted",
  "since 19", "since 20", "years of experience", "family owned", "family-owned",
  "licensed", "insured", "certified", "accredited", "guarantee", "guaranteed",
  "free quote", // allowed only in service labels, not invented claims — handled below
];

/**
 * @param {object} lead  { businessName, suburb, niche, rating, reviewCount }
 * @param {object} theme resolved theme preset (for default services)
 * @param {Anthropic} anthropic
 */
export async function writeCopy(lead, theme, anthropic) {
  const prompt = `You are writing website copy for a local ${lead.niche || theme.label} business in ${lead.suburb || "Sydney"}, Australia. The business is "${lead.businessName}". The owner is NOT technical. Write warm, confident, plain Australian English — the way a trusted local tradesperson talks, not marketing fluff.

VERIFIED FACTS (the ONLY facts you may state):
- Business name: ${lead.businessName}
- Location: ${lead.suburb || "Sydney"}
- Trade: ${lead.niche || theme.label}
${lead.rating ? `- Google rating: ${lead.rating} stars` : ""}
${lead.reviewCount ? `- Google reviews: ${lead.reviewCount}` : ""}

STRICT RULES — do NOT break these:
- NEVER invent: years in business, "family owned", licences, insurance, certifications, awards, "#1 / best / voted", specific guarantees, staff numbers, or any history you were not given above.
- Do not claim "free quotes" or "24/7" unless phrased as a general invitation ("Get in touch for a quote"), never as a promise.
- Write for the customer's outcome (a fixed problem, a tidy home, a job done right), not jargon.
- Keep it tight and punchy. No emojis.

Respond with ONLY valid JSON — no markdown, no code fences, no text before or after:

{
  "heroHeadline": "5-9 words. Punchy. The core promise. e.g. 'Reliable plumbing across Western Sydney'",
  "heroSub": "1 sentence. Reassuring. What they do and who for.",
  "ctaPrimary": "2-4 words. e.g. 'Get a Quote' or 'Call Now'",
  "aboutTitle": "3-6 words section heading",
  "aboutBody": "2 sentences. Friendly, trustworthy, customer-focused. No invented history.",
  "whyUs": ["3 short benefit phrases, 2-5 words each, customer-outcome focused"],
  "services": [
    {"name": "Service name (2-4 words)", "blurb": "1 short sentence describing it plainly"}
  ],
  "ctaBannerTitle": "5-8 words inviting them to make contact",
  "ctaBannerSub": "1 sentence, friendly nudge to call or enquire"
}

Provide exactly 6 services relevant to a ${lead.niche || theme.label} business. Use these as a starting point but rewrite naturally: ${theme.services.join(", ")}.`;

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  let parsed;
  try {
    const raw = msg.content[0].text.trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Claude returned invalid JSON:\n${msg.content[0].text}`);
  }

  // Fabrication guard — scan everything EXCEPT service labels (where "free quote" etc. is fine as a label, not a claim).
  const claimText = [
    parsed.heroHeadline, parsed.heroSub, parsed.aboutBody, parsed.aboutTitle,
    ...(parsed.whyUs || []), parsed.ctaBannerTitle, parsed.ctaBannerSub,
  ].join(" ").toLowerCase();

  const violations = BANNED.filter((b) => b !== "free quote" && claimText.includes(b));
  if (violations.length) {
    throw new Error(`MOCK-UP COPY REJECTED — unverifiable claims detected: "${violations.join('", "')}"`);
  }

  // Defensive defaults so the template never renders empty sections.
  parsed.whyUs = (parsed.whyUs || []).slice(0, 3);
  parsed.services = (parsed.services && parsed.services.length ? parsed.services : theme.services.map((s) => ({ name: s, blurb: "" }))).slice(0, 6);

  return parsed;
}
