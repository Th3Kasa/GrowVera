"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BellRinging } from "@phosphor-icons/react";

/**
 * Scripted, animated SMS demo of the optional Google Review Agent. Pure
 * client-side, costs nothing to run, and is clearly labelled as an example.
 * The business persona ("Sample Plumbing Co") is fictional — no real customer,
 * job, or review is depicted.
 */

type Msg = {
  from: "business" | "customer";
  text: string;
  /** Render as the owner's "bad review" alert instead of a normal bubble. */
  alert?: boolean;
};

const SCRIPT: Msg[] = [
  { from: "business", text: "Hi Dave, thanks for having Sample Plumbing Co out today! If we did a good job, would you mind leaving us a quick Google review? 🙏" },
  { from: "customer", text: "No worries, happy to. Where do I go?" },
  { from: "business", text: "Legend — here you go: g.page/sample-plumbing/review ⭐ Takes 20 seconds." },
  { from: "customer", text: "Done! Left you 5 stars 👍" },
  { from: "business", text: "You're a champion, Dave. Cheers for that!" },
  { from: "business", alert: true, text: "Owner alert: a 2-star review just landed for Sample Plumbing Co. Tap to reply before it's live to the world." },
];

export default function ReviewAgentDemo() {
  const [count, setCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count >= SCRIPT.length) {
      const reset = setTimeout(() => setCount(1), 4200);
      return () => clearTimeout(reset);
    }
    const next = setTimeout(() => setCount((c) => c + 1), 1600);
    return () => clearTimeout(next);
  }, [count]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

  const shown = SCRIPT.slice(0, count);

  return (
    <div style={{ maxWidth: "26rem", margin: "0 auto", width: "100%" }}>
      {/* Phone frame */}
      <div
        style={{
          background: "#0B0B0E",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "1.75rem",
          padding: "0.85rem",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.4rem 0.6rem 0.85rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: "rgba(52,211,153,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={16} weight="fill" style={{ color: "#34D399" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F4F4F1", lineHeight: 1.1 }}>Sample Plumbing Co</p>
            <p style={{ fontSize: "0.68rem", color: "#6E6E72" }}>Review Agent · text message</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ height: "340px", overflowY: "auto", padding: "0.85rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          <AnimatePresence initial={false}>
            {shown.map((m, i) => {
              if (m.alert) {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                    style={{
                      alignSelf: "stretch",
                      background: "rgba(248,113,113,0.10)",
                      border: "1px solid rgba(248,113,113,0.35)",
                      borderRadius: "0.9rem",
                      padding: "0.7rem 0.85rem",
                      display: "flex",
                      gap: "0.55rem",
                      alignItems: "flex-start",
                      marginTop: "0.4rem",
                    }}
                  >
                    <BellRinging size={16} weight="fill" style={{ color: "#F87171", flexShrink: 0, marginTop: "0.1rem" }} />
                    <span style={{ fontSize: "0.78rem", color: "#F4C7C7", lineHeight: 1.5 }}>{m.text}</span>
                  </motion.div>
                );
              }
              const isBiz = m.from === "business";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  style={{ alignSelf: isBiz ? "flex-start" : "flex-end", maxWidth: "80%" }}
                >
                  <div
                    style={{
                      background: isBiz ? "#1C1C22" : "#34D399",
                      color: isBiz ? "#E4E4E1" : "#06180F",
                      borderRadius: "1rem",
                      borderBottomLeftRadius: isBiz ? "0.3rem" : "1rem",
                      borderBottomRightRadius: isBiz ? "1rem" : "0.3rem",
                      padding: "0.6rem 0.8rem",
                      fontSize: "0.82rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#6E6E72", marginTop: "0.9rem" }}>
        Example conversation — demo. &ldquo;Sample Plumbing Co&rdquo; is fictional.
      </p>
    </div>
  );
}
