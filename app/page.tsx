import type React from "react";
import {
  CheckCircle,
  ArrowRight,
  MagnifyingGlass,
  Images,
  PaintBrushBroad,
  DeviceMobile,
  PaperPlaneTilt,
  Brain,
  Kanban,
  RocketLaunch,
} from "@phosphor-icons/react/dist/ssr";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import HeroButtons from "@/components/HeroButtons";
import RotatingWord from "@/components/RotatingWord";
import AgencyConsole from "@/components/AgencyConsole";
import Pricing from "@/components/Pricing";

const marqueeItems = [
  "Plumbers", "Electricians", "HVAC Companies", "Auto Repair Shops", "Solar Installers",
  "Roofers", "Landscapers", "Builders", "Cleaners", "Cafés", "Mechanics", "Painters",
];

const steps = [
  {
    step: "01",
    name: "Find",
    icon: MagnifyingGlass,
    title: "Finds local businesses with no website",
    desc: "Point it at a region. It scans public listings and maps for businesses that have no website at all, scores them with a proprietary ranking so the strongest opportunities surface first, and files every one into the CRM — so it never picks the same business twice.",
  },
  {
    step: "02",
    name: "Gather",
    icon: Images,
    title: "Pulls their real photos and details",
    desc: "For each business it collects everything publicly available — real photos, services, hours, reviews, location — from a range of public sources. No stock imagery, no placeholders. The site is built around who they actually are.",
  },
  {
    step: "03",
    name: "Build",
    icon: PaintBrushBroad,
    title: "Builds a bespoke, designer-quality site",
    desc: "It designs a unique site for each business and builds it around the photos and details it gathered, then deploys it live to a real URL. Every site is different — no cookie-cutter templates.",
  },
  {
    step: "04",
    name: "Self-review",
    icon: DeviceMobile,
    title: "A second AI reviews it on desktop and mobile",
    desc: "Before anything goes out, a separate review agent looks at the finished site with fresh eyes — desktop and mobile — and fixes what's off. Quality control is built into the loop, not left to chance.",
  },
  {
    step: "05",
    name: "Pitch & follow up",
    icon: PaperPlaneTilt,
    title: "Drafts the pitch and runs the follow-ups",
    desc: "It emails you the live site plus a personalised pitch ready to send. A built-in CRM runs a five-touch sequence, sorts replies, and flags lapsed leads — so the only thing left for you is to close.",
  },
];

