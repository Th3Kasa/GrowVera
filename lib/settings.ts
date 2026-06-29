/**
 * Runtime flags stored in an Airtable `Settings` table (fields: Key, Value).
 * Lets the dashboard toggle things — chiefly the outreach kill switch — without
 * a redeploy. Falls back to env when Airtable/the table isn't there.
 *
 * Outreach is OFF unless explicitly enabled, so nothing sends by accident.
 */
import { listRecords, createRecords, updateRecords, escapeFormulaValue, isConfigured, AIRTABLE } from "./airtable";

const TABLE = () => process.env.AIRTABLE_SETTINGS_TABLE || "Settings";
const OUTREACH_KEY = "outreach_enabled";

async function readFlag(key: string): Promise<string | null> {
  if (!isConfigured()) return null;
  const recs = await listRecords<{ Key?: string; Value?: string }>(TABLE(), {
    filterByFormula: `{Key} = '${escapeFormulaValue(key)}'`,
    maxRecords: 1,
  });
  return recs[0]?.fields?.Value ?? null;
}

async function writeFlag(key: string, value: string): Promise<void> {
  if (!isConfigured()) return;
  const recs = await listRecords(TABLE(), {
    filterByFormula: `{Key} = '${escapeFormulaValue(key)}'`,
    maxRecords: 1,
  });
  if (recs[0]) {
    await updateRecords(TABLE(), [{ id: recs[0].id, fields: { Value: value } }]);
  } else {
    await createRecords(TABLE(), [{ Key: key, Value: value }]);
  }
}

/** Is autonomous outreach allowed to send right now? Airtable flag wins; if the
 * table/keys aren't set, falls back to OUTREACH_ENABLED env (default off). */
export async function isOutreachEnabled(): Promise<boolean> {
  const flag = await readFlag(OUTREACH_KEY);
  if (flag === null) return process.env.OUTREACH_ENABLED === "true";
  return flag === "true";
}

export async function setOutreachEnabled(on: boolean): Promise<void> {
  await writeFlag(OUTREACH_KEY, on ? "true" : "false");
}

const TARGET_INDEX_KEY = "target_index";

export async function getTargetIndex(): Promise<number> {
  const val = await readFlag(TARGET_INDEX_KEY);
  return val ? parseInt(val, 10) || 0 : 0;
}

export async function setTargetIndex(index: number): Promise<void> {
  await writeFlag(TARGET_INDEX_KEY, String(index));
}
