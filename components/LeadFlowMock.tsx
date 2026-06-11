"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";
import { CallWave, ProcessingDots } from "./MockBits";

const STEPS = [
  { time: "0:00", event: "Lead submits contact form on your website", status: "trigger", color: "rgba(255,255,255,0.85)", accent: "rgba(255,255,255,0.55)" },
  { time: "0:08", event: "Engine receives lead data from CRM", status: "processing", color: "#FBBF24", accent: "#FBBF24" },
  { time: "0:20", event: "Outbound call placed to prospect", status: "calling", color: "#4ADE80", accent: "#4ADE80" },
  { time: "1:45", event: "Prospect qualified — appointment booked", status: "booked", color: "#60A5FA", accent: "#60A5FA" },
];

export default function LeadFlowMock({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const run = () => {
      setStep(-1);
      setDone(false);
      timers.push(setTimeout(() => setStep(0), 500));
      timers.push(setTimeout(() => setStep(1), 1800));
      timers.push(setTimeout(() => setStep(2), 3100));
      timers.push(setTimeout(() => setStep(3), 4600));
      timers.push(setTimeout(() => setDone(true), 5500));
      timers.push(setTimeout(() => { if (!cancelled) run(); }, 8600));
    };

    run();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, []);

  const pad = compact ? "1.1rem" : "1.5rem";
  const radius = compact ? "1rem" : "1.5rem";
  const bg = compact ? "#0D0D0B" : "rgba(255,255,255,0.04)";
  const eventSize = compact ? "0.72rem" : "0.8rem";

  return (
    <div style={{ background: bg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: radius, padding: pad }}>
      <div style={{ marginBottom: "1.1rem" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.30)" }}>
          Vera Reach · Lead Flow
        </p>
      </div>

      {STEPS.map((s, i) => {
        const active = i <= step;
        const current = i === step && !done;
        return (
          <motion.div
            key={s.time}
            initial={false}
            animate={{ opacity: active ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", alignItems: "stretch", gap: "0.7rem", marginBottom: "0.55rem" }}
          >
            <span style={{ fontSize: "0.62rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", minWidth: "2.4rem", paddingTop: "0.6rem", fontFamily: "monospace" }}>
              {s.time}
            </span>
            <motion.div
              animate={{
                backgroundColor: current ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                boxShadow: current ? `0 0 0 1px ${s.accent}55, 0 0 20px ${s.accent}22` : "0 0 0 1px rgba(255,255,255,0)",
              }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1, borderRadius: "0.5rem", padding: "0.55rem 0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", position: "relative", overflow: "hidden" }}
            >
              <motion.span
                aria-hidden
                initial={false}
                animate={{ opacity: active ? 1 : 0, scaleY: active ? 1 : 0.2 }}
                transition={{ duration: 0.4 }}
                style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5, background: s.accent, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
              />
              <span style={{ fontSize: eventSize, color: active ? s.color : "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
                {s.event}
              </span>
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                {current && i === 1 ? (
                  <ProcessingDots color={s.accent} />
                ) : current && i === 2 ? (
                  <CallWave color={s.accent} />
                ) : active && i === 3 ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} style={{ display: "flex" }}>
                    <CheckCircle size={15} weight="fill" style={{ color: s.accent }} />
                  </motion.span>
                ) : (
                  <span style={{ fontSize: "0.58rem", fontWeight: 700, color: active ? s.accent : "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {s.status}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* reserved height so the result card doesn't shift the layout each loop */}
      <div style={{ minHeight: compact ? "4.9rem" : "5.1rem" }}>
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            style={{ marginTop: "1rem", padding: "0.8rem 0.9rem", background: "rgba(26,92,58,0.22)", borderRadius: "0.75rem", border: "1px solid rgba(26,92,58,0.4)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
              <CheckCircle size={14} weight="fill" style={{ color: "#4ADE80" }} />
              <p style={{ fontSize: "0.74rem", fontWeight: 700, color: "#4ADE80" }}>Result: Appointment Confirmed</p>
            </div>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>Total elapsed: 1 min 45 sec. Zero staff involved.</p>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
