/**
 * Web-side lead helpers over Airtable. Used by the public /offer/[id] page and
 * the Cal.com webhook. Kept separate from pipeline/ so the Next app never pulls
 * in the pipeline's Node-only modules (Anthropic SDK, Playwright, etc.).
 */
import { listRecords, updateRecords, escapeFormulaValue, isConfigured, AIRTABLE } from "./airtable";

export interface LeadView {
  recordId: string;
  leadId: string;
  business: string;
  category?: string;
  region?: string;
  signal?: string;
  demoUrl?: string;
  status?: string;
  email?: string;
  phone?: string;
}

function toView(rec: { id: string; fields: Record<string, unknown> }): LeadView {
  const f = rec.fields;
  const s = (k: string) => (typeof f[k] === "string" ? (f[k] as string) : undefined);
  return {
    recordId: rec.id,
    leadId: s("LeadId") || rec.id,
    business: s("Business") || s("Name") || "your business",
    category: s("Category"),
    region: s("Region"),
    signal: s("Signal"),
    demoUrl: s("DemoUrl"),
    status: s("Status"),
    email: s("Email"),
    phone: s("Phone"),
  };
}

/** Fetch a lead by its stable LeadId (the /offer/[id] segment). */
export async function getLeadByLeadId(leadId: string): Promise<LeadView | null> {
  if (!isConfigured()) return null;
  const recs = await listRecords(AIRTABLE.tables.leads(), {
    filterByFormula: `{LeadId} = '${escapeFormulaValue(leadId)}'`,
    maxRecords: 1,
  });
  return recs[0] ? toView(recs[0]) : null;
}

/** Find a lead by booking metadata leadId first, then fall back to email. */
export async function findLeadForBooking(leadId?: string, email?: string): Promise<LeadView | null> {
  if (leadId) {
    const byId = await getLeadByLeadId(leadId);
    if (byId) return byId;
  }
  if (email && isConfigured()) {
    const recs = await listRecords(AIRTABLE.tables.leads(), {
      filterByFormula: `{Email} = '${escapeFormulaValue(email)}'`,
      maxRecords: 1,
    });
    if (recs[0]) return toView(recs[0]);
  }
  return null;
}

/** Mark a lead as Booked (called by the Cal webhook). */
export async function markLeadBooked(recordId: string): Promise<void> {
  await updateRecords(AIRTABLE.tables.leads(), [
    { id: recordId, fields: { Status: "booked", BookedAt: new Date().toISOString() } },
  ]);
}
