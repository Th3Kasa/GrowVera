"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowClockwise, CaretDown, FileText, GridFour, ChatText, Gear } from "@phosphor-icons/react";
import { formatAud } from "@/lib/tiers";
import { FictionLabel, AuditCTA, StatusChip, Takeaway, DemoHeader } from "./DemoChrome";
import { Monogram } from "./CallUI";
import { useDemoMotion, useChatAutoScroll, FRAME_H } from "./motion";

/**
 * "Build a quote yourself" — Demo 3.
 * A deterministic, no-LLM quoting tool rendered as a desktop app window for the
 * fictional Harbourline Plumbing: pick job type → detail → urgency, then the
 * agent chat-types and "prints" an itemised quote onto a document sheet. Every
 * number is derived purely from the visible mock PRICE_LIST below, so the demo
 * can never quote something the price list doesn't back. The maths (LABOUR_RATE,
 * CALL_OUT_FEE, PRIORITY_SURCHARGE, JOB_TYPES, URGENCY, buildQuote) is unchanged
 * — 12 deterministic totals.
 */

const LABOUR_RATE = 110; // $/hour
const CALL_OUT_FEE = 60; // flat call-out
const PRIORITY_SURCHARGE = 60; // same-day priority

type JobTypeId = "tap" | "hotwater" | "drain";
type UrgencyId = "standard" | "priority";

type Variant = {
  id: string;
  name: string;
  itemLabel: string;
  partCost: number;
  labourHours: number;
  equipment: number;
  equipmentLabel?: string;
};

type JobType = {
  id: JobTypeId;
  name: string;
  variants: Variant[];
};

/** Mock price list — the exact numbers this demo quotes from. */
const JOB_TYPES: JobType[] = [
  {
    id: "tap",
    name: "Leaking tap / mixer replacement",
    variants: [
      { id: "standard-mixer", name: "Standard mixer ($89 part)", itemLabel: "Standard mixer (part)", partCost: 89, labourHours: 1.0, equipment: 0 },
      { id: "premium-mixer", name: "Premium mixer ($189 part)", itemLabel: "Premium mixer (part)", partCost: 189, labourHours: 1.0, equipment: 0 },
    ],
  },
  {
    id: "hotwater",
    name: "Hot water system replacement",
    variants: [
      { id: "electric-250", name: "Electric storage 250L ($1,150 unit)", itemLabel: "Electric storage 250L (unit)", partCost: 1150, labourHours: 3.5, equipment: 0 },
      { id: "gas-flow", name: "Gas continuous flow ($1,420 unit)", itemLabel: "Gas continuous flow (unit)", partCost: 1420, labourHours: 3.5, equipment: 0 },
    ],
  },
  {
    id: "drain",
    name: "Blocked drain",
    variants: [
      { id: "single", name: "Single fixture blockage", itemLabel: "Single fixture blockage", partCost: 0, labourHours: 1.5, equipment: 0 },
      { id: "main", name: "Main line (jetter required, +$180 equipment)", itemLabel: "Main line clearance", partCost: 0, labourHours: 2.5, equipment: 180, equipmentLabel: "Jetter equipment" },
    ],
  },
];

const URGENCY: { id: UrgencyId; name: string }[] = [
  { id: "standard", name: "Standard (next available)" },
  { id: "priority", name: "Priority same-day (+$60)" },
];

type Quote = {
  variant: Variant;
  labourCost: number;
  callOut: number;
  priority: number;
  total: number;
};

function buildQuote(jobType: JobType, variant: Variant, urgency: UrgencyId): Quote {
  const labourCost = variant.labourHours * LABOUR_RATE;
  const priority = urgency === "priority" ? PRIORITY_SURCHARGE : 0;
  const total = variant.partCost + labourCost + CALL_OUT_FEE + variant.equipment + priority;
  return { variant, labourCost, callOut: CALL_OUT_FEE, priority, total };
}

type Msg = { role: "agent" | "user"; text: string; at: string };
type Phase = "job" | "detail" | "urgency" | "typing" | "quote";

const INITIAL_LOG: Msg[] = [
  { role: "agent", text: "Hi — this is the Harbourline Plumbing quoting tool. Tell me a couple of things and I'll price the job on the spot.", at: "now" },
  { role: "agent", text: "First up — what's the job?", at: "now" },
];

const typingDelay = () => 500 + Math.round(Math.random() * 300); // 500–800ms cadence

