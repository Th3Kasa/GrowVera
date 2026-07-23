import {
  CheckCircle,
  ArrowRight,
  Phone,
  Lightning,
  Receipt,
  Star,
  ArrowCounterClockwise,
  ShieldCheck,
  ArrowUUpLeft,
  PhoneDisconnect,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import HeroButtons from "@/components/HeroButtons";
import WithWithout from "@/components/WithWithout";
import DemosHub from "@/components/demo/DemosHub";
import { TIERS, ADDONS, formatAud } from "@/lib/tiers";

const marqueeItems = [
  "Plumbers", "Electricians", "Solar Installers", "Landscapers", "Builders",
  "Real Estate Agents", "Roofers", "Mechanics", "HVAC", "Cleaners", "Locksmiths", "Painters",
];

const steps = [
  {
    step: "01",
    name: "Catch",
    icon: Phone,
    title: "It answers only the calls you can't get to",
    desc: "In your business's name — while you're on the tools, after hours, or already on another call. You still pick up whenever you're free; this only catches what would otherwise ring out.",
  },
  {
    step: "02",
    name: "Capture",
    icon: Receipt,
    title: "It gets the job, the details, and the urgency",
    desc: "It never guesses. If it doesn't know something, it takes a proper message rather than making something up — so what lands on your phone is accurate, not invented.",
  },
  {
    step: "03",
    name: "Hand-back",
    icon: ArrowUUpLeft,
    title: "It texts you the summary and sends them your booking link",
    desc: "The ball's back in your court with a warm, qualified lead — not phone tag. And if our system's ever down, calls fall straight back to your phone, exactly as today.",
  },
];

const productIcons: Record<string, typeof Phone> = {
  receptionist: Phone,
  "speed-to-lead": Lightning,
  quoting: Receipt,
};

// Icons for the add-on agents, keyed by their name in lib/tiers ADDONS
// (the single source of truth for add-on copy + pricing).
const addonIcons: Record<string, typeof Phone> = {
  "Google Review Agent": Star,
  "Lead Reactivation Agent": ArrowCounterClockwise,
};

// The ascension ladder — everything after the receptionist wedge. Same card
// treatment for all four so Lead Reactivation finally gets parity instead of
// being an orphan card with no section of its own.
const ladderItems = [
  ...TIERS.filter((t) => t.slug !== "receptionist").map((t) => ({
    key: t.id,
    icon: productIcons[t.slug] ?? Star,
    name: t.name,
    desc: `${t.outcome} ${t.pickThisIf}`,
    href: `/${t.slug}`,
    cta: "See how it works",
  })),
  ...ADDONS.map((a) => ({
    key: a.name,
    icon: addonIcons[a.name] ?? Star,
    name: a.name,
    desc: a.desc,
    href: "/audit",
    cta: "Add it on your audit call",
  })),
];

const receptionistTier = TIERS.find((t) => t.slug === "receptionist")!;

export default function HomePage() {
  return (
    <div style={{ background: "var(--color-bg)" }}>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div
          aria-hidden="true"
          style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vw", height: "60vw", maxWidth: 760, maxHeight: 760, background: "radial-gradient(circle, var(--color-accent-tint) 0%, transparent 60%)", pointerEvents: "none" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 pt-40">
          <div className="max-w-4xl">
            <ScrollReveal delay={0}>
              <p style={{ color: "var(--color-accent)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>
                For Australian trades &amp; local services
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.75rem, 6.5vw, 6rem)", fontWeight: 900, lineHeight: 0.94, letterSpacing: "-0.04em", marginBottom: "2rem", color: "var(--color-text)" }}>
                <span style={{ display: "block" }}>Never miss a call.</span>
                <span style={{ display: "block", color: "var(--color-accent)" }}>Never lose a job.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.14}>
              <p style={{ fontSize: "1.15rem", color: "var(--color-text-muted)", lineHeight: 1.7, maxWidth: "40rem", marginBottom: "2rem" }}>
                You didn&apos;t start your business to be chained to your phone. The Missed-Call Safety Net catches the calls you can&apos;t get to, books the job, and texts you the summary &mdash; so you stay on the tools and still win the work. Your customers never talk to a machine unless you decide they should.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.18}>
              <div style={{ height: "1px", background: "var(--color-border)", marginBottom: "1.5rem" }} />
              <div className="grid grid-cols-3 gap-8 mb-8" style={{ maxWidth: "36rem" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1, marginBottom: "0.25rem" }}>24/7</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-faint)", lineHeight: 1.4 }}>the calls you can&apos;t get to,<br />answered day or night</p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1, marginBottom: "0.25rem" }}>80%</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-faint)", lineHeight: 1.4 }}>of callers who hit voicemail<br />just ring the next tradie</p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1, marginBottom: "0.25rem" }}>Free</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-faint)", lineHeight: 1.4 }}>audit shows what<br />you&apos;re losing</p>
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
      <section className="overflow-hidden" style={{ background: "var(--color-bg-section)", paddingTop: "3rem", paddingBottom: "3rem", borderTop: "1px solid var(--color-hairline)" }}>
        <p style={{ textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "1.25rem", fontWeight: 600 }}>
          Built for the trades that live and die by the phone
        </p>
        <Marquee items={marqueeItems} className="text-[color:var(--color-text-muted)]" />
      </section>

      {/* PAIN — before / after */}
      <section style={{ background: "var(--color-bg)", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "0.75rem" }}>The real problem</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "34rem", marginBottom: "1.25rem" }}>
              It&apos;s not your work.<br />It&apos;s the calls you can&apos;t get to.
            </h2>
            <p style={{ fontSize: "0.975rem", color: "var(--color-text-muted)", lineHeight: 1.7, maxWidth: "36rem", marginBottom: "3rem" }}>
              You&apos;re under a sink when the phone rings. Hands full, you let it ring out &mdash; and most people won&apos;t leave a message. They just ring the next tradie. That job was yours &mdash; and you never even knew they called.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.06}>
            <WithWithout
              stat="When a call goes to voicemail, about 80% of people hang up without leaving a message — and 62% of them just ring the next business."
              without="The call rings out, they hang up, ring the next tradie — and you never even knew they called."
              withGV="It answers on your behalf, captures the job, books it, and texts you the details — so nothing slips past."
              sources={[{ label: "AIRA (411 Locals, PATLive, Dialzara data)", url: "https://www.getaira.io/blog/missed-business-calls-statistics" }]}
              packageName="GrowVera"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "var(--color-bg-section)", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "0.75rem" }}>The named mechanism</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "34rem", marginBottom: "1.25rem" }}>
              Meet The Missed-Call Safety Net.
            </h2>
            <p style={{ fontSize: "0.975rem", color: "var(--color-text-muted)", lineHeight: 1.7, maxWidth: "36rem", marginBottom: "4rem" }}>
              It&apos;s not a call centre and it&apos;s not an always-on bot. It stays silent while you handle your own calls, and only ever steps in on the ones that would otherwise ring out. We call that <strong style={{ color: "var(--color-text)" }}>Answers-Only-When-You-Can&apos;t</strong> &mdash; it&apos;s not a replacement for you, it&apos;s the safety net under you.
            </p>
          </ScrollReveal>

          {steps.map((row, idx) => {
            const Icon = row.icon;
            return (
              <ScrollReveal key={row.step} delay={idx * 0.06}>
                <div
                  className="group grid grid-cols-[52px_1fr] md:grid-cols-[80px_1fr] gap-5 md:gap-8"
                  style={{ borderTop: "1px solid var(--color-border)", padding: "2.25rem 0", alignItems: "start" }}
                >
                  <div style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 900, color: "var(--color-border)", lineHeight: 1, userSelect: "none" }}>
                    {row.step}
                  </div>
                  <div style={{ maxWidth: "44rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <Icon size={16} weight="bold" style={{ color: "var(--color-accent)" }} />
                      <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "var(--color-accent)", background: "var(--color-accent-soft)", borderRadius: "2rem", padding: "0.25rem 0.7rem" }}>{row.name}</p>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.25rem, 3vw, 1.6rem)", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>{row.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>{row.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
          <div style={{ borderTop: "1px solid var(--color-border)" }} />
        </div>
      </section>

      {/* THE WEDGE — 24/7 AI Receptionist, the single hero offer */}
      <section id="services" style={{ background: "var(--color-bg)", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(2rem, 4vw, 3rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>Start here</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              Every client starts<br />with the phone.
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "3rem", maxWidth: "36rem" }}>
              This is the wedge &mdash; the one thing that has to work before anything else is worth adding. Get the phone handled first.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <Link href={`/${receptionistTier.slug}`} style={{ display: "block", textDecoration: "none" }}>
              <div style={{ background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border-strong)", borderRadius: "1.5rem", padding: "clamp(2rem, 5vw, 3.5rem)", display: "grid", gap: "2.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))", alignItems: "center" }}>
                <div>
                  <div style={{ width: 48, height: 48, background: "var(--color-accent-soft)", borderRadius: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <Phone size={24} weight="bold" style={{ color: "var(--color-accent)" }} />
                  </div>
                  <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--color-accent)", marginBottom: "0.75rem" }}>{receptionistTier.name}</p>
                  <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "0.9rem" }}>
                    {receptionistTier.outcome}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "34rem" }}>
                    {receptionistTier.tagline}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-accent)", color: "var(--color-on-accent)", padding: "0.85rem 1.6rem", borderRadius: "2rem", fontSize: "0.88rem", fontWeight: 700 }}>
                      See exactly how it works <ArrowRight size={14} weight="bold" />
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-text-faint)" }}>Priced to your business on your free audit</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  {steps.map((s) => (
                    <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "0.85rem", padding: "0.9rem 1.1rem" }}>
                      <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontWeight: 900, fontSize: "0.85rem", color: "var(--color-accent)", flexShrink: 0, paddingTop: "0.15rem" }}>{s.name}</span>
                      <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ASCENSION LADDER — everything after the phone's handled */}
      <section id="ladder" style={{ background: "var(--color-bg)", paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>Once your phone&apos;s handled</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Here&apos;s what&apos;s next.
            </h2>
            <p style={{ fontSize: "0.975rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "3rem", maxWidth: "36rem" }}>
              These four are the ladder you climb after the receptionist &mdash; add one at a time, whenever you&apos;re ready. No fifty-grand overhaul, just the next thing that&apos;s costing you the most.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ladderItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.key} delay={i * 0.06}>
                  <Link href={item.href} style={{ display: "block", height: "100%", textDecoration: "none" }}>
                    <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1.25rem", padding: "1.75rem", height: "100%", display: "flex", gap: "1.1rem", alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, background: "var(--color-accent-soft)", borderRadius: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={19} weight="bold" style={{ color: "var(--color-accent)" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0.25rem 0.75rem", marginBottom: "0.3rem" }}>
                          <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)" }}>{item.name}</h3>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-accent-muted)", whiteSpace: "nowrap", fontWeight: 600 }}>{item.cta}</span>
                        </div>
                        <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEMOS HUB — try them yourself */}
      <section id="demos" style={{ background: "var(--color-bg)", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)", borderTop: "1px solid var(--color-hairline)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>Try them yourself</p>
            <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              Don&apos;t take our word for it —<br />press play.
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "3.5rem", maxWidth: "38rem" }}>
              Three working demos, right here in your browser — hear a call answered, watch a callback, build a quote. Each one&apos;s a scripted example on a made-up business, but it behaves exactly like the real thing. No signup, no catch.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <DemosHub />
          </ScrollReveal>
        </div>
      </section>

      {/* ROI CALCULATOR TEASER */}
      <section style={{ background: "var(--color-bg-section)", paddingTop: "clamp(3rem, 7vw, 7rem)", paddingBottom: "clamp(3rem, 7vw, 7rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1.5rem", padding: "clamp(2rem, 5vw, 3.5rem)", display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))", alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <PhoneDisconnect size={18} weight="bold" style={{ color: "var(--color-accent)" }} />
                  <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--color-accent)" }}>Free AI audit</p>
                </div>
                <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem" }}>
                  What are missed calls actually costing you?
                </h2>
                <p style={{ fontSize: "0.975rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                  Put in your own numbers and watch the figure land &mdash; no email needed. It&apos;s an honest estimate from what you enter, and we&apos;ll check the real number together on a quick call. How many jobs walked past your phone this year?
                </p>
                <a
                  href="/audit"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-accent)", color: "var(--color-on-accent)", padding: "0.9rem 1.9rem", borderRadius: "2rem", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}
                >
                  Get my free audit <ArrowRight size={15} weight="bold" />
                </a>
              </div>
              <div style={{ background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border-soft)", borderRadius: "1.25rem", padding: "2rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-accent-muted)", fontWeight: 700, marginBottom: "0.75rem" }}>Example</p>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  15 missed calls a week, 40% you&apos;d win, $1,300 a job
                </p>
                <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.25rem, 7vw, 3.25rem)", fontWeight: 900, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {formatAud(15 * 0.4 * 1300 * 52)}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-faint)", marginTop: "0.4rem" }}>walking past the phone each year</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* GOOGLE REVIEW AGENT — add-on */}
      <section style={{ background: "var(--color-bg)", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1.5rem", padding: "clamp(2rem, 5vw, 3.5rem)", display: "grid", gap: "2.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))", alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Star size={18} weight="fill" style={{ color: "var(--color-accent)" }} />
                  <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--color-accent)" }}>Google Review Agent</p>
                </div>
                <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
                  More 5-star reviews. No bad ones by surprise.
                </h2>
                <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                  After every job, it asks your happy customers for the Google review that wins you the next one. And the second a low rating lands, it pings you first &mdash; so you can make it right before the whole suburb reads it.
                </p>
                <a
                  href="/audit"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-accent)", color: "var(--color-on-accent)", padding: "0.9rem 1.9rem", borderRadius: "2rem", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}
                >
                  Add it to your audit <ArrowRight size={15} weight="bold" />
                </a>
              </div>
              <div style={{ background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border-soft)", borderRadius: "1.25rem", padding: "2.5rem 2rem", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(3.5rem, 10vw, 5rem)", fontWeight: 900, color: "var(--color-accent)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  81%
                </p>
                <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.6, marginTop: "0.75rem", maxWidth: "18rem", marginLeft: "auto", marginRight: "auto" }}>
                  of people check Google reviews before they pick a local business.
                </p>
                <a href="https://www.brightlocal.com/research/local-consumer-review-survey-2025/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.9rem", fontSize: "0.78rem", color: "var(--color-accent-muted)", textDecoration: "underline" }}>
                  BrightLocal, 2025
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* HONEST TRUST */}
      <section style={{ background: "var(--color-bg-section)", paddingTop: "clamp(3rem, 7vw, 8rem)", paddingBottom: "clamp(3rem, 7vw, 8rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 items-start">
            <ScrollReveal>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>No smoke, no mirrors</p>
              <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
                Built so you&apos;re never worse off.
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                We&apos;re a small Sydney outfit, and we&apos;d rather earn your trust than dazzle you. Here&apos;s the honest version &mdash; what it costs, what it doesn&apos;t do, and what happens if it ever breaks.
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-bright)", lineHeight: 1.7, fontWeight: 600, marginBottom: "1.5rem" }}>
                You&apos;re one of our first clients and we genuinely need this to work for you &mdash; you&apos;ll get more attention, not less.
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-faint)", lineHeight: 1.7 }}>
                GrowVera · Sydney, Australia · ABN 50 329 139 726 · contact.basemmorkos@gmail.com
              </p>
            </ScrollReveal>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { icon: Phone, title: "You approve every call recording before we go live", desc: "You hear exactly how it answers your phone, word for word. Nothing goes live until you've listened and said yes." },
                { icon: ArrowUUpLeft, title: "Forwarding is reversible in 30 seconds", desc: "It runs through simple call forwarding on your existing number. Change your mind and you switch it off yourself, in about the time it took to read this." },
                { icon: ShieldCheck, title: "If our system's ever down, calls fall back to your phone", desc: "Exactly as they do today. There's no version of this where a customer can't reach you because of something on our end." },
                { icon: CheckCircle, title: "No lock-in games", desc: "A three-month minimum so it gets a fair run, then month to month. No fake logos, no invented reviews, no numbers we can't show you the source for." },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <ScrollReveal key={f.title} delay={i * 0.05}>
                    <div style={{ display: "flex", gap: "1.25rem", padding: "1.75rem 0", borderBottom: "1px solid var(--color-hairline-strong)", alignItems: "flex-start" }}>
                      <div style={{ width: 38, height: 38, background: "var(--color-accent-soft)", borderRadius: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={18} weight="bold" style={{ color: "var(--color-accent)" }} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.3rem" }}>{f.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--color-bg)", paddingTop: "clamp(4rem, 9vw, 9rem)", paddingBottom: "clamp(4rem, 9vw, 9rem)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              background: "var(--gradient-cta)",
              borderRadius: "1.75rem",
              padding: "clamp(2.5rem, 6vw, 5rem)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
              <ScrollReveal delay={0}>
                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-on-dark-60)", marginBottom: "1.25rem" }}>Start today</p>
                <h2 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.98, marginBottom: "1.5rem" }}>
                  See what you&apos;re<br />losing. Free.
                </h2>
                <p style={{ fontSize: "1.05rem", color: "var(--color-on-dark-80)", lineHeight: 1.7, maxWidth: "30rem", marginBottom: "1.5rem" }}>
                  Two minutes with the audit shows you the number. A quick call shows you how to stop it. Start with one agent and keep the rest &mdash; no obligation, no jargon.
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--color-on-dark-60)", lineHeight: 1.6, maxWidth: "28rem", marginBottom: "2.25rem", fontStyle: "italic" }}>
                  This is for trades already busy enough to be missing calls. If your phone isn&apos;t ringing yet, we&apos;re not your fix &mdash; and we&apos;d tell you.
                </p>
                <a
                  href="/audit"
                  className="inline-flex items-center gap-2 rounded-full text-sm font-bold transition-all duration-200 hover:shadow-xl"
                  style={{ background: "#fff", color: "var(--color-accent-deepest)", padding: "1rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                >
                  Get my free AI audit &rarr;
                </a>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <div>
                  {[
                    "See what missed calls cost you — on the spot",
                    "Answers only when you can't — you're first to pick up",
                    "You approve everything before it goes live",
                    "Priced to your business — you see the number on your free audit",
                    "Reversible in 30 seconds, anytime",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 0", borderTop: "1px solid var(--color-on-dark-20)" }}>
                      <CheckCircle size={18} weight="fill" style={{ color: "#fff", flexShrink: 0 }} />
                      <span style={{ fontSize: "1rem", color: "var(--color-on-dark-92)", fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--color-on-dark-20)" }} />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
