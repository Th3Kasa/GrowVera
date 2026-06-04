"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), 2500);
    return () => clearInterval(timer);
  }, [words.length]);
  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <AnimatePresence mode="wait">
        <motion.span key={words[index]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ display: "inline-block", color: "#0D0D0B" }}>
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
