import type React from "react";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  Star,
  Buildings,
  ChartBar,
  FileText,
  MagnifyingGlass,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import RankVisual from "@/components/RankVisual";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import HeroButtons from "@/components/HeroButtons";
import AuditScoreCard from "@/components/AuditScoreCard";
import RotatingWord from "@/components/RotatingWord";

const marqueeItems = [
  "Dental Practices",
  "Med Spas",
  "NDIS Providers",
  "Physio Clinics",
  "Law Firms",
  "Accounting Firms",
  "Trades",
  "Childcare Centres",
  "Podiatry Clinics",
  "Chiropractic Practices",
];

const services = [
  {
    number: "01",
    icon: MapPin,
    title: "Google Listing Setup & Maintenance",
    descriptor: "We set up and maintain your Google business listing so it ranks",
    description:
      "We set up your Google business listing properly and keep it updated — the right photos, the right details, in the right places — so Google ranks you above your competitors.",
  },
  {
    number: "02",
    icon: Star,
    title: "Getting You More 5-Star Reviews",
    descriptor: "We help your happy customers leave reviews automatically",
    description:
      "We set up a simple system that asks your happy customers to leave a review. More reviews means Google trusts you more — and more people call you.",
  },
  {
    number: "03",
    icon: Buildings,
    title: "Getting Your Business Listed Everywhere",
    descriptor: "We list your business on 50+ Australian directories",
    description:
      "We list your business on 50+ Australian directories — True Local, Yellow Pages, Yelp, and more. The more places you appear, the more Google trusts you.",
  },
  {
    number: "04",
    icon: ChartBar,
    title: "Seeing What Your Competitors Are Doing",
    descriptor: "We find out how your top competitors rank — then beat them",
    description:
      "We look at exactly how the businesses showing up above you are doing it — then we do it better for you.",
  },
  {
    number: "05",
    icon: FileText,
    title: "Plain-English Monthly Updates",
    descriptor: "Every month we show you what's working, in plain language",
    description:
      "Every month we send you a simple report — how many people found you, how many called, and what we did. No jargon. No confusing graphs.",
  },
  {
    number: "06",
    icon: MagnifyingGlass,
    title: "Showing Up in Google Search & Maps",
    descriptor: "Maps and search results — we get you in both",
    description:
      "When someone searches for your service nearby, we make sure your business shows up — in Google Maps and in the regular search results below it.",
  },
];

