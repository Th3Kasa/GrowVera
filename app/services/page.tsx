import Link from "next/link";
import type { Metadata } from "next";
import { Globe, Megaphone, ChartLineUp, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Marketing add-ons — websites, social & ads | GrowVera",
  description:
    "GrowVera builds AI receptionists and quoting tools for trades — but we're a marketing agency too. Websites, social content and paid ads as add-ons for our clients. Ask us on your audit call.",
};

const addOns = [
  {
    icon: Globe,
    name: "Websites",
    desc: "A clean, modern website built and hosted for you — the sort that makes a customer trust you before they even call. Need a change? Message us and it's done.",
  },
  {
    icon: Megaphone,
    name: "Social content",
    desc: "Regular posts and short videos so your business looks active and stays in front of local customers between jobs. Produced for you — you just approve.",
  },
  {
    icon: ChartLineUp,
    name: "Paid ads",
    desc: "Facebook and Instagram ads that bring you enquiries — which your Speed-to-Lead Agent then rings back in seconds. We run them, you control the budget.",
  },
];

export default function ServicesPage() {
  return (
    <main style={{ background: "var(--color-bg)" }}>
      {/* HEADER */}
      <section style={{ background: "var(--color-bg-section)" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>
              Marketing add-ons
            </p>
            <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.035em", color: "var(--color-text)", lineHeight: 1.05, marginBottom: "16px" }}>
              We&apos;re a marketing<br />agency too — just ask.
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
              Our main job is making sure you never miss a call or lose a job to a slow quote. But if you also need a website, social content or ads, we do those too — as add-ons for our clients. One team, one invoice.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ADD-ONS */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))" }}>
            {addOns.map((a, i) => {
              const Icon = a.icon;
              return (
                <ScrollReveal key={a.name} delay={i * 0.07}>
                  <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1.25rem", padding: "2rem", height: "100%" }}>
                    <div style={{ width: 44, height: 44, background: "var(--color-accent-soft)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                      <Icon size={22} weight="bold" style={{ color: "var(--color-accent)" }} />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>{a.name}</h2>
                    <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.65 }}>{a.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal delay={0.2}>
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--color-text-faint)", marginTop: "2rem", maxWidth: "40rem", marginInline: "auto", lineHeight: 1.6 }}>
              Add-ons are priced per job and are for businesses already working with us. The best way to scope one is to mention it on your free audit call.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
          <div style={{ background: "var(--gradient-cta)", borderRadius: "20px", padding: "clamp(32px, 5vw, 52px)", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", color: "#fff", marginBottom: "14px" }}>
              Start with the audit.
            </h2>
            <p style={{ color: "var(--color-on-dark-80)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "420px", margin: "0 auto 28px" }}>
              First we make sure you&apos;re not losing jobs. Then, if you want the marketing side handled too, we sort it. Book your free AI audit and tell us what you need.
            </p>
            <Link
              href="/audit"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "var(--color-accent-deepest)", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "100px", textDecoration: "none" }}
            >
              Get my free AI audit <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
