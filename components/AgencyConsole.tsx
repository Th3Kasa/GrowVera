import { CheckCircle, Globe, MagnifyingGlass, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";

/**
 * Presentational mock of the autonomous pipeline running — used in the hero and
 * the "system" section. Pure SSR, no hooks; the live dot animates via CSS.
 */
export default function AgencyConsole() {
  const rows = [
    { biz: "Coastline Plumbing", region: "Cronulla", status: "Pitched", color: "#34D399", icon: PaperPlaneTilt },
    { biz: "Ridgeway Electrical", region: "Penrith", status: "Reviewing", color: "#FBBF24", icon: Globe },
    { biz: "Apex Auto Care", region: "Parramatta", status: "Building", color: "#60A5FA", icon: Globe },
    { biz: "Summit Roofing", region: "Newcastle", status: "Found", color: "#A2A2A0", icon: MagnifyingGlass },
  ];
  return (
    <div
      style={{
        background: "#0F0F13",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "1.25rem",
        padding: "1.1rem",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="gv-pulse" style={{ width: 8, height: 8, borderRadius: 999, background: "#34D399", display: "inline-block" }} />
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#A2A2A0", fontWeight: 600 }}>Agency · live</span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "#6E6E72" }}>today · 14 built</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.biz}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "#16161C", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.7rem", padding: "0.7rem 0.8rem",
              }}
            >
              <Icon size={16} weight="bold" style={{ color: r.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#F4F4F1", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.biz}</p>
                <p style={{ fontSize: "0.68rem", color: "#6E6E72" }}>{r.region} · no website</p>
              </div>
              <span style={{ fontSize: "0.64rem", fontWeight: 700, color: r.color, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.2rem 0.55rem", borderRadius: 999, whiteSpace: "nowrap" }}>{r.status}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.9rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <CheckCircle size={15} weight="fill" style={{ color: "#34D399" }} />
        <span style={{ fontSize: "0.72rem", color: "#A2A2A0" }}>Coastline Plumbing — live site + pitch sent to your inbox</span>
      </div>
    </div>
  );
}
