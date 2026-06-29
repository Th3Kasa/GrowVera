/**
 * Retainer tiers for GrowVera — the done-for-you AI growth agency. Clients pay
 * monthly for websites, content and ads delivered for them.
 *
 * Pricing is monthly recurring (MRR) in AUD, GST-inclusive. To change a price,
 * update `priceMonthly` here and point `stripePriceIdEnv` / `paymentLinkEnv` at
 * the matching Stripe Price / Payment Link via environment variables.
 *
 * Tier IDs (starter/pro/agency) are kept stable as the internal billing keys so
 * the Stripe Price-ID / Payment-Link env wiring and entitlement store don't move;
 * the client-facing names are Presence / Engine / Growth Partner.
 *
 * Phase 1 (ship now): set NEXT_PUBLIC_STRIPE_PAYMENT_LINK_<TIER> to a hosted
 *   Stripe Payment Link (subscription mode) and the Subscribe button links out.
 * Phase 2 (full lifecycle): set STRIPE_PRICE_ID_<TIER> and the Subscribe button
 *   POSTs to /api/checkout, which creates a Checkout Session (mode: subscription).
 */

export type TierId = "starter" | "pro" | "agency";

export interface Tier {
  id: TierId;
  name: string;
  tagline: string;
  priceMonthly: number; // AUD, GST-inclusive
  /** env var holding the Stripe Price ID (price_...) for Checkout Sessions */
  stripePriceIdEnv: string;
  /** env var holding a hosted Stripe Payment Link URL (Phase 1) */
  paymentLinkEnv: string;
  highlight?: boolean;
  features: string[];
}

export const TRIAL_DAYS = 7;

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Presence",
    tagline: "Get found, look the part, stay current.",
    priceMonthly: 890,
    stripePriceIdEnv: "STRIPE_PRICE_ID_STARTER",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STARTER",
    features: [
      "Bespoke AI website, designed + hosted for you",
      "Unlimited site edits via your client portal",
      "8 social content pieces / month (carousels + clips)",
      "Google Business Profile kept sharp",
      "Monthly performance report",
      "Email + chat support",
    ],
  },
  {
    id: "pro",
    name: "Engine",
    tagline: "A full content + lead engine, run for you.",
    priceMonthly: 1990,
    stripePriceIdEnv: "STRIPE_PRICE_ID_PRO",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO",
    highlight: true,
    features: [
      "Everything in Presence",
      "16–20 content pieces / month + 4 short videos",
      "AI spokesperson (talking-head) series",
      "Lead-gen landing pages",
      "Competitor-tracking content dashboard",
      "5-touch email nurture for new leads",
      "Priority delivery + monthly strategy call",
    ],
  },
  {
    id: "agency",
    name: "Growth Partner",
    tagline: "We run your paid growth end to end.",
    priceMonthly: 3900,
    stripePriceIdEnv: "STRIPE_PRICE_ID_AGENCY",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AGENCY",
    features: [
      "Everything in Engine",
      "Managed Meta / Instagram ads (ad spend separate)",
      "UGC ad creative, validated before we spend",
      "Multi-location / multi-brand",
      "Dedicated strategist + weekly reporting",
      "Quarterly growth roadmap",
    ],
  },
];

export function getTier(id: string): Tier | undefined {
  return TIERS.find((t) => t.id === id);
}

export function formatAud(amount: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(amount);
}
