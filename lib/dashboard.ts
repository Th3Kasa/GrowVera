/**
 * Business summary for /admin. One server-side aggregation over Stripe (revenue)
 * and Airtable (pipeline + outreach). Every source degrades gracefully to zero
 * so the dashboard renders before all keys are wired.
 */
import { getStripe } from "./stripe";
import { listRecords, isConfigured, AIRTABLE } from "./airtable";
import { isOutreachEnabled } from "./settings";

export interface DashboardSummary {
  mrr: number; // AUD/month
  activeClients: number;
  leadsByStage: Record<string, number>;
  totalLeads: number;
  demosBuilt: number;
  bookedThisWeek: number;
  outreachSent: number;
  replies: number;
  bookings: number;
  replyRate: number; // 0..1
  bookingRate: number; // 0..1
  outreachEnabled: boolean;
  configured: { stripe: boolean; airtable: boolean };
}

/** Stripe: monthly recurring revenue + active client count. */
async function stripeStats(): Promise<{ mrr: number; activeClients: number; ok: boolean }> {
  const stripe = getStripe();
  if (!stripe) return { mrr: 0, activeClients: 0, ok: false };

  try {
    let mrr = 0;
    const ids = new Set<string>();
    for (const status of ["active", "trialing"] as const) {
      const subs = await stripe.subscriptions.list({ status, limit: 100 });
      for (const sub of subs.data) {
        ids.add(sub.customer as string);
        for (const item of sub.items.data) {
          const price = item.price;
          const amount = (price.unit_amount ?? 0) * (item.quantity ?? 1);
          const interval = price.recurring?.interval;
          const perMonth = interval === "year" ? amount / 12 : interval === "week" ? amount * 4.345 : amount;
          mrr += perMonth;
        }
      }
    }
    return { mrr: Math.round(mrr / 100), activeClients: ids.size, ok: true };
  } catch (err) {
    console.error("[dashboard] stripe stats failed:", err);
    return { mrr: 0, activeClients: 0, ok: false };
  }
}

function startOfWeek(): number {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}

export async function getSummary(): Promise<DashboardSummary> {
  const airtableOk = isConfigured();
  const [stripe, leads, outreach, outreachEnabled] = await Promise.all([
    stripeStats(),
    airtableOk ? listRecords<Record<string, unknown>>(AIRTABLE.tables.leads()) : Promise.resolve([]),
    airtableOk ? listRecords<Record<string, unknown>>(AIRTABLE.tables.outreach()) : Promise.resolve([]),
    isOutreachEnabled(),
  ]);

  const leadsByStage: Record<string, number> = {};
  let demosBuilt = 0;
  let bookedThisWeek = 0;
  const weekStart = startOfWeek();

  for (const rec of leads) {
    const f = rec.fields;
    const status = (typeof f.Status === "string" ? f.Status : "unknown").toLowerCase();
    leadsByStage[status] = (leadsByStage[status] ?? 0) + 1;
    if (typeof f.DemoUrl === "string" && f.DemoUrl) demosBuilt++;
    if (typeof f.BookedAt === "string" && new Date(f.BookedAt).getTime() >= weekStart) bookedThisWeek++;
  }

  let replies = 0;
  let bookings = 0;
  for (const rec of outreach) {
    const f = rec.fields;
    if (f.RepliedAt || f.Replied === true) replies++;
    if (f.BookedAt || f.Booked === true) bookings++;
  }
  const outreachSent = outreach.length;

  return {
    mrr: stripe.mrr,
    activeClients: stripe.activeClients,
    leadsByStage,
    totalLeads: leads.length,
    demosBuilt,
    bookedThisWeek,
    outreachSent,
    replies,
    bookings,
    replyRate: outreachSent ? replies / outreachSent : 0,
    bookingRate: outreachSent ? bookings / outreachSent : 0,
    outreachEnabled,
    configured: { stripe: stripe.ok, airtable: airtableOk },
  };
}
