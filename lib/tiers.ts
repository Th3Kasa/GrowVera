/**
 * Retainer tiers for GrowVera — the done-for-you AI growth agency.
 *
 * Single source of truth for: pricing, Stripe wiring, AND the plain-language
 * content rendered on the package landing pages + comparison page. Each tier is
 * one clear OUTCOME so a visitor instantly knows which to pick:
 *   Presence → get found · Engine → get seen · Growth Partner → get customers.
 *
 * Pricing is monthly recurring (MRR) in AUD, GST-inclusive. Tier IDs
 * (starter/pro/agency) stay stable as the billing keys; client-facing names are
 * Presence / Engine / Growth Partner.
 *
 * Phase 1 (live): NEXT_PUBLIC_STRIPE_PAYMENT_LINK_<TIER> → Subscribe links out.
 * Phase 2: STRIPE_PRICE_ID_<TIER> → /api/checkout Checkout Session.
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
  /** URL slug for the landing page, e.g. /presence */
  slug: string;
  name: string;
  /** Short, plain-English promise — the one reason to pick this package. */
  outcome: string;
  tagline: string;
  priceMonthly: number; // AUD, GST-inclusive — recurring retainer
  /** One-off onboarding & build fee (AUD), charged on the first invoice. */
  setupFee: number;
  /** Internal sales-playbook note: how the setup fee can be waived on the
   * discovery call (a closing lever — deliberately NOT shown on the site). */
  setupWaiverNote: string;
  /** "Pick this if you…" — the self-selection line on the comparison page. */
  pickThisIf: string;
  /** "Is this you?" — pain points in the client's own words. */
  forWho: string[];
  /** What we do for you — jargon-free, no tool names. */
  plainGet: string[];
  /** The value contrast shown on the landing page. */
  without: string;
  withGV: string;
  /** Headline statistic that justifies the package (real, sourced). */
  stat: string;
  sources: Source[];
  faqs: Faq[];
  /** env var holding the Stripe Price ID (price_...) for Checkout Sessions */
  stripePriceIdEnv: string;
  /** env var holding a hosted Stripe Payment Link URL (Phase 1) */
  paymentLinkEnv: string;
  highlight?: boolean;
  /** Detailed inclusions (used on landing pages / internal reference). */
  features: string[];
}

/** Free-trial days for self-serve checkout (Phase 2). 0 = no trial, which is
 * the model for done-for-you retainers (setup fee instead). */
export const TRIAL_DAYS = 0;

