import { NextRequest, NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";
import { getTier, TRIAL_DAYS, type TierId } from "@/lib/tiers";

export const runtime = "nodejs";

/**
 * Phase 2 checkout: creates a Stripe Checkout Session in subscription mode for
 * the requested tier and returns its URL. The client redirects the browser to it.
 *
 * Requires: STRIPE_SECRET_KEY and STRIPE_PRICE_ID_<TIER> (recurring Price IDs).
 * If a hosted Payment Link is configured instead, the client links out directly
 * and never reaches this route.
 */
export async function POST(request: NextRequest) {
  try {
    const { tier } = (await request.json()) as { tier?: TierId };
    const t = tier && getTier(tier);
    if (!t) {
      return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Checkout is not configured yet. Add STRIPE_SECRET_KEY to go live." },
        { status: 503 },
      );
    }

    const priceId = process.env[t.stripePriceIdEnv];
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing ${t.stripePriceIdEnv}. Create a recurring Price in Stripe and set this env var.` },
        { status: 503 },
      );
    }

    const origin = request.headers.get("origin");
    const base = siteUrl(origin);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: { tier: t.id },
      },
      metadata: { tier: t.id },
      success_url: `${base}/buy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[GrowVera] checkout error:", error);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
