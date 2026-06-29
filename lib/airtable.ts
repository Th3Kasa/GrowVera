/**
 * Shared, typed Airtable REST client. One source of truth for both the website
 * (dashboard API, lead capture, Cal webhook) and the pipeline (CRM backend).
 *
 * No SDK dependency — Airtable's REST API is simple and we keep the bundle lean.
 * Every function is a no-op-safe wrapper: if AIRTABLE_API_KEY / AIRTABLE_BASE_ID
 * aren't set, `isConfigured()` returns false and callers degrade gracefully
 * (the site still builds and renders before keys are wired).
 *
 * Tables (see pipeline/README or the schema doc):
 *   Leads        — every prospect/enquiry (inbound + outbound), the CRM
 *   Outreach     — one row per message sent (channel, variant, outcomes)
 *   Experiments  — per-variant rollups for the self-improvement loop
 *   Suppression  — do-not-contact list, checked before every send
 */

const API = "https://api.airtable.com/v0";

export const AIRTABLE = {
  apiKey: () => process.env.AIRTABLE_API_KEY || "",
  baseId: () => process.env.AIRTABLE_BASE_ID || "",
  tables: {
    leads: () => process.env.AIRTABLE_LEADS_TABLE || "Leads",
    outreach: () => process.env.AIRTABLE_OUTREACH_TABLE || "Outreach",
    experiments: () => process.env.AIRTABLE_EXPERIMENTS_TABLE || "Experiments",
    suppression: () => process.env.AIRTABLE_SUPPRESSION_TABLE || "Suppression",
  },
};

export function isConfigured(): boolean {
  return !!(AIRTABLE.apiKey() && AIRTABLE.baseId());
}

export interface AirtableRecord<T = Record<string, unknown>> {
  id: string;
  createdTime?: string;
  fields: T;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${AIRTABLE.apiKey()}`,
    "Content-Type": "application/json",
  };
}

function tableUrl(table: string): string {
  return `${API}/${AIRTABLE.baseId()}/${encodeURIComponent(table)}`;
}

/** List records, transparently following pagination. Supports a filterByFormula
 * and field selection. Returns [] when Airtable isn't configured. */
export async function listRecords<T = Record<string, unknown>>(
  table: string,
  opts: { filterByFormula?: string; maxRecords?: number; pageSize?: number; fields?: string[]; sort?: { field: string; direction?: "asc" | "desc" }[] } = {},
): Promise<AirtableRecord<T>[]> {
  if (!isConfigured()) return [];

  const out: AirtableRecord<T>[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();
    if (opts.filterByFormula) params.set("filterByFormula", opts.filterByFormula);
    if (opts.maxRecords) params.set("maxRecords", String(opts.maxRecords));
    params.set("pageSize", String(opts.pageSize ?? 100));
    for (const f of opts.fields ?? []) params.append("fields[]", f);
    (opts.sort ?? []).forEach((s, i) => {
      params.set(`sort[${i}][field]`, s.field);
      params.set(`sort[${i}][direction]`, s.direction ?? "asc");
    });
    if (offset) params.set("offset", offset);

    const res = await fetch(`${tableUrl(table)}?${params.toString()}`, { headers: headers() });
    if (!res.ok) {
      console.error("[airtable] list failed:", table, res.status, await res.text().catch(() => ""));
      break;
    }
    const data = (await res.json()) as { records: AirtableRecord<T>[]; offset?: string };
    out.push(...data.records);
    offset = data.offset;
    if (opts.maxRecords && out.length >= opts.maxRecords) break;
  } while (offset);

  return out;
}

/** Create records (Airtable caps at 10 per request; we chunk). typecast lets
 * single-selects accept new option strings without a 422. */
export async function createRecords<T = Record<string, unknown>>(
  table: string,
  records: Partial<T>[],
): Promise<AirtableRecord<T>[]> {
  if (!isConfigured() || records.length === 0) return [];

  const created: AirtableRecord<T>[] = [];
  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10).map((fields) => ({ fields }));
    const res = await fetch(tableUrl(table), {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ records: chunk, typecast: true }),
    });
    if (!res.ok) {
      console.error("[airtable] create failed:", table, res.status, await res.text().catch(() => ""));
      continue;
    }
    const data = (await res.json()) as { records: AirtableRecord<T>[] };
    created.push(...data.records);
  }
  return created;
}

/** Patch records by id (chunked, typecast). */
export async function updateRecords<T = Record<string, unknown>>(
  table: string,
  updates: { id: string; fields: Partial<T> }[],
): Promise<void> {
  if (!isConfigured() || updates.length === 0) return;

  for (let i = 0; i < updates.length; i += 10) {
    const chunk = updates.slice(i, i + 10);
    const res = await fetch(tableUrl(table), {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ records: chunk, typecast: true }),
    });
    if (!res.ok) {
      console.error("[airtable] update failed:", table, res.status, await res.text().catch(() => ""));
    }
  }
}

/** Escape a value for use inside a filterByFormula string literal. */
export function escapeFormulaValue(v: string): string {
  return v.replace(/'/g, "\\'");
}
