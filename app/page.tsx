import type React from "react";
import {
  CheckCircle,
  ArrowRight,
  Globe,
  Megaphone,
  ChartLineUp,
  Phone,
  Star,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import HeroButtons from "@/components/HeroButtons";
import Pricing from "@/components/Pricing";

const marqueeItems = [
  "Plumbers", "Electricians", "Solar Installers", "Landscapers", "Builders",
  "Real Estate Agents", "Roofers", "Mechanics", "Coaches", "Cleaners", "Cafés", "Painters",
];

const steps = [
  {
    step: "01",
    name: "Free sample",
    icon: Globe,
    title: "We build your site before you pay a cent",
    desc: "We find your business online, pull your real photos and details, and build a bespoke AI website for you — live at a real URL. You see exactly what you're getting before you commit to anything.",
  },
  {
    step: "02",
    name: "15-min call",
    icon: Phone,
    title: "One short call to align on goals",
    desc: "We walk through the sample site together, understand your business, and map a plan. No jargon, no sales pressure. If it's a fit, we scope the retainer and you're onboarded the same week.",
  },
  {
    step: "03",
    name: "We run it",
    icon: Star,
    title: "We build and run everything — you just approve",
    desc: "Your website goes live. Content drops weekly. If you need an edit, send us a message and it's done the same day. Monthly report lands in your inbox. You focus on the work — we handle the growth.",
  },
];

const pillars = [
  {
    icon: Globe,
    title: "Websites",
    desc: "A bespoke, cinematic AI website — built around your real photos and brand, hosted, and kept current. Unlimited edits via your client portal.",
    items: ["Bespoke design, not a template", "Hosted + maintained for you", "Unlimited edits, same-day turnaround", "Mobile-first, fast-loading"],
  },
  {
    icon: Megaphone,
    title: "Content",
    desc: "We write, design, and post your social content every week across every platform. Carousels, short-form video, and long-form — all done for you.",
    items: ["8–20 assets per month", "Carousels, clips, motion graphics", "Cross-posted to 9 platforms", "Competitor-tracked and data-driven"],
  },
  {
    icon: ChartLineUp,
    title: "Ads",
    desc: "We run your Meta and Instagram paid ads end to end — creative, targeting, validation, and optimisation. We only spend on creative that's already proven to work.",
    items: ["Managed Meta / Instagram campaigns", "UGC ad creative produced for you", "Trial Reel validation before spend", "Weekly ROAS reporting"],
  },
];

export default function HomePage() {
  return (
    <div style={{ background: "#08080A" }}>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div
          aria-hidden="true"
          style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vw", height: "60vw", maxWidth: 760, maxHeight: 760, background: "radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 60%)", pointerEvents: "none" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 pt-40">
          <div className="max-w-4xl">
            <ScrollReveal delay={0}>
              <p style={{ color: "#34D399", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>
                Sydney · Done-for-you AI agency
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(3rem, 7vw, 6.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", marginBottom: "2rem", color: "#F4F4F1" }}>
                <span style={{ display: "block" }}>Your AI</span>
                <span style={{ display: "block", WebkitTextStroke: "2px #34D399", color: "transparent" }}>growth team.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.14}>
              <p style={{ fontSize: "1.15rem", color: "#A2A2A0", lineHeight: 1.7, maxWidth: "38rem", marginBottom: "2rem" }}>
                Websites, content and ads — done for you, for a fraction of what an agency charges. Built and run by AI, overseen by humans. We handle everything so you can focus on your work.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.18}>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "1.5rem" }} />
              <div className="grid grid-cols-3 gap-8 mb-8" style={{ maxWidth: "36rem" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, marginBottom: "0.25rem" }}>3-in-1</p>
                  <p style={{ fontSize: "0.75rem", color: "#6E6E72", lineHeight: 1.4 }}>website, content<br />and ads, one team</p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, marginBottom: "0.25rem" }}>59%</p>
                  <p style={{ fontSize: "0.75rem", color: "#6E6E72", lineHeight: 1.4 }}>of AU small businesses<br />have no website at all</p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, marginBottom: "0.25rem" }}>$890</p>
                  <p style={{ fontSize: "0.75rem", color: "#6E6E72", lineHeight: 1.4 }}>starting retainer —<br />fraction of agency rates</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.24}>
              <HeroButtons />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden" style={{ background: "#0E0E11", paddingTop: "3rem", paddingBottom: "3rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6E6E72", marginBottom: "1.25rem", fontWeight: 600 }}>
          Built for the local businesses that need it most
        </p>
        <Marquee items={marqueeItems} className="text-white/70" />
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "#08080A", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "0.75rem" }}>How it works</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#F4F4F1", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "30rem", marginBottom: "1.25rem" }}>
              Three steps.<br />Almost none of them yours.
            </h2>
            <p style={{ fontSize: "0.975rem", color: "#A2A2A0", lineHeight: 1.7, maxWidth: "34rem", marginBottom: "4rem" }}>
              We build a real sample site for your business before you commit. Then we run the whole thing for you every month.
            </p>
          </ScrollReveal>

          {steps.map((row, idx) => {
            const Icon = row.icon;
            return (
              <ScrollReveal key={row.step} delay={idx * 0.06}>
                <div
                  className="group grid grid-cols-[52px_1fr] md:grid-cols-[80px_1fr] gap-5 md:gap-8"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "2.25rem 0", alignItems: "start" }}
                >
                  <div style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 900, color: "rgba(255,255,255,0.10)", lineHeight: 1, userSelect: "none" }}>
                    {row.step}
                  </div>
                  <div style={{ maxWidth: "44rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <Icon size={16} weight="bold" style={{ color: "#34D399" }} />
                      <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "#34D399", background: "rgba(52,211,153,0.10)", borderRadius: "2rem", padding: "0.25rem 0.7rem" }}>{row.name}</p>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.25rem, 3vw, 1.6rem)", fontWeight: 700, color: "#F4F4F1", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>{row.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#A2A2A0", lineHeight: 1.7 }}>{row.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
        </div>
      </section>

      {/* SERVICE PILLARS */}
      <section id="services" style={{ background: "#0E0E11", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>What we do</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "#F4F4F1", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              The whole growth stack,<br />done for you.
            </h2>
            <p style={{ fontSize: "1rem", color: "#A2A2A0", lineHeight: 1.7, marginBottom: "3.5rem", maxWidth: "36rem" }}>
              Most agencies do one thing — websites, or content, or ads. We do all three, coordinated, for one monthly retainer.
            </p>
          </ScrollReveal>

          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))" }}>
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <ScrollReveal key={p.title} delay={i * 0.07}>
                  <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.25rem", padding: "2rem", height: "100%" }}>
                    <div style={{ width: 44, height: 44, background: "rgba(52,211,153,0.10)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                      <Icon size={22} weight="bold" style={{ color: "#34D399" }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#F4F4F1", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>{p.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "#A2A2A0", lineHeight: 1.7, marginBottom: "1.4rem" }}>{p.desc}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                      {p.items.map((item) => (
                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <CheckCircle size={14} weight="fill" style={{ color: "#34D399", flexShrink: 0, marginTop: "0.2rem" }} />
                          <span style={{ fontSize: "0.82rem", color: "#C9C9C6", lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.2}>
            <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
              <a
                href="/services"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#34D399", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}
              >
                See everything we do <ArrowRight size={14} weight="bold" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHY GROWVERA */}
      <section style={{ background: "#08080A", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-16 items-center">
            <ScrollReveal>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>Why GrowVera</p>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#F4F4F1", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
                Agency quality.<br />AI economics.
              </h2>
              <p style={{ fontSize: "1rem", color: "#A2A2A0", lineHeight: 1.7, marginBottom: "2rem" }}>
                A traditional Sydney agency charges $3,400–$4,800 a month for one slice of this. We deliver the whole stack for a fraction of that — because AI does the labour.
              </p>
              <a
                href="/audit"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#34D399", color: "#06180F", padding: "0.875rem 1.75rem", borderRadius: "2rem", fontSize: "0.875rem", fontWeight: 700, textDecoration: "none" }}
              >
                Book your free strategy call <ArrowRight size={15} weight="bold" />
              </a>
            </ScrollReveal>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { icon: Buildings, title: "Proof before you pay", desc: "We build a sample site for your real business before you commit. You see the quality firsthand — no leap of faith." },
                { icon: Globe, title: "Everything under one roof", desc: "Website, content, and ads — coordinated and consistent. No more briefing three different agencies and hoping they align." },
                { icon: Star, title: "You approve from your phone", desc: "One message to approve an edit or a content piece. We handle the rest. No back-and-forth, no project management overhead." },
                { icon: ChartLineUp, title: "Cancel anytime", desc: "Month-to-month by default. No lock-in contracts, no six-month minimums. We earn your retainer every month." },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <ScrollReveal key={f.title} delay={i * 0.05}>
                    <div style={{ display: "flex", gap: "1.25rem", padding: "1.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "flex-start" }}>
                      <div style={{ width: 38, height: 38, background: "rgba(52,211,153,0.10)", borderRadius: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={18} weight="bold" style={{ color: "#34D399" }} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#F4F4F1", marginBottom: "0.3rem" }}>{f.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: "#A2A2A0", lineHeight: 1.6 }}>{f.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* CTA */}
      <section style={{ background: "#08080A", paddingTop: "clamp(4rem, 9vw, 9rem)", paddingBottom: "clamp(4rem, 9vw, 9rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              background: "linear-gradient(135deg, #16A34A 0%, #1A5C3A 100%)",
              borderRadius: "1.75rem",
              padding: "clamp(2.5rem, 6vw, 5rem)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
              <ScrollReveal delay={0}>
                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.60)", marginBottom: "1.25rem" }}>Start today</p>
                <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.98, marginBottom: "1.5rem" }}>
                  Book your free<br />strategy call.
                </h2>
                <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.80)", lineHeight: 1.7, maxWidth: "30rem", marginBottom: "2.25rem" }}>
                  We&apos;ll audit your current online presence, show you a free sample site, and map a clear plan. No obligation — and no agency waffle.
                </p>
                <a
                  href="/audit"
                  className="inline-flex items-center gap-2 rounded-full text-sm font-bold transition-all duration-200 hover:shadow-xl"
                  style={{ background: "#fff", color: "#0D2A1B", padding: "1rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                >
                  Book your free strategy call &rarr;
                </a>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <div>
                  {[
                    "Free sample site built for your real business",
                    "No obligation — see the quality before you commit",
                    "Websites, content and ads under one retainer",
                    "From $890/mo — fraction of traditional agency rates",
                    "Cancel anytime, month to month",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 0", borderTop: "1px solid rgba(255,255,255,0.20)" }}>
                      <CheckCircle size={18} weight="fill" style={{ color: "#fff", flexShrink: 0 }} />
                      <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.92)", fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.20)" }} />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
