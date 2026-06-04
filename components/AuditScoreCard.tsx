"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ITEMS = [
  { label: "Profile completeness", before: 55, after: 98 },
  { label: "Review velocity", before: 62, after: 91 },
  { label: "Citation consistency", before: 41, after: 95 },
  { label: "Photo quality score", before: 70, after: 96 },
];

function ScoreBar({ value, animated }: { value: number; animated: boolean }) {
  const color = value >= 90 ? "#1A5C3A" : value >= 70 ? "#4A8A6A" : "#D97706";
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(13,13,11,0.08)" }}>
      <motion.div className="absolute left-0 top-0 h-full rounded-full" style={{ background: color }} initial={{ width: "0%" }} animate={{ width: animated ? `${value}%` : "0%" }} transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }} />
    </div>
  );
}

export default function AuditScoreCard() {
  const [phase, setPhase] = useState<"before" | "after">("before");
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setAnimated(true), 600);
    const t2 = setTimeout(() => setPhase("after"), 2800);
    const t3 = setTimeout(() => { setAnimated(false); setPhase("before"); setTimeout(() => setAnimated(true), 200); }, 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const overallScore = phase === "before" ? 68 : 94;
  return (
    <div className="mt-5 p-4 rounded-2xl" style={{ background: "rgba(13,13,11,0.03)", border: "1px solid rgba(13,13,11,0.06)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: "#6B6B67" }}>GBP Audit Score</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <motion.span key={overallScore} initial={{ y: 4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="text-3xl font-bold" style={{ color: phase === "after" ? "#1A5C3A" : "#D97706" }}>{overallScore}</motion.span>
            <span className="text-sm" style={{ color: "#6B6B67" }}>/ 100</span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: phase === "after" ? "#E8F2EC" : "#FEF3C7", color: phase === "after" ? "#1A5C3A" : "#D97706" }}>
          {phase === "after" ? "Optimised" : "Before"}
        </div>
      </div>
      <div className="space-y-3">
        {ITEMS.map((item) => {
          const val = phase === "before" ? item.before : item.after;
          return (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px]" style={{ color: "#6B6B67" }}>{item.label}</span>
                <motion.span key={`${item.label}-${phase}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-semibold" style={{ color: "#0D0D0B" }}>{val}%</motion.span>
              </div>
              <ScoreBar value={val} animated={animated} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
