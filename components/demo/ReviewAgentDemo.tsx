"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BellRinging, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";
import { FictionLabel, AuditCTA } from "./DemoChrome";

/**
 * Scripted, animated SMS demo of the optional Google Review Agent. Pure
 * client-side, costs nothing to run, and is clearly labelled as an example.
 * The business persona ("Sample Plumbing Co") is fictional — no real customer,
 * job, or review is depicted.
 *
 * Two scenes toggled by tabs inside one dark phone frame:
 *   1. Review request — asks a happy customer for a Google review.
 *   2. Bad-review alert — a low rating lands, the owner is alerted, and the AI
 *      drafts a reply for approval before it goes public.
 */

type Msg = { from: "business" | "customer"; text: string };

const REQUEST_SCRIPT: Msg[] = [
  { from: "business", text: "Hi Dave, thanks for having Sample Plumbing Co out today! If we did a good job, would you mind leaving us a quick Google review? 🙏" },
  { from: "customer", text: "No worries, happy to. Where do I go?" },
  { from: "business", text: "Legend — here you go: g.page/sample-plumbing/review ⭐ Takes 20 seconds." },
  { from: "customer", text: "Done! Left you 5 stars 👍" },
  { from: "business", text: "You're a champion, Dave. Cheers for that!" },
];

type Tab = "request" | "alert";

