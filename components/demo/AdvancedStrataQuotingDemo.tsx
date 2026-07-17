"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowClockwise, CaretDown, FileText, GridFour, ChatText, Gear, Warning } from "@phosphor-icons/react";
import { formatAud } from "@/lib/tiers";
import { StatusChip, Takeaway, DemoHeader } from "./DemoChrome";
import { Monogram } from "./CallUI";
import { useDemoMotion, useChatAutoScroll, FRAME_H } from "./motion";

/**
 * Advanced Strata — Internal Quoting Tool (upsell demo).
 * Adapted from QuotingDemo: same chat window, typing dots, option buttons and
 * document-style quote sheet — but retuned for a STRATA INSPECTION business, not
 * a tradie. It's a deterministic, no-LLM staff tool: pick service → turnaround →
 * property, then it "prints" an itemised quote onto a document sheet.
 *
 * Every figure comes purely from PRICING below — Advanced Strata's ONLY real
 * published rates (pre-purchase report: $320 base, $360 urgent, +$50 admin for
 * multi-lot, GST 10%). The other two services have no published price, so the
 * tool refuses to invent one and instead flags them "Price on assessment —
 * flagged for Matthew" — the same "never guesses" guardrail the receptionist
 * demo shows, as a feature not a gap. No internal margin view (a service
 * business has no parts-markup margin to reveal).
 */

const BASE = 320; // pre-purchase report base (ex GST)
const URGENT_SURCHARGE = 40; // $320 -> $360 for the urgent (48hr) tier
const MULTI_LOT_ADMIN = 50; // illustrative admin fee for multi-lot / large schemes
const GST_RATE = 0.1; // Advanced Strata charges GST — shown as a line

type ServiceId = "prepurchase" | "review" | "section108";
type TurnaroundId = "standard" | "urgent";
type PropertyId = "single" | "multi";

type Service = { id: ServiceId; name: string; priced: boolean; blurb: string };

/** The three services. Only the pre-purchase report has a published price. */
const SERVICES: Service[] = [
  { id: "prepurchase", name: "Pre-purchase strata report", priced: true, blurb: "Full pre-purchase inspection report" },
  { id: "review", name: "Strata report review", priced: false, blurb: "Review of an existing report" },
  { id: "section108", name: "Section 108 inspection", priced: false, blurb: "Section 108 works inspection" },
];

const TURNAROUNDS: { id: TurnaroundId; name: string; line: string }[] = [
  { id: "standard", name: "Standard (1–3 business days)", line: "Standard — 1–3 business days" },
  { id: "urgent", name: "Urgent (48 hours)", line: "Urgent — back within 48 hours" },
];

const PROPERTIES: { id: PropertyId; name: string }[] = [
  { id: "single", name: "Single lot (residential)" },
  { id: "multi", name: "Multi-lot / large scheme" },
];

type Quote = {
  base: number;
  urgent: number;
  admin: number;
  subtotal: number;
  gst: number;
  total: number;
};

/** Deterministic price for the pre-purchase report only, straight from PRICING. */
function buildQuote(turnaround: TurnaroundId, property: PropertyId): Quote {
  const base = BASE;
  const urgent = turnaround === "urgent" ? URGENT_SURCHARGE : 0;
  const admin = property === "multi" ? MULTI_LOT_ADMIN : 0;
  const subtotal = base + urgent + admin;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;
  return { base, urgent, admin, subtotal, gst, total };
}

type Msg = { role: "agent" | "user"; text: string; at: string };
type Phase = "service" | "turnaround" | "property" | "typing" | "quote";

const INITIAL_LOG: Msg[] = [
  { role: "agent", text: "Advanced Strata — internal quoting tool. Tell me the job and I'll price it from our published rates on the spot.", at: "now" },
  { role: "agent", text: "First up — what's the service?", at: "now" },
];

const typingDelay = () => 500 + Math.round(Math.random() * 300); // 500–800ms cadence

