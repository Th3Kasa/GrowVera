import { NextRequest, NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";
import { ADMIN_COOKIE, tokenValid } from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/**
 * Opens the Stripe Customer Portal so a subscriber can manage their plan.
 * Requires a valid admin session — the customerId must come from the server,
 * never from untrusted client input, to prevent portal hijacking.
 */
export async function POST(request: NextRequest) {
  // Auth gate — only the admin dashboard can call this.
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!(await tokenValid(token))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { customerId } = (await request.json()) as { customerId?: string };
    if (!customerId || !customerId.startsWith("cus_")) {
      return NextResponse.json({ error: "Missing or invalid customer id." }, { status: 400 });
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
