import type { Metadata } from "next";
import { CheckCircle, Calculator, Phone, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import CalEmbed from "@/components/CalEmbed";
import AuditCalculator from "@/components/AuditCalculator";
import LeadForm from "@/components/LeadForm";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Free AI Audit — see what missed calls are costing you | GrowVera",
  description:
    "See, on the spot, roughly what missed calls and slow quotes cost your trade business each year — an honest estimate from your own numbers. Then book a free 15-minute call, no obligation, and we'll work out the real figure together.",
};

export default function AuditPage() {
  return (
    <div style={{ background: "var(--color-bg)" }}>

      {/* HEADER */}
      <section style={{ background: "var(--color-bg-section)" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>
              Free AI Audit · No obligation · 2 minutes
            </p>
            <h1
              style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.035em", color: "var(--color-text)", lineHeight: 1.05, marginBottom: "1rem" }}
            >
              See what missed calls<br />
              <span style={{ color: "var(--color-accent)" }}>are costing you.</span>
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
              Put in a few numbers and see, on the spot, roughly what you&apos;re losing each year. Most owners guess low &mdash; this shows your real number in two minutes. Then book a quick call and we&apos;ll work out the exact figure together.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CALCULATOR */}
      <section style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Calculator size={18} weight="bold" style={{ color: "var(--color-accent)" }} />
              <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--color-accent)" }}>Your quick audit</p>
            </div>
            <AuditCalculator />
          </ScrollReveal>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Calculator,
                  title: "We check your real numbers",
                  body: "The estimate above is a rough guide from your inputs. On the call we work out what's actually walking past your phone — often more than owners expect.",
                },
                {
                  icon: Phone,
                  title: "15 minutes, plain English",
                  body: "No jargon, no hard sell. We show you where jobs are slipping out and the simplest, cheapest way to plug the gap.",
                },
                {
                  icon: ShieldCheck,
                  title: "No obligation — ever",
                  body: "The audit is yours to keep, whether we work together or not. No follow-up unless you ask for it. We comply with the Australian Spam Act 2003.",
                },
              ].map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="flex items-start gap-3 px-5 py-4 rounded-2xl"
                    style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                  >
                    <div style={{ width: 32, height: 32, background: "var(--color-accent-soft)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={15} weight="bold" style={{ color: "var(--color-accent)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>{point.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{point.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* BOOK — CAL EMBED */}
      <section style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(2rem, 4vw, 3rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "var(--font-cabinet)", fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em", marginBottom: "0.6rem" }}>
                Book your free 15-minute audit.
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", maxWidth: "34rem", marginInline: "auto", lineHeight: 1.6 }}>
                Pick a time that suits. We&apos;ll walk through your real numbers and show you the simplest way to stop losing jobs &mdash; with no pressure to buy anything on the call.
              </p>
            </div>
            <CalEmbed />
          </ScrollReveal>
        </div>
      </section>

      {/* LEAD CAPTURE FALLBACK */}
      <section style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "0.75rem" }}>
                Rather we reach out?
              </p>
              <h3 style={{ fontFamily: "var(--font-cabinet)", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                Leave your details and we&apos;ll ring you back.
              </h3>
            </div>
            <LeadForm />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                {[
                  "Free, no obligation",
                  "Answers only when you can't — you're first to pick up",
                  "No setup fee — priced to your business",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CheckCircle size={14} weight="fill" style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
