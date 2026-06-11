import type React from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Warning,
  CurrencyDollar,
  Robot,
} from "@phosphor-icons/react/dist/ssr";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import HeroButtons from "@/components/HeroButtons";

const marqueeItems = [
  "Trade Businesses",
  "HVAC Companies",
  "Auto Repair Shops",
  "Solar Installers",
  "Roofing Contractors",
  "Plumbing Businesses",
  "Flooring Companies",
  "Commercial Cleaners",
  "Logistics Operators",
  "Property Managers",
];

export default function HomePage() {
  return (
    <div style={{ background: "#FAFAF8" }}>

      {/* ——— HERO ——— */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 pt-40">
          <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-16 items-center">
            <div>
              <ScrollReveal delay={0}>
                <p style={{ color: "#1A5C3A", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>
                  Sydney · AI Automation Agency
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.07}>
                <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(3rem, 6.5vw, 6rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", marginBottom: "2rem" }}>
                  <span style={{ display: "block", color: "#0D0D0B" }}>Slow responses</span>
                  <span style={{ display: "block", color: "#0D0D0B" }}>kill deals.</span>
                  <span style={{ display: "block", WebkitTextStroke: "2px #1A5C3A", color: "transparent" }}>Manual quotes</span>
                  <span style={{ display: "block", color: "#0D0D0B" }}>kill margins.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.13}>
                <p style={{ fontSize: "1.1rem", color: "#6B6B68", lineHeight: 1.7, maxWidth: "32rem", marginBottom: "2rem" }}>
                  We build and install two custom AI engines for mid-market businesses. One calls your leads in 20 seconds. The other prices your jobs in under 5.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.18}>
                <HeroButtons />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.1} className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[380px]">
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", inset: "-32px", backgroundImage: "radial-gradient(circle, rgba(26,92,58,0.15) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none", borderRadius: "2rem" }}
                />
                <div style={{ background: "#0D0D0B", borderRadius: "2rem", padding: "1.5rem", boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 32px 80px rgba(0,0,0,0.25)", position: "relative", zIndex: 1 }}>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>
                    Active Engines
                  </p>
                  {[
                    { label: "Speed-to-Lead Voice Agent", time: "20 sec response" },
                    { label: "Internal Quoting Engine", time: "< 5 sec quote" },
                  ].map((engine) => (
                    <div
                      key={engine.label}
                      style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff", marginBottom: "0.2rem" }}>{engine.label}</p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}>{engine.time}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(26,92,58,0.3)", borderRadius: "2rem", padding: "0.25rem 0.6rem" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80", display: "block" }} />
                        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#4ADE80" }}>Live</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { number: "20s", label: "First call" },
                        { number: "100×", label: "Scalable" },
                        { number: "< 5s", label: "Quote time" },
                        { number: "0", label: "Pricing errors" },
                      ].map((stat) => (
                        <div key={stat.label} style={{ textAlign: "center" }}>
                          <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{stat.number}</p>
                          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem" }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ——— STATS BAR ——— */}
      <section className="overflow-hidden" style={{ background: "#0D0D0B", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "3rem" }}>
            {[
              { number: "20s", line1: "outbound call triggered", line2: "the moment a lead hits your CRM" },
              { number: "80%", line1: "close rate drop", line2: "if you wait 5+ minutes to respond" },
              { number: "3+ hrs", line1: "reclaimed per day", line2: "from manual quoting workflows" },
              { number: "$0", line1: "per automated call", line2: "vs. thousands in admin salary per month" },
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

      {/* ——— PAIN POINTS ——— */}
      <section style={{ background: "#FAFAF8", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "0.75rem" }}>The Revenue Leaks</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "28rem", marginBottom: "4rem" }}>
              Three ways your business bleeds revenue every single day.
            </h2>
          </ScrollReveal>
          {[
            {
              number: "01",
              Icon: Clock,
              title: "The 5-Minute Death Window",
              body: "When a prospect submits a form and you don't call within 5 minutes, your close rate drops by 80%. They've already clicked your competitor's Google listing. They're already talking to someone else. It doesn't matter how good your service is — you weren't fast enough.",
            },
            {
              number: "02",
              Icon: Warning,
              title: "The Free-Quote Trap",
              body: "Your senior staff — or you — spend 15 minutes per enquiry calling suppliers, cross-referencing fuel costs, checking labour rates, and calculating margins manually. Then the prospect ghosts you. Multiply that by 20 to 50 quotes a day and you've consumed 3 or more hours of your highest-leverage management time on data entry and arithmetic.",
            },
            {
              number: "03",
              Icon: CurrencyDollar,
              title: "Margin Leakage on Every Job",
              body: "Manual pricing errors don't announce themselves. They quietly erode your margins — or worse, they cause you to take on jobs that actively lose the business money. You don't find out until the job is done and the invoices are in.",
            },
          ].map((row, idx) => (
            <ScrollReveal key={row.number} delay={idx * 0.08}>
              <div style={{ borderTop: "1px solid #E2E1DC", padding: "2.5rem 0", display: "grid", gridTemplateColumns: "80px 1fr", gap: "2rem", alignItems: "start" }}>
                <div style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "5rem", fontWeight: 900, color: "#EEECEA", lineHeight: 1, userSelect: "none" }}>{row.number}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                    <row.Icon size={18} weight="duotone" style={{ color: "#1A5C3A", flexShrink: 0 }} />
                    <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#0D0D0B", letterSpacing: "-0.02em" }}>{row.title}</h3>
                  </div>
                  <p style={{ fontSize: "0.975rem", color: "#6B6B68", lineHeight: 1.7, maxWidth: "38rem" }}>{row.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
          <div style={{ borderTop: "1px solid #E2E1DC" }} />
        </div>
      </section>

      {/* ——— ENGINE 01: SPEED-TO-LEAD ——— */}
      <section id="engine-1" style={{ background: "#0D0D0B", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.30)", marginBottom: "1.5rem" }}>
              Engine 01
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal delay={0.05}>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem" }}>
                The Outbound Speed-to-Lead Voice Agent
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                The moment a lead is captured on your website or landing page, this engine triggers an automated outbound call via your CRM in 20 seconds. It qualifies the prospect, handles common FAQs using your exact script, and books them directly into your calendar. It never takes a day off. It never misses a lead. It scales instantly to 100 simultaneous calls.
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
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.5rem", padding: "1.5rem" }}>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.25)", marginBottom: "1.25rem" }}>
                  Lead Flow — Live
                </p>
                {[
                  { time: "0:00", event: "Lead submits contact form on your website", statusLabel: "trigger", color: "rgba(255,255,255,0.50)" },
                  { time: "0:08", event: "Engine receives lead data from CRM", statusLabel: "processing", color: "#FBBF24" },
                  { time: "0:20", event: "Outbound call placed to prospect", statusLabel: "calling", color: "#4ADE80" },
                  { time: "1:45", event: "Prospect qualified — appointment booked", statusLabel: "booked", color: "#60A5FA" },
                ].map((step) => (
                  <div key={step.time} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.25)", minWidth: "2.5rem", paddingTop: "0.65rem", fontFamily: "monospace" }}>
                      {step.time}
                    </span>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "0.5rem", padding: "0.625rem 0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.8rem", color: step.color, lineHeight: 1.4 }}>{step.event}</span>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: step.color, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>{step.statusLabel}</span>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "1.25rem", padding: "0.875rem", background: "rgba(26,92,58,0.2)", borderRadius: "0.75rem", border: "1px solid rgba(26,92,58,0.3)" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4ADE80", marginBottom: "0.25rem" }}>Result: Appointment Confirmed</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.40)" }}>Total elapsed: 1 min 45 sec. Zero staff involved.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ——— ENGINE 02: QUOTING ENGINE ——— */}
      <section id="engine-2" style={{ background: "#F4F3EF", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "1.5rem" }}>
              Engine 02
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal delay={0.05}>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem" }}>
                The Automated Internal Quoting Engine
              </h2>
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
              <div style={{ background: "#fff", border: "1px solid #E2E1DC", borderRadius: "1.5rem", padding: "1.5rem", boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #E2E1DC" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1A5C3A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Robot size={16} weight="fill" style={{ color: "#fff" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0D0D0B", lineHeight: 1 }}>Quoting Engine</p>
                    <p style={{ fontSize: "0.65rem", color: "#1A5C3A" }}>● Active</p>
                  </div>
                </div>
                <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: "#0D0D0B", borderRadius: "1rem 1rem 0.2rem 1rem", padding: "0.75rem 1rem", maxWidth: "80%" }}>
                    <p style={{ fontSize: "0.8rem", color: "#fff", lineHeight: 1.5 }}>2019 Ford Ranger, snapped front CV axle, customer in Parramatta</p>
                  </div>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ background: "#F4F3EF", borderRadius: "1rem 1rem 1rem 0.2rem", padding: "1rem", maxWidth: "92%" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0D0D0B", marginBottom: "0.6rem" }}>Quote ready — 4.2 seconds</p>
                    {[
                      { label: "Parts (OEM supplier — live price)", value: "$312.50" },
                      { label: "Labour (1.5 hrs @ your rate)", value: "$187.50" },
                      { label: "Travel surcharge (22 km)", value: "$28.00" },
                      { label: "Margin overlay (38%)", value: "applied" },
                    ].map((line) => (
                      <div key={line.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <span style={{ fontSize: "0.7rem", color: "#6B6B68" }}>{line.label}</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0D0D0B" }}>{line.value}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "rgba(26,92,58,0.08)", borderRadius: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0D0D0B" }}>Quote to customer</span>
                      <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#1A5C3A" }}>$734.00</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: "0.65rem", color: "#9E9E9A", textAlign: "center" }}>
                  Prices pulled live from supplier API. SOPs and margins applied automatically.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ——— ENGAGEMENT MODEL ——— */}
      <section id="how-we-engage" style={{ background: "#FAFAF8", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "0.75rem" }}>How We Engage</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0D0D0B", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "32rem", marginBottom: "1.25rem" }}>
              No hourly consulting. No guesswork on cost.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6B6B68", lineHeight: 1.75, maxWidth: "38rem", marginBottom: "4rem" }}>
              We charge a flat technical setup fee to build and integrate the engine into your existing CRM and systems. Then a monthly maintenance retainer covers ongoing calibration, supplier API updates, and performance auditing — so the engine keeps improving, not drifting.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Setup Fee",
                description: "A flat fee to build, configure, and integrate your AI engine into your existing CRM and tech stack. Scoped, quoted, and agreed before any work begins. No surprises.",
                points: [
                  "Engine built to your exact SOPs and call script",
                  "Full CRM integration and pre-launch testing",
                  "Staff onboarding and operational handover",
                ],
              },
              {
                label: "Monthly Retainer",
                description: "Ongoing maintenance to keep the engine performing at standard. We monitor, calibrate, update supplier APIs, and audit results every month without exception.",
                points: [
                  "Supplier API updates as prices and catalogues change",
                  "Monthly performance auditing and reporting",
                  "Script and SOP refinements as your business evolves",
                ],
              },
            ].map((card, idx) => (
              <ScrollReveal key={card.label} delay={idx * 0.07}>
                <div style={{ border: "1.5px solid #E2E1DC", borderRadius: "1.25rem", padding: "2rem", height: "100%" }}>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "0.75rem" }}>{card.label}</p>
                  <p style={{ fontSize: "0.95rem", color: "#6B6B68", lineHeight: 1.7, marginBottom: "1.5rem" }}>{card.description}</p>
                  <div>
                    {card.points.map((point) => (
                      <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.6rem" }}>
                        <CheckCircle size={14} weight="fill" style={{ color: "#1A5C3A", flexShrink: 0, marginTop: "0.2rem" }} />
                        <span style={{ fontSize: "0.85rem", color: "#6B6B68", lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section style={{ background: "#1A5C3A", paddingTop: "clamp(4rem, 9vw, 10rem)", paddingBottom: "clamp(4rem, 9vw, 10rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-start">
            <ScrollReveal delay={0}>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.50)", marginBottom: "1.25rem" }}>No Obligation</p>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: "1.5rem" }}>
                Book a 15-Minute<br />Pipeline Audit.
              </h2>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "28rem", marginBottom: "2.5rem" }}>
                We map exactly where your business is losing revenue — to slow response times, manual quoting, or both. No sales pitch. Just a clear picture of what an automated engine would return to your bottom line.
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
