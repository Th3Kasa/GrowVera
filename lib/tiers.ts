/**
 * Product tiers for GrowVera — AI receptionists and instant quoting for
 * Australian trades & local services.
 *
 * Single source of truth for: pricing, Stripe wiring, AND the plain-language
 * content rendered on the product landing pages + the audit/pricing surfaces.
 * Each tier is one clear OUTCOME a tradie instantly gets:
 *   Receptionist → never miss a call · Speed-to-Lead → beat the other quote
 *   in · Quoting → quotes done in seconds.
 *
 * Prices are in AUD (no GST charged — Growvera is not GST-registered). Tier IDs (starter/pro/agency) stay stable
 * as the billing keys so existing billing/checkout code keeps working; the
 * client-facing names are Receptionist / Speed-to-Lead / Quoting Agent.
 *
 * Stripe: STRIPE_PRICE_ID_<TIER> → /api/checkout Checkout Session (Phase 2).
 * paymentLink is intentionally "" for now — new Stripe links are created after
 * launch. Consumers should treat an empty paymentLink as "no self-serve yet"
 * and route the button to /audit (the Free AI Audit funnel) instead.
 */

export type TierId = "starter" | "pro" | "agency";

export interface Source {
  label: string;
  url: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Tier {
  id: TierId;
  /** URL slug for the landing page, e.g. /receptionist */
  slug: string;
  name: string;
  /** Short, plain-English promise — the one reason to pick this product. */
  outcome: string;
  tagline: string;
  priceMonthly: number; // AUD — monthly (no GST while not GST-registered)
  /** One-off setup/build fee (AUD). 0 = no setup fee. */
  setupFee: number;
  /** Internal sales-playbook note (deliberately NOT shown on the site). */
  setupWaiverNote: string;
  /** "Pick this if you…" — the self-selection line. */
  pickThisIf: string;
  /** "Is this you?" — pain points in the owner's own words. */
  forWho: string[];
  /** What we do for you — jargon-free, no tool names. */
  plainGet: string[];
  /** The value contrast shown on the landing page. */
  without: string;
  withGV: string;
  /** Headline statistic that justifies the product (real, sourced). */
  stat: string;
  sources: Source[];
  faqs: Faq[];
  /** env var holding the Stripe Price ID (price_...) for Checkout Sessions */
  stripePriceIdEnv: string;
  /** env var holding a hosted Stripe Payment Link URL (Phase 1) */
  paymentLinkEnv: string;
  /** Hosted Stripe Payment Link (public URL). Empty until new links are created
   * post-launch. When empty, consumers link the button to /audit instead of
   * self-serve checkout, so a missing link can never break the page. */
  paymentLink: string;
  highlight?: boolean;
  /** Detailed inclusions (used on landing pages / pricing). */
  features: string[];
  /** Short price note shown under the price (e.g. "$990 one-off setup"). */
  priceNote: string;
}

/** Free-trial days for self-serve checkout (Phase 2). 0 = no trial. */
export const TRIAL_DAYS = 0;

export const TIERS: Tier[] = [
  {
    id: "starter",
    slug: "receptionist",
    name: "24/7 AI Receptionist",
    outcome: "Never miss a call — even when you're on the tools.",
    tagline: "Your phone answered 24/7, so no job slips past.",
    priceMonthly: 650,
    setupFee: 990,
    setupWaiverNote: "Entry product — $990 setup, waivable as a closing lever for founding clients on the audit call",
    pickThisIf: "You miss calls when you're on a job, on a break, or after hours.",
    forWho: [
      "You can't answer the phone with your hands full on a job.",
      "Calls after hours go to voicemail — and you never hear back.",
      "You're losing work to whoever picks up first.",
    ],
    plainGet: [
      "A friendly AI receptionist answers every call you can't take.",
      "It only picks up when you don't — you still answer when you're free.",
      "It captures the job, books it in, and texts you a summary.",
      "Works after hours, weekends, and while you're on another call.",
      "You approve exactly how it sounds before it ever goes live.",
    ],
    without:
      "A call goes to voicemail, the customer hangs up, rings the next tradie, and you never even knew they called.",
    withGV:
      "Every call gets answered, the job gets captured and booked, and you get a text — so nothing slips past you.",
    stat: "When a call goes to voicemail, about 80% of people hang up without leaving a message — and 62% of them just ring the next business.",
    sources: [
      { label: "AIRA (411 Locals, PATLive, Dialzara data)", url: "https://www.getaira.io/blog/missed-business-calls-statistics" },
    ],
    faqs: [
      { q: "Does it replace me or my staff?", a: "No. It only answers when you can't. When you or your team are free, you pick up as normal — it's a safety net, not a replacement." },
      { q: "What's the commitment?", a: "$990 one-off setup, then from $650/mo. Three-month minimum so it has a fair run, then month to month." },
      { q: "Will callers know it's not a person?", a: "It's upfront and natural. You hear and approve exactly how it answers before it goes live." },
      { q: "What if the system ever goes down?", a: "Calls fall straight back to your phone exactly as they do today. You're never worse off than before." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_STARTER",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STARTER",
    paymentLink: "",
    features: [
      "Answers every call you can't take, 24/7",
      "Only picks up when you don't — you stay in control",
      "Captures the job and books it straight in",
      "Texts you a summary of every call",
      "You approve the script and voice before go-live",
      "Set up in days — no new phone, no new number",
    ],
    priceNote: "$990 one-off setup · 3-month minimum, then month to month",
  },
  {
    id: "pro",
    slug: "speed-to-lead",
    name: "Speed-to-Lead Agent",
    outcome: "Call every web lead back in 20 seconds — before they call anyone else.",
    tagline: "Beat the other quote to the phone, every time.",
    priceMonthly: 2000,
    setupFee: 1490,
    setupWaiverNote: "Bundle discount available on the audit call if paired with Receptionist",
    pickThisIf: "You get website or form enquiries but don't always ring them back fast enough.",
    forWho: [
      "Leads come in through your website or a form and sit for hours.",
      "By the time you call back, they've already booked someone else.",
      "You're busy on the tools when the good enquiries land.",
    ],
    plainGet: [
      "The moment a lead fills in your form, we call them back — in about 20 seconds.",
      "A natural-sounding agent qualifies them and answers the basics.",
      "It books the job straight into your calendar.",
      "You get the lead's details and a summary by text.",
      "Every enquiry gets chased fast — not whenever you next check your phone.",
    ],
    without:
      "A lead fills in your form, waits, hears nothing, and books the first business that actually rings back.",
    withGV:
      "You're the first call they get — inside 20 seconds — so you're the one who wins the job.",
    stat: "78% of customers buy from the business that responds first. Reply within an hour and you're 7× more likely to win the job — yet the average business takes over a day.",
    sources: [
      { label: "Harvard Business Review — The Short Life of Online Sales Leads", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
      { label: "LeadResponse — Speed-to-Lead Statistics", url: "https://leadresponse.co/blog/speed-to-lead-statistics" },
    ],
    faqs: [
      { q: "How fast does it actually call?", a: "Within about 20 seconds of the lead hitting your form — while they're still on your website thinking about it." },
      { q: "What does it say?", a: "A short, friendly qualifying call in your business's voice — we write and you approve the script before it goes live." },
      { q: "What's the commitment?", a: "From $2,000/mo. Three-month minimum so it has time to prove itself, then month to month." },
      { q: "Do I need new software?", a: "No. We connect it to your existing website form and calendar. Nothing for you to install." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_PRO",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO",
    paymentLink: "",
    highlight: true,
    features: [
      "Calls every web-form lead back in ~20 seconds",
      "Qualifies the lead and answers the basics",
      "Books the job into your calendar",
      "Texts you the lead's details and a call summary",
      "Connects to your existing form and calendar",
      "Script written for you — you approve before go-live",
    ],
    priceNote: "$1,490 one-off setup · 3-month minimum, then month to month",
  },
  {
    id: "agency",
    slug: "quoting",
    name: "AI Quoting Agent",
    outcome: "Quotes that took 15 minutes, done in seconds.",
    tagline: "Your price lists and rates, built into an instant quoting tool.",
    priceMonthly: 1500,
    setupFee: 10000,
    setupWaiverNote: "Flagship build — priced per business on the audit call",
    pickThisIf: "You quote a lot, and putting each one together eats your evenings.",
    forWho: [
      "Every quote means digging through price lists and doing the maths.",
      "Quotes pile up for after hours — and the slow ones lose the job.",
      "You want quotes out the door the same day, not next week.",
    ],
    plainGet: [
      "We build you a quoting tool wired to your own price lists and labour rates.",
      "Punch in the job, and it produces a priced quote in seconds.",
      "It uses your margins and your rules — not a generic template.",
      "You review and send — every quote is still yours to approve.",
      "Quotes that used to take 10–15 minutes take moments.",
    ],
    without:
      "Quotes stack up for the weekend, take days to send, and the customer's already gone with whoever quoted first.",
    withGV:
      "You send a proper, accurate quote the same day — often while you're still standing on the job.",
    stat: "35–50% of jobs go to the business that quotes first. When a quote takes days, the fast quote down the road wins the work.",
    sources: [
      { label: "Google / Corporate Executive Board (via Lift AI)", url: "https://www.lift-ai.com/blog/50-percent-of-sales-go-to-the-first-company-to-respond-heres-how-to-beat-them-all" },
      { label: "Harvard Business Review — The Short Life of Online Sales Leads", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
    ],
    faqs: [
      { q: "How is this priced?", a: "It's a custom build — from $10,000 setup to wire it to your price lists and rules, then monthly care to keep it accurate. We scope the exact number on the audit call." },
      { q: "Is it accurate to my business?", a: "Yes — it's built on your actual price lists, labour rates, and margin rules. It's not a generic calculator." },
      { q: "Do I still check quotes before they go out?", a: "Always. It does the heavy lifting in seconds; you review and send. Every quote stays under your control." },
      { q: "How long does the build take?", a: "It depends on how your pricing is structured. We map it all out on the audit call and give you a clear timeline." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_AGENCY",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AGENCY",
    paymentLink: "",
    features: [
      "Quoting tool built on your own price lists + rates",
      "Priced quotes produced in seconds",
      "Uses your margins and your rules",
      "You review and send — quotes stay yours",
      "Custom build from $10,000 setup",
      "Ongoing care to keep pricing accurate",
    ],
    priceNote: "Custom build from $10,000 setup + monthly care",
  },
];

/** Plain-language capability matrix (kept for any comparison surface). */
export const CAPABILITIES: { label: string; tiers: Record<TierId, boolean> }[] = [
  { label: "Answers calls you can't take, 24/7", tiers: { starter: true, pro: false, agency: false } },
  { label: "Calls web-form leads back in ~20 seconds", tiers: { starter: false, pro: true, agency: false } },
  { label: "Books jobs straight into your calendar", tiers: { starter: true, pro: true, agency: false } },
  { label: "Texts you a summary of every call", tiers: { starter: true, pro: true, agency: false } },
  { label: "Instant quotes from your own price lists", tiers: { starter: false, pro: false, agency: true } },
  { label: "You approve before anything goes live", tiers: { starter: true, pro: true, agency: true } },
];

export function getTier(id: string): Tier | undefined {
  return TIERS.find((t) => t.id === id);
}

export function getTierBySlug(slug: string): Tier | undefined {
  return TIERS.find((t) => t.slug === slug);
}

export function formatAud(amount: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(amount);
}
