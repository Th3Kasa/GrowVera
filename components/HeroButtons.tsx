"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MagneticButton as="a" href="/audit" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200" style={{ background: "#34D399", color: "#06180F", boxShadow: "0 4px 24px rgba(52,211,153,0.30)" } as React.CSSProperties}>
        Get my free AI audit
        <motion.span initial={{ x: 0, y: 0 }} whileHover={{ x: 2, y: -1 }} transition={{ duration: 0.2 }} style={{ display: "flex", alignItems: "center" }}>
          <ArrowRight size={15} weight="bold" />
        </motion.span>
      </MagneticButton>
      <MagneticButton as="a" href="/#pricing" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200" style={{ background: "transparent", color: "#F4F4F1", border: "1px solid rgba(255,255,255,0.18)" } as React.CSSProperties}>
        See pricing
      </MagneticButton>
    </div>
  );
}