export const TIERS: Tier[] = [
  {
    id: "starter",
    slug: "presence",
    name: "Presence",
    outcome: "Look professional and get found online.",
    tagline: "Get found, look the part, stay current.",
    priceMonthly: 890,
    setupFee: 990,
    setupWaiverNote: "Setup waived on 6-month prepay",
    pickThisIf: "You have no website, or an old one you're embarrassed by.",
    forWho: [
      "You don't have a website — or the one you have looks dated.",
      "Customers can't find you on Google.",
      "You don't have time to keep anything updated.",
    ],
    plainGet: [
      "A modern website, built for you and hosted — nothing to manage.",
      "Any change you want, just message us and it's done.",
      "Your Google listing set up properly so locals find you.",
      "A few posts a month so your business looks active.",
      "A simple monthly report.",
    ],
    without:
      "An old or missing website makes customers doubt you — most click straight to your competitor.",
    withGV:
      "A clean, modern site makes you look established and gets you the call.",
    stat: "75% of customers judge your business by its website, and 62% skip businesses with no real web presence.",
    sources: [
      { label: "Made For Web", url: "https://www.madeforweb.co.uk/blog/75-of-consumers-judge-a-companys-credibility-by-its-website" },
      { label: "Network Solutions", url: "https://www.networksolutions.com/blog/small-business-website-statistics/" },
    ],
    faqs: [
      { q: "What's the commitment?", a: "Month to month after a one-off onboarding & build. Cancel anytime." },
      { q: "Do I need to do anything?", a: "Just send us your logo and a few photos. We handle the rest, and you approve from your phone." },
      { q: "How fast is it live?", a: "Your site is typically built and live within the first week." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_STARTER",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STARTER",
    features: [
      "Bespoke website, designed + hosted for you",
      "Unlimited site edits — just message us",
      "8 social posts / month (carousels + clips)",
      "Google Business Profile kept sharp",
      "Monthly performance report",
      "Email + chat support",
    ],
  },
  {
    id: "pro",
    slug: "engine",
    name: "Engine",
    outcome: "Stay visible and grow — without lifting a finger.",
    tagline: "A full content engine, run for you.",
    priceMonthly: 1990,
    setupFee: 1500,
    setupWaiverNote: "Setup waived on 6-month prepay",
    pickThisIf: "You have a site but no time to post and stay visible.",
    forWho: [
      "You know you should be posting, but never have the time.",
      "Your social pages have gone quiet.",
      "Competitors with worse work get noticed more than you.",
    ],
    plainGet: [
      "Everything in Presence.",
      "A steady stream of posts and short videos every week.",
      "Posted across your channels for you — you just approve.",
      "A presenter-style video series featuring your brand.",
      "A clear monthly report on reach and results.",
    ],
    without:
      "Go quiet on social and customers forget you between jobs — you're invisible in the feed.",
    withGV:
      "Fresh posts and video every week keep you top-of-mind, so referrals and enquiries keep coming.",
    stat: "Short videos get 2.5× more engagement and 12× more shares, and 78% of people prefer short video to learn about a business.",
    sources: [
      { label: "Teleprompter", url: "https://www.teleprompter.com/blog/social-media-video-statistics" },
      { label: "Sprout Social", url: "https://sproutsocial.com/insights/social-media-video-statistics/" },
    ],
    faqs: [
      { q: "What's the commitment?", a: "Month to month after onboarding. Cancel anytime." },
      { q: "When do I see results?", a: "Consistency compounds — most clients see meaningful engagement lift within 60–90 days." },
      { q: "Do I need to film anything?", a: "No. We produce everything for you; you simply approve each batch from your phone." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_PRO",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO",
    highlight: true,
    features: [
      "Everything in Presence",
      "16–20 posts / month + 4 short videos",
      "Presenter-style (talking-head) video series",
      "Lead-capture landing pages",
      "Competitor-tracked content strategy",
      "Priority delivery + monthly strategy call",
    ],
  },
  {
    id: "agency",
    slug: "growth-partner",
    name: "Growth Partner",
    outcome: "Turn attention into booked customers.",
    tagline: "We run your paid growth end to end.",
    priceMonthly: 3900,
    setupFee: 2500,
    setupWaiverNote: "Setup waived on 12-month commitment",
    pickThisIf: "You're ready to spend on ads and want a steady flow of leads.",
    forWho: [
      "Word-of-mouth alone isn't filling your calendar.",
      "You want more enquiries, predictably.",
      "You've tried ads before and wasted money.",
    ],
    plainGet: [
      "Everything in Engine.",
      "We create and run your Facebook & Instagram ads.",
      "We test the ad before spending, so budget only goes to what works.",
      "Leads delivered straight to you.",
      "Weekly reporting in plain English (you control the ad budget).",
    ],
    without:
      "Without a lead system it's feast-or-famine — and ad money gets burned on guesses.",
    withGV:
      "We generate the leads and help you respond fast, turning attention into booked jobs.",
    stat: "Businesses that reply to a new lead within 5 minutes are up to 21× more likely to win it, and 78% of buyers go with whoever responds first.",
    sources: [
      { label: "Casey Response", url: "https://caseyresponse.com/blog/lead-response-time-statistics" },
      { label: "LeadResponse", url: "https://leadresponse.co/blog/speed-to-lead-statistics" },
    ],
    faqs: [
      { q: "Is ad spend included?", a: "No — your ad budget is separate and paid directly to the platforms. You stay in full control of it." },
      { q: "What's the commitment?", a: "We recommend at least 3 months so the ads have time to optimise. Cancel anytime after." },
      { q: "What budget do I need?", a: "We'll recommend a starting ad budget on the call based on your goals and market." },
    ],
    stripePriceIdEnv: "STRIPE_PRICE_ID_AGENCY",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AGENCY",
    features: [
      "Everything in Engine",
      "Managed Meta / Instagram ads (ad spend separate)",
      "Ad creative tested before we spend",
      "Leads delivered to you",
      "Dedicated strategist + weekly reporting",
      "Quarterly growth roadmap",
    ],
  },
];

/** Plain-language capability matrix for the comparison table (no tool names). */
export const CAPABILITIES: { label: string; tiers: Record<TierId, boolean> }[] = [
  { label: "Modern website, built + hosted", tiers: { starter: true, pro: true, agency: true } },
  { label: "Unlimited edits — just message us", tiers: { starter: true, pro: true, agency: true } },
  { label: "Google Business Profile sorted", tiers: { starter: true, pro: true, agency: true } },
  { label: "Social posts every month", tiers: { starter: true, pro: true, agency: true } },
  { label: "Weekly short-form video", tiers: { starter: false, pro: true, agency: true } },
  { label: "Presenter-style video series", tiers: { starter: false, pro: true, agency: true } },
  { label: "Lead-capture landing pages", tiers: { starter: false, pro: true, agency: true } },
  { label: "Managed Facebook & Instagram ads", tiers: { starter: false, pro: false, agency: true } },
  { label: "Leads delivered to you", tiers: { starter: false, pro: false, agency: true } },
  { label: "Monthly performance report", tiers: { starter: true, pro: true, agency: true } },
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
