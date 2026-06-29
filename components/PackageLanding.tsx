import { CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import ScrollReveal from "@/components/ScrollReveal";
import WithWithout from "@/components/WithWithout";
import { formatAud, type Tier } from "@/lib/tiers";

/**
 * Shared template for the three package landing pages (/presence, /engine,
 * /growth-partner). Renders entirely from a single Tier record so all copy lives
 * in lib/tiers.ts. Plain-language, one clear outcome, value-first.
 */
export default function PackageLanding({ tier }: { tier: Tier }) {
  return (
    <main style={{ background: "#08080A" }}>
      {/* HERO */}
      <section style={{ background: "#0E0E11" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>
              {tier.name}
            </p>
            <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(2.1rem, 5.5vw, 3.75rem)", letterSpacing: "-0.035em", color: "#F4F4F1", lineHeight: 1.05, marginBottom: "1.1rem" }}>
              {tier.outcome}
            </h1>
            <p style={{ color: "#A2A2A0", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 2rem" }}>
              {tier.pickThisIf} We build it and run it for you — from {formatAud(tier.priceMonthly)}/month.
            </p>
            <a
              href="/audit"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#34D399", color: "#06180F", padding: "0.95rem 1.9rem", borderRadius: "2rem", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 24px rgba(52,211,153,0.25)" }}
            >
              Book your free call <ArrowRight size={15} weight="bold" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        {/* IS THIS YOU */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "#F4F4F1", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              Is this you?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tier.forWho.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                  <span style={{ color: "#34D399", fontWeight: 800, lineHeight: 1.6 }}>&mdash;</span>
                  <span style={{ color: "#C9C9C6", fontSize: "0.975rem", lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* WITH / WITHOUT */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "#F4F4F1", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              The difference it makes
            </h2>
            <WithWithout stat={tier.stat} without={tier.without} withGV={tier.withGV} sources={tier.sources} packageName={tier.name} />
          </section>
        </ScrollReveal>

        {/* WHAT WE DO */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "#F4F4F1", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              What we do for you
            </h2>
            <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.25rem", padding: "clamp(1.5rem, 4vw, 2.25rem)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {tier.plainGet.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                  <CheckCircle size={18} weight="fill" style={{ color: "#34D399", flexShrink: 0, marginTop: "0.1rem" }} />
                  <span style={{ color: "#E4E4E1", fontSize: "0.975rem", lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* HOW IT WORKS */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "#F4F4F1", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
              How it works
            </h2>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))" }}>
              {[
                { n: "1", t: "Free sample", d: "We build a real sample for your business — see the quality before you pay." },
                { n: "2", t: "Quick call", d: "A 15-minute call to align on goals. No jargon, no pressure." },
                { n: "3", t: "We run it", d: "We build and run everything. You approve from your phone." },
              ].map((s) => (
                <div key={s.n} style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.4rem" }}>
                  <div style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#34D399", lineHeight: 1, marginBottom: "0.6rem" }}>{s.n}</div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#F4F4F1", marginBottom: "0.3rem" }}>{s.t}</p>
                  <p style={{ fontSize: "0.85rem", color: "#A2A2A0", lineHeight: 1.55 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* PRICE */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <div style={{ background: "linear-gradient(180deg, #15211B 0%, #121218 100%)", border: "1px solid rgba(52,211,153,0.35)", borderRadius: "1.25rem", padding: "clamp(1.75rem, 4vw, 2.5rem)", textAlign: "center" }}>
              <p style={{ fontSize: "0.8rem", color: "#A2A2A0", marginBottom: "0.4rem" }}>From</p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.35rem", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "3rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, letterSpacing: "-0.03em" }}>{formatAud(tier.priceMonthly)}</span>
                <span style={{ fontSize: "0.9rem", color: "#6E6E72" }}>/month</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#A2A2A0", marginBottom: "1.5rem" }}>
                AUD, GST inclusive · one-off onboarding &amp; build · cancel anytime
              </p>
              <a
                href="/audit"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#34D399", color: "#06180F", padding: "0.95rem 1.9rem", borderRadius: "2rem", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}
              >
                Book your free call <ArrowRight size={15} weight="bold" />
              </a>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <section>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "#F4F4F1", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              Common questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tier.faqs.map((f) => (
                <div key={f.q} style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem 1.4rem" }}>
                  <p style={{ fontWeight: 700, color: "#F4F4F1", fontSize: "0.95rem", marginBottom: "0.35rem" }}>{f.q}</p>
                  <p style={{ color: "#A2A2A0", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* COMPARE LINK */}
        <ScrollReveal>
          <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.85rem", color: "#6E6E72" }}>
            Not sure this is the right fit?{" "}
            <a href="/services" style={{ color: "#34D399", textDecoration: "none", fontWeight: 600 }}>Compare all packages →</a>
          </p>
        </ScrollReveal>
      </div>
    </main>
  );
}
