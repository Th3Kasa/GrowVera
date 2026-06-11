import type React from "react";
import {
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import HeroButtons from "@/components/HeroButtons";
import RotatingWord from "@/components/RotatingWord";
import ActiveEnginesMock from "@/components/ActiveEnginesMock";
import LeadFlowMock from "@/components/LeadFlowMock";
import QuotingMock from "@/components/QuotingMock";

const marqueeItems = [
  "Trade Businesses", "HVAC Companies", "Auto Repair Shops", "Solar Installers",
  "Roofing Contractors", "Plumbing Businesses", "Flooring Companies",
  "Commercial Cleaners", "Logistics Operators", "Property Managers",
];


export default function HomePage() {
  return (
    <div style={{ background: "#FAFAF8" }}>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 pt-40">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-center">
            <div>
              <ScrollReveal delay={0}>
                <p style={{ color: "#1A5C3A", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>
                  Sydney · AI Automation Agency
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(3.5rem, 7vw, 6.5rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: "2rem" }}>
                  <span style={{ display: "block", color: "#0D0D0B" }}>Stop losing</span>
                  <span style={{ display: "block", color: "#0D0D0B" }}>
                    <RotatingWord words={["deals", "leads", "revenue", "jobs", "margins"]} />{" "}to
                  </span>
                  <span style={{ display: "block", WebkitTextStroke: "2px #1A5C3A", color: "transparent" }}>slow responses.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.14}>
                <div style={{ height: "1px", background: "#E2E1DC", marginBottom: "1.5rem" }} />
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#0D0D0B", lineHeight: 1, marginBottom: "0.25rem" }}>20s</p>
                    <p style={{ fontSize: "0.75rem", color: "#9E9E9A", lineHeight: 1.4 }}>first call after a lead<br />submits — not 20 minutes</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#0D0D0B", lineHeight: 1, marginBottom: "0.25rem" }}>3+ hrs</p>
                    <p style={{ fontSize: "0.75rem", color: "#9E9E9A", lineHeight: 1.4 }}>daily management time<br />reclaimed from manual quoting</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <HeroButtons />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.12} className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[380px]">
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", inset: "-32px", backgroundImage: "radial-gradient(circle, rgba(26,92,58,0.15) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none", borderRadius: "2rem" }}
                />
                <ActiveEnginesMock />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="overflow-hidden" style={{ background: "#0D0D0B", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "3rem" }}>
            {[
              { number: "20s", line1: "outbound call triggered", line2: "the moment a lead hits your CRM" },
              { number: "80%", line1: "drop in close rate", line2: "if you wait more than 5 minutes" },
              { number: "3+ hrs", line1: "reclaimed per day", line2: "from manual quoting workflows" },
              { number: "$0", line1: "per automated call", line2: "vs. thousands in admin salary monthly" },
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
                <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.25rem, 6vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: "0.5rem" }}>{stat.number}</p>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.40)", marginBottom: "0.1rem" }}>{stat.line1}</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>{stat.line2}</p>
              </div>
            ))}
          </div>
        </div>
        <Marquee items={marqueeItems} className="text-white" />
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "#FAFAF8", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "0.75rem" }}>How the Engines Work</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "26rem", marginBottom: "1.25rem" }}>
              Two engines.<br />Real results.
            </h2>
            <p style={{ fontSize: "0.975rem", color: "#6B6B68", lineHeight: 1.7, maxWidth: "34rem", marginBottom: "4rem" }}>
              We install two AI engines into your existing systems: <strong style={{ color: "#0D0D0B", fontWeight: 600 }}>Vera Reach</strong> calls every new lead within 20 seconds, and <strong style={{ color: "#0D0D0B", fontWeight: 600 }}>Vera Quote</strong> gives your staff an exact price for any job in under 5 seconds. Here&apos;s what that looks like day to day.
            </p>
          </ScrollReveal>

          {[
            {
              step: "01",
              engine: "Vera Reach",
              title: "A lead arrives — Vera Reach calls them in 20 seconds",
              desc: "The moment a prospect fills out a form on your website or landing page, Vera Reach triggers an outbound call via your CRM. It qualifies them, handles FAQs using your script, and books them directly into your calendar — before your competitor even knows they exist.",
              visual: <LeadFlowMock compact />,
            },
            {
              step: "02",
              engine: "Vera Quote",
              title: "Staff input a job — Vera Quote returns a price in under 5 seconds",
              desc: "Your employee types the vehicle or project type and the problem. Vera Quote connects to your parts suppliers via API, pulls live pricing, overlays your labour rates and SOPs, applies your target margins, and returns an exact price guide before the customer finishes explaining the job.",
              visual: (
                <div style={{ maxWidth: "20rem" }}>
                  {[
                    "Live supplier API — current parts pricing, not last month's",
                    "Your SOPs and labour rates applied automatically",
                    "Travel distance factored in without manual input",
                    "Margin overlay built in — no underquoting possible",
                    "Error-free quote ready in under 5 seconds",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5" style={{ marginBottom: "0.75rem" }}>
                      <CheckCircle size={15} weight="fill" style={{ color: "#1A5C3A", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.875rem", color: "#6B6B68" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: "03",
              engine: "Both engines",
              title: "Management reclaims 3+ hours of high-leverage time every day",
              desc: "Two things that used to bleed your schedule — chasing leads and manually pricing jobs — are handled automatically. Your team focuses on closing and delivering. You focus on building the business, not running the admin.",
              visual: (
                <div style={{ maxWidth: "20rem", padding: "1.25rem", borderRadius: "1rem", background: "rgba(26,92,58,0.06)" }}>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: "#1A5C3A", marginBottom: "0.75rem" }}>Daily impact</p>
                  {[
                    { label: "Lead response time", value: "20 sec" },
                    { label: "Quote generation time", value: "< 5 sec" },
                    { label: "Management hours reclaimed", value: "3+ hrs" },
                    { label: "Pricing errors", value: "Zero" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center" style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(26,92,58,0.10)" }}>
                      <span style={{ fontSize: "0.75rem", color: "#6B6B68" }}>{stat.label}</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1A5C3A" }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              ),
            },
          ].map((row, idx) => (
            <ScrollReveal key={row.step} delay={idx * 0.08}>
              <div
                className="group grid grid-cols-[52px_1fr] md:grid-cols-[80px_1fr_auto] gap-5 md:gap-8"
                style={{ borderTop: "1px solid #E2E1DC", padding: "2.5rem 0", alignItems: "start", transition: "background 0.2s ease", borderRadius: "0.5rem", marginLeft: "-1rem", marginRight: "-1rem", paddingLeft: "1rem", paddingRight: "1rem" }}
              >
                <div
                  style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.75rem, 8vw, 5rem)", fontWeight: 900, color: "#EEECEA", lineHeight: 1, userSelect: "none" }}
                  className="group-hover:text-[rgba(26,92,58,0.15)]"
                >
                  {row.step}
                </div>
                <div style={{ maxWidth: "28rem" }}>
                  <p style={{ display: "inline-block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "#1A5C3A", background: "rgba(26,92,58,0.08)", borderRadius: "2rem", padding: "0.25rem 0.7rem", marginBottom: "0.75rem" }}>{row.engine}</p>
                  <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 700, color: "#0D0D0B", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{row.title}</h3>
                  <p style={{ fontSize: "0.95rem", color: "#6B6B68", lineHeight: 1.65 }}>{row.desc}</p>
                </div>
                <div className="hidden md:block" style={{ maxWidth: "22rem", width: "100%" }}>{row.visual}</div>
              </div>
            </ScrollReveal>
          ))}
          <div style={{ borderTop: "1px solid #E2E1DC" }} />
        </div>
      </section>

      {/* ENGINE 01: SPEED-TO-LEAD */}
      <section id="engine-1" style={{ background: "#0D0D0B", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.30)", marginBottom: "1.5rem" }}>Engine 01 · Speed to Lead</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal delay={0.05}>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "0.75rem" }}>
                Vera Reach
              </h2>
              <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                The outbound voice agent that calls every new lead in 20 seconds.
              </p>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                The moment a lead is captured on your website or landing page, Vera Reach triggers an automated outbound call via your CRM in 20 seconds. It qualifies the prospect, handles FAQs using your exact script, and books them directly into your calendar. It never takes a day off. It never misses a lead. It scales instantly to 100 simultaneous calls.
              </p>
              <div style={{ marginBottom: "2.5rem" }}>
                {[
                  "Responds in 20 seconds — before your competitor picks up the phone",
                  "Qualifies prospects and handles FAQs using your exact script",
                  "Books directly into your calendar with zero admin involvement",
                  "Scales instantly to 100 simultaneous calls at no extra cost",
                  "Replaces a full-time admin salary at a fraction of the overhead",
                ].map((point) => (
                  <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <CheckCircle size={16} weight="fill" style={{ color: "#1A5C3A", flexShrink: 0, marginTop: "0.2rem" }} />
                    <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
              </div>
              <a
                href="/audit"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#1A5C3A", color: "#fff", padding: "0.875rem 1.75rem", borderRadius: "2rem", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 20px rgba(26,92,58,0.40)" }}
              >
                Book a Pipeline Audit <ArrowRight size={15} weight="bold" />
              </a>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <LeadFlowMock />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ENGINE 02: QUOTING ENGINE */}
      <section id="engine-2" style={{ background: "#F4F3EF", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "1.5rem" }}>Engine 02 · Instant Quoting</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal delay={0.05}>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", fontWeight: 900, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "0.75rem" }}>
                Vera Quote
              </h2>
              <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#3D3D3A", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                The internal quoting engine that prices any job in under 5 seconds.
              </p>
              <p style={{ fontSize: "1rem", color: "#6B6B68", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                An internal, secure chat engine built exclusively for your staff. When a customer calls, your employee inputs the vehicle or project type and the problem. The engine hooks into your parts suppliers via API, pulls current pricing, overlays your exact SOPs, factors in labour rates and travel distance, and returns an error-free price guide in under 5 seconds.
              </p>
              <div style={{ marginBottom: "2.5rem" }}>
                {[
                  "Centralised internal dashboard — works on any device your staff already use",
                  "Live API synchronisation with your parts suppliers — no manual lookups",
                  "Your SOPs, margins, and labour rates built in from day one",
                  "Turns a 15-minute pricing exercise into a 5-second workflow",
                  "Eliminates underquoting and the jobs that cost you money",
                ].map((point) => (
                  <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <CheckCircle size={16} weight="fill" style={{ color: "#1A5C3A", flexShrink: 0, marginTop: "0.2rem" }} />
                    <span style={{ fontSize: "0.9rem", color: "#6B6B68", lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
              </div>
              <a
                href="/audit"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#1A5C3A", color: "#fff", padding: "0.875rem 1.75rem", borderRadius: "2rem", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 20px rgba(26,92,58,0.25)" }}
              >
                Book a Pipeline Audit <ArrowRight size={15} weight="bold" />
              </a>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <QuotingMock />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT MODEL */}
      <section id="how-we-engage" style={{ background: "#FAFAF8", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div
              style={{ border: "1.5px solid #1A5C3A", borderRadius: "1.5rem", padding: "clamp(2rem, 5vw, 4rem)" }}
            >
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "1rem" }}>How We Charge</p>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 900, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                Flat setup fee. Monthly retainer. Nothing else.
              </h2>
              <p style={{ fontSize: "0.975rem", color: "#6B6B68", lineHeight: 1.7, maxWidth: "36rem", marginBottom: "2rem" }}>
                We charge a flat technical setup fee to build and integrate the engine into your existing CRM and systems. Then a monthly maintenance retainer covers ongoing calibration, supplier API updates, and performance auditing — so the engine keeps improving, not drifting. Everything scoped and agreed before any work begins.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { label: "Setup Fee", detail: "flat rate — scoped upfront" },
                  { label: "Monthly Retainer", detail: "calibration + API updates" },
                  { label: "Notice Period", detail: "30 days — no lock-in" },
                ].map((item) => (
                  <div key={item.label} style={{ padding: "0.875rem 1.25rem", background: "rgba(26,92,58,0.06)", borderRadius: "0.75rem", minWidth: "10rem" }}>
                    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "#1A5C3A", marginBottom: "0.2rem" }}>{item.label}</p>
                    <p style={{ fontSize: "0.8rem", color: "#6B6B68" }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1A5C3A", paddingTop: "clamp(4rem, 9vw, 10rem)", paddingBottom: "clamp(4rem, 9vw, 10rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-start">
            <ScrollReveal delay={0}>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.50)", marginBottom: "1.25rem" }}>No Obligation</p>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: "1.5rem" }}>
                Book a 15-Minute<br />Pipeline Audit.
              </h2>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "28rem", marginBottom: "2.5rem" }}>
                We map exactly where your business is losing revenue — slow response times, manual quoting, or both. No sales pitch. Just a clear picture of what an automated engine would return to your bottom line.
              </p>
              <a
                href="/audit"
                className="inline-flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-xl"
                style={{ background: "#fff", color: "#1A5C3A", padding: "1rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.20)" }}
              >
                Book the Pipeline Audit &rarr;
              </a>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <div>
                {[
                  "15 minutes — no obligation, no sales script",
                  "We identify your exact revenue leakage points",
                  "Clear scope provided before any fee is discussed",
                  "Flat setup fee — no surprise hourly billing",
                  "Monthly retainer — cancel with 30 days notice",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                    <CheckCircle size={18} weight="light" style={{ color: "rgba(255,255,255,0.50)", flexShrink: 0 }} />
                    <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.80)", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </div>
  );
}

