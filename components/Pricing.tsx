"use client";

import { useState } from "react";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { TIERS, formatAud, type TierId } from "@/lib/tiers";

/**
 * Phase 1: if a hosted Stripe Payment Link is configured for the tier, the
 * Subscribe button links straight out to it (subscription mode, no backend).
 * Phase 2: otherwise it POSTs to /api/checkout to create a Checkout Session.
 *
 * These must be referenced as literal `process.env.NEXT_PUBLIC_*` so Next can
 * inline them into the client bundle.
 */
const PAYMENT_LINKS: Record<TierId, string | undefined> = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STARTER,
  pro: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO,
  agency: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AGENCY,
};

export default function Pricing() {
  const [loading, setLoading] = useState<TierId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(tier: TierId) {
    setError(null);
    const link = PAYMENT_LINKS[tier];
    if (link) {
      window.location.href = link;
      return;
    }
    try {
      setLoading(tier);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Checkout is not configured yet. Add your Stripe keys to go live.");
      }
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" style={{ background: "#0E0E11", paddingTop: "clamp(3.5rem, 8vw, 8rem)", paddingBottom: "clamp(3.5rem, 8vw, 8rem)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: "center", maxWidth: "44rem", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "0.9rem" }}>Pricing</p>
          <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.25rem)", fontWeight: 900, color: "#F4F4F1", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem" }}>
            One subscription. <span style={{ color: "#34D399" }}>The whole agency.</span>
          </h2>
          <p style={{ fontSize: "1rem", color: "#A2A2A0", lineHeight: 1.7, marginBottom: "0.5rem" }}>
            A one-off onboarding &amp; build, then a simple monthly retainer. Cancel anytime. Prices in AUD, GST inclusive.
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
                  background: featured ? "linear-gradient(180deg, #15211B 0%, #121218 100%)" : "#131318",
                  border: featured ? "1px solid rgba(52,211,153,0.45)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "1.25rem",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: featured ? "0 24px 60px rgba(52,211,153,0.10)" : "none",
                }}
              >
                {featured && (
                  <span style={{ position: "absolute", top: "1.1rem", right: "1.1rem", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#06180F", background: "#34D399", padding: "0.25rem 0.6rem", borderRadius: 999 }}>Most popular</span>
                )}
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F4F4F1", marginBottom: "0.2rem" }}>{tier.name}</p>
                <p style={{ fontSize: "0.82rem", color: "#A2A2A0", marginBottom: "1.25rem" }}>{tier.tagline}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.4rem" }}>
                  <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.75rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, letterSpacing: "-0.03em" }}>{formatAud(tier.priceMonthly)}</span>
                  <span style={{ fontSize: "0.85rem", color: "#6E6E72" }}>/month</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#A2A2A0", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                  + {formatAud(tier.setupFee)} one-off setup
                  <br />
                  <span style={{ color: "#6E6E72" }}>{tier.setupWaiverNote}</span>
                </p>

                <button
                  onClick={() => subscribe(tier.id)}
                  disabled={loading === tier.id}
                  className="inline-flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    width: "100%",
                    padding: "0.85rem 1.25rem",
                    borderRadius: 999,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: loading === tier.id ? "wait" : "pointer",
                    border: featured ? "none" : "1px solid rgba(255,255,255,0.16)",
                    background: featured ? "#34D399" : "transparent",
                    color: featured ? "#06180F" : "#F4F4F1",
                    marginBottom: "1.5rem",
                  }}
                >
                  {loading === tier.id ? "Starting…" : <>Get started <ArrowRight size={15} weight="bold" /></>}
                </button>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {tier.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                      <CheckCircle size={15} weight="fill" style={{ color: "#34D399", flexShrink: 0, marginTop: "0.15rem" }} />
                      <span style={{ fontSize: "0.83rem", color: "#C9C9C6", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#FCA5A5" }}>{error}</p>
        )}

        <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.85rem", color: "#6E6E72" }}>
          Want it done for you instead? <a href="/audit" style={{ color: "#34D399", textDecoration: "none", fontWeight: 600 }}>Book a strategy call →</a>
        </p>
      </div>
    </section>
  );
}
