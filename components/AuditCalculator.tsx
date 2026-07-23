"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

/**
 * Free AI Audit calculator. The visitor puts in their own numbers and we show,
 * on the page, a rough estimate of the money walking out the door on missed
 * jobs each year. Deliberately honest: it's their inputs × a close rate they
 * control, and we say plainly that we verify the real numbers together.
 *
 * Formula: missed calls/week × close rate × average job value × 52 weeks.
 */

const TRADES = [
  "Plumber",
  "Electrician",
  "Builder",
  "Landscaper",
  "Roofer",
  "Painter",
  "HVAC / Air-con",
  "Carpenter",
  "Concreter",
  "Cleaner",
  "Locksmith",
  "Real estate",
  "Other local service",
];

function formatAud(n: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}

export default function AuditCalculator() {
  const [trade, setTrade] = useState("");
  const [otherTrade, setOtherTrade] = useState(""); // free-text trade when "Other local service" selected
  const [missed, setMissed] = useState(""); // missed calls per week
  const [jobValue, setJobValue] = useState(""); // average job value $
  const [closeRate, setCloseRate] = useState(40); // %
  const [shown, setShown] = useState(false);

  const missedNum = Math.max(0, Number(missed) || 0);
  const jobNum = Math.max(0, Number(jobValue) || 0);
  const lostPerYear = Math.round(missedNum * (closeRate / 100) * jobNum * 52);

  const field: React.CSSProperties = {
    width: "100%",
    background: "var(--color-bg-section)",
    border: "1px solid var(--color-border-strong)",
    borderRadius: "0.75rem",
    padding: "0.8rem 1rem",
    color: "var(--color-text)",
    fontSize: "0.95rem",
    outline: "none",
  };
  const label: React.CSSProperties = { fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "0.35rem", display: "block" };

  const canCalc = missedNum > 0 && jobNum > 0;

  // Client-side display only: personalise the footnote when "Other" is selected.
  const otherTradeDisplay =
    trade === "Other local service" ? otherTrade.trim().slice(0, 40) : "";

  return (
    <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1.25rem", padding: "clamp(1.5rem, 4vw, 2.25rem)" }}>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))" }}>
        <div>
          <label style={label} htmlFor="calc-trade">What do you do?</label>
          <select
            style={field}
            id="calc-trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
          >
            <option value="">Choose your trade…</option>
            {TRADES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {trade === "Other local service" && (
            <div style={{ marginTop: "0.75rem" }}>
              <label style={label} htmlFor="calc-other-trade">What kind of business?</label>
              <input
                style={field}
                id="calc-other-trade"
                type="text"
                placeholder="e.g. pest control, towing, physio clinic"
                value={otherTrade}
                onChange={(e) => setOtherTrade(e.target.value)}
              />
            </div>
          )}
        </div>
        <div>
          <label style={label} htmlFor="calc-missed">Missed calls a week (your best guess)</label>
          <input
            style={field}
            id="calc-missed"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="e.g. 15"
            value={missed}
            onChange={(e) => setMissed(e.target.value)}
          />
        </div>
        <div>
          <label style={label} htmlFor="calc-job">Average job value ($)</label>
          <input
            style={field}
            id="calc-job"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="e.g. 1300"
            value={jobValue}
            onChange={(e) => setJobValue(e.target.value)}
          />
        </div>
      </div>

      {/* Close rate slider */}
      <div style={{ marginTop: "1.4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
          <label style={{ ...label, marginBottom: 0 }} htmlFor="calc-close">
            How many of those would you actually win?
          </label>
          <span style={{ color: "var(--color-accent)", fontWeight: 700, fontSize: "0.95rem" }}>{closeRate}%</span>
        </div>
        <input
          id="calc-close"
          type="range"
          min={10}
          max={80}
          step={5}
          value={closeRate}
          onChange={(e) => setCloseRate(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--color-accent)" }}
        />
        <p style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginTop: "0.35rem" }}>
          Most local businesses close 30–50% of the jobs they actually get to. Slide it to what feels right for you.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShown(true)}
        disabled={!canCalc}
        className="inline-flex items-center justify-center gap-2"
        style={{
          width: "100%",
          marginTop: "1.5rem",
          padding: "0.95rem 1.25rem",
          borderRadius: 999,
          fontSize: "0.9rem",
          fontWeight: 700,
          border: "none",
          background: canCalc ? "var(--color-accent)" : "var(--color-accent-ring)",
          color: "var(--color-on-accent)",
          cursor: canCalc ? "pointer" : "not-allowed",
        }}
      >
        Show me what I&apos;m losing <ArrowRight size={15} weight="bold" />
      </button>

      {/* Result */}
      {shown && canCalc && (
        <div
          style={{
            marginTop: "1.75rem",
            background: "var(--gradient-card-featured)",
            border: "1px solid var(--color-accent-border)",
            borderRadius: "1rem",
            padding: "clamp(1.5rem, 4vw, 2rem)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-accent)", fontWeight: 700, marginBottom: "0.75rem" }}>
            Roughly what missed calls could be costing you
          </p>
          <p
            style={{
              fontFamily: "var(--font-cabinet), Outfit, sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              fontWeight: 900,
              color: "var(--color-text)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "0.4rem",
            }}
          >
            {formatAud(lostPerYear)}
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>a year</p>
          <p style={{ fontSize: "0.82rem", color: "var(--color-accent-muted)", lineHeight: 1.6, marginTop: "1.25rem", maxWidth: "34rem", marginInline: "auto" }}>
            This is only an estimate from the numbers you put in ({missedNum} missed calls/week × {closeRate}% won × {formatAud(jobNum)} × 52 weeks). It&apos;s not a promise — we&apos;ll work out your real numbers together on the audit call. An AI receptionist catches the calls behind a figure like this{otherTradeDisplay ? ` for a ${otherTradeDisplay} business` : ""}.
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-faint)", lineHeight: 1.6, marginTop: "0.85rem", maxWidth: "34rem", marginInline: "auto", fontStyle: "italic" }}>
            Every one of those missed calls is a job the tradie down the road is quoting this week — and you&apos;ll likely never know it happened.
          </p>
        </div>
      )}
    </div>
  );
}
