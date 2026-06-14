import { promises as fs } from "node:fs";
import { CRM_PATH } from "./config";
import type { Business, Lead, LeadStatus } from "./types";

/**
 * Lightweight CRM. Persists leads to a local JSON file so the pipeline runs with
 * zero infrastructure; dedupes by business id so a business is never worked
 * twice. Swap `load`/`save` for Supabase (see lib/subscriptions.ts pattern) when
 * you want a shared, queryable store.
 */
export class Crm {
  private leads = new Map<string, Lead>();

  async init(): Promise<void> {
    try {
      const raw = await fs.readFile(CRM_PATH, "utf8");
      const arr = JSON.parse(raw) as Lead[];
      for (const l of arr) this.leads.set(l.business.id, l);
    } catch {
      // no file yet — start empty
    }
  }

  has(id: string): boolean {
    return this.leads.has(id);
  }

  /** Insert a freshly-found business if unseen. Returns true if it was new. */
  add(business: Business): boolean {
    if (this.leads.has(business.id)) return false;
    const now = new Date().toISOString();
    this.leads.set(business.id, {
      business,
      status: "found",
      touches: 0,
      createdAt: now,
      updatedAt: now,
    });
    return true;
  }

  update(id: string, patch: Partial<Omit<Lead, "business" | "createdAt">>): void {
    const lead = this.leads.get(id);
    if (!lead) return;
    Object.assign(lead, patch, { updatedAt: new Date().toISOString() });
  }

  setStatus(id: string, status: LeadStatus): void {
    this.update(id, { status });
  }

  get(id: string): Lead | undefined {
    return this.leads.get(id);
  }

  byStatus(status: LeadStatus): Lead[] {
    return [...this.leads.values()].filter((l) => l.status === status);
  }

  /** Flag leads that have been pitched but went quiet (simple lapsed-lead rule). */
  markLapsed(olderThanDays = 14): number {
    const cutoff = Date.now() - olderThanDays * 86_400_000;
    let n = 0;
    for (const lead of this.leads.values()) {
      if (lead.status === "pitched" && new Date(lead.updatedAt).getTime() < cutoff) {
        lead.status = "lapsed";
        n++;
      }
    }
    return n;
  }

  all(): Lead[] {
    return [...this.leads.values()];
  }

  async save(): Promise<void> {
    await fs.writeFile(CRM_PATH, JSON.stringify(this.all(), null, 2), "utf8");
  }
}
