import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import CalEmbed from "@/components/CalEmbed";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "GrowVera — Book a Free Pipeline Audit",
  description: "Book a free 15-minute Pipeline Audit with GrowVera. We map exactly where your business is losing revenue to slow lead response times and manual quoting — and show you what an automated engine would return to your bottom line.",
};

export default function AuditPage() {
  return (
    <div style={{ background: "#FAFAF8" }}>
      <section style={{ background: "#F4F3EF" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "1rem" }}>
              Zero cost · Zero commitment
            </p>
            <h1
              style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.035em", color: "#0D0D0B", lineHeight: 1, marginBottom: "1rem" }}
            >
              Book your Pipeline Audit.<br />
              <span style={{ color: "#1A5C3A" }}>Free. 15 minutes.</span>
            </h1>
            <p style={{ color: "#6B6B68", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
              Pick a time that works — we&apos;ll map exactly where your business is losing revenue and show you what an automated engine would fix.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <CalEmbed />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              style={{ marginTop: "2.5rem" }}
            >
              {[
                { title: "15 minutes. No sales pitch.", body: "We map your pipeline leaks and show you what an engine would fix. You decide whether to proceed." },
                { title: "No obligation", body: "The audit is yours to keep. There is no pressure to engage and no follow-up unless you ask for it." },
                { title: "No spam, ever", body: "We comply with the Australian Spam Act 2003. One call to book your audit. That is it." },
              ].map((point) => (
                <div
                  key={point.title}
                  className="flex items-start gap-3 px-5 py-4 rounded-2xl"
                  style={{ background: "#fff", border: "1px solid rgba(13,13,11,0.07)" }}
                >
                  <CheckCircle size={16} weight="fill" style={{ color: "#1A5C3A", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#0D0D0B" }}>{point.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B6B68" }}>{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