function nowLabel() {
  const d = new Date();
  let h = d.getHours();
  const mer = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${d.getMinutes().toString().padStart(2, "0")} ${mer}`;
}

export default function QuotingDemo() {
  const m = useDemoMotion();
  const [log, setLog] = useState<Msg[]>(INITIAL_LOG);
  const [phase, setPhase] = useState<Phase>("job");
  const [jobType, setJobType] = useState<JobType | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [urgency, setUrgency] = useState<UrgencyId | null>(null);
  const [showPrices, setShowPrices] = useState(false);
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

  const pickJob = (jt: JobType) => {
    setJobType(jt);
    advance(jt.name, "Got it. Which option are we going with?", "detail");
  };

  const pickVariant = (v: Variant) => {
    setVariant(v);
    advance(v.name, "And how soon do you need it done?", "urgency");
  };

  const pickUrgency = (u: UrgencyId) => {
    setUrgency(u);
    const name = URGENCY.find((x) => x.id === u)!.name;
    setLog((l) => [...l, { role: "user", text: name, at: nowLabel() }]);
    setPhase("typing");
    timers.current.push(
      window.setTimeout(() => {
        setLog((l) => [...l, { role: "agent", text: "Done — here's your itemised quote:", at: nowLabel() }]);
        setPhase("quote");
      }, typingDelay())
    );
  };

  const restart = () => {
    clearTimers();
    setLog(INITIAL_LOG);
    setPhase("job");
    setJobType(null);
    setVariant(null);
    setUrgency(null);
  };

  const quote = jobType && variant && urgency && phase === "quote" ? buildQuote(jobType, variant, urgency) : null;

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

  // Document-sheet line items (printed staggered).
  const sheetRows: { label: string; value: string }[] = [];
  if (quote && variant) {
    if (variant.partCost > 0) sheetRows.push({ label: variant.itemLabel, value: formatAud(variant.partCost) });
    sheetRows.push({ label: `Labour (${variant.labourHours}h × ${formatAud(LABOUR_RATE)}/h)`, value: formatAud(quote.labourCost) });
    sheetRows.push({ label: "Call-out fee", value: formatAud(quote.callOut) });
    if (variant.equipment > 0) sheetRows.push({ label: variant.equipmentLabel ?? "Equipment", value: `+${formatAud(variant.equipment)}` });
    if (quote.priority > 0) sheetRows.push({ label: "Priority same-day surcharge", value: `+${formatAud(quote.priority)}` });
  }

  return (
    <div style={{ maxWidth: "27rem", margin: "0 auto", width: "100%" }}>
      {/* Comprehension chip */}
      <DemoHeader>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {phase === "quote" ? <StatusChip tone="success">Quote ready ✓</StatusChip> : <StatusChip tone="muted">Pick a job — priced in seconds</StatusChip>}
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
            Harbourline Plumbing — Quoting
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
              <Monogram size={30} label="HP" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>Harbourline Plumbing</p>
                <p style={{ fontSize: "0.64rem", color: "var(--color-text-faint)" }}>Quoting assistant</p>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.64rem", color: "var(--color-accent)", fontWeight: 700 }}>
                <span className="gv-pulse" style={{ width: 7, height: 7, borderRadius: 999, background: "var(--color-accent)", display: "inline-block" }} />
                online
              </span>
            </div>

            {/* Chat (internal scroll) */}
            <div ref={chat.ref} onScroll={chat.onScroll} onWheel={chat.onWheel} data-demo-scroll="quoting" style={{ flex: 1, overflowY: "auto", padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem", background: "var(--color-bg-section)", minHeight: 0 }}>
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

              {/* Quote document sheet */}
              <AnimatePresence>
                {quote && jobType && variant && (
                  <motion.div
                    initial={m.card.initial}
                    animate={m.card.animate}
                    transition={m.card.transition}
                    style={{ alignSelf: "stretch", background: "var(--color-bg-card)", border: "1px solid var(--color-border-strong)", borderRadius: "0.5rem", padding: "1rem 1.05rem", marginTop: "0.3rem", boxShadow: "0 10px 26px var(--color-phone-shadow-soft)" }}
                  >
                    {/* Letterhead */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.6rem", marginBottom: "0.7rem" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Harbourline Plumbing</p>
                        <p style={{ fontSize: "0.62rem", color: "var(--color-text-faint)", marginTop: "0.1rem" }}>Licensed plumbing services · Sydney</p>
                      </div>
                      <span style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--color-accent)", border: "1px solid var(--color-accent-border-soft)", borderRadius: "0.4rem", padding: "0.2rem 0.4rem", whiteSpace: "nowrap" }}>QUOTE</span>
                    </div>

                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-bright)", marginBottom: "0.5rem" }}>
                      {jobType.name} · {variant.name.replace(/\s*\(.*\)\s*$/, "")}
                    </p>

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
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)" }}>Total (inc. parts &amp; labour)</span>
                        <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-accent)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{formatAud(quote.total)}</span>
                      </div>
                      <p style={{ fontSize: "0.6rem", color: "var(--color-text-faint)", marginTop: "0.6rem", lineHeight: 1.5, borderTop: "1px dashed var(--color-border)", paddingTop: "0.5rem" }}>
                        Prepared by the Harbourline quoting tool · just now
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Option buttons */}
            <div style={{ borderTop: "1px solid var(--color-border)", padding: "0.7rem 0.85rem", background: "var(--color-bg-card)" }}>
              {phase === "job" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {JOB_TYPES.map((jt) => (
                    <button key={jt.id} onClick={() => pickJob(jt)} style={optionBtnStyle}>{jt.name}</button>
                  ))}
                </div>
              )}
              {phase === "detail" && jobType && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {jobType.variants.map((v) => (
                    <button key={v.id} onClick={() => pickVariant(v)} style={optionBtnStyle}>{v.name}</button>
                  ))}
                </div>
              )}
              {phase === "urgency" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {URGENCY.map((u) => (
                    <button key={u.id} onClick={() => pickUrgency(u.id)} style={optionBtnStyle}>{u.name}</button>
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

      {/* Collapsible mock price list — honesty / transparency */}
      <div style={{ marginTop: "0.75rem", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "0.85rem", overflow: "hidden" }}>
        <button
          onClick={() => setShowPrices((s) => !s)}
          aria-expanded={showPrices}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", padding: "0.7rem 0.9rem", cursor: "pointer", fontSize: "0.76rem", fontWeight: 600, color: "var(--color-text-muted)" }}
        >
          The mock price list this demo uses
          <motion.span animate={{ rotate: showPrices ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "inline-flex" }}>
            <CaretDown size={14} weight="bold" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {showPrices && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              <div style={{ padding: "0 0.9rem 0.9rem", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Job</th>
                      <th style={thStyle}>Option</th>
                      <th style={thStyleR}>Part / unit</th>
                      <th style={thStyleR}>Labour</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JOB_TYPES.map((jt) =>
                      jt.variants.map((v, vi) => (
                        <tr key={jt.id + v.id}>
                          <td style={tdStyle}>{vi === 0 ? jt.name : ""}</td>
                          <td style={tdStyle}>
                            {v.itemLabel}
                            {v.equipment > 0 ? ` (+${formatAud(v.equipment)} equip.)` : ""}
                          </td>
                          <td style={tdStyleR}>{v.partCost > 0 ? formatAud(v.partCost) : "—"}</td>
                          <td style={tdStyleR}>{v.labourHours}h</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.35rem 1rem", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                  <span>Labour: <strong style={{ color: "var(--color-text)" }}>{formatAud(LABOUR_RATE)}/h</strong></span>
                  <span>Call-out: <strong style={{ color: "var(--color-text)" }}>{formatAud(CALL_OUT_FEE)}</strong></span>
                  <span>Priority same-day: <strong style={{ color: "var(--color-text)" }}>+{formatAud(PRIORITY_SURCHARGE)}</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === "quote" && <Takeaway>A priced, itemised quote in seconds — while the lead is still on your website.</Takeaway>}
      <FictionLabel business="Harbourline Plumbing" />
      <AuditCTA prompt="Want instant quoting for YOUR business?" />
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: "left", padding: "0.4rem 0.3rem", borderBottom: "1px solid var(--color-border-strong)", color: "var(--color-text-faint)", fontWeight: 700, fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.04em" };
const thStyleR: React.CSSProperties = { ...thStyle, textAlign: "right" };
const tdStyle: React.CSSProperties = { padding: "0.35rem 0.3rem", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-muted)" };
const tdStyleR: React.CSSProperties = { ...tdStyle, textAlign: "right", color: "var(--color-text)", fontWeight: 600 };
