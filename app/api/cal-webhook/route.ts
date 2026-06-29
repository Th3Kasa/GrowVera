import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { findLeadForBooking, markLeadBooked } from "@/lib/leads";
import { notifyFounder } from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Cal.com webhook. On BOOKING_CREATED we flip the matching lead to "booked" in
 * Airtable (matched by booking metadata.leadId, falling back to attendee email)
 * and email the founder. This closes the loop: a booked call = a warm, price-
 * aware lead, and it shows up on the /admin dashboard.
 *
 * Set the webhook URL in Cal.com to https://growvera.com.au/api/cal-webhook and,
 * if you set a signing secret there, put it in CAL_WEBHOOK_SECRET to verify.
 */
function verifySignature(raw: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  // timing-safe compare
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const raw = await request.text();

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const sig = request.headers.get("x-cal-signature-256");
    if (!verifySignature(raw, sig, secret)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let event: { triggerEvent?: string; payload?: Record<string, unknown> };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (event.triggerEvent !== "BOOKING_CREATED") {
    return NextResponse.json({ ok: true, ignored: event.triggerEvent ?? "unknown" }, { status: 200 });
  }

  const payload = event.payload ?? {};
  const metadata = (payload.metadata as Record<string, unknown> | undefined) ?? {};
  const leadId = typeof metadata.leadId === "string" ? metadata.leadId : undefined;
  const attendees = (payload.attendees as Array<{ email?: string; name?: string }> | undefined) ?? [];
  const email = attendees[0]?.email;
  const name = attendees[0]?.name || "A prospect";
  const when = typeof payload.startTime === "string" ? payload.startTime : "soon";

  const lead = await findLeadForBooking(leadId, email);
  if (lead) {
    await markLeadBooked(lead.recordId);
  }

  await notifyFounder(
    `📞 New call booked — ${lead?.business ?? name}`,
    `${name} (${email ?? "no email"}) booked a call for ${when}.\n` +
      (lead ? `Lead: ${lead.business} — ${lead.category ?? ""} ${lead.region ?? ""}\n` : "Not matched to an existing lead.\n") +
      `They saw pricing before booking, so this is a warm, price-aware lead.`,
  );

  return NextResponse.json({ ok: true, matched: !!lead }, { status: 200 });
}
