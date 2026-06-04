"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MagneticButton as="a" href="/audit" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200" style={{ background: "#1A5C3A", color: "#fff", boxShadow: "0 4px 20px rgba(26,92,58,0.30)" } as React.CSSProperties}>
        Get your free audit
        <motion.span initial={{ x: 0, y: 0 }} whileHover={{ x: 2, y: -1 }} transition={{ duration: 0.2 }} style={{ display: "flex", alignItems: "center" }}>
          <ArrowRight size={15} weight="bold" />
        </motion.span>
      </MagneticButton>
      <MagneticButton as="a" href="/#how-it-works" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200" style={{ background: "transparent", color: "#0D0D0B", border: "1px solid rgba(13,13,11,0.15)" } as React.CSSProperties}>
        See how it works
      </MagneticButton>
    </div>
  );
}
