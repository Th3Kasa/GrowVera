"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightning, CheckCircle, PhoneCall, ArrowClockwise, Timer } from "@phosphor-icons/react";
import { buildCues, useCallPlayback, type CueLine } from "./useCallPlayback";
import { FictionLabel, AuditCTA } from "./DemoChrome";

/**
 * "Watch the 20-second callback" — Demo 2.
 * Submit a mock lead form → a stopwatch counts 0→20s (compressed) → the AI
 * rings back → the callback call plays (audio-optional, /demos/speedtolead-call.mp3)
 * → a booking-confirmed card drops in. Dialogue 2 verbatim from
 * ops/demo-call-scripts.md. Replay resets the whole sequence.
 */

const AUDIO_SRC = "/demos/speedtolead-call.mp3";

const LINES: CueLine[] = [
  { speaker: "ai", text: "Hi, this is the assistant from Sample Plumbing Co — you just popped in a request for gutter cleaning on a two-storey in Parramatta. Have I caught you at an okay time?" },
  { speaker: "caller", text: "Oh — wow, that was fast. I literally just hit submit." },
  { speaker: "ai", text: "We like to be quick! Just a couple of things so we can quote it properly. Is there safe ladder access around the place, or anything tricky like a steep pitch?" },
  { speaker: "caller", text: "Nah, access is fine. There's a bit of a slope out the back but nothing mad." },
  { speaker: "ai", text: "Perfect. And roughly how long since they were last done?" },
  { speaker: "caller", text: "Ooh — probably a good two years. They're pretty full." },
  { speaker: "ai", text: "No dramas, that's a common one this time of year. I've got a spot Thursday morning or Friday afternoon — which works better for you?" },
  { speaker: "caller", text: "Friday arvo would be good." },
  { speaker: "ai", text: "Locked in for Friday afternoon. I'll shoot you a text now with the confirmation and what to expect. Thanks for that — talk soon." },
  { speaker: "caller", text: "Great, thanks!" },
];

const CUES = buildCues(LINES);

type Stage = "form" | "timeline" | "call";

