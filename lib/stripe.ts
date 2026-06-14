import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Lazily construct the Stripe client. Returns null when STRIPE_SECRET_KEY is not
 * set so the site still builds and renders before keys are configured — callers
 * surface a friendly "checkout not configured yet" message instead of crashing.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) cached = new Stripe(key);
  return cached;
}

export function siteUrl(originFromRequest?: string | null): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    originFromRequest ||
    "https://growvera.com.au"
  ).replace(/\/$/, "");
}