const systemFeatures = [
  { icon: RocketLaunch, title: "Whole agency, not a builder", desc: "Finds the businesses, builds the sites, deploys them, pitches them, and runs the follow-ups. Nothing else does all of it." },
  { icon: PaintBrushBroad, title: "Bespoke every time", desc: "A unique design per project, built around real photos and data. No two sites look the same." },
  { icon: DeviceMobile, title: "Reviewed before it ships", desc: "A second AI checks every site on desktop and mobile with fresh eyes and fixes issues before it goes live." },
  { icon: Kanban, title: "Real CRM included", desc: "Every prospect, status, and reply in one board — five-touch sequence, reply sorting, lapsed-lead detection." },
  { icon: Brain, title: "Learns your preferences", desc: "Remembers the design tweaks, outreach tone, and regional patterns you teach it — across every run." },
  { icon: RocketLaunch, title: "Runs around the clock", desc: "Set the region and let it work. It finds, builds, and pitches 24/7 while you sleep." },
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
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-center">
            <div>
              <ScrollReveal delay={0}>
                <p style={{ color: "#34D399", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>
                  Sydney · Autonomous Web Agency
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(3rem, 6.5vw, 6rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", marginBottom: "2rem", color: "#F4F4F1" }}>
                  <span style={{ display: "block" }}>An entire web</span>
                  <span style={{ display: "block" }}>agency. Fully</span>
                  <span style={{ display: "block", WebkitTextStroke: "2px #34D399", color: "transparent" }}>autonomous.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.14}>
                <p style={{ fontSize: "1.05rem", color: "#A2A2A0", lineHeight: 1.7, maxWidth: "34rem", marginBottom: "2rem" }}>
                  GrowVera finds local businesses with no website, builds each one a bespoke site, deploys it live, and sends you a ready-to-send pitch — on its own, while you{" "}
                  <RotatingWord words={["sleep", "scale", "close deals", "rest"]} />.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.18}>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "1.5rem" }} />
                <div className="grid grid-cols-2 gap-8 mb-8" style={{ maxWidth: "28rem" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, marginBottom: "0.25rem" }}>24/7</p>
                    <p style={{ fontSize: "0.75rem", color: "#6E6E72", lineHeight: 1.4 }}>finding, building and<br />pitching — never stops</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, marginBottom: "0.25rem" }}>$0</p>
                    <p style={{ fontSize: "0.75rem", color: "#6E6E72", lineHeight: 1.4 }}>hosting per pitch site —<br />pay for a domain only when sold</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.24}>
                <HeroButtons />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.12} className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px]">
                <AgencyConsole />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* STATS + MARQUEE */}
      <section className="overflow-hidden" style={{ background: "#0E0E11", paddingTop: "4rem", paddingBottom: "4rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "3rem" }}>
            {[
              { number: "5B+", line1: "businesses worldwide", line2: "still have no website at all" },
              { number: "60s", line1: "to a finished site", line2: "found, built and deployed live" },
              { number: "5-touch", line1: "follow-up built in", line2: "with reply sorting + lapsed-lead detection" },
              { number: "0", line1: "duplicate outreach", line2: "the CRM never picks a business twice" },
            ].map((stat, i) => (
              <div
                key={stat.number}
                className={[
                  "pb-8 md:pb-10",
                  i === 0 ? "pl-0 pr-4 md:pr-8" : "",
                  i === 1 ? "border-l border-white/10 px-4 md:px-8" : "",
                  i === 2 ? "md:border-l border-white/10 pl-0 md:pl-8 pr-4 md:pr-8 pt-8 md:pt-0" : "",
                  i === 3 ? "border-l border-white/10 px-4 md:px-8 pt-8 md:pt-0" : "",
                ].join(" ")}
              >
                <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.25rem, 6vw, 3rem)", fontWeight: 900, color: "#F4F4F1", lineHeight: 1, marginBottom: "0.5rem" }}>{stat.number}</p>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.1rem" }}>{stat.line1}</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.28)" }}>{stat.line2}</p>
              </div>
            ))}
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6E6E72", marginBottom: "1.25rem", fontWeight: 600 }}>Built for the businesses that need it most</p>
        <Marquee items={marqueeItems} className="text-white/70" />
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "#08080A", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "0.75rem" }}>How it works</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#F4F4F1", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "30rem", marginBottom: "1.25rem" }}>
              Five steps.<br />Zero of them yours.
            </h2>
            <p style={{ fontSize: "0.975rem", color: "#A2A2A0", lineHeight: 1.7, maxWidth: "34rem", marginBottom: "4rem" }}>
              Each agent finds a business, builds it a bespoke website, and sends a personalised pitch — end to end. Here is the loop it runs on repeat.
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
                  <div
                    style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 900, color: "rgba(255,255,255,0.10)", lineHeight: 1, userSelect: "none" }}
                  >
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

      {/* THE SYSTEM */}
      <section id="system" style={{ background: "#0E0E11", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-start">
            <ScrollReveal>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>The system</p>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "#F4F4F1", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
                A whole agency in one pipeline.
              </h2>
              <p style={{ fontSize: "1rem", color: "#A2A2A0", lineHeight: 1.7, marginBottom: "2rem" }}>
                Not just a site builder — the entire workflow an agency runs, automated end to end and improving with every run.
              </p>
              <a
                href="#pricing"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#34D399", color: "#06180F", padding: "0.875rem 1.75rem", borderRadius: "2rem", fontSize: "0.875rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 24px rgba(52,211,153,0.25)" }}
              >
                See plans <ArrowRight size={15} weight="bold" />
              </a>
            </ScrollReveal>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 15rem), 1fr))" }}>
              {systemFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <ScrollReveal key={f.title} delay={i * 0.05}>
                    <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.4rem", height: "100%" }}>
                      <Icon size={22} weight="duotone" style={{ color: "#34D399", marginBottom: "0.85rem" }} />
                      <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#F4F4F1", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>{f.title}</h3>
                      <p style={{ fontSize: "0.85rem", color: "#A2A2A0", lineHeight: 1.6 }}>{f.desc}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING (MRR) */}
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
                  Let it build your<br />first sites tonight.
                </h2>
                <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.80)", lineHeight: 1.7, maxWidth: "30rem", marginBottom: "2.25rem" }}>
                  Pick a region, start your free trial, and wake up to live websites and ready-to-send pitches in your inbox. Cancel anytime.
                </p>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-full text-sm font-bold transition-all duration-200 hover:shadow-xl"
                  style={{ background: "#fff", color: "#0D2A1B", padding: "1rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                >
                  Start your free trial &rarr;
                </a>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <div>
                  {[
                    "7-day free trial — no charge until it ends",
                    "Bespoke, deployed-live sites from day one",
                    "Built-in CRM and five-touch follow-up",
                    "Reviewed on desktop and mobile before send",
                    "Cancel anytime, self-serve",
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