export default function SpeedToLeadDemo() {
  const pb = useCallPlayback(CUES, AUDIO_SRC);
  const [stage, setStage] = useState<Stage>("form");
  const [seconds, setSeconds] = useState(0);
  const [ringing, setRinging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [pb.index, pb.status]);

  useEffect(() => () => clearTimers(), []);

  const submit = () => {
    setStage("timeline");
    setSeconds(0);
    setRinging(false);
    // Compress a 20s callback into ~2.6s of stopwatch, then ring, then call.
    const runMs = 2600;
    const startTs = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - startTs) / runMs);
      setSeconds(Number((p * 20).toFixed(1)));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    timers.current.push(
      window.setTimeout(() => {
        setSeconds(20);
        setRinging(true);
      }, runMs)
    );
    timers.current.push(
      window.setTimeout(() => {
        setStage("call");
        pb.start();
      }, runMs + 1200)
    );
  };

  const replay = () => {
    clearTimers();
    pb.reset();
    setRinging(false);
    setSeconds(0);
    setStage("form");
  };

  const shown = pb.index >= 0 ? CUES.slice(0, pb.index + 1) : [];

  return (
    <div style={{ maxWidth: "26rem", margin: "0 auto", width: "100%" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={pb.audioRef} src={AUDIO_SRC} preload="none" />

      <div
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "1.25rem",
          padding: "1.1rem",
          minHeight: "440px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Step 1: lead form ── */}
        {stage === "form" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
              <Lightning size={16} weight="fill" style={{ color: "var(--color-accent)" }} />
              <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "var(--color-accent)" }}>Website enquiry</span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "1.1rem", lineHeight: 1.5 }}>
              A sample lead just filled in the form on Sample Plumbing Co&apos;s website.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {[
                { label: "Name", value: "Jordan (sample lead)" },
                { label: "Phone", value: "0400 000 000 (not a real number)" },
                { label: "Job", value: "Gutter cleaning — two-storey, Parramatta" },
              ].map((f) => (
                <div key={f.label} style={{ background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", borderRadius: "0.7rem", padding: "0.6rem 0.8rem" }}>
                  <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-faint)", marginBottom: "0.15rem", fontWeight: 700 }}>{f.label}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text)", fontWeight: 500 }}>{f.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={submit}
              style={{
                marginTop: "auto",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "var(--color-accent)",
                color: "var(--color-on-accent)",
                border: "none",
                borderRadius: "2rem",
                padding: "0.85rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Submit enquiry — watch what happens
            </button>
          </motion.div>
        )}

        {/* ── Step 2: timeline / stopwatch ── */}
        {stage === "timeline" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", textAlign: "center" }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-accent)" }}>
              <CheckCircle size={18} weight="fill" />
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Form received</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-faint)" }}>
                <Timer size={16} weight="bold" />
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Calling back in</span>
              </div>
              <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "3.5rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                {seconds.toFixed(1)}s
              </p>
            </div>

            <AnimatePresence>
              {ringing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}
                >
                  <motion.div
                    animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    style={{ width: 54, height: 54, borderRadius: 999, background: "var(--color-accent-soft)", border: "1px solid var(--color-accent-border)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <PhoneCall size={24} weight="fill" style={{ color: "var(--color-accent)" }} />
                  </motion.div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 600 }}>Ringing the lead…</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Step 3: call transcript + booking card ── */}
        {stage === "call" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", paddingBottom: "0.7rem", borderBottom: "1px solid var(--color-border)", marginBottom: "0.6rem" }}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: "var(--color-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PhoneCall size={15} weight="fill" style={{ color: "var(--color-accent)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.1 }}>Outbound callback</p>
                <p style={{ fontSize: "0.66rem", color: "var(--color-text-faint)" }}>Sample Plumbing Co → Jordan</p>
              </div>
              <span style={{ fontSize: "0.66rem", color: "var(--color-accent)", fontWeight: 700 }}>~20s later</span>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.45rem", paddingRight: "0.15rem" }}>
              <AnimatePresence initial={false}>
                {shown.map((c, i) => {
                  const isAi = c.speaker === "ai";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                      style={{ alignSelf: isAi ? "flex-start" : "flex-end", maxWidth: "84%" }}
                    >
                      <div
                        style={{
                          background: isAi ? "var(--color-accent-soft)" : "var(--color-bg-subtle)",
                          border: isAi ? "1px solid var(--color-accent-border-soft)" : "1px solid var(--color-border)",
                          color: "var(--color-text)",
                          borderRadius: "0.9rem",
                          borderBottomLeftRadius: isAi ? "0.25rem" : "0.9rem",
                          borderBottomRightRadius: isAi ? "0.9rem" : "0.25rem",
                          padding: "0.5rem 0.7rem",
                          fontSize: "0.78rem",
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ display: "block", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: isAi ? "var(--color-accent)" : "var(--color-text-faint)", marginBottom: "0.15rem" }}>
                          {isAi ? "AI agent" : "Lead"}
                        </span>
                        {c.text}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <AnimatePresence>
                {pb.status === "ended" && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
                    style={{ marginTop: "0.5rem", background: "var(--gradient-card-featured)", border: "1px solid var(--color-accent-border)", borderRadius: "0.9rem", padding: "0.85rem 0.9rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <CheckCircle size={15} weight="fill" style={{ color: "var(--color-accent)" }} />
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text)" }}>Booking confirmed — Sample Plumbing Co</p>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-bright)", lineHeight: 1.6 }}>Job: Gutter cleaning · Two-storey, Parramatta</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-bright)", lineHeight: 1.6 }}>Access: OK · Last cleaned: ~2 years</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-bright)", lineHeight: 1.6 }}>Slot booked: Friday afternoon</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 600, lineHeight: 1.6 }}>Confirmation text sent.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress hairline */}
            <div style={{ height: 2, background: "var(--color-border)", marginTop: "0.6rem" }}>
              <div style={{ height: "100%", width: `${pb.progress * 100}%`, background: "var(--color-accent)", transition: "width 0.1s linear" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Replay control (outside the card, always available after start) */}
      {stage !== "form" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
          <button
            onClick={replay}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--color-bg-subtle)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: "2rem",
              padding: "0.5rem 1.1rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <ArrowClockwise size={14} weight="bold" /> Replay from the form
          </button>
        </div>
      )}

      <FictionLabel business="Sample Plumbing Co" />
      <AuditCTA />
    </div>
  );
}
