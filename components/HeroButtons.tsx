"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MagneticButton as="a" href="/audit" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200" style={{ background: "var(--color-accent)", color: "var(--color-on-accent)", boxShadow: "0 4px 24px var(--color-accent-border-soft)" } as React.CSSProperties}>
        Get my free AI audit
        <motion.span initial={{ x: 0, y: 0 }} whileHover={{ x: 2, y: -1 }} transition={{ duration: 0.2 }} style={{ display: "flex", alignItems: "center" }}>
          <ArrowRight size={15} weight="bold" />
        </motion.span>
      </MagneticButton>
      <MagneticButton as="a" href="/#pricing" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200" style={{ background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-white-18)" } as React.CSSProperties}>
        See pricing
      </MagneticButton>
    </div>
  );
}
