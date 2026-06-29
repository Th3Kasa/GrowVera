import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Lead capture → Airtable. Creates a record in the `Leads` table so every
 * enquiry lands in GrowVera's CRM. Notifications (email to the founder, optional
 * auto-reply) are handled by an Airtable automation on new records — no extra
 * email service needed.
 *
 * Requires env: AIRTABLE_API_KEY, AIRTABLE_BASE_ID. Optional: AIRTABLE_LEADS_TABLE
 * (defaults to "Leads"). If unset, the route returns 200 with stored:false so the
 * client still routes the prospect to the booking page (no lead is ever lost).
 */
const FIELDS = ["name", "business", "suburb", "trade", "email", "phone", "website"] as const;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Minimal validation — name + (email or phone) so a lead is reachable.
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  if (!name || (!email && !phone)) {
    return NextResponse.json({ error: "Please add your name and an email or phone." }, { status: 400 });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_LEADS_TABLE || "Leads";

  // Not configured yet — accept the lead so the UX continues; founder can wire keys later.
  if (!apiKey || !baseId) {
    console.warn("[lead] Airtable not configured — lead not persisted:", { name, email, phone });
    return NextResponse.json({ stored: false }, { status: 200 });
  }

  const fields: Record<string, string> = { Status: "New", Source: "Website" };
  for (const key of FIELDS) {
    const val = String(body[key] ?? "").trim();
    if (val) fields[key.charAt(0).toUpperCase() + key.slice(1)] = val;
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[lead] Airtable error:", res.status, detail);
      // Don't lose the lead — report soft failure; client still books the call.
      return NextResponse.json({ stored: false }, { status: 200 });
    }

    return NextResponse.json({ stored: true }, { status: 200 });
  } catch (err) {
    console.error("[lead] Airtable request failed:", err);
    return NextResponse.json({ stored: false }, { status: 200 });
  }
}
