import type { Metadata } from "next";
import { CheckCircle, Clock, Phone, Star } from "@phosphor-icons/react/dist/ssr";
import CalEmbed from "@/components/CalEmbed";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Book a Free Strategy Call — GrowVera",
  description:
    "Book a free 15-minute strategy call with GrowVera. We'll audit your online presence, show you a free sample site built for your business, and map a clear growth plan — no obligation.",
};

export default function AuditPage() {
  return (
    <div style={{ background: "#08080A" }}>

      {/* HEADER */}
      <section style={{ background: "#0E0E11" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>
              Free · No obligation · 15 minutes
            </p>
            <h1
              style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.035em", color: "#F4F4F1", lineHeight: 1.05, marginBottom: "1rem" }}
            >
              Book your free<br />
              <span style={{ color: "#34D399" }}>strategy call.</span>
            </h1>
            <p style={{ color: "#A2A2A0", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
              We&apos;ll audit your current online presence, walk you through a free sample site built for your real business, and map a clear plan — no agency waffle, no obligation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "0" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Star,
                  title: "Free sample site",
                  body: "We build a real bespoke website for your business before the call. You see the quality before you commit to anything.",
                },
                {
                  icon: Clock,
                  title: "15 minutes, plain English",
                  body: "We audit your online presence, show you what’s missing, and walk through a clear plan. No jargon, no pressure.",
                },
                {
                  icon: Phone,
                  title: "No obligation — ever",
                  body: "The audit and sample site are yours to keep. No follow-up unless you ask for it. We comply with the Australian Spam Act 2003.",
                },
              ].map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="flex items-start gap-3 px-5 py-4 rounded-2xl"
                    style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div style={{ width: 32, height: 32, background: "rgba(52,211,153,0.10)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={15} weight="bold" style={{ color: "#34D399" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "#F4F4F1" }}>{point.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#A2A2A0" }}>{point.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CAL EMBED */}
      <section style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <CalEmbed />
          </ScrollReveal>

          {/* TRUST LINE */}
          <ScrollReveal delay={0.1}>
            <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                {[
                  "Free sample site built for your business",
                  "No commitment required",
                  "Retainers from $390/mo AUD",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CheckCircle size={14} weight="fill" style={{ color: "#34D399", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.82rem", color: "#A2A2A0" }}>{item}</span>
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
