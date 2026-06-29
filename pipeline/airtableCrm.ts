import { listRecords, createRecords, updateRecords, escapeFormulaValue, isConfigured, AIRTABLE, type AirtableRecord } from "../lib/airtable";
import type { Business, Lead, LeadStatus } from "./types";

/**
 * Airtable-backed CRM. Same public surface as the JSON `Crm` (init/has/add/
 * update/setStatus/get/byStatus/markLapsed/all/save) so the pipeline doesn't
 * care which store is active. Operations are buffered in memory (like the JSON
 * CRM) and flushed to Airtable on save(): new leads are created, changed leads
 * patched. Dedup key is the business id, stored in the `LeadId` field.
 *
 * This is the single source of truth shared with the website dashboard.
 */

type LeadFields = Record<string, unknown>;

interface Entry {
  lead: Lead;
  recordId?: string; // Airtable record id (undefined until first save)
  dirty: boolean;
  isNew: boolean;
}

/** Map a Lead to flat Airtable fields. Keep names aligned with the inbound
 * lead route so both sources share one schema. */
function toFields(lead: Lead): LeadFields {
  const b = lead.business;
  const f: LeadFields = {
    LeadId: b.id,
    Business: b.name,
    Name: b.name,
    Category: b.category,
    Region: b.region,
    Status: lead.status,
    Source: b.source,
    Touches: lead.touches,
    UpdatedAt: lead.updatedAt,
  };
  if (b.address) f.Address = b.address;
  if (b.phone) f.Phone = b.phone;
  if (b.website) f.Website = b.website;
  if (typeof b.rating === "number") f.Rating = b.rating;
  if (typeof b.reviewsCount === "number") f.ReviewsCount = b.reviewsCount;
  if (typeof b.score === "number") f.Score = b.score;
  if (lead.signal) f.Signal = lead.signal;
  if (lead.site?.url) f.DemoUrl = lead.site.url;
  if (lead.site?.slug) f.DemoSlug = lead.site.slug;
  if (lead.offerUrl) f.OfferUrl = lead.offerUrl;
  if (lead.pitch) f.Pitch = lead.pitch;
  if (lead.channel) f.Channel = lead.channel;
  if (lead.variant) f.Variant = lead.variant;
  if (lead.sentAt) f.SentAt = lead.sentAt;
  if (lead.repliedAt) f.RepliedAt = lead.repliedAt;
  if (lead.bookedAt) f.BookedAt = lead.bookedAt;
  return f;
}

/** Rebuild a Lead from an Airtable record (best-effort; for cross-run dedup). */
function fromRecord(rec: AirtableRecord): Lead {
  const f = rec.fields as Record<string, unknown>;
  const str = (k: string) => (typeof f[k] === "string" ? (f[k] as string) : undefined);
  const num = (k: string) => (typeof f[k] === "number" ? (f[k] as number) : undefined);
  const business: Business = {
    id: str("LeadId") || rec.id,
    name: str("Business") || str("Name") || "Unknown",
    category: str("Category") || "",
    region: str("Region") || "",
    address: str("Address"),
    phone: str("Phone"),
    website: str("Website") ?? null,
    rating: num("Rating"),
    reviewsCount: num("ReviewsCount"),
    photos: [],
    source: (str("Source") as Business["source"]) || "sample",
    score: num("Score"),
  };
  return {
    business,
    status: (str("Status") as LeadStatus) || "found",
    site: str("DemoUrl") ? { slug: str("DemoSlug") || "", url: str("DemoUrl") } : undefined,
    offerUrl: str("OfferUrl"),
    pitch: str("Pitch"),
    signal: str("Signal"),
    channel: str("Channel") as Lead["channel"],
    variant: str("Variant"),
    sentAt: str("SentAt"),
    repliedAt: str("RepliedAt"),
    bookedAt: str("BookedAt"),
    touches: num("Touches") ?? 0,
    createdAt: rec.createdTime || new Date().toISOString(),
    updatedAt: str("UpdatedAt") || rec.createdTime || new Date().toISOString(),
  };
}

export class AirtableCrm {
  private entries = new Map<string, Entry>();
  private table = AIRTABLE.tables.leads();

  async init(): Promise<void> {
    if (!isConfigured()) {
      console.warn("[airtableCrm] Airtable not configured — running with an empty in-memory CRM.");
      return;
    }
    const records = await listRecords(this.table);
    for (const rec of records) {
      const lead = fromRecord(rec);
      this.entries.set(lead.business.id, { lead, recordId: rec.id, dirty: false, isNew: false });
    }
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  add(business: Business): boolean {
    if (this.entries.has(business.id)) return false;
    const now = new Date().toISOString();
    this.entries.set(business.id, {
      lead: { business, status: "found", touches: 0, createdAt: now, updatedAt: now },
      dirty: true,
      isNew: true,
    });
    return true;
  }

  update(id: string, patch: Partial<Omit<Lead, "business" | "createdAt">>): void {
    const e = this.entries.get(id);
    if (!e) return;
    Object.assign(e.lead, patch, { updatedAt: new Date().toISOString() });
    e.dirty = true;
  }

  setStatus(id: string, status: LeadStatus): void {
    this.update(id, { status });
  }

  get(id: string): Lead | undefined {
    return this.entries.get(id)?.lead;
  }

  byStatus(status: LeadStatus): Lead[] {
    return [...this.entries.values()].filter((e) => e.lead.status === status).map((e) => e.lead);
  }

  markLapsed(olderThanDays = 14): number {
    const cutoff = Date.now() - olderThanDays * 86_400_000;
    let n = 0;
    for (const e of this.entries.values()) {
      if (e.lead.status === "pitched" && new Date(e.lead.updatedAt).getTime() < cutoff) {
        e.lead.status = "lapsed";
        e.dirty = true;
        n++;
      }
    }
    return n;
  }

  all(): Lead[] {
    return [...this.entries.values()].map((e) => e.lead);
  }

  /** Flush buffered changes: create new leads, patch changed ones. */
  async save(): Promise<void> {
    if (!isConfigured()) return;

    const toCreate = [...this.entries.values()].filter((e) => e.isNew);
    const toUpdate = [...this.entries.values()].filter((e) => e.dirty && !e.isNew && e.recordId);

    if (toCreate.length) {
      const created = await createRecords(this.table, toCreate.map((e) => toFields(e.lead)));
      // Re-attach Airtable record ids by LeadId so later runs can patch them.
      const byLeadId = new Map(created.map((r) => [(r.fields as { LeadId?: string }).LeadId, r.id]));
      for (const e of toCreate) {
        e.recordId = byLeadId.get(e.lead.business.id) ?? e.recordId;
        e.isNew = false;
        e.dirty = false;
      }
    }

    if (toUpdate.length) {
      await updateRecords(
        this.table,
        toUpdate.map((e) => ({ id: e.recordId as string, fields: toFields(e.lead) })),
      );
      for (const e of toUpdate) e.dirty = false;
    }
  }
}

/** Look up an existing lead's Airtable record id by business id (for the web
 * app, e.g. the Cal webhook marking a lead Booked). */
export async function findLeadRecordIdById(businessId: string): Promise<string | null> {
  if (!isConfigured()) return null;
  const recs = await listRecords(AIRTABLE.tables.leads(), {
    filterByFormula: `{LeadId} = '${escapeFormulaValue(businessId)}'`,
    maxRecords: 1,
  });
  return recs[0]?.id ?? null;
}
