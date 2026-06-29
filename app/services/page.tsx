import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle, ArrowRight, X } from "@phosphor-icons/react/dist/ssr";
import { TIERS, CAPABILITIES, formatAud, type TierId } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Which package is right for you? — GrowVera",
  description:
    "Pick the result you want: get found (Presence), stay visible (Engine), or get more customers (Growth Partner). Compare GrowVera's done-for-you packages.",
};

export default function ServicesPage() {
  return (
    <main style={{ background: "#08080A" }}>
      {/* HEADER */}
      <section style={{ background: "#0E0E11" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>
            Find your fit
          </p>
          <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.035em", color: "#F4F4F1", lineHeight: 1.05, marginBottom: "16px" }}>
            Not sure where to start?<br />Pick the result you want.
          </h1>
          <p style={{ color: "#A2A2A0", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Three simple packages. Each one builds on the last: get found → stay visible → get more customers.
          </p>
        </div>
      </section>

      {/* OUTCOME CARDS */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))" }}>
            {TIERS.map((tier) => {
              const featured = !!tier.highlight;
              return (
                <div
                  key={tier.id}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    background: featured ? "linear-gradient(180deg, #15211B 0%, #121218 100%)" : "#131318",
                    border: featured ? "1px solid rgba(52,211,153,0.45)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "1.25rem",
                    padding: "1.75rem",
                  }}
                >
                  {featured && (
                    <span style={{ position: "absolute", top: "1.1rem", right: "1.1rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#06180F", background: "#34D399", padding: "0.25rem 0.6rem", borderRadius: 999 }}>Most popular</span>
                  )}
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#F4F4F1", marginBottom: "0.5rem" }}>{tier.name}</p>
                  <p style={{ fontSize: "0.95rem", color: "#E4E4E1", lineHeight: 1.5, marginBottom: "1rem", fontWeight: 600 }}>{tier.outcome}</p>
                  <p style={{ fontSize: "0.82rem", color: "#A2A2A0", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                    <span style={{ color: "#34D399", fontWeight: 600 }}>Pick this if:</span> {tier.pickThisIf}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "#6E6E72" }}>from</span>
                    <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.9rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, letterSpacing: "-0.03em" }}>{formatAud(tier.priceMonthly)}</span>
                    <span style={{ fontSize: "0.8rem", color: "#6E6E72" }}>/mo</span>
                  </div>

                  <Link
                    href={`/${tier.slug}`}
                    className="inline-flex items-center justify-center gap-2"
                    style={{ width: "100%", padding: "0.8rem 1.25rem", borderRadius: 999, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", marginTop: "auto", border: featured ? "none" : "1px solid rgba(255,255,255,0.16)", background: featured ? "#34D399" : "transparent", color: featured ? "#06180F" : "#F4F4F1" }}
                  >
                    See {tier.name} <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.25rem", padding: "clamp(1rem, 3vw, 1.75rem)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.75rem 0.5rem", fontSize: "0.75rem", color: "#A2A2A0", fontWeight: 600 }}>What you get</th>
                  {TIERS.map((t) => (
                    <th key={t.id} style={{ textAlign: "center", padding: "0.75rem 0.5rem", fontSize: "0.8rem", color: "#F4F4F1", fontWeight: 700, fontFamily: "var(--font-cabinet), Outfit, sans-serif" }}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAPABILITIES.map((row, i) => (
                  <tr key={row.label} style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ padding: "0.7rem 0.5rem", fontSize: "0.85rem", color: "#C9C9C6" }}>{row.label}</td>
                    {TIERS.map((t) => (
                      <td key={t.id} style={{ textAlign: "center", padding: "0.7rem 0.5rem" }}>
                        {row.tiers[t.id as TierId] ? (
                          <CheckCircle size={18} weight="fill" style={{ color: "#34D399", display: "inline" }} />
                        ) : (
                          <X size={15} weight="bold" style={{ color: "#3A3A3E", display: "inline" }} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                  <td style={{ padding: "0.9rem 0.5rem", fontSize: "0.8rem", color: "#A2A2A0", fontWeight: 600 }}>From / month</td>
                  {TIERS.map((t) => (
                    <td key={t.id} style={{ textAlign: "center", padding: "0.9rem 0.5rem", fontSize: "0.95rem", fontWeight: 800, color: "#F4F4F1", fontFamily: "var(--font-cabinet), Outfit, sans-serif" }}>{formatAud(t.priceMonthly)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#6E6E72", marginTop: "1rem" }}>
            All packages: month to month, one-off onboarding &amp; build, AUD GST-inclusive. Cancel anytime.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
          <div style={{ background: "linear-gradient(135deg, #16A34A 0%, #1A5C3A 100%)", borderRadius: "20px", padding: "clamp(32px, 5vw, 52px)", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", color: "#fff", marginBottom: "14px" }}>
              Still not sure? Let&apos;s talk.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.80)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "400px", margin: "0 auto 28px" }}>
              Book a free 15-minute call and we&apos;ll tell you exactly which package fits — and show you a free sample site.
            </p>
            <Link
              href="/audit"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#0D2A1B", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "100px", textDecoration: "none" }}
            >
              Book your free call →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
