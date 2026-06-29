import { Crm } from "./crm";
import { AirtableCrm } from "./airtableCrm";
import { isConfigured } from "../lib/airtable";
import type { LeadStore } from "./types";

/**
 * Pick the CRM backend. Airtable is the shared source of truth with the website
 * dashboard; it's used when CRM_BACKEND=airtable (or "auto" + Airtable keys are
 * present). Otherwise the zero-infra JSON CRM runs — so the pipeline still works
 * fully offline. Both implement the same LeadStore surface.
 */
export function createCrm(): LeadStore {
  const backend = (process.env.CRM_BACKEND || "auto").toLowerCase();
  const useAirtable = backend === "airtable" || (backend === "auto" && isConfigured());
  if (useAirtable) {
    console.log("   CRM: Airtable (shared with dashboard)");
    return new AirtableCrm();
  }
  console.log("   CRM: local JSON (.crm.json)");
  return new Crm();
}
