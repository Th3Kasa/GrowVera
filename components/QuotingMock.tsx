"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Robot, CheckCircle } from "@phosphor-icons/react";
import { useCountUp } from "./useCountUp";

const QUERY = "2019 Ford Ranger, snapped front CV axle, customer in Parra";

const LINES = [
  { label: "Parts (OEM supplier — live price)", value: "$312.50" },
  { label: "Labour (1.5 hrs @ your rate)", value: "$187.50" },
  { label: "Travel surcharge (22 km)", value: "$28.00" },
  { label: "Margin overlay (38%)", value: "applied" },
];

// phases: 0 idle · 1 user typing · 2 engine thinking · 3 quote card + lines · 4 total reveal
export default function QuotingMock() {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const run = () => {
      setPhase(0);
      setTyped(0);
      timers.push(setTimeout(() => setPhase(1), 600));
      timers.push(setTimeout(() => setPhase(2), 600 + 2400));
      timers.push(setTimeout(() => setPhase(3), 600 + 2400 + 1300));
      timers.push(setTimeout(() => setPhase(4), 600 + 2400 + 1300 + 900));
      timers.push(setTimeout(() => { if (!cancelled) run(); }, 600 + 2400 + 1300 + 900 + 4200));
    };

    run();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, []);

  // keep typing until the message is complete, even if the phase timeline
  // has already advanced (timers can outpace rendering on slower phones)
  useEffect(() => {
    if (phase < 1 || typed >= QUERY.length) return;
    const id = setTimeout(() => setTyped((t) => Math.min(t + 1, QUERY.length)), 34);
    return () => clearTimeout(id);
  }, [phase, typed]);

  const timer = useCountUp(4.2, phase >= 3, 900);
  const total = useCountUp(734, phase >= 4, 1100);

  const showUser = phase >= 1;
  const typingDone = typed >= QUERY.length;

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E1DC", borderRadius: "1.5rem", padding: "1.5rem", boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #E2E1DC" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1A5C3A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Robot size={16} weight="fill" style={{ color: "#fff" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0D0D0B", lineHeight: 1 }}>Vera Quote</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.2rem" }}>
            <motion.span
              style={{ width: 5, height: 5, borderRadius: "50%", background: "#1A5C3A", display: "block" }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span style={{ fontSize: "0.65rem", color: "#1A5C3A" }}>Active</span>
          </div>
        </div>
      </div>

      {/* user message — minHeight fits the wrapped bubble on narrow screens so the card doesn't jump */}
      <div style={{ minHeight: "4.4rem", display: "flex", justifyContent: "flex-end", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <AnimatePresence>
          {showUser && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              style={{ background: "#0D0D0B", borderRadius: "1rem 1rem 0.2rem 1rem", padding: "0.7rem 0.95rem", maxWidth: "82%" }}
            >
              <p style={{ fontSize: "0.8rem", color: "#fff", lineHeight: 1.5 }}>
                {QUERY.slice(0, typed)}
                {!typingDone && (
                  <motion.span
                    style={{ display: "inline-block", width: 2, height: "0.9em", background: "#fff", marginLeft: 1, verticalAlign: "text-bottom" }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* engine response — reserved height stops the layout collapsing (flickering) each loop */}
      <div style={{ minHeight: "14.5rem" }}>
        <AnimatePresence mode="wait">
          {phase === 2 && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F4F3EF", borderRadius: "1rem 1rem 1rem 0.2rem", padding: "0.7rem 0.9rem" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#9E9E9A", display: "block" }}
                  animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.13 }}
                />
              ))}
            </motion.div>
          )}

          {phase >= 3 && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              style={{ background: "#F4F3EF", borderRadius: "1rem 1rem 1rem 0.2rem", padding: "1rem", maxWidth: "94%" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.7rem" }}>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 14 }} style={{ display: "flex" }}>
                  <CheckCircle size={14} weight="fill" style={{ color: "#1A5C3A" }} />
                </motion.span>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0D0D0B" }}>Quote ready — {timer.toFixed(1)} seconds</p>
              </div>
              {LINES.map((line, i) => (
                <motion.div
                  key={line.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.13, duration: 0.35 }}
                  style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <span style={{ fontSize: "0.7rem", color: "#6B6B68" }}>{line.label}</span>
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0D0D0B" }}>{line.value}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 4 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginTop: "0.75rem", padding: "0.55rem 0.8rem", background: "rgba(26,92,58,0.08)", borderRadius: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0D0D0B" }}>Quote to customer</span>
                <span style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 900, color: "#1A5C3A" }}>
                  ${total.toFixed(2)}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p style={{ fontSize: "0.65rem", color: "#9E9E9A", textAlign: "center", marginTop: "0.9rem" }}>
        Prices pulled live from supplier API. SOPs and margins applied automatically.
      </p>
    </div>
  );
}
