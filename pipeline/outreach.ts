import { listRecords, createRecords, escapeFormulaValue, isConfigured, AIRTABLE } from "../lib/airtable";
import { sendEmail } from "../lib/notify";
import { isOutreachEnabled } from "../lib/settings";
import type { Lead, LeadStore } from "./types";

/**
 * Autonomous outreach — with hard guardrails. Sends the drafted pitch for
 * "ready" leads, but ONLY when:
 *   - the kill switch is on (Airtable Settings outreach_enabled, or env
 *     OUTREACH_ENABLED — default OFF, nothing sends by accident),
 *   - under the daily cap (DAILY_OUTREACH_CAP, default 15),
 *   - the recipient isn't on the Suppression (do-not-contact) list.
 *
 * Channel reality: cold prospects from Places give us a phone, not an email, and
 * unsolicited cold email/SMS is restricted under the Australian Spam Act 2003. So
 * we auto-SEND only where we have a contactable email; leads without one stay
 * "ready" and surface in the dashboard queue for a compliant human send (DM /
 * call) — which also converts best for trades. Every send is logged to Outreach.
 */

const COMPLIANCE_FOOTER =
  "\n\n—\nGrowVera · Sydney, Australia · ABN 50 329 139 726\nWe sent this because your business may benefit from a better web presence. " +
  "If you'd rather not hear from us, reply STOP or email admin@growvera.com.au and we'll remove you immediately.";

function dailyCap(): number {
  return Math.max(0, parseInt(process.env.DAILY_OUTREACH_CAP || "15", 10));
}

async function suppressedEmails(): Promise<Set<string>> {
  const set = new Set<string>();
  if (!isConfigured()) return set;
  const recs = await listRecords<{ Email?: string }>(AIRTABLE.tables.suppression());
  for (const r of recs) {
    const e = r.fields?.Email;
    if (typeof e === "string" && e) set.add(e.toLowerCase().trim());
  }
  return set;
}

/** Fetch emails for ready leads from Airtable (keyed by LeadId). */
async function emailsForLeads(leadIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!isConfigured() || leadIds.length === 0) return map;
  // Airtable OR() formula, chunked to keep the URL sane.
  for (let i = 0; i < leadIds.length; i += 25) {
    const chunk = leadIds.slice(i, i + 25);
    const formula = `OR(${chunk.map((id) => `{LeadId}='${escapeFormulaValue(id)}'`).join(",")})`;
    const recs = await listRecords<{ LeadId?: string; Email?: string }>(AIRTABLE.tables.leads(), { filterByFormula: formula });
    for (const r of recs) {
      const id = r.fields?.LeadId;
      const email = r.fields?.Email;
      if (typeof id === "string" && typeof email === "string" && email) map.set(id, email);
    }
  }
  return map;
}

async function logOutreach(lead: Lead, channel: string, email: string): Promise<void> {
  if (!isConfigured()) return;
  await createRecords(AIRTABLE.tables.outreach(), [
    {
      LeadId: lead.business.id,
      Business: lead.business.name,
      Channel: channel,
      Variant: lead.variant || "default",
      Email: email,
      SentAt: new Date().toISOString(),
    },
  ]);
}

export interface OutreachResult {
  sent: number;
  queued: number;
  skipped: number;
  reason?: string;
}

/** Run a capped, compliant outreach pass over the CRM's ready leads. */
export async function runOutreach(crm: LeadStore): Promise<OutreachResult> {
  if (!(await isOutreachEnabled())) {
    return { sent: 0, queued: 0, skipped: 0, reason: "outreach disabled (kill switch / OUTREACH_ENABLED)" };
  }

  const ready = crm.byStatus("ready").filter((l) => l.pitch && l.offerUrl);
  if (ready.length === 0) return { sent: 0, queued: 0, skipped: 0 };

  const [suppressed, emails] = await Promise.all([
    suppressedEmails(),
    emailsForLeads(ready.map((l) => l.business.id)),
  ]);

  let cap = dailyCap();
  let sent = 0;
  let queued = 0;
  let skipped = 0;

  for (const lead of ready) {
    const email = emails.get(lead.business.id);
    if (!email) {
      queued++; // no compliant email channel — leave for the founder queue
      continue;
    }
    if (suppressed.has(email.toLowerCase().trim())) {
      crm.setStatus(lead.business.id, "suppressed");
      skipped++;
      continue;
    }
    if (cap <= 0) {
      queued++; // over the daily cap — try next run
      continue;
    }

    const subject = `A website we built for ${lead.business.name}`;
    const ok = await sendEmail(email, subject, (lead.pitch as string) + COMPLIANCE_FOOTER);
    if (ok) {
      crm.update(lead.business.id, { status: "pitched", channel: "email", sentAt: new Date().toISOString(), touches: lead.touches + 1 });
      await logOutreach(lead, "email", email);
      sent++;
      cap--;
    } else {
      queued++; // SMTP not configured / failed — leave ready
    }
  }

  return { sent, queued, skipped };
}
