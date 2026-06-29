import { X, Check } from "@phosphor-icons/react/dist/ssr";
import type { Source } from "@/lib/tiers";

/**
 * The value visual on each package landing page: a headline stat (real, sourced)
 * with a side-by-side "Without" vs "With GrowVera" contrast.
 */
export default function WithWithout({
  stat,
  without,
  withGV,
  sources,
  packageName,
}: {
  stat: string;
  without: string;
  withGV: string;
  sources: Source[];
  packageName: string;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-cabinet), Outfit, sans-serif",
          fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)",
          fontWeight: 800,
          color: "#F4F4F1",
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          maxWidth: "44rem",
          marginBottom: "1.75rem",
        }}
      >
        {stat}
      </p>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))" }}>
        {/* Without */}
        <div style={{ background: "#131318", border: "1px solid rgba(248,113,113,0.20)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ width: 26, height: 26, borderRadius: 999, background: "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} weight="bold" style={{ color: "#F87171" }} />
            </span>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "#F87171" }}>Without</span>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#C9C9C6", lineHeight: 1.6 }}>{without}</p>
        </div>

        {/* With */}
        <div style={{ background: "linear-gradient(180deg, #15211B 0%, #121218 100%)", border: "1px solid rgba(52,211,153,0.35)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ width: 26, height: 26, borderRadius: 999, background: "rgba(52,211,153,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} weight="bold" style={{ color: "#34D399" }} />
            </span>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "#34D399" }}>With {packageName}</span>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#F4F4F1", lineHeight: 1.6 }}>{withGV}</p>
        </div>
      </div>

      {sources.length > 0 && (
        <p style={{ fontSize: "0.7rem", color: "#6E6E72", marginTop: "1rem" }}>
          Source:{" "}
          {sources.map((s, i) => (
            <span key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#8A9A92", textDecoration: "underline" }}>{s.label}</a>
              {i < sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
