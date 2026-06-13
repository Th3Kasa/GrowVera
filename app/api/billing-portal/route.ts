import { NextRequest, NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Opens the Stripe Customer Portal so a subscriber can upgrade, downgrade,
 * update their card, or cancel — self-serve. Pass the Stripe customer id
 * (cus_...), which the success page captures from the completed Checkout Session.
 */
export async function POST(request: NextRequest) {
  try {
    const { customerId } = (await request.json()) as { customerId?: string };
    if (!customerId) {
      return NextResponse.json({ error: "Missing customer id." }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
    }

    const origin = request.headers.get("origin");
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl(origin)}/`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("[GrowVera] billing-portal error:", error);
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 500 });
  }
}
