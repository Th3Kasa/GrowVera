/**
 * Subscription tiers for the GrowVera autonomous web-agency product.
 *
 * Pricing is monthly recurring (MRR) in AUD, GST-inclusive. To change a price,
 * update `priceMonthly` here and point `stripePriceIdEnv` / `paymentLinkEnv` at
 * the matching Stripe Price / Payment Link via environment variables.
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
    name: "Starter",
    tagline: "Prove the model in one region.",
    priceMonthly: 99,
    stripePriceIdEnv: "STRIPE_PRICE_ID_STARTER",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STARTER",
    features: [
      "Up to 30 prospect sites built per month",
      "1 target region",
      "Bespoke, deployed-live websites",
      "Personalised pitch drafted for each",
      "Built-in CRM — no duplicate outreach",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Run it like a real agency.",
    priceMonthly: 199,
    stripePriceIdEnv: "STRIPE_PRICE_ID_PRO",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO",
    highlight: true,
    features: [
      "Up to 150 prospect sites built per month",
      "3 target regions",
      "AI self-review on desktop + mobile before send",
      "5-touch follow-up sequence + reply sorting",
      "Lapsed-lead detection",
      "Remembers your design + tone preferences",
      "Priority support",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "Scale across markets.",
    priceMonthly: 399,
    stripePriceIdEnv: "STRIPE_PRICE_ID_AGENCY",
    paymentLinkEnv: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AGENCY",
    features: [
      "Unlimited prospect sites",
      "Unlimited regions",
      "Everything in Pro",
      "Custom branding on generated sites",
      "Dedicated onboarding + strategy call",
      "Priority build queue",
    ],
  },
];

export function getTier(id: string): Tier | undefined {
  return TIERS.find((t) => t.id === id);
}

export function formatAud(amount: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(amount);
}
