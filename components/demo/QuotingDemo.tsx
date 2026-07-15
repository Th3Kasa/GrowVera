"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, ArrowClockwise, CaretDown, Receipt } from "@phosphor-icons/react";
import { formatAud } from "@/lib/tiers";
import { FictionLabel, AuditCTA } from "./DemoChrome";

/**
 * "Get a sample quote yourself" — Demo 3.
 * Fully deterministic, no LLM. A scripted decision-tree chat for the fictional
 * "Sample Mobile Mechanics": pick vehicle → job → urgency, then the agent
 * chat-types an itemised quote from the visible mock PRICE_LIST below.
 */

const LABOUR_RATE = 110; // $/hour
const TRAVEL_FEE = 40; // flat call-out
const PRIORITY_SURCHARGE = 60; // same-day priority

type VehicleId = "civic" | "hilux" | "mazda3";
type JobId = "brakes" | "battery" | "service";
type UrgencyId = "standard" | "priority";

const VEHICLES: { id: VehicleId; name: string }[] = [
  { id: "civic", name: "2017 Honda Civic" },
  { id: "hilux", name: "2020 Toyota Hilux" },
  { id: "mazda3", name: "2015 Mazda 3" },
];

const JOBS: { id: JobId; name: string; labourHours: number }[] = [
  { id: "brakes", name: "Front brake pads & rotors", labourHours: 2.5 },
  { id: "battery", name: "Battery replacement", labourHours: 1.5 },
  { id: "service", name: "General service", labourHours: 2.0 },
];

const URGENCY: { id: UrgencyId; name: string }[] = [
  { id: "standard", name: "Standard (this week)" },
  { id: "priority", name: "Priority — same day (+$60)" },
];

/** Mock parts price list — the exact numbers this demo quotes from. */
const PARTS: Record<JobId, { name: string; price: Record<VehicleId, number> }[]> = {
  brakes: [
    { name: "Front brake pads (set)", price: { civic: 120, hilux: 160, mazda3: 110 } },
    { name: "Front rotors (pair)", price: { civic: 180, hilux: 260, mazda3: 170 } },
  ],
  battery: [{ name: "Replacement battery", price: { civic: 220, hilux: 320, mazda3: 200 } }],
  service: [
    { name: "Oil + oil filter", price: { civic: 90, hilux: 120, mazda3: 85 } },
    { name: "Air + cabin filters", price: { civic: 50, hilux: 60, mazda3: 45 } },
  ],
};

type Quote = {
  parts: { name: string; price: number }[];
  partsSubtotal: number;
  labourHours: number;
  labourCost: number;
  travel: number;
  priority: number;
  total: number;
};

function buildQuote(vehicle: VehicleId, jobId: JobId, urgency: UrgencyId): Quote {
  const job = JOBS.find((j) => j.id === jobId)!;
  const parts = PARTS[jobId].map((p) => ({ name: p.name, price: p.price[vehicle] }));
  const partsSubtotal = parts.reduce((s, p) => s + p.price, 0);
  const labourCost = job.labourHours * LABOUR_RATE;
  const priority = urgency === "priority" ? PRIORITY_SURCHARGE : 0;
  const total = partsSubtotal + labourCost + TRAVEL_FEE + priority;
  return { parts, partsSubtotal, labourHours: job.labourHours, labourCost, travel: TRAVEL_FEE, priority, total };
}

type Msg = { role: "agent" | "user"; text: string };
type Phase = "vehicle" | "job" | "urgency" | "typing" | "quote";

const INITIAL_LOG: Msg[] = [
  { role: "agent", text: "G'day! I'm the Sample Mobile Mechanics quoting assistant. Tell me a couple of things and I'll price it up on the spot." },
  { role: "agent", text: "First up — which vehicle are we looking at?" },
];

export default function QuotingDemo() {
  const [log, setLog] = useState<Msg[]>(INITIAL_LOG);
  const [phase, setPhase] = useState<Phase>("vehicle");
  const [vehicle, setVehicle] = useState<VehicleId | null>(null);
  const [job, setJob] = useState<JobId | null>(null);
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

  const pickVehicle = (v: VehicleId) => {
    setVehicle(v);
    const name = VEHICLES.find((x) => x.id === v)!.name;
    advance(name, `Nice — a ${name}. What's the job?`, "job");
  };

  const pickJob = (j: JobId) => {
    setJob(j);
    const name = JOBS.find((x) => x.id === j)!.name;
    advance(name, "Got it. And how soon do you need it done?", "urgency");
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
    setPhase("vehicle");
    setVehicle(null);
    setJob(null);
    setUrgency(null);
  };

  const quote = vehicle && job && urgency && phase === "quote" ? buildQuote(vehicle, job, urgency) : null;

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
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>Sample Mobile Mechanics</p>
            <p style={{ fontSize: "0.66rem", color: "var(--color-text-faint)" }}>Instant quoting assistant</p>
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
            {quote && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                style={{ alignSelf: "stretch", background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border)", borderRadius: "0.9rem", padding: "0.95rem 1rem", marginTop: "0.3rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
                  <Receipt size={15} weight="fill" style={{ color: "var(--color-accent)" }} />
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text)" }}>
                    {VEHICLES.find((v) => v.id === vehicle)!.name} · {JOBS.find((j) => j.id === job)!.name}
                  </p>
                </div>

                {quote.parts.map((p) => (
                  <Row key={p.name} label={p.name} value={formatAud(p.price)} />
                ))}
                <Row label={`Labour (${quote.labourHours}h × ${formatAud(LABOUR_RATE)}/h)`} value={formatAud(quote.labourCost)} />
                <Row label="Travel / call-out" value={formatAud(quote.travel)} />
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
          {phase === "vehicle" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {VEHICLES.map((v) => (
                <button key={v.id} onClick={() => pickVehicle(v.id)} style={optionBtnStyle}>{v.name}</button>
              ))}
            </div>
          )}
          {phase === "job" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {JOBS.map((j) => (
                <button key={j.id} onClick={() => pickJob(j.id)} style={optionBtnStyle}>{j.name}</button>
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
                      <th style={thStyle}>Part</th>
                      <th style={thStyleR}>Civic</th>
                      <th style={thStyleR}>Hilux</th>
                      <th style={thStyleR}>Mazda 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.keys(PARTS) as JobId[]).map((jid) =>
                      PARTS[jid].map((p) => (
                        <tr key={jid + p.name}>
                          <td style={tdStyle}>{p.name}</td>
                          <td style={tdStyleR}>{formatAud(p.price.civic)}</td>
                          <td style={tdStyleR}>{formatAud(p.price.hilux)}</td>
                          <td style={tdStyleR}>{formatAud(p.price.mazda3)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.35rem 1rem", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                  <span>Labour: <strong style={{ color: "var(--color-text)" }}>{formatAud(LABOUR_RATE)}/h</strong> (1.5–2.5h by job)</span>
                  <span>Travel: <strong style={{ color: "var(--color-text)" }}>{formatAud(TRAVEL_FEE)}</strong></span>
                  <span>Priority: <strong style={{ color: "var(--color-text)" }}>+{formatAud(PRIORITY_SURCHARGE)}</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FictionLabel business="Sample Mobile Mechanics" />
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
