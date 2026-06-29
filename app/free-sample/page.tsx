import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import LeadForm from "@/components/LeadForm";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Get a free sample site for your business — GrowVera",
  description:
    "Tell us about your business and we'll build a real sample website for it — free, no obligation. See the quality before you decide anything.",
};

export default function FreeSamplePage() {
  return (
    <main style={{ background: "#08080A" }}>
      <section style={{ background: "#0E0E11" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>
              Free · No obligation
            </p>
            <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(2.1rem, 5.5vw, 3.75rem)", letterSpacing: "-0.035em", color: "#F4F4F1", lineHeight: 1.05, marginBottom: "1.1rem" }}>
              See your new website<br /><span style={{ color: "#34D399" }}>before you pay a cent.</span>
            </h1>
            <p style={{ color: "#A2A2A0", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
              Tell us about your business and we&apos;ll build a real sample site for it. If you love it, we&apos;ll talk. If not, it&apos;s yours to keep — no strings.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
          <ScrollReveal>
            <LeadForm />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem", marginTop: "2.5rem" }}>
              {["A real site, not a mockup", "No obligation to buy", "Built for your actual business"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle size={14} weight="fill" style={{ color: "#34D399", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", color: "#A2A2A0" }}>{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