export default function ReviewAgentDemo() {
  const [tab, setTab] = useState<Tab>("request");
  const [reqCount, setReqCount] = useState(1);
  const [alertStep, setAlertStep] = useState(1); // 1=review, 2=alert, 3=draft, 4=approve btn
  const [posted, setPosted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Advance the review-request thread (loops).
  useEffect(() => {
    if (tab !== "request") return;
    if (reqCount >= REQUEST_SCRIPT.length) {
      const reset = setTimeout(() => setReqCount(1), 4200);
      return () => clearTimeout(reset);
    }
    const next = setTimeout(() => setReqCount((c) => c + 1), 1600);
    return () => clearTimeout(next);
  }, [reqCount, tab]);

  // Advance the bad-review alert scene (stops at the approve button).
  useEffect(() => {
    if (tab !== "alert") return;
    if (alertStep >= 4) return;
    const next = setTimeout(() => setAlertStep((s) => s + 1), 1500);
    return () => clearTimeout(next);
  }, [alertStep, tab]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [reqCount, alertStep, tab]);

  const switchTab = (t: Tab) => {
    setTab(t);
    if (t === "request") setReqCount(1);
    else {
      setAlertStep(1);
      setPosted(false);
    }
  };

  const shownReq = REQUEST_SCRIPT.slice(0, reqCount);

  const tabBtn = (t: Tab): React.CSSProperties => ({
    flex: 1,
    background: tab === t ? "var(--color-accent-tint)" : "transparent",
    border: tab === t ? "1px solid var(--color-accent-border)" : "1px solid var(--color-on-dark-07)",
    color: tab === t ? "var(--color-on-dark-text)" : "var(--color-on-dark-text-muted)",
    borderRadius: "0.6rem",
    padding: "0.45rem 0.5rem",
    fontSize: "0.72rem",
    fontWeight: 600,
    cursor: "pointer",
  });

  return (
    <div style={{ maxWidth: "26rem", margin: "0 auto", width: "100%" }}>
      {/* Phone frame */}
      <div
        style={{
          background: "var(--color-phone-shell)",
          border: "1px solid var(--color-on-dark-10)",
          borderRadius: "1.75rem",
          padding: "0.85rem",
          boxShadow: "0 24px 60px var(--color-phone-shadow)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.4rem 0.6rem 0.75rem", borderBottom: "1px solid var(--color-on-dark-07)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: "var(--color-accent-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={16} weight="fill" style={{ color: "var(--color-accent)" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.1 }}>Sample Plumbing Co</p>
            <p style={{ fontSize: "0.68rem", color: "var(--color-on-dark-text-faint)" }}>Review Agent</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", padding: "0.65rem 0.4rem 0.4rem" }}>
          <button onClick={() => switchTab("request")} style={tabBtn("request")}>Review request</button>
          <button onClick={() => switchTab("alert")} style={tabBtn("alert")}>Bad-review alert</button>
        </div>

        {/* Body */}
        <div ref={scrollRef} style={{ height: "340px", overflowY: "auto", padding: "0.6rem 0.5rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {tab === "request" && (
            <AnimatePresence initial={false}>
              {shownReq.map((m, i) => {
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
                        background: isBiz ? "var(--color-phone-bubble)" : "var(--color-accent)",
                        color: isBiz ? "var(--color-on-dark-text-bright)" : "var(--color-on-accent)",
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
          )}

          {tab === "alert" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {/* Step 1: the bad review lands */}
              {alertStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  style={{ background: "var(--color-phone-bubble)", border: "1px solid var(--color-on-dark-07)", borderRadius: "0.9rem", padding: "0.75rem 0.85rem" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.35rem" }}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} size={13} weight="fill" style={{ color: s < 2 ? "var(--color-on-dark-danger)" : "var(--color-on-dark-30)" }} />
                    ))}
                    <span style={{ fontSize: "0.68rem", color: "var(--color-on-dark-text-faint)", marginLeft: "0.25rem" }}>New review · R. Nguyen (sample)</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.5 }}>
                    &ldquo;Waited two hours past the window and no call to let me know. The work was fine but the wait wasn&apos;t good enough.&rdquo;
                  </p>
                </motion.div>
              )}

              {/* Step 2: owner alert */}
              {alertStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  style={{ background: "var(--color-on-dark-danger-soft)", border: "1px solid var(--color-on-dark-danger-border)", borderRadius: "0.9rem", padding: "0.7rem 0.85rem", display: "flex", gap: "0.55rem", alignItems: "flex-start" }}
                >
                  <BellRinging size={16} weight="fill" style={{ color: "var(--color-on-dark-danger)", flexShrink: 0, marginTop: "0.1rem" }} />
                  <span style={{ fontSize: "0.78rem", color: "var(--color-on-dark-danger-text)", lineHeight: 1.5 }}>
                    Owner alert: a 2★ review just landed. I&apos;ve drafted a reply — check it before it goes public.
                  </span>
                </motion.div>
              )}

              {/* Step 3: AI-drafted reply */}
              {alertStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  style={{ background: "var(--color-accent-tint)", border: "1px solid var(--color-accent-border)", borderRadius: "0.9rem", padding: "0.75rem 0.85rem" }}
                >
                  <p style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-accent)", marginBottom: "0.35rem" }}>Drafted reply · AI</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-on-dark-text)", lineHeight: 1.55 }}>
                    Hi R, I&apos;m really sorry we ran two hours over without a call — that&apos;s on us and not our standard. I&apos;d like to make it right; please call the office directly and ask for the owner. Thanks for the honest feedback. — Sample Plumbing Co
                  </p>
                </motion.div>
              )}

              {/* Step 4: approve button (non-functional, demo) */}
              {alertStep >= 4 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <button
                    onClick={() => setPosted(true)}
                    disabled={posted}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.45rem",
                      background: posted ? "var(--color-on-dark-10)" : "var(--color-accent)",
                      color: posted ? "var(--color-on-dark-text-muted)" : "var(--color-on-accent)",
                      border: "none",
                      borderRadius: "0.7rem",
                      padding: "0.6rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: posted ? "default" : "pointer",
                    }}
                  >
                    {posted ? <><CheckCircle size={15} weight="fill" /> Approved (demo)</> : <><PaperPlaneTilt size={15} weight="fill" /> Approve &amp; post reply</>}
                  </button>
                  <span style={{ fontSize: "0.64rem", color: "var(--color-on-dark-text-faint)", textAlign: "center" }}>
                    Button is disabled in this demo — nothing is actually posted.
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <FictionLabel business="Sample Plumbing Co" />
      <AuditCTA prompt="Want this working for YOUR reviews?" />
    </div>
  );
}
