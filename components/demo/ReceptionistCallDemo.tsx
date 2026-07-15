"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Play, ArrowClockwise, SpeakerHigh, SpeakerSlash, ChatText } from "@phosphor-icons/react";
import { buildCues, useCallPlayback, type CueLine } from "./useCallPlayback";
import { FictionLabel, AuditCTA } from "./DemoChrome";

/**
 * "Hear it take a real call" — Demo 1.
 * A dark phone (a deliberate dark anchor on the light page) shows an after-hours
 * incoming-call screen; on Play the call plays with the transcript animating in.
 * Audio-optional: tries /demos/receptionist-call.mp3, otherwise transcript-only.
 * Dialogue transcribed verbatim from ops/demo-call-scripts.md (Dialogue 1).
 */

const AUDIO_SRC = "/demos/receptionist-call.mp3";

const LINES: CueLine[] = [
  { speaker: "ai", text: "Good evening, you've reached Sample Plumbing's after-hours assistant. I can take your details and get you booked in — what's going on tonight?" },
  { speaker: "caller", text: "Yeah, hi — I've got a tap under the kitchen sink that's leaking, and it's sort of getting worse. There's water pooling in the cupboard now." },
  { speaker: "ai", text: "Okay, water in the cupboard — let's sort that. First things, have you been able to shut the water off to it, or is it still running?" },
  { speaker: "caller", text: "Ah — there's a little valve under there, I think I turned it. It's slowed right down but it's still dripping." },
  { speaker: "ai", text: "Good on you, that's exactly the right move — that'll keep the damage down overnight. Whereabouts are you? Which suburb?" },
  { speaker: "caller", text: "Marrickville." },
  { speaker: "ai", text: "Beautiful, we cover Marrickville. Can I grab your name and the best number to reach you on?" },
  { speaker: "caller", text: "It's Dave — 0400 123 456." },
  { speaker: "ai", text: "Thanks Dave. So you know what to expect, our call-out starts from $120, and the plumber gives you an exact quote once he's had a look — no surprises." },
  { speaker: "caller", text: "Yeah, that's fine." },
  { speaker: "ai", text: "Easy. I can get someone out to you first thing — does eight in the morning suit?" },
  { speaker: "caller", text: "Eight's perfect, yeah. That'd be a big relief, honestly." },
  { speaker: "ai", text: "Done — you're booked for 8am. I'll text you a confirmation with all the details in just a moment, and the owner gets a summary of this tonight, so it's all in hand." },
  { speaker: "caller", text: "Ah, brilliant. Thanks so much for that." },
  { speaker: "ai", text: "No worries at all, Dave. Keep that valve turned down and we'll see you in the morning. Night now." },
];

const CUES = buildCues(LINES);

