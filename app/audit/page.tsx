import type { Metadata } from "next";
import { CheckCircle, Clock, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import AuditForm from "@/components/AuditForm";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "GrowVera — Free Google Audit",
  description:
    "Get a free Google Business Profile audit for your Sydney business. We'll identify exactly what's stopping you from ranking #1 in Google Maps — and how to fix it.",
};

const trustPoints = [
  {
    icon: Clock,
    title: "Ready within 24 hours",
    body: "We manually review your Google presence — not a generic automated report.",
  },
  {
    icon: CheckCircle,
    title: "No obligation",
    body: "The audit is yours to keep, whether you work with us or not.",
  },
  {
    icon: ShieldCheck,
    title: "No spam, ever",
    body: "We comply with the Australian Spam Act 2003. One email with your audit. That's it.",
  },
];

export default function AuditPage() {
  return (
    <div style={{ background: "#FAFAF8" }}>
      {/* Hero */}
      <section className="pt-40 pb-16" style={{ background: "#F4F3EF" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-4">
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                style={{ color: "#1A5C3A" }}
              >
                Zero cost · Zero commitment
              </span>
            </div>
            <h1
              className="font-bold tracking-tight leading-[1.0] mb-4"
              style={{
                fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                color: "#0D0D0B",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
              }}
            >
              Get your free Google audit.
              <br />
              <span style={{ color: "#1A5C3A" }}>Takes 60 seconds.</span>
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: "#6B6B68" }}
            >
              Tell us about your business and we&apos;ll send you a personalised
              audit of your Google Business Profile, local rankings, and review
              strategy — within 24 hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form + trust section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-start">
            {/* Form */}
            <ScrollReveal>
              <div
                className="rounded-3xl p-8 md:p-10"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(13,13,11,0.07)",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  className="text-xl font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                    color: "#0D0D0B",
                  }}
                >
                  Request your audit
                </h2>
                <p
                  className="text-sm mb-7"
                  style={{ color: "#6B6B68" }}
                >
                  Fill in the details below — we&apos;ll do the rest.
                </p>
                <AuditForm />
              </div>
            </ScrollReveal>

            {/* Trust sidebar */}
            <div className="space-y-6">
              <ScrollReveal delay={0.1}>
                {/* What you'll receive */}
                <div
                  className="rounded-3xl p-7"
                  style={{
                    background: "#E8F2EC",
                    border: "1px solid rgba(26,92,58,0.12)",
                  }}
                >
                  <h3
                    className="text-base font-bold mb-4"
                    style={{
                      fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                      color: "#0D0D0B",
                    }}
                  >
                    What&apos;s in your audit
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Your current Google Maps ranking for your core keywords",
                      "GBP optimisation score (out of 100) with key gaps identified",
                      "Review velocity benchmarked against your top 3 competitors",
                      "Citation consistency check across major AU directories",
                      "Top 3 actions to improve your ranking this month",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle
                          size={15}
                          weight="fill"
                          style={{
                            color: "#1A5C3A",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "#0D0D0B" }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Trust points */}
              {trustPoints.map((point, i) => (
                <ScrollReveal key={point.title} delay={0.12 + i * 0.06}>
                  <div
                    className="flex items-start gap-4 px-5 py-4 rounded-2xl"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(13,13,11,0.07)",
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                      style={{ background: "#F4F3EF" }}
                    >
                      <point.icon
                        size={17}
                        weight="bold"
                        style={{ color: "#1A5C3A" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: "#0D0D0B" }}
                      >
                        {point.title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "#6B6B68" }}>
                        {point.body}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              {/* Sydney callout */}
              <ScrollReveal delay={0.3}>
                <div
                  className="px-5 py-4 rounded-2xl"
                  style={{ background: "#0D0D0B" }}
                >
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                      Sydney-based team.
                    </strong>{" "}
                    We understand the Sydney market — suburbs, competition,
                    industry dynamics. We&apos;re not an offshore agency.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
