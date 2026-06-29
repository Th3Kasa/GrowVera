import "./env";
import { promises as fs } from "node:fs";
import path from "node:path";
import { listRecords, createRecords, updateRecords, escapeFormulaValue, isConfigured, AIRTABLE } from "../lib/airtable";

/**
 * Self-improvement loop. Reads real outcomes (Outreach sends + which leads
 * booked) and rolls them up per channel and per message variant into the
 * Experiments table, then deactivates variants/channels that underperform once
 * they have enough sample. Bookings are the ground-truth signal (the Cal webhook
 * marks leads booked); replies are counted when present. Outputs a plain-English
 * report to pipeline/research/optimizer-report.md.
 *
 *   npx tsx pipeline/optimizer.ts
 */

const MIN_SAMPLE = Number(process.env.OPTIMIZER_MIN_SAMPLE || 20);
const MIN_BOOKING_RATE = Number(process.env.OPTIMIZER_MIN_BOOKING_RATE || 0.02);
const REPORT_PATH = path.join(process.cwd(), "pipeline", "research", "optimizer-report.md");

interface Stat { sent: number; replied: number; booked: number }

function blank(): Stat {
  return { sent: 0, replied: 0, booked: 0 };
}

function key(channel: string, variant: string): string {
  return `${channel}::${variant}`;
}

async function run() {
  if (!isConfigured()) {
    console.error("[optimizer] Airtable not configured — nothing to optimise.");
    return;
  }

  const [outreach, leads] = await Promise.all([
    listRecords<Record<string, unknown>>(AIRTABLE.tables.outreach()),
    listRecords<Record<string, unknown>>(AIRTABLE.tables.leads()),
  ]);

  // Which leads have booked? (ground truth from the Cal webhook)
  const bookedLeadIds = new Set(
    leads.filter((l) => String(l.fields.Status ?? "").toLowerCase() === "booked" || l.fields.BookedAt).map((l) => l.fields.LeadId as string),
  );

  const stats = new Map<string, Stat>();
  for (const rec of outreach) {
    const f = rec.fields;
    const channel = (typeof f.Channel === "string" ? f.Channel : "unknown").toLowerCase();
    const variant = typeof f.Variant === "string" ? f.Variant : "default";
    const k = key(channel, variant);
    const st = stats.get(k) ?? blank();
    st.sent++;
    if (f.RepliedAt || f.Replied === true) st.replied++;
    if (f.BookedAt || f.Booked === true || (typeof f.LeadId === "string" && bookedLeadIds.has(f.LeadId))) st.booked++;
    stats.set(k, st);
  }

  if (stats.size === 0) {
    console.log("[optimizer] no outreach sent yet — nothing to roll up.");
    await writeReport([]);
    return;
  }

  // Upsert each (channel, variant) into Experiments and decide active/paused.
  const existing = await listRecords<{ Key?: string }>(AIRTABLE.tables.experiments());
  const byKey = new Map(existing.map((r) => [r.fields?.Key, r.id]));

  const rows: { k: string; channel: string; variant: string; st: Stat; bookingRate: number; active: boolean }[] = [];
  const creates: Record<string, unknown>[] = [];
  const updates: { id: string; fields: Record<string, unknown> }[] = [];

  for (const [k, st] of stats) {
    const [channel, variant] = k.split("::");
    const bookingRate = st.sent ? st.booked / st.sent : 0;
    const replyRate = st.sent ? st.replied / st.sent : 0;
    // Pause only once there's enough evidence; otherwise keep testing.
    const active = st.sent < MIN_SAMPLE || bookingRate >= MIN_BOOKING_RATE;
    rows.push({ k, channel, variant, st, bookingRate, active });

    const fields = {
      Key: k, Channel: channel, Variant: variant,
      Sent: st.sent, Replied: st.replied, Booked: st.booked,
      ReplyRate: Number(replyRate.toFixed(3)), BookingRate: Number(bookingRate.toFixed(3)),
      Active: active, UpdatedAt: new Date().toISOString(),
    };
    const id = byKey.get(k);
    if (id) updates.push({ id, fields });
    else creates.push(fields);
  }

  if (creates.length) await createRecords(AIRTABLE.tables.experiments(), creates);
  if (updates.length) await updateRecords(AIRTABLE.tables.experiments(), updates);

  const paused = rows.filter((r) => !r.active);
  console.log(`[optimizer] rolled up ${rows.length} channel/variant combos · ${paused.length} paused for underperformance.`);
  await writeReport(rows);
}

async function writeReport(rows: { channel: string; variant: string; st: Stat; bookingRate: number; active: boolean }[]) {
  const lines = [
    `# Outreach optimizer report`,
    ``,
    `Generated ${new Date().toISOString()}. Thresholds: min sample ${MIN_SAMPLE}, min booking rate ${(MIN_BOOKING_RATE * 100).toFixed(1)}%.`,
    ``,
  ];
  if (rows.length === 0) {
    lines.push(`No outreach data yet. Once the engine sends and leads book, winners/losers appear here.`);
  } else {
    lines.push(`| Channel | Variant | Sent | Booked | Booking rate | Status |`, `|---|---|---|---|---|---|`);
    for (const r of [...rows].sort((a, b) => b.bookingRate - a.bookingRate)) {
      lines.push(`| ${r.channel} | ${r.variant} | ${r.st.sent} | ${r.st.booked} | ${(r.bookingRate * 100).toFixed(1)}% | ${r.active ? "active" : "PAUSED"} |`);
    }
    const best = [...rows].sort((a, b) => b.bookingRate - a.bookingRate)[0];
    lines.push(``, `Best performer: **${best.channel} / ${best.variant}** at ${(best.bookingRate * 100).toFixed(1)}% booking rate. Double down here.`);
  }
  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, lines.join("\n") + "\n", "utf8");
  console.log(`[optimizer] report → ${REPORT_PATH}`);
}

run().catch((err) => {
  console.error("Optimizer failed:", err);
  process.exitCode = 1;
});