export default function ReceptionistCallDemo() {
  const pb = useCallPlayback(CUES, AUDIO_SRC);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [pb.index, pb.status]);

  const replay = () => {
    pb.reset();
    requestAnimationFrame(() => pb.start());
  };

  const shown = pb.index >= 0 ? CUES.slice(0, pb.index + 1) : [];
  const isIdle = pb.status === "idle";

  return (
    <div style={{ maxWidth: "24rem", margin: "0 auto", width: "100%" }}>
      {/* Hidden audio element — attempts to load; silently ignored if absent. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={pb.audioRef} src={AUDIO_SRC} preload="none" />

      {/* Phone shell */}
      <div
        style={{
          background: "var(--color-phone-shell)",
          border: "1px solid var(--color-on-dark-10)",
          borderRadius: "1.9rem",
          padding: "0.7rem",
          boxShadow: "0 24px 60px var(--color-phone-shadow)",
        }}
      >
        {/* Notch */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem" }}>
          <div style={{ width: 74, height: 5, borderRadius: 999, background: "var(--color-on-dark-12)" }} />
        </div>

        <div
          style={{
            background: "var(--color-phone-screen)",
            borderRadius: "1.4rem",
            overflow: "hidden",
            height: "440px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isIdle ? (
            /* ── Incoming-call screen ── */
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "2rem 1.5rem 1.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ marginTop: "0.5rem" }}>
                <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-faint)", letterSpacing: "0.02em" }}>Incoming call · 9:04 PM</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.85rem" }}>
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 999,
                    background: "var(--color-accent-tint)",
                    border: "1px solid var(--color-accent-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Phone size={38} weight="fill" style={{ color: "var(--color-accent)" }} />
                </motion.div>
                <div>
                  <p style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.2 }}>Sample Plumbing Co</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-on-dark-text-muted)", marginTop: "0.15rem" }}>After Hours · mobile</p>
                </div>
              </div>

              <button
                onClick={pb.start}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  background: "var(--color-accent)",
                  color: "var(--color-on-accent)",
                  border: "none",
                  borderRadius: "2rem",
                  padding: "0.85rem 1.75rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Play size={16} weight="fill" /> Play the call
              </button>
            </div>
          ) : (
            /* ── Live transcript ── */
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 0.9rem",
                  borderBottom: "1px solid var(--color-on-dark-07)",
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 999, background: "var(--color-accent-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={15} weight="fill" style={{ color: "var(--color-accent)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.1 }}>Sample Plumbing Co</p>
                  <p style={{ fontSize: "0.66rem", color: "var(--color-on-dark-text-faint)" }}>After-hours assistant · live call</p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.66rem", color: "var(--color-accent)", fontWeight: 600 }}>
                  <span className="gv-pulse" style={{ width: 7, height: 7, borderRadius: 999, background: "var(--color-accent)", display: "inline-block" }} />
                  {pb.status === "ended" ? "Ended" : "9:04"}
                </span>
              </div>

              <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: "auto", padding: "0.85rem 0.7rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                <AnimatePresence initial={false}>
                  {shown.map((c, i) => {
                    const isAi = c.speaker === "ai";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        style={{ alignSelf: isAi ? "flex-start" : "flex-end", maxWidth: "82%" }}
                      >
                        <div
                          style={{
                            background: isAi ? "var(--color-accent-tint)" : "var(--color-phone-bubble)",
                            border: isAi ? "1px solid var(--color-accent-border)" : "1px solid var(--color-on-dark-07)",
                            color: isAi ? "var(--color-on-dark-text)" : "var(--color-on-dark-text-bright)",
                            borderRadius: "1rem",
                            borderBottomLeftRadius: isAi ? "0.3rem" : "1rem",
                            borderBottomRightRadius: isAi ? "1rem" : "0.3rem",
                            padding: "0.55rem 0.75rem",
                            fontSize: "0.8rem",
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: isAi ? "var(--color-accent)" : "var(--color-on-dark-text-faint)", marginBottom: "0.2rem" }}>
                            {isAi ? "AI receptionist" : "Caller"}
                          </span>
                          {c.text}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* SMS summary card, after the call ends */}
                <AnimatePresence>
                  {pb.status === "ended" && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
                      style={{ marginTop: "0.5rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", justifyContent: "center" }}>
                        <ChatText size={13} weight="fill" style={{ color: "var(--color-on-dark-text-faint)" }} />
                        <span style={{ fontSize: "0.64rem", color: "var(--color-on-dark-text-faint)" }}>sent to the owner 9:07pm</span>
                      </div>
                      <div
                        style={{
                          background: "var(--color-accent-tint)",
                          border: "1px solid var(--color-accent-border)",
                          borderRadius: "0.9rem",
                          padding: "0.85rem 0.9rem",
                        }}
                      >
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-on-dark-text)", marginBottom: "0.4rem" }}>New after-hours booking — Sample Plumbing Co</p>
                        <p style={{ fontSize: "0.74rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.5 }}>Dave · Marrickville · Leaking kitchen tap, water pooling in cupboard (valve shut, slow drip)</p>
                        <div style={{ height: 1, background: "var(--color-on-dark-10)", margin: "0.55rem 0" }} />
                        <p style={{ fontSize: "0.74rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.6 }}>Urgency: Medium — contained overnight</p>
                        <p style={{ fontSize: "0.74rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.6 }}>Booked: Tomorrow 8:00am</p>
                        <p style={{ fontSize: "0.74rem", color: "var(--color-accent)", fontWeight: 600, lineHeight: 1.6 }}>Customer confirmed via text.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress hairline */}
              <div style={{ height: 2, background: "var(--color-on-dark-07)", flexShrink: 0 }}>
                <div style={{ height: "100%", width: `${pb.progress * 100}%`, background: "var(--color-accent)", transition: "width 0.1s linear" }} />
              </div>

              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 0.9rem", flexShrink: 0 }}>
                <button
                  onClick={replay}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "var(--color-on-dark-10)",
                    color: "var(--color-on-dark-text)",
                    border: "none",
                    borderRadius: "2rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <ArrowClockwise size={14} weight="bold" /> {pb.status === "ended" ? "Replay" : "Restart"}
                </button>
                {pb.usingAudio && (
                  <button
                    onClick={pb.toggleMute}
                    aria-label={pb.muted ? "Unmute" : "Mute"}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      background: "var(--color-on-dark-10)",
                      color: "var(--color-on-dark-text)",
                      border: "none",
                      borderRadius: 999,
                      cursor: "pointer",
                    }}
                  >
                    {pb.muted ? <SpeakerSlash size={15} weight="fill" /> : <SpeakerHigh size={15} weight="fill" />}
                  </button>
                )}
                <span style={{ marginLeft: "auto", fontSize: "0.66rem", color: "var(--color-on-dark-text-faint)" }}>
                  {pb.usingAudio ? "Audio + transcript" : "Transcript demo"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <FictionLabel business="Sample Plumbing Co" />
      <AuditCTA />
    </div>
  );
}
