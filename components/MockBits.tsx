"use client";

import { motion } from "framer-motion";

/** Pulsing "LIVE" indicator with an expanding ring. */
export function LivePulse({ color = "#4ADE80", label = "LIVE" }: { color?: string; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <span style={{ position: "relative", display: "block", width: 7, height: 7 }}>
        <motion.span
          aria-hidden
          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }}
          animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
      </span>
      <span style={{ fontSize: "0.6rem", fontWeight: 700, color, letterSpacing: "0.12em" }}>{label}</span>
    </div>
  );
}

/** Animated audio equaliser bars — used for the "calling" state. */
export function CallWave({ color = "#4ADE80", bars = 4 }: { color?: string; bars?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 12 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          style={{ width: 2, borderRadius: 2, background: color, display: "block" }}
          animate={{ height: [3, 11, 4, 9, 3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.13, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/** Three bouncing dots — used for the "processing / thinking" state. */
export function ProcessingDots({ color = "#FBBF24" }: { color?: string }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 4, height: 4, borderRadius: "50%", background: color, display: "block" }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
        />
      ))}
    </div>
  );
}
