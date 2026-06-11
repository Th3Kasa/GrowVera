import type { Metadata } from "next";
import { CheckCircle, Clock, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import AuditForm from "@/components/AuditForm";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "GrowVera — Book a Free Pipeline Audit",
  description: "Book a free 15-minute Pipeline Audit with GrowVera. We map exactly where your business is losing revenue to slow lead response times and manual quoting — and show you what an automated engine would return to your bottom line.",
};

const trustPoints = [
  { icon: Clock, title: "15 minutes. No sales pitch.", body: "We map your pipeline leaks and show you what an engine would fix. You decide whether to proceed." },
  { icon: CheckCircle, title: "No obligation", body: "The audit is yours to keep. There is no pressure to engage and no follow-up unless you ask for it." },
  { icon: ShieldCheck, title: "No spam, ever", body: "We comply with the Australian Spam Act 2003. One call to book your audit. That is it." },
];

export default function AuditPage() {
  return (
    <div style={{ background: "#FAFAF8" }}>
      <section className="pt-40 pb-16" style={{ background: "#F4F3EF" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#1A5C3A" }}>
                Zero cost · Zero commitment
              </span>
            </div>
            <h1 className="font-bold tracking-tight leading-[1.0] mb-4" style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", color: "#0D0D0B", fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              Book your Pipeline Audit.<br />
              <span style={{ color: "#1A5C3A" }}>Free. 15 minutes.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#6B6B68" }}>
              Tell us about your business and we will map exactly where you are losing revenue — to slow lead response times, manual quoting, or both — and show you what an automated engine would return to your bottom line.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-start">
            <ScrollReveal>
              <div className="rounded-3xl p-8 md:p-10" style={{ background: "#fff", border: "1px solid rgba(13,13,11,0.07)", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>
                <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", color: "#0D0D0B" }}>Request your audit</h2>
                <p className="text-sm mb-7" style={{ color: "#6B6B68" }}>Fill in the details below — we will reach out within 24 hours to lock in a time.</p>
                <AuditForm />
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal delay={0.1}>
                <div className="rounded-3xl p-7" style={{ background: "#E8F2EC", border: "1px solid rgba(26,92,58,0.12)" }}>
                  <h3 className="text-base font-bold mb-4" style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", color: "#0D0D0B" }}>What happens in 15 minutes</h3>
                  <ul className="space-y-3">
                    {[
                      "We identify your current lead response time and what it is costing you in lost deals",
                      "We map your quoting process and calculate the daily time cost to your management",
                      "We show you the exact revenue impact of both leaks combined",
                      "We walk you through what an AI engine would change — concretely, not theoretically",
                      "You receive a clear scope and a flat fee before committing to anything",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle size={15} weight="fill" style={{ color: "#1A5C3A", flexShrink: 0, marginTop: "2px" }} />
                        <span className="text-sm leading-relaxed" style={{ color: "#0D0D0B" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {trustPoints.map((point, i) => (
                <ScrollReveal key={point.title} delay={0.12 + i * 0.06}>
                  <div className="flex items-start gap-4 px-5 py-4 rounded-2xl" style={{ background: "#fff", border: "1px solid rgba(13,13,11,0.07)" }}>
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: "#F4F3EF" }}>
                      <point.icon size={17} weight="bold" style={{ color: "#1A5C3A" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "#0D0D0B" }}>{point.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#6B6B68" }}>{point.body}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              <ScrollReveal delay={0.3}>
                <div className="px-5 py-4 rounded-2xl" style={{ background: "#0D0D0B" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <strong style={{ color: "rgba(255,255,255,0.85)" }}>Sydney-based team.</strong>{" "}
                    We work with Australian mid-market businesses. We understand your suppliers, your CRM, and your market — we are not an offshore build shop.
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