export default function HomePage() {
  return (
    <div style={{ background: "#FAFAF8" }}>
      {/* ============================================================
          SECTION 1 — HERO
      ============================================================ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 pt-40">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-center">

            {/* LEFT */}
            <div>
              <ScrollReveal delay={0}>
                {/* Location tag — no pill */}
                <p
                  style={{
                    color: "#1A5C3A",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "1.5rem",
                  }}
                >
                  Sydney · Local Growth Agency
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <h1
                  style={{
                    fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                    fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    marginBottom: "2rem",
                  }}
                >
                  <span style={{ display: "block", color: "#0D0D0B" }}>Your next</span>
                  <span style={{ display: "block", color: "#0D0D0B" }}>
                    <RotatingWord words={["client", "patient", "family", "case", "customer"]} />{" "}is
                  </span>
                  <span
                    style={{
                      display: "block",
                      WebkitTextStroke: "2px #1A5C3A",
                      color: "transparent",
                    }}
                  >
                    searching
                  </span>
                  <span style={{ display: "block", color: "#0D0D0B" }}>Google.</span>
                </h1>
              </ScrollReveal>

              {/* Divider + Stats */}
              <ScrollReveal delay={0.14}>
                <div
                  style={{
                    height: "1px",
                    background: "#E2E1DC",
                    marginBottom: "1.5rem",
                  }}
                />
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                        fontSize: "2.5rem",
                        fontWeight: 900,
                        color: "#0D0D0B",
                        lineHeight: 1,
                        marginBottom: "0.25rem",
                      }}
                    >
                      #1
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#9E9E9A", lineHeight: 1.4 }}>
                      our goal — get your business
                      <br />
                      to the top of local search
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                        fontSize: "2.5rem",
                        fontWeight: 900,
                        color: "#0D0D0B",
                        lineHeight: 1,
                        marginBottom: "0.25rem",
                      }}
                    >
                      50+
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#9E9E9A", lineHeight: 1.4 }}>
                      Australian directories
                      <br />
                      where we list your business
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <HeroButtons />
              </ScrollReveal>
            </div>

            {/* RIGHT — GBP Card in dark device frame */}
            <ScrollReveal delay={0.12} className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[380px]">
                {/* Dot grid background */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "-32px",
                    backgroundImage:
                      "radial-gradient(circle, rgba(26,92,58,0.15) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                    pointerEvents: "none",
                    borderRadius: "2rem",
                  }}
                />
                {/* Device frame */}
                <div
                  style={{
                    background: "#0D0D0B",
                    borderRadius: "2rem",
                    padding: "12px",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.10), 0 32px 80px rgba(0,0,0,0.25)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <RankVisual />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 — STATS BAR (replacing dark marquee)
      ============================================================ */}
      <section
        className="overflow-hidden"
        style={{ background: "#0D0D0B", paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 4-column stats row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "3rem" }}
          >
            {[
              { number: "30–60", line1: "days — typical window", line2: "before rankings start moving" },
              { number: "50+", line1: "Australian directories", line2: "where we list your business" },
              { number: "2 mo", line1: "minimum — cancel after that", line2: "no lock-in, no penalties" },
              { number: "Free", line1: "audit — see exactly where", line2: "you stand before spending a cent" },
            ].map((stat, i) => (
              <div
                key={stat.number}
                style={{
                  padding: "0 2rem 2.5rem",
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
                className={i === 0 ? "pl-0" : ""}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.number}
                </p>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.40)", marginBottom: "0.1rem" }}>
                  {stat.line1}
                </p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
                  {stat.line2}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Industry marquee */}
        <Marquee items={marqueeItems} className="text-white" />
      </section>

      {/* ============================================================
          SECTION 3 — HOW IT WORKS (numbered editorial rows)
      ============================================================ */}
      <section
        id="how-it-works"
        style={{ background: "#FAFAF8", paddingTop: "8rem", paddingBottom: "8rem" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 600,
                color: "#1A5C3A",
                marginBottom: "0.75rem",
              }}
            >
              The Process
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0D0D0B",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                maxWidth: "24rem",
                marginBottom: "4rem",
              }}
            >
              Three steps.
              <br />
              Real results.
            </h2>
          </ScrollReveal>

          {/* Step rows */}
          {[
            {
              step: "01",
              title: "We find out why Google is ignoring you",
              desc: "We look at how your business appears on Google right now — what's missing, what's wrong, and exactly why your competitors are showing up ahead of you.",
              visual: <AuditScoreCard />,
            },
            {
              step: "02",
              title: "We fix it — you don't lift a finger",
              desc: "We update everything Google needs to rank your business higher. Better photos, more reviews, the right information in the right places. You keep running your business. We handle the rest.",
              visual: (
                <div style={{ maxWidth: "20rem" }}>
                  {[
                    "Your Google listing set up correctly",
                    "A system to get you more 5-star reviews",
                    "Your business listed on 50+ Australian sites",
                    "A clear picture of how to outrank your competitors",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5"
                      style={{ marginBottom: "0.75rem" }}
                    >
                      <CheckCircle
                        size={15}
                        weight="fill"
                        style={{ color: "#1A5C3A", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "0.875rem", color: "#6B6B68" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: "03",
              title: "Your phone starts ringing more",
              desc: "When locals search for what you do, your business shows up first. More calls. More bookings. A monthly report shows you exactly what changed.",
              visual: (
                <div
                  style={{
                    maxWidth: "20rem",
                    padding: "1.25rem",
                    borderRadius: "1rem",
                    background: "rgba(26,92,58,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontWeight: 600,
                      color: "#1A5C3A",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Month 3 results
                  </p>
                  {[
                    { label: "Google ranking", value: "#1" },
                    { label: "New reviews", value: "+24" },
                    { label: "Profile views", value: "+312%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex justify-between items-center"
                      style={{
                        padding: "0.5rem 0",
                        borderBottom: "1px solid rgba(26,92,58,0.10)",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "#6B6B68" }}>
                        {stat.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "#1A5C3A",
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              ),
            },
          ].map((row, idx) => (
            <ScrollReveal key={row.step} delay={idx * 0.08}>
              <div
                className="group"
                style={{
                  borderTop: "1px solid #E2E1DC",
                  padding: "2.5rem 0",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: "2rem",
                  alignItems: "start",
                  transition: "background 0.2s ease",
                  borderRadius: "0.5rem",
                  marginLeft: "-1rem",
                  marginRight: "-1rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                    fontSize: "5rem",
                    fontWeight: 900,
                    color: "#EEECEA",
                    lineHeight: 1,
                    transition: "color 0.2s ease",
                    userSelect: "none",
                  }}
                  className="group-hover:text-[rgba(26,92,58,0.15)]"
                >
                  {row.step}
                </div>

                {/* Title + description */}
                <div style={{ maxWidth: "28rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#0D0D0B",
                      marginBottom: "0.75rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {row.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#6B6B68", lineHeight: 1.65 }}>
                    {row.desc}
                  </p>
                </div>

                {/* Visual element */}
                <div className="hidden md:block" style={{ maxWidth: "22rem", width: "100%" }}>
                  {row.visual}
                </div>
              </div>
            </ScrollReveal>
          ))}
          {/* Bottom border on last row */}
          <div style={{ borderTop: "1px solid #E2E1DC" }} />
        </div>
      </section>

      {/* ============================================================
          SECTION 4 — SERVICES (horizontal editorial list)
      ============================================================ */}
      <section style={{ background: "#F4F3EF", paddingTop: "8rem", paddingBottom: "8rem" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 600,
                color: "#1A5C3A",
                marginBottom: "0.75rem",
              }}
            >
              What&apos;s Included
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0D0D0B",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "3.5rem",
              }}
            >
              What we do every month —
              <br />
              so you don&apos;t have to.
            </h2>
          </ScrollReveal>

          {/* Service list */}
          <div>
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.number} delay={idx * 0.05}>
                  <ServiceRow service={service} Icon={Icon} />
                </ScrollReveal>
              );
            })}
            {/* Bottom border */}
            <div style={{ borderTop: "1px solid #E2E1DC" }} />
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5 — THE OFFER (split layout)
      ============================================================ */}
      <section
        style={{
          background: "#1A5C3A",
          paddingTop: "10rem",
          paddingBottom: "10rem",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-start">

            {/* Left */}
            <ScrollReveal delay={0}>
              <p
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.50)",
                  marginBottom: "1.25rem",
                }}
              >
                No Obligation
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  marginBottom: "1.5rem",
                }}
              >
                Start with a
                <br />
                free audit.
              </h2>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.7,
                  maxWidth: "28rem",
                  marginBottom: "2.5rem",
                }}
              >
                We&apos;ll look at how your business appears on Google right now — for
                free. You&apos;ll get a full report showing exactly what&apos;s holding
                you back and what it would take to fix it. If you want to move forward,
                we&apos;ll send you a custom quote and a plain-English contract. No
                lock-in beyond 2 months.
              </p>
              <a
                href="/audit"
                className="inline-flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-xl"
                style={{
                  background: "#fff",
                  color: "#1A5C3A",
                  padding: "1rem 2rem",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.20)",
                }}
              >
                Get your free audit &rarr;
              </a>
            </ScrollReveal>

            {/* Right — commitment list */}
            <ScrollReveal delay={0.12}>
              <div>
                {[
                  "Free audit — takes 60 seconds to request",
                  "Custom quote — no generic packages",
                  "Clear contract — we walk you through everything",
                  "New agency — you get the founder's direct attention, not a junior account manager",
                ].map((item, i) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1.5rem 0",
                      borderTop: i === 0 ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <CheckCircle
                      size={18}
                      weight="light"
                      style={{ color: "rgba(255,255,255,0.50)", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: "1rem",
                        color: "rgba(255,255,255,0.80)",
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </span>
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

/* ================================================================
   ServiceRow — client-side hover state handled via CSS group
================================================================ */
function ServiceRow({
  service,
  Icon,
}: {
  service: (typeof services)[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
}) {
  return (
    <div
      className="group"
      style={{
        borderTop: "1px solid #E2E1DC",
        cursor: "default",
      }}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-6 transition-colors duration-200 group-hover:bg-white"
        style={{
          padding: "1.25rem 1rem",
          borderRadius: "0.5rem",
          marginLeft: "-1rem",
          marginRight: "-1rem",
        }}
      >
        {/* Number */}
        <span
          style={{
            fontFamily: "var(--font-cabinet), Outfit, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#9E9E9A",
            minWidth: "2rem",
            flexShrink: 0,
          }}
        >
          {service.number}
        </span>

        {/* Icon */}
        <Icon
          size={18}
          weight="light"
          style={{ color: "#1A5C3A", flexShrink: 0 }}
        />

        {/* Title */}
        <span
          className="flex-1 transition-colors duration-200 group-hover:text-[#1A5C3A]"
          style={{
            fontFamily: "var(--font-cabinet), Outfit, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#0D0D0B",
          }}
        >
          {service.title}
        </span>

        {/* Descriptor — hidden on mobile */}
        <span
          className="hidden md:block text-right"
          style={{
            fontSize: "0.875rem",
            color: "#6B6B68",
            minWidth: "14rem",
          }}
        >
          {service.descriptor}
        </span>

        {/* Arrow icon — visible on hover */}
        <ArrowUpRight
          size={18}
          weight="regular"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "#1A5C3A", flexShrink: 0 }}
        />
      </div>

      {/* Expanded description — slides in on hover via max-height */}
      <div
        className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-[6rem]"
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6B6B68",
            paddingBottom: "1.25rem",
            paddingLeft: "3.5rem",
            lineHeight: 1.65,
          }}
        >
          {service.description}
        </p>
      </div>
    </div>
  );
}
