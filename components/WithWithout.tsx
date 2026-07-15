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
          color: "var(--color-text)",
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
        <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-danger-border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ width: 26, height: 26, borderRadius: 999, background: "var(--color-danger-icon-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} weight="bold" style={{ color: "var(--color-danger)" }} />
            </span>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "var(--color-danger)" }}>Without</span>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-soft)", lineHeight: 1.6 }}>{without}</p>
        </div>

        {/* With */}
        <div style={{ background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ width: 26, height: 26, borderRadius: 999, background: "var(--color-accent-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} weight="bold" style={{ color: "var(--color-accent)" }} />
            </span>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "var(--color-accent)" }}>With {packageName}</span>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text)", lineHeight: 1.6 }}>{withGV}</p>
        </div>
      </div>

      {sources.length > 0 && (
        <p style={{ fontSize: "0.7rem", color: "var(--color-text-faint)", marginTop: "1rem" }}>
          Source:{" "}
          {sources.map((s, i) => (
            <span key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent-muted)", textDecoration: "underline" }}>{s.label}</a>
              {i < sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
