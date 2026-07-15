"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, ArrowClockwise, CaretDown, Receipt } from "@phosphor-icons/react";
import { formatAud } from "@/lib/tiers";
import { FictionLabel, AuditCTA } from "./DemoChrome";

/**
 * "Get a sample quote yourself" — Demo 3.
 * Fully deterministic, no LLM. A scripted decision-tree chat for the fictional
 * "Sample Plumbing Co" internal quoting tool: pick job type → job detail →
 * urgency, then the agent chat-types an itemised quote computed purely from the
 * visible mock PRICE_LIST below. Every number the card shows is derived from
 * that table, so the demo can never quote something the price list doesn't back.
 */

const LABOUR_RATE = 110; // $/hour
const CALL_OUT_FEE = 60; // flat call-out
const PRIORITY_SURCHARGE = 60; // same-day priority

type JobTypeId = "tap" | "hotwater" | "drain";
type UrgencyId = "standard" | "priority";

type Variant = {
  id: string;
  /** Button label shown in step 2. */
  name: string;
  /** Line label used on the quote card + price list for the part/unit. */
  itemLabel: string;
  /** Cost of the part or unit (0 = no part line, e.g. drain clears). */
  partCost: number;
  labourHours: number;
  /** Extra equipment surcharge (0 = none). */
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

type Msg = { role: "agent" | "user"; text: string };
type Phase = "job" | "detail" | "urgency" | "typing" | "quote";

const INITIAL_LOG: Msg[] = [
  { role: "agent", text: "Hi — this is the Sample Plumbing Co quoting tool. Tell me a couple of things and I'll price the job on the spot." },
  { role: "agent", text: "First up — what's the job?" },
];

export default function QuotingDemo() {
  const [log, setLog] = useState<Msg[]>(INITIAL_LOG);
  const [phase, setPhase] = useState<Phase>("job");
  const [jobType, setJobType] = useState<JobType | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [urgency, setUrgency] = useState<UrgencyId | null>(null);
  const [showPrices, setShowPrices] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, phase]);

  const advance = (userText: string, agentText: string, nextPhase: Phase) => {
    setLog((l) => [...l, { role: "user", text: userText }]);
    setPhase("typing");
    timers.current.push(
      window.setTimeout(() => {
        setLog((l) => [...l, { role: "agent", text: agentText }]);
        setPhase(nextPhase);
      }, 480)
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
    setLog((l) => [...l, { role: "user", text: name }]);
    setPhase("typing");
    timers.current.push(
      window.setTimeout(() => {
        setLog((l) => [...l, { role: "agent", text: "Done — here's your itemised quote:" }]);
        setPhase("quote");
      }, 620)
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

  return (
    <div style={{ maxWidth: "27rem", margin: "0 auto", width: "100%" }}>
      <div
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "1.25rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: "460px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-subtle)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "0.6rem", background: "var(--color-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wrench size={17} weight="fill" style={{ color: "var(--color-accent)" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>Sample Plumbing Co</p>
            <p style={{ fontSize: "0.66rem", color: "var(--color-text-faint)" }}>Internal quoting tool</p>
          </div>
        </div>

        {/* Chat */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0.9rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <AnimatePresence initial={false}>
            {log.map((m, i) => {
              const isAgent = m.role === "agent";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
                  style={{ alignSelf: isAgent ? "flex-start" : "flex-end", maxWidth: "85%" }}
                >
                  <div
                    style={{
                      background: isAgent ? "var(--color-bg-subtle)" : "var(--color-accent)",
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
                    {m.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing indicator */}
          {phase === "typing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: "flex-start" }}>
              <div style={{ display: "flex", gap: "0.25rem", background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", borderRadius: "0.9rem", padding: "0.6rem 0.8rem" }}>
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                    style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-text-faint)", display: "inline-block" }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Quote card */}
          <AnimatePresence>
            {quote && jobType && variant && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                style={{ alignSelf: "stretch", background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border)", borderRadius: "0.9rem", padding: "0.95rem 1rem", marginTop: "0.3rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
                  <Receipt size={15} weight="fill" style={{ color: "var(--color-accent)" }} />
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text)" }}>
                    {jobType.name} · {variant.name.replace(/\s*\(.*\)\s*$/, "")}
                  </p>
                </div>

                {variant.partCost > 0 && <Row label={variant.itemLabel} value={formatAud(variant.partCost)} />}
                <Row label={`Labour (${variant.labourHours}h × ${formatAud(LABOUR_RATE)}/h)`} value={formatAud(quote.labourCost)} />
                <Row label="Call-out fee" value={formatAud(quote.callOut)} />
                {variant.equipment > 0 && <Row label={variant.equipmentLabel ?? "Equipment"} value={`+${formatAud(variant.equipment)}`} />}
                {quote.priority > 0 && <Row label="Priority same-day surcharge" value={`+${formatAud(quote.priority)}`} />}

                <div style={{ height: 1, background: "var(--color-accent-border)", margin: "0.55rem 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)" }}>Total (inc. parts &amp; labour)</span>
                  <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-accent)", letterSpacing: "-0.02em" }}>{formatAud(quote.total)}</span>
                </div>
                <p style={{ fontSize: "0.66rem", color: "var(--color-text-faint)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                  Illustrative only — prices belong to the fictional demo business.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Option buttons */}
        <div style={{ borderTop: "1px solid var(--color-border)", padding: "0.75rem 0.85rem" }}>
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
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                width: "100%",
                background: "var(--color-accent)",
                color: "var(--color-on-accent)",
                border: "none",
                borderRadius: "0.7rem",
                padding: "0.65rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <ArrowClockwise size={14} weight="bold" /> Start another quote
            </button>
          )}
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
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden" }}
            >
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

      <FictionLabel business="Sample Plumbing Co" />
      <AuditCTA prompt="Want instant quoting for YOUR business?" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.2rem 0" }}>
      <span style={{ fontSize: "0.76rem", color: "var(--color-text-muted)" }}>{label}</span>
      <span style={{ fontSize: "0.8rem", color: "var(--color-text)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: "left", padding: "0.4rem 0.3rem", borderBottom: "1px solid var(--color-border-strong)", color: "var(--color-text-faint)", fontWeight: 700, fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.04em" };
const thStyleR: React.CSSProperties = { ...thStyle, textAlign: "right" };
const tdStyle: React.CSSProperties = { padding: "0.35rem 0.3rem", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-muted)" };
const tdStyleR: React.CSSProperties = { ...tdStyle, textAlign: "right", color: "var(--color-text)", fontWeight: 600 };