function nowLabel() {
  const d = new Date();
  let h = d.getHours();
  const mer = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${d.getMinutes().toString().padStart(2, "0")} ${mer}`;
}

export default function AdvancedStrataQuotingDemo() {
  const m = useDemoMotion();
  const [log, setLog] = useState<Msg[]>(INITIAL_LOG);
  const [phase, setPhase] = useState<Phase>("service");
  const [service, setService] = useState<Service | null>(null);
  const [turnaround, setTurnaround] = useState<TurnaroundId | null>(null);
  const [property, setProperty] = useState<PropertyId | null>(null);
  const [showRates, setShowRates] = useState(false);
  const chat = useChatAutoScroll(`${log.length}-${phase}`, !m.reduce);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const advance = (userText: string, agentText: string, nextPhase: Phase) => {
    setLog((l) => [...l, { role: "user", text: userText, at: nowLabel() }]);
    setPhase("typing");
    timers.current.push(
      window.setTimeout(() => {
        setLog((l) => [...l, { role: "agent", text: agentText, at: nowLabel() }]);
        setPhase(nextPhase);
      }, typingDelay())
    );
  };

  const pickService = (s: Service) => {
    setService(s);
    advance(s.name, "Got it. What turnaround does the client need?", "turnaround");
  };

  const pickTurnaround = (t: TurnaroundId) => {
    setTurnaround(t);
    const name = TURNAROUNDS.find((x) => x.id === t)!.name;
    advance(name, "And what kind of property is it?", "property");
  };

  const pickProperty = (p: PropertyId) => {
    setProperty(p);
    const name = PROPERTIES.find((x) => x.id === p)!.name;
    setLog((l) => [...l, { role: "user", text: name, at: nowLabel() }]);
    setPhase("typing");
    const priced = service?.priced;
    timers.current.push(
      window.setTimeout(() => {
        setLog((l) => [
          ...l,
          {
            role: "agent",
            text: priced ? "Done — here's the itemised quote:" : "This one doesn't have a fixed published price — I've flagged it for Matthew rather than guessing:",
            at: nowLabel(),
          },
        ]);
        setPhase("quote");
      }, typingDelay())
    );
  };

  const restart = () => {
    clearTimers();
    setLog(INITIAL_LOG);
    setPhase("service");
    setService(null);
    setTurnaround(null);
    setProperty(null);
  };

  const priced = !!service?.priced;
  const quote = service && priced && turnaround && property && phase === "quote" ? buildQuote(turnaround, property) : null;
  const turnaroundLine = turnaround ? TURNAROUNDS.find((x) => x.id === turnaround)!.line : "";
  const propertyName = property ? PROPERTIES.find((x) => x.id === property)!.name : "";

  const optionBtnStyle: React.CSSProperties = {
    background: "var(--color-bg-card)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border-strong)",
    borderRadius: "0.7rem",
    padding: "0.6rem 0.85rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  };

  // Document-sheet line items for the priced quote (printed staggered).
  const sheetRows: { label: string; value: string; note?: boolean }[] = [];
  if (quote) {
    sheetRows.push({ label: "Pre-purchase strata report (base)", value: formatAud(quote.base) });
    if (quote.urgent > 0) sheetRows.push({ label: "Urgent turnaround surcharge", value: `+${formatAud(quote.urgent)}` });
    if (quote.admin > 0) sheetRows.push({ label: "Admin fee — multi-lot (illustrative)", value: `+${formatAud(quote.admin)}`, note: true });
    sheetRows.push({ label: "GST (10%)", value: formatAud(quote.gst) });
  }

  const atQuote = phase === "quote";

  return (
    <div style={{ maxWidth: "27rem", margin: "0 auto", width: "100%" }}>
      {/* Comprehension chip */}
      <DemoHeader>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {atQuote ? (
            priced ? <StatusChip tone="success">Quote ready ✓</StatusChip> : <StatusChip tone="muted">Flagged for Matthew ✓</StatusChip>
          ) : (
            <StatusChip tone="muted">Pick a job — priced from published rates</StatusChip>
          )}
        </div>
      </DemoHeader>

      {/* Desktop app window */}
      <div style={{ height: FRAME_H, background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "0.9rem", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px var(--color-phone-shadow-soft)" }}>
        {/* Title bar */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 0.8rem", background: "var(--color-bg-subtle)", borderBottom: "1px solid var(--color-border)" }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--color-win-close)" }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--color-win-min)" }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--color-win-max)" }} />
          <p style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", pointerEvents: "none" }}>
            Advanced Strata — Internal Quoting
          </p>
        </div>

        {/* Body: sidebar + main */}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* Thin sidebar hint */}
          <div style={{ width: 46, flexShrink: 0, background: "var(--color-bg-section)", borderRight: "1px solid var(--color-border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", padding: "0.8rem 0" }}>
            {[
              { icon: <ChatText size={16} weight="fill" />, active: true },
              { icon: <FileText size={16} weight="fill" />, active: false },
              { icon: <GridFour size={16} weight="fill" />, active: false },
              { icon: <Gear size={16} weight="fill" />, active: false },
            ].map((s, i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: "0.55rem", display: "flex", alignItems: "center", justifyContent: "center", background: s.active ? "var(--color-accent-soft)" : "transparent", color: s.active ? "var(--color-accent)" : "var(--color-text-faint)" }}>
                {s.icon}
              </div>
            ))}
          </div>

          {/* Main column */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            {/* Chat header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.7rem 0.9rem", borderBottom: "1px solid var(--color-border)" }}>
              <Monogram size={30} label="AS" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>Advanced Strata</p>
                <p style={{ fontSize: "0.64rem", color: "var(--color-text-faint)" }}>Internal quoting tool</p>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.64rem", color: "var(--color-accent)", fontWeight: 700 }}>
                <span className="gv-pulse" style={{ width: 7, height: 7, borderRadius: 999, background: "var(--color-accent)", display: "inline-block" }} />
                staff only
              </span>
            </div>

            {/* Chat (internal scroll) */}
            <div ref={chat.ref} onScroll={chat.onScroll} onWheel={chat.onWheel} data-demo-scroll="as-quoting" style={{ flex: 1, overflowY: "auto", padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem", background: "var(--color-bg-section)", minHeight: 0 }}>
              <AnimatePresence initial={false}>
                {log.map((msg, i) => {
                  const isAgent = msg.role === "agent";
                  return (
                    <motion.div key={i} initial={m.bubble.initial} animate={m.bubble.animate} transition={m.bubble.transition} style={{ alignSelf: isAgent ? "flex-start" : "flex-end", maxWidth: "85%" }}>
                      <div
                        style={{
                          background: isAgent ? "var(--color-bg-card)" : "var(--color-accent)",
                          border: isAgent ? "1px solid var(--color-border)" : "none",
                          color: isAgent ? "var(--color-text)" : "var(--color-on-accent)",
                          borderRadius: "0.9rem",
                          borderBottomLeftRadius: isAgent ? "0.25rem" : "0.9rem",
                          borderBottomRightRadius: isAgent ? "0.9rem" : "0.25rem",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.8rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.text}
                      </div>
                      <p style={{ fontSize: "0.56rem", color: "var(--color-text-faint)", marginTop: "0.15rem", textAlign: isAgent ? "left" : "right", paddingInline: "0.3rem" }}>{msg.at}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing indicator */}
              {phase === "typing" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: "flex-start" }}>
                  <div style={{ display: "flex", gap: "0.25rem", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "0.9rem", padding: "0.6rem 0.8rem" }}>
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={m.reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                        style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-text-faint)", display: "inline-block" }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quote document sheet (priced) */}
              <AnimatePresence>
                {atQuote && quote && service && (
                  <motion.div
                    initial={m.card.initial}
                    animate={m.card.animate}
                    transition={m.card.transition}
                    style={{ alignSelf: "stretch", background: "var(--color-bg-card)", border: "1px solid var(--color-border-strong)", borderRadius: "0.5rem", padding: "1rem 1.05rem", marginTop: "0.3rem", boxShadow: "0 10px 26px var(--color-phone-shadow-soft)" }}
                  >
                    {/* Letterhead */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.6rem", marginBottom: "0.7rem" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Advanced Strata</p>
                        <p style={{ fontSize: "0.62rem", color: "var(--color-text-faint)", marginTop: "0.1rem" }}>Strata inspection reports · NSW</p>
                      </div>
                      <span style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--color-accent)", border: "1px solid var(--color-accent-border-soft)", borderRadius: "0.4rem", padding: "0.2rem 0.4rem", whiteSpace: "nowrap" }}>QUOTE</span>
                    </div>

                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-bright)", marginBottom: "0.15rem" }}>{service.name}</p>
                    <p style={{ fontSize: "0.66rem", color: "var(--color-text-muted)", marginBottom: "0.55rem" }}>{propertyName} · {turnaroundLine}</p>

                    {sheetRows.map((r, i) => (
                      <motion.div
                        key={r.label}
                        initial={m.reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: m.reduce ? 0 : 0.18 + i * 0.12, ease: [0.32, 0.72, 0, 1] }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.22rem 0" }}
                      >
                        <span style={{ fontSize: "0.76rem", color: "var(--color-text-muted)" }}>{r.label}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--color-text)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: m.reduce ? 0 : 0.18 + sheetRows.length * 0.12 }}
                    >
                      <div style={{ height: 1, background: "var(--color-border-strong)", margin: "0.6rem 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)" }}>Total (inc. GST)</span>
                        <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-accent)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{formatAud(quote.total)}</span>
                      </div>
                      {quote.admin > 0 && (
                        <p style={{ fontSize: "0.6rem", color: "var(--color-text-faint)", marginTop: "0.45rem", lineHeight: 1.5 }}>
                          The multi-lot admin fee is illustrative — final schemes are confirmed with Matthew.
                        </p>
                      )}
                      <p style={{ fontSize: "0.6rem", color: "var(--color-text-faint)", marginTop: "0.6rem", lineHeight: 1.5, borderTop: "1px dashed var(--color-border)", paddingTop: "0.5rem" }}>
                        Prepared by the Advanced Strata quoting tool · just now
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price-on-assessment sheet (no published price → flag a human) */}
              <AnimatePresence>
                {atQuote && !priced && service && (
                  <motion.div
                    initial={m.card.initial}
                    animate={m.card.animate}
                    transition={m.card.transition}
                    style={{ alignSelf: "stretch", background: "var(--color-bg-card)", border: "1px solid var(--color-border-strong)", borderRadius: "0.5rem", padding: "1rem 1.05rem", marginTop: "0.3rem", boxShadow: "0 10px 26px var(--color-phone-shadow-soft)" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.6rem", marginBottom: "0.7rem" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Advanced Strata</p>
                        <p style={{ fontSize: "0.62rem", color: "var(--color-text-faint)", marginTop: "0.1rem" }}>Strata inspection reports · NSW</p>
                      </div>
                      <span style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--color-text-muted)", border: "1px solid var(--color-border-strong)", borderRadius: "0.4rem", padding: "0.2rem 0.4rem", whiteSpace: "nowrap" }}>ON ASSESSMENT</span>
                    </div>

                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-bright)", marginBottom: "0.15rem" }}>{service.name}</p>
                    <p style={{ fontSize: "0.66rem", color: "var(--color-text-muted)", marginBottom: "0.7rem" }}>{propertyName} · {turnaroundLine}</p>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", background: "var(--color-fill-subtle)", border: "1px dashed var(--color-border-strong)", borderRadius: "0.5rem", padding: "0.7rem 0.75rem" }}>
                      <Warning size={16} weight="fill" style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "0.1rem" }} />
                      <div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text)" }}>Price on assessment</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.15rem", lineHeight: 1.5 }}>Flagged for Matthew to confirm.</p>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.66rem", color: "var(--color-text-muted)", marginTop: "0.65rem", lineHeight: 1.55 }}>
                      These vary by scope, so the tool flags them for a human rather than guessing.
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "var(--color-text-faint)", marginTop: "0.6rem", lineHeight: 1.5, borderTop: "1px dashed var(--color-border)", paddingTop: "0.5rem" }}>
                      Prepared by the Advanced Strata quoting tool · just now
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Option buttons */}
            <div style={{ borderTop: "1px solid var(--color-border)", padding: "0.7rem 0.85rem", background: "var(--color-bg-card)" }}>
              {phase === "service" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {SERVICES.map((s) => (
                    <button key={s.id} onClick={() => pickService(s)} style={optionBtnStyle}>{s.name}</button>
                  ))}
                </div>
              )}
              {phase === "turnaround" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {TURNAROUNDS.map((t) => (
                    <button key={t.id} onClick={() => pickTurnaround(t.id)} style={optionBtnStyle}>{t.name}</button>
                  ))}
                </div>
              )}
              {phase === "property" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {PROPERTIES.map((p) => (
                    <button key={p.id} onClick={() => pickProperty(p.id)} style={optionBtnStyle}>{p.name}</button>
                  ))}
                </div>
              )}
              {phase === "typing" && (
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", textAlign: "center", padding: "0.4rem 0" }}>Pricing it up…</p>
              )}
              {phase === "quote" && (
                <button
                  onClick={restart}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", width: "100%", background: "var(--color-accent)", color: "var(--color-on-accent)", border: "none", borderRadius: "0.7rem", padding: "0.65rem", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                >
                  <ArrowClockwise size={14} weight="bold" /> Start another quote
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible published-rate list — honesty / transparency */}
      <div style={{ marginTop: "0.75rem", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "0.85rem", overflow: "hidden" }}>
        <button
          onClick={() => setShowRates((s) => !s)}
          aria-expanded={showRates}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", padding: "0.7rem 0.9rem", cursor: "pointer", fontSize: "0.76rem", fontWeight: 600, color: "var(--color-text-muted)" }}
        >
          The published rates this tool uses
          <motion.span animate={{ rotate: showRates ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "inline-flex" }}>
            <CaretDown size={14} weight="bold" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {showRates && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              <div style={{ padding: "0 0.9rem 0.9rem", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Service</th>
                      <th style={thStyleR}>Rate (ex GST)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>Pre-purchase report — standard</td>
                      <td style={tdStyleR}>{formatAud(BASE)}</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Pre-purchase report — urgent (48hr)</td>
                      <td style={tdStyleR}>{formatAud(BASE + URGENT_SURCHARGE)}</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Multi-lot / large scheme</td>
                      <td style={tdStyleR}>+{formatAud(MULTI_LOT_ADMIN)} admin</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Strata report review</td>
                      <td style={tdStyleR}>On assessment</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Section 108 inspection</td>
                      <td style={tdStyleR}>On assessment</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: "0.6rem", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                  GST added at <strong style={{ color: "var(--color-text)" }}>10%</strong>. The multi-lot admin fee is illustrative; the two &ldquo;on assessment&rdquo; services are flagged for Matthew rather than auto-priced.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {atQuote && (
        <Takeaway>
          {priced
            ? "An itemised, GST-inclusive quote in seconds — straight from your published rates, no maths, no guessing."
            : "When there's no set price, it flags the job for you instead of inventing a number — the same guardrail as your phone assistant."}
        </Takeaway>
      )}

      {/* Custom fiction/label — internal tool, honest prices, illustrative details */}
      <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--color-text-faint)", marginTop: "0.9rem", lineHeight: 1.5 }}>
        Demo — an internal example tool for Advanced Strata. Prices are their real published figures; property details are illustrative.
      </p>
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: "left", padding: "0.4rem 0.3rem", borderBottom: "1px solid var(--color-border-strong)", color: "var(--color-text-faint)", fontWeight: 700, fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.04em" };
const thStyleR: React.CSSProperties = { ...thStyle, textAlign: "right" };
const tdStyle: React.CSSProperties = { padding: "0.35rem 0.3rem", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-muted)" };
const tdStyleR: React.CSSProperties = { ...tdStyle, textAlign: "right", color: "var(--color-text)", fontWeight: 600 };
