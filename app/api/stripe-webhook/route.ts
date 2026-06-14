import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { upsertSubscription } from "@/lib/subscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe subscription lifecycle webhook. Keeps entitlement state in Supabase in
 * sync with Stripe. Configure the endpoint in the Stripe dashboard to send:
 *   checkout.session.completed,
 *   customer.subscription.created | updated | deleted,
 *   invoice.payment_failed
 * and set STRIPE_WEBHOOK_SECRET to the signing secret.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  const body = await request.text(); // raw body required for signature verification

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", secret);
  } catch (err) {
    console.error("[GrowVera] webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription && typeof session.subscription === "string") {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await recordSubscription(sub, session.customer_details?.email ?? null);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await recordSubscription(sub, null);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn("[GrowVera] payment failed for customer:", invoice.customer);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[GrowVera] webhook handler error:", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function recordSubscription(sub: Stripe.Subscription, email: string | null) {
  const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
  await upsertSubscription({
    stripe_subscription_id: sub.id,
    stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
    customer_email: email,
    tier: (sub.metadata?.tier as string) ?? null,
    status: sub.status,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  });
}
