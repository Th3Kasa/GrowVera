import type { Metadata } from "next";
import { getSummary } from "@/lib/dashboard";
import { listRecords, isConfigured, AIRTABLE } from "@/lib/airtable";
import { formatAud } from "@/lib/tiers";
import AdminControls from "./AdminControls";

export const metadata: Metadata = { title: "Dashboard — GrowVera", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STAGE_ORDER = ["found", "ready", "pitched", "replied", "booked", "won", "lost", "lapsed", "suppressed"];
const STAGE_LABEL: Record<string, string> = {
  found: "Found", gathered: "Researched", built: "Demo built", reviewing: "In review", ready: "Ready",
  pitched: "Contacted", replied: "Replied", booked: "Booked", won: "Won", lost: "Lost",
  lapsed: "Lapsed", suppressed: "Suppressed", new: "New (inbound)", unknown: "Other",
};

function pct(n: number): string {
  return `${(n * 100).toFixed(0)}%`;
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}>
      <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6E6E72", marginBottom: "0.5rem" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-cabinet)", fontSize: "1.9rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: "0.78rem", color: "#8A9A92", marginTop: "0.4rem" }}>{sub}</p>}
    </div>
  );
}

interface RecentLead { name: string; status: string; region?: string; demo?: boolean; created?: string }

async function recentLeads(): Promise<RecentLead[]> {
  if (!isConfigured()) return [];
  const recs = await listRecords<Record<string, unknown>>(AIRTABLE.tables.leads(), {
    maxRecords: 12,
    sort: [{ field: "UpdatedAt", direction: "desc" }],
  });
  return recs.map((r) => {
    const f = r.fields;
    return {
      name: (typeof f.Business === "string" && f.Business) || (typeof f.Name === "string" ? f.Name : "—"),
      status: typeof f.Status === "string" ? f.Status : "unknown",
      region: typeof f.Region === "string" ? f.Region : undefined,
      demo: typeof f.DemoUrl === "string" && !!f.DemoUrl,
      created: r.createdTime,
    };
  });
}

export default async function AdminDashboard() {
  const [s, leads] = await Promise.all([getSummary(), recentLeads()]);

  const rank = (st: string) => {
    const i = STAGE_ORDER.indexOf(st);
    return i === -1 ? STAGE_ORDER.length : i;
  };
  const stages = Object.keys(s.leadsByStage).sort((a, b) => rank(a) - rank(b));

  return (
    <div style={{ background: "#08080A", minHeight: "100vh", paddingTop: "clamp(5rem,8vw,6rem)", paddingBottom: "4rem" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-cabinet)", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#F4F4F1", letterSpacing: "-0.03em" }}>Business summary</h1>
            <p style={{ fontSize: "0.9rem", color: "#A2A2A0", marginTop: "0.4rem" }}>Your agency at a glance — revenue, pipeline, and the autonomous engine.</p>
          </div>
          <AdminControls initialEnabled={s.outreachEnabled} />
        </div>

        {/* Config warnings */}
        {(!s.configured.stripe || !s.configured.airtable) && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "0.85rem", padding: "0.85rem 1.1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#FCA5A5" }}>
            {!s.configured.stripe && <div>Stripe not connected — revenue shows 0. Set STRIPE_SECRET_KEY.</div>}
            {!s.configured.airtable && <div>Airtable not connected — pipeline shows 0. Set AIRTABLE_API_KEY + AIRTABLE_BASE_ID.</div>}
          </div>
        )}

        {/* KPI cards */}
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))", marginBottom: "1.25rem" }}>
          <Card label="Monthly revenue (MRR)" value={formatAud(s.mrr)} sub={`${s.activeClients} active client${s.activeClients === 1 ? "" : "s"}`} />
          <Card label="Calls booked this week" value={String(s.bookedThisWeek)} sub="warm, price-aware leads" />
          <Card label="Total leads" value={String(s.totalLeads)} sub={`${s.demosBuilt} demo sites built`} />
          <Card label="Outreach sent" value={String(s.outreachSent)} sub={`${pct(s.replyRate)} reply · ${pct(s.bookingRate)} booked`} />
        </div>

        {/* Pipeline by stage */}
        <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6E6E72", marginBottom: "1rem" }}>Pipeline by stage</p>
          {stages.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "#8A9A92" }}>No leads yet. Run the pipeline to start filling this.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {stages.map((st) => (
                <div key={st} style={{ background: "#0E0E11", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "0.75rem 1rem", minWidth: "7rem" }}>
                  <p style={{ fontFamily: "var(--font-cabinet)", fontSize: "1.4rem", fontWeight: 800, color: "#34D399" }}>{s.leadsByStage[st]}</p>
                  <p style={{ fontSize: "0.78rem", color: "#A2A2A0" }}>{STAGE_LABEL[st] ?? st}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent leads */}
        <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}>
          <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6E6E72", marginBottom: "1rem" }}>Recent leads</p>
          {leads.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "#8A9A92" }}>No leads yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {leads.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 0.75rem", borderRadius: "0.6rem", background: "#0E0E11" }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: "0.88rem", color: "#F4F4F1", fontWeight: 600 }}>{l.name}</span>
                    {l.region && <span style={{ fontSize: "0.78rem", color: "#6E6E72", marginLeft: "0.5rem" }}>{l.region}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                    {l.demo && <span style={{ fontSize: "0.7rem", color: "#34D399" }}>demo ✓</span>}
                    <span style={{ fontSize: "0.74rem", color: "#A2A2A0", textTransform: "capitalize", background: "rgba(255,255,255,0.05)", padding: "0.2rem 0.55rem", borderRadius: "999px" }}>{STAGE_LABEL[l.status.toLowerCase()] ?? l.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
