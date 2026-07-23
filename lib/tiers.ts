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
  /** Short price note shown under the price (e.g. "No setup fee · month to month"). */
  priceNote: string;
}

/** Free-trial days for self-serve checkout (Phase 2). 0 = no trial. */
export const TRIAL_DAYS = 0;

/**
 * Optional add-on agents — sold alongside the three core TIERS but priced and
 * presented separately. Deliberately NOT part of the TierId union or Stripe
 * wiring: these are call-first (route to /audit), so they carry no billing keys.
 * Single source of truth for the "Also available" cards and the Pricing add-on row.
 */
export interface Addon {
  name: string;
  desc: string;
  setupFee: number;
  priceMonthly: number;
  priceNote: string;
}

export const ADDONS: Addon[] = [
  {
    name: "Google Review Agent",
    desc: "After every job it asks your happy customers for a review — then pings you the second a low one lands, so you fix it before the suburb sees it.",
    setupFee: 1000,
    priceMonthly: 500,
    priceNote: "Priced on your free audit call · month to month",
  },
  {
    name: "Lead Reactivation Agent",
    desc: "Works back through your dead lead list and wakes the ones still worth a job — revenue you already paid to get, sitting there cold.",
    setupFee: 0,
    priceMonthly: 1000,
    priceNote: "No setup fee · month to month",
  },
];

