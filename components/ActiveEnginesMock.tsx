"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCountUp } from "./useCountUp";
import { CallWave, ProcessingDots } from "./MockBits";

export default function ActiveEnginesMock() {
  const [run, setRun] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRun(true), 300);
    return () => clearTimeout(t);
  }, []);

  const v20 = useCountUp(20, run, 1100);
  const v100 = useCountUp(100, run, 1200);
  const v5 = useCountUp(5, run, 1000);

  const engines = [
    { label: "Speed-to-Lead Voice Agent", time: "20 sec to first call", wave: true },
    { label: "Internal Quoting Engine", time: "< 5 sec to quote", wave: false },
  ];

  const stats = [
    { display: `${Math.round(v20)}s`, label: "First call" },
    { display: `${Math.round(v100)}×`, label: "Scalable" },
    { display: `< ${Math.round(v5)}s`, label: "Quote time" },
    { display: "0", label: "Errors" },
  ];

  return (
    <div
      style={{
        background: "#0D0D0B",
        borderRadius: "2rem",
        padding: "12px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 32px 80px rgba(0,0,0,0.25)",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* sweeping scan highlight */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "45%",
          background: "linear-gradient(to bottom, rgba(74,222,128,0) 0%, rgba(74,222,128,0.07) 50%, rgba(74,222,128,0) 100%)",
          pointerEvents: "none",
        }}
        animate={{ top: ["-45%", "100%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
      />

      <div style={{ padding: "1rem", position: "relative" }}>
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "rgba(255,255,255,0.30)" }}>
            Active Engines
          </p>
        </div>

        {engines.map((e) => (
          <div
            key={e.label}
            style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "0.875rem 1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}
          >
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff", marginBottom: "0.15rem" }}>{e.label}</p>
              <p style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.40)" }}>{e.time}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexShrink: 0 }}>
              {e.wave ? <CallWave color="#4ADE80" bars={4} /> : <ProcessingDots color="#4ADE80" />}
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(26,92,58,0.30)", borderRadius: "2rem", padding: "0.2rem 0.55rem" }}>
                <motion.span
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80", display: "block" }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4ADE80" }}>Live</span>
              </div>
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", marginTop: "0.5rem" }}>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                style={{ textAlign: "center", padding: "0.5rem 0" }}
              >
                <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                  {stat.display}
                </p>
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.30)", marginTop: "0.1rem" }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
