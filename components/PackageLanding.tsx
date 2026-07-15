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
    <main style={{ background: "var(--color-bg)" }}>
      {/* HERO */}
      <section style={{ background: "var(--color-bg-section)" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>
              {tier.name}
            </p>
            <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(2.1rem, 5.5vw, 3.75rem)", letterSpacing: "-0.035em", color: "var(--color-text)", lineHeight: 1.05, marginBottom: "1.1rem" }}>
              {tier.outcome}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 2rem" }}>
              {tier.pickThisIf} We build it for you — from {formatAud(tier.priceMonthly)}/month.
            </p>
            <a
              href="/audit"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-accent)", color: "var(--color-on-accent)", padding: "0.95rem 1.9rem", borderRadius: "2rem", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 24px var(--color-accent-ring)" }}
            >
              Get my free AI audit <ArrowRight size={15} weight="bold" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        {/* IS THIS YOU */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "var(--color-text)", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              Is this you?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tier.forWho.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                  <span style={{ color: "var(--color-accent)", fontWeight: 800, lineHeight: 1.6 }}>&mdash;</span>
                  <span style={{ color: "var(--color-text-soft)", fontSize: "0.975rem", lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* WITH / WITHOUT */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "var(--color-text)", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              The difference it makes
            </h2>
            <WithWithout stat={tier.stat} without={tier.without} withGV={tier.withGV} sources={tier.sources} packageName={tier.name} />
          </section>
        </ScrollReveal>

        {/* WHAT WE DO */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "var(--color-text)", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              What we do for you
            </h2>
            <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1.25rem", padding: "clamp(1.5rem, 4vw, 2.25rem)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {tier.plainGet.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                  <CheckCircle size={18} weight="fill" style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "0.1rem" }} />
                  <span style={{ color: "var(--color-text-bright)", fontSize: "0.975rem", lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* HOW IT WORKS */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "var(--color-text)", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
              How it works
            </h2>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))" }}>
              {[
                { n: "1", t: "Free AI audit", d: "Tell us your numbers and we show you what missed jobs are costing you." },
                { n: "2", t: "We build it", d: "We set it up for your business — you approve exactly how it works." },
                { n: "3", t: "It goes live", d: "It runs quietly in the background. Nothing changes for you until you say go." },
              ].map((s) => (
                <div key={s.n} style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1rem", padding: "1.4rem" }}>
                  <div style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-accent)", lineHeight: 1, marginBottom: "0.6rem" }}>{s.n}</div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.3rem" }}>{s.t}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* PRICE */}
        <ScrollReveal>
          <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <div style={{ background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border)", borderRadius: "1.25rem", padding: "clamp(1.75rem, 4vw, 2.5rem)", textAlign: "center" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>From</p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.35rem", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "3rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1, letterSpacing: "-0.03em" }}>{formatAud(tier.priceMonthly)}</span>
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-faint)" }}>/month</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                Prices in AUD · {tier.priceNote}
              </p>
              <a
                href="/audit"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-accent)", color: "var(--color-on-accent)", padding: "0.95rem 1.9rem", borderRadius: "2rem", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}
              >
                Get my free AI audit <ArrowRight size={15} weight="bold" />
              </a>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <section>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.2vw, 2rem)", color: "var(--color-text)", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              Common questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tier.faqs.map((f) => (
                <div key={f.q} style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1rem", padding: "1.25rem 1.4rem" }}>
                  <p style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "0.95rem", marginBottom: "0.35rem" }}>{f.q}</p>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* COMPARE LINK */}
        <ScrollReveal>
          <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.85rem", color: "var(--color-text-faint)" }}>
            Not sure this is the right fit?{" "}
            <a href="/audit" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>Get a free audit and we&apos;ll tell you →</a>
          </p>
        </ScrollReveal>
      </div>
    </main>
  );
}