export const TIERS: Tier[] = [
  {
    id: "starter",
    slug: "receptionist",
    name: "24/7 AI Receptionist",
    outcome: "Every call caught. Every job booked. You stay on the tools.",
    tagline: "The Missed-Call Safety Net — answers only when you can't, so no job slips past.",
    priceMonthly: 1000,
    setupFee: 0,
    setupWaiverNote: "Retainer-only per Kirk model — no setup fee is the trust play; month-one retainer covers the freelancer build",
    pickThisIf: "You miss calls when you're on a job, on a break, or after hours.",
    forWho: [
      "Your hands are full on a job — you physically can't get to the phone.",
      "After-hours calls hit voicemail, and you never hear from them again.",
      "Whoever picks up first wins the job — and lately that's not you.",
      "You didn't start your business to be chained to your phone.",
    ],
    plainGet: [
      "Catch — it answers only the calls you can't get to, in your business's name.",
      "Capture — it gets the job, the details, and the urgency, and never guesses; if it doesn't know, it takes a proper message rather than making something up.",
      "Hand-back — it texts you the summary and sends the caller your booking link, so you're holding a warm lead, not playing phone tag.",
      "Works after hours, on weekends, and while you're already on another call.",
      "You hear exactly how it sounds and approve it before it goes live.",
    ],
    without:
      "The call rings out, they hang up, ring the next tradie — and you never even knew they called.",
    withGV:
      "Every call gets answered, the job gets captured and booked, and a text lands on your phone — so nothing slips past.",
    stat: "When a call goes to voicemail, about 80% of people hang up without leaving a message — and 62% of them just ring the next business.",
    sources: [
      { label: "AIRA (411 Locals, PATLive, Dialzara data)", url: "https://www.getaira.io/blog/missed-business-calls-statistics" },
    ],
    faqs: [
      { q: "Does it replace me or my staff?", a: "No — and that's the point. It only answers when you can't. The moment you or your team are free, you pick up as normal. It's a safety net under the calls you'd otherwise drop, not a replacement for anyone." },
      { q: "What's the commitment?", a: "We price it on your free audit call, scaled to your business. No setup fee, three-month minimum so it gets a fair run, then month to month — no lock-in past that." },
      { q: "Will my customers know it's not a person?", a: "It's upfront that it's an assistant — and it sounds natural, not robotic. You hear exactly how it answers and approve every word before it goes live. Prefer it to only ever take a message? It'll do that too." },
      { q: "What if the system ever goes down?", a: "Calls fall straight back to your phone, exactly as they do today. There's no scenario where a customer can't reach you because of us — you're never worse off than before." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_STARTER",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STARTER",
    paymentLink: "",
    features: [
      "Answers every call you can't get to, day or night",
      "Only picks up when you don't — you stay first in line",
      "Captures the job and books it straight in",
      "Texts you a summary of every call it takes",
      "You approve the script and voice before go-live",
      "Set up in days — no new phone, no new number",
    ],
    priceNote: "No setup fee · 3-month minimum, then month to month",
  },
  {
    id: "pro",
    slug: "speed-to-lead",
    name: "Speed-to-Lead Agent",
    outcome: "Call every web lead back in 20 seconds — before they call anyone else.",
    tagline: "Beat the other quote to the phone, every time.",
    priceMonthly: 2000,
    setupFee: 0,
    setupWaiverNote: "Bundle discount available on the audit call if paired with Receptionist",
    pickThisIf: "You get website or form enquiries but don't always ring them back fast enough.",
    forWho: [
      "Web and form enquiries land while you're flat out on the tools.",
      "By the time you ring back, they've already booked someone else.",
      "The good leads come in at the worst possible moment to answer them.",
    ],
    plainGet: [
      "The moment a lead fills in your form, it rings them back — in about 20 seconds.",
      "A natural-sounding agent qualifies them and answers the basics.",
      "It books the job straight into your calendar.",
      "You get their details and a summary by text.",
      "Every enquiry gets chased in seconds — not whenever you next check your phone.",
    ],
    without:
      "The lead fills in your form, waits, hears nothing — and books the first business that actually rings back.",
    withGV:
      "You're the first call they get, inside 20 seconds — so you're the one who wins the job.",
    stat: "78% of customers buy from the business that responds first. Reply within an hour and you're 7× more likely to win the job — yet the average business takes over a day.",
    sources: [
      { label: "Harvard Business Review — The Short Life of Online Sales Leads", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
      { label: "LeadResponse — Speed-to-Lead Statistics", url: "https://leadresponse.co/blog/speed-to-lead-statistics" },
    ],
    faqs: [
      { q: "How fast does it actually call?", a: "Within about 20 seconds of the lead hitting your form — while they're still on your website with your name in front of them. That's the window where most buyers go with whoever answers first." },
      { q: "What does it say to my customer?", a: "A short, friendly qualifying call in your business's voice — we write the script, you approve every line before it goes live. Nothing goes out that you haven't signed off." },
      { q: "What's the commitment?", a: "We price it on your free audit call, scaled to your business. No setup fee, three-month minimum so it has time to prove itself, then month to month." },
      { q: "Do I need new software for this?", a: "No. We wire it into the website form and calendar you already use. Nothing for you to install, nothing to learn." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_PRO",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO",
    paymentLink: "",
    features: [
      "Rings every web-form lead back in about 20 seconds",
      "Qualifies the lead and answers the basics",
      "Books the job into your calendar",
      "Texts you the lead's details and a call summary",
      "Connects to your existing form and calendar",
      "Script written for you — you approve before go-live",
    ],
    priceNote: "No setup fee · 3-month minimum, then month to month",
  },
  {
    id: "agency",
    slug: "quoting",
    name: "AI Quoting Agent",
    outcome: "Quotes that took 15 minutes, done in seconds.",
    tagline: "Your price lists and rates, built into a quoting tool your team runs in-house.",
    priceMonthly: 1500,
    setupFee: 12000,
    setupWaiverNote: "Flagship build — priced per business on the audit call",
    pickThisIf: "You quote a lot, and putting each one together eats your evenings.",
    forWho: [
      "Every quote means digging through price lists and running the maths by hand.",
      "Quotes pile up for after hours — and the slow ones lose the job.",
      "You want quotes out the door the same day, not next week.",
    ],
    plainGet: [
      "We build your team a quoting tool wired to your own price lists and rates.",
      "Your staff punch in the job; it returns a priced quote in seconds.",
      "It's internal — only your people touch it. Your customers never talk to AI.",
      "It uses your margins and your rules, not a generic template.",
      "Quotes that ate 10–15 minutes each now take moments.",
    ],
    without:
      "Quotes stack up for the weekend, take days to go out — and the customer's already gone with whoever quoted first.",
    withGV:
      "Your team sends a proper, accurate quote the same day — often while you're still standing on the job.",
    stat: "35–50% of jobs go to the business that quotes first. When a quote takes days, the fast quote down the road wins the work.",
    sources: [
      { label: "Google / Corporate Executive Board (via Lift AI)", url: "https://www.lift-ai.com/blog/50-percent-of-sales-go-to-the-first-company-to-respond-heres-how-to-beat-them-all" },
      { label: "Harvard Business Review — The Short Life of Online Sales Leads", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
    ],
    faqs: [
      { q: "How is this priced?", a: "It's a custom build, scoped to how your pricing actually works. We work out the exact number with you on your free audit call — so there are no surprises, and you approve it before anything starts." },
      { q: "Will it get my prices wrong?", a: "It's built on your actual price lists, labour rates, and margin rules — not a generic calculator. And your team reviews every quote before it's sent, so nothing goes out that you haven't checked." },
      { q: "Do my customers have to deal with AI?", a: "No. This one's internal — only your staff use it. Your customers get the same quote from the same people as always, just faster. If you ever want to put quoting in front of customers directly, that's your call to make later." },
      { q: "How long does the build take?", a: "It depends on how your pricing is structured. We map it all out on the audit call and give you a clear timeline before you commit to anything." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_AGENCY",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AGENCY",
    paymentLink: "",
    features: [
      "Quoting tool built on your own price lists and rates",
      "Priced quotes produced in seconds",
      "Internal tool — only your team uses it",
      "Uses your margins and your rules, not a template",
      "Your team reviews and sends — quotes stay yours",
      "Custom build scoped to your pricing, plus ongoing care to keep it accurate",
    ],
    priceNote: "Priced to your business on your free audit call",
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
