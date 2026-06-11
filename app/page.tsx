import type React from "react";
import {
  CheckCircle,
  Lightning,
  Phone,
  CalendarBlank,
  Database,
  Sliders,
  CurrencyDollar,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import HeroButtons from "@/components/HeroButtons";
import RotatingWord from "@/components/RotatingWord";

const marqueeItems = [
  "Trade Businesses", "HVAC Companies", "Auto Repair Shops", "Solar Installers",
  "Roofing Contractors", "Plumbing Businesses", "Flooring Companies",
  "Commercial Cleaners", "Logistics Operators", "Property Managers",
];

const engineFeatures = [
  {
    number: "01",
    icon: Lightning,
    title: "20-Second Outbound Trigger",
    descriptor: "Calls your lead before they click your competitor",
    description: "The moment a lead submits a form, the engine triggers an outbound call in 20 seconds via your existing CRM. No staff intervention. No delay. No lost deal.",
  },
  {
    number: "02",
    icon: Phone,
    title: "Prospect Qualification & Script Handling",
    descriptor: "Qualifies leads using your exact constraints",
    description: "The engine handles common FAQs using your business's exact script, filters unqualified enquiries, and only passes real opportunities through to your team.",
  },
  {
    number: "03",
    icon: CalendarBlank,
    title: "Automated Calendar Booking",
    descriptor: "Appointments confirmed without a single staff member",
    description: "Qualified prospects are booked directly into your team's calendar. Zero admin. Zero back-and-forth. Just a confirmed appointment, ready to close.",
  },
  {
    number: "04",
    icon: Database,
    title: "Live Supplier API Synchronisation",
    descriptor: "Pulls current parts pricing the moment a job comes in",
    description: "The quoting engine connects directly to your parts suppliers via API and extracts live pricing — so every quote reflects what you actually pay today, not last month.",
  },
  {
    number: "05",
    icon: Sliders,
    title: "SOP & Labour Rate Overlay",
    descriptor: "Your margins and procedures built in from day one",
    description: "Your standard operating procedures, labour rates, and target margins are embedded into every calculation. The engine applies them automatically — no manual adjustment required.",
  },
  {
    number: "06",
    icon: CurrencyDollar,
    title: "Error-Free Quote Generation",
    descriptor: "An exact price guide in under 5 seconds, every time",
    description: "Inputs go in. A precise, margin-protected quote comes out in under 5 seconds. No underquoting. No overquoting. No jobs that quietly cost you money.",
  },
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
                  <span style={{ display: "block", WebkitTextStroke: "2px #1A5C3A", color: "transparent" }}>slow responses</span>
                  <span style={{ display: "block", color: "#0D0D0B" }}>and manual admin.</span>
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
                <div style={{ background: "#0D0D0B", borderRadius: "2rem", padding: "12px", boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 32px 80px rgba(0,0,0,0.25)", position: "relative", zIndex: 1 }}>
                  <div style={{ padding: "1rem" }}>
                    <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.30)", marginBottom: "1rem" }}>
                      Active Engines
                    </p>
                    {[
                      { label: "Speed-to-Lead Voice Agent", time: "20 sec to first call" },
                      { label: "Internal Quoting Engine", time: "< 5 sec to quote" },
                    ].map((engine) => (
                      <div key={engine.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "0.875rem 1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                        <div>
                          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff", marginBottom: "0.15rem" }}>{engine.label}</p>
                          <p style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.40)" }}>{engine.time}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(26,92,58,0.30)", borderRadius: "2rem", padding: "0.2rem 0.55rem", flexShrink: 0 }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ADE80", display: "block" }} />
                          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4ADE80" }}>Live</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { number: "20s", label: "First call" },
                          { number: "100×", label: "Scalable" },
                          { number: "< 5s", label: "Quote time" },
                          { number: "0", label: "Errors" },
                        ].map((stat) => (
                          <div key={stat.label} style={{ textAlign: "center", padding: "0.5rem 0" }}>
                            <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{stat.number}</p>
                            <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.30)", marginTop: "0.1rem" }}>{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
                style={{ padding: "0 2rem 2.5rem", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
                className={i === 0 ? "pl-0" : ""}
              >
                <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "3rem", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: "0.5rem" }}>{stat.number}</p>
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
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "24rem", marginBottom: "4rem" }}>
              Two engines.<br />Real results.
            </h2>
          </ScrollReveal>

          {[
            {
              step: "01",
              title: "A lead arrives — the engine calls them in 20 seconds",
              desc: "The moment a prospect fills out a form on your website or landing page, the voice engine triggers an outbound call via your CRM. It qualifies them, handles FAQs using your script, and books them directly into your calendar — before your competitor even knows they exist.",
              visual: (
                <div style={{ background: "#0D0D0B", borderRadius: "1rem", padding: "1.25rem" }}>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>Lead flow — live</p>
                  {[
                    { t: "0:00", label: "Form submitted on your website", color: "rgba(255,255,255,0.50)" },
                    { t: "0:08", label: "CRM receives lead data", color: "#FBBF24" },
                    { t: "0:20", label: "Outbound call placed", color: "#4ADE80" },
                    { t: "1:45", label: "Appointment confirmed", color: "#60A5FA" },
                  ].map((row) => (
                    <div key={row.t} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "rgba(255,255,255,0.25)", minWidth: "2rem" }}>{row.t}</span>
                      <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "0.4rem", padding: "0.4rem 0.7rem" }}>
                        <span style={{ fontSize: "0.75rem", color: row.color }}>{row.label}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.75rem", background: "rgba(26,92,58,0.25)", borderRadius: "0.5rem", border: "1px solid rgba(26,92,58,0.40)" }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#4ADE80" }}>Zero staff involved. Deal in the calendar.</p>
                  </div>
                </div>
              ),
            },
            {
              step: "02",
              title: "Staff input a job — the engine returns a price in under 5 seconds",
              desc: "Your employee types the vehicle or project type and the problem. The engine connects to your parts suppliers via API, pulls live pricing, overlays your labour rates and SOPs, applies your target margins, and returns an exact price guide before the customer finishes explaining the job.",
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
                className="group"
                style={{ borderTop: "1px solid #E2E1DC", padding: "2.5rem 0", display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "2rem", alignItems: "start", transition: "background 0.2s ease", borderRadius: "0.5rem", marginLeft: "-1rem", marginRight: "-1rem", paddingLeft: "1rem", paddingRight: "1rem" }}
              >
                <div
                  style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "5rem", fontWeight: 900, color: "#EEECEA", lineHeight: 1, userSelect: "none" }}
                  className="group-hover:text-[rgba(26,92,58,0.15)]"
                >
                  {row.step}
                </div>
                <div style={{ maxWidth: "28rem" }}>
                  <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#0D0D0B", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{row.title}</h3>
                  <p style={{ fontSize: "0.95rem", color: "#6B6B68", lineHeight: 1.65 }}>{row.desc}</p>
                </div>
                <div className="hidden md:block" style={{ maxWidth: "22rem", width: "100%" }}>{row.visual}</div>
              </div>
            </ScrollReveal>
          ))}
          <div style={{ borderTop: "1px solid #E2E1DC" }} />
        </div>
      </section>

      {/* ENGINE FEATURES */}
      <section style={{ background: "#F4F3EF", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "0.75rem" }}>What&apos;s Included</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "3.5rem" }}>
              Six capabilities built into<br />every engagement.
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "#9E9E9A", marginBottom: "0.5rem", paddingLeft: "1rem" }}>
              Engine 01 — Speed-to-Lead Voice Agent
            </p>
          </ScrollReveal>
          <div>
            {engineFeatures.slice(0, 3).map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.number} delay={idx * 0.05}>
                  <ServiceRow feature={feature} Icon={Icon} />
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "#9E9E9A", marginBottom: "0.5rem", paddingLeft: "1rem", marginTop: "2.5rem" }}>
              Engine 02 — Automated Internal Quoting Engine
            </p>
          </ScrollReveal>
          <div>
            {engineFeatures.slice(3).map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.number} delay={idx * 0.05}>
                  <ServiceRow feature={feature} Icon={Icon} />
                </ScrollReveal>
              );
            })}
            <div style={{ borderTop: "1px solid #E2E1DC" }} />
          </div>
        </div>
      </section>

      {/* ENGAGEMENT MODEL */}
      <section id="how-we-engage" style={{ background: "#FAFAF8", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div
              style={{ border: "1.5px solid #1A5C3A", borderRadius: "1.5rem", padding: "clamp(2rem, 5vw, 4rem)", display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem" }}
              className="lg:grid-cols-[1fr_auto]"
            >
              <div>
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
              <div className="flex items-center justify-center lg:justify-end" style={{ minWidth: "10rem" }}>
                <div style={{ width: "140px", height: "140px", borderRadius: "50%", background: "#1A5C3A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1rem", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.25rem", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: "0.15rem" }}>60</p>
                  <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Day</p>
                  <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Guarantee</p>
                </div>
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

function ServiceRow({
  feature,
  Icon,
}: {
  feature: (typeof engineFeatures)[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
}) {
  return (
    <div className="group" style={{ borderTop: "1px solid #E2E1DC", cursor: "default" }}>
      <div
        className="flex items-center gap-6 transition-colors duration-200 group-hover:bg-white"
        style={{ padding: "1.25rem 1rem", borderRadius: "0.5rem", marginLeft: "-1rem", marginRight: "-1rem" }}
      >
        <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#9E9E9A", minWidth: "2rem", flexShrink: 0 }}>{feature.number}</span>
        <Icon size={18} weight="light" style={{ color: "#1A5C3A", flexShrink: 0 }} />
        <span
          className="flex-1 transition-colors duration-200 group-hover:text-[#1A5C3A]"
          style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0D0D0B" }}
        >
          {feature.title}
        </span>
        <span className="hidden md:block text-right" style={{ fontSize: "0.875rem", color: "#6B6B68", minWidth: "14rem" }}>{feature.descriptor}</span>
        <ArrowUpRight size={18} weight="regular" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: "#1A5C3A", flexShrink: 0 }} />
      </div>
      <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-[6rem]" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
        <p style={{ fontSize: "0.875rem", color: "#6B6B68", paddingBottom: "1.25rem", paddingLeft: "3.5rem", lineHeight: 1.65 }}>{feature.description}</p>
      </div>
    </div>
  );
}
