import Link from "next/link";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { TIERS, formatAud } from "@/lib/tiers";

/**
 * Pricing section — founding phase is call-first: each card links to its package
 * landing page (details) and the primary CTA books a call. Stripe payment links
 * stay wired in lib/tiers for post-call self-serve.
 */
export default function Pricing() {
  return (
    <section id="pricing" style={{ background: "var(--color-bg-section)", paddingTop: "clamp(3.5rem, 8vw, 8rem)", paddingBottom: "clamp(3.5rem, 8vw, 8rem)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: "center", maxWidth: "44rem", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "0.9rem" }}>Pricing</p>
          <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.25rem)", fontWeight: 900, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem" }}>
            Simple pricing. Real numbers.
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
            Start with a free AI audit — we&apos;ll show you what missed calls are costing you first. Prices in AUD, GST inclusive.
          </p>
        </div>

        <div style={{ display: "grid", gap: "1.25rem", marginTop: "3rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 19rem), 1fr))" }}>
          {TIERS.map((tier) => {
            const featured = !!tier.highlight;
            return (
              <div
                key={tier.id}
                style={{
                  position: "relative",
                  background: featured ? "var(--gradient-card-featured)" : "var(--color-bg-card)",
                  border: featured ? "1px solid var(--color-accent-border-vivid)" : "1px solid var(--color-border)",
                  borderRadius: "1.25rem",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: featured ? "0 24px 60px var(--color-accent-soft)" : "none",
                }}
              >
                {featured && (
                  <span style={{ position: "absolute", top: "1.1rem", right: "1.1rem", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-on-accent)", background: "var(--color-accent)", padding: "0.25rem 0.6rem", borderRadius: 999 }}>Most popular</span>
                )}
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.2rem" }}>{tier.name}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>{tier.outcome}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-faint)" }}>from</span>
                  <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.6rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1, letterSpacing: "-0.03em" }}>{formatAud(tier.priceMonthly)}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-faint)" }}>/month</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                  {tier.priceNote}
                </p>

                <Link
                  href="/audit"
                  className="inline-flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    width: "100%",
                    padding: "0.85rem 1.25rem",
                    borderRadius: 999,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    border: featured ? "none" : "1px solid var(--color-border-strong)",
                    background: featured ? "var(--color-accent)" : "transparent",
                    color: featured ? "var(--color-on-accent)" : "var(--color-text)",
                    marginBottom: "0.6rem",
                  }}
                >
                  Get my free audit <ArrowRight size={15} weight="bold" />
                </Link>
                <Link href={`/${tier.slug}`} style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--color-accent-muted)", textDecoration: "none", marginBottom: "1.4rem" }}>
                  See {tier.name} details →
                </Link>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {tier.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                      <CheckCircle size={15} weight="fill" style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "0.15rem" }} />
                      <span style={{ fontSize: "0.83rem", color: "var(--color-text-soft)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.85rem", color: "var(--color-text-faint)" }}>
          Not sure which fits? <a href="/audit" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>Start with a free audit →</a>
        </p>
      </div>
    </section>
  );
}
