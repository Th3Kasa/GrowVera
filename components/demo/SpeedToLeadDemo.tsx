"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LockSimple,
  CheckCircle,
  CaretDown,
  ArrowClockwise,
  MicrophoneSlash,
  GridFour,
  SpeakerSimpleHigh,
  CalendarBlank,
} from "@phosphor-icons/react";
import { buildCues, useCallPlayback, type CueLine } from "./useCallPlayback";
import { SPEEDTOLEAD_CUES } from "./callCues.generated";
import { FictionLabel, AuditCTA, StatusChip, Takeaway, DemoHeader } from "./DemoChrome";
import { PhoneFrame, Monogram, RingPulse, Waveform, CallBubble, CallGlyph } from "./CallUI";
import { useDemoMotion, useChatAutoScroll, callLength, clockAt, mmss, FRAME_H } from "./motion";

/**
 * "Watch the 20-second callback" — Demo 2.
 * Fill in a real enquiry form inside a mini browser window → the button morphs
 * to a spinner → a stopwatch counts 0→20s (compressed) → the same smartphone
 * frame rings → the callback plays (audio-optional, /demos/speedtolead-call.mp3)
 * → a booking-confirmed card drops into a mini calendar. The typed name/suburb/
 * job personalise the on-screen headers + cards only; the audio stays the
 * scripted example (hence the "Example call" caption).
 *
 * Cues: SPEEDTOLEAD_CUES (callCues.generated.ts) carry EXACT startSec/dur from
 * the generated MP3; LINES + buildCues() is the transcript-only fallback.
 */

const AUDIO_SRC = "/demos/speedtolead-call.mp3";

const LINES: CueLine[] = [
  { speaker: "ai", text: "Hi, this is the assistant from Harbourline Plumbing — you just popped in a request for gutter cleaning on a two-storey in Parramatta. Have I caught you at an okay time?" },
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

const CUES = SPEEDTOLEAD_CUES?.length ? SPEEDTOLEAD_CUES : buildCues(LINES);
const TOTAL = callLength(CUES);

const JOB_OPTIONS = [
  { id: "gutter", label: "Gutter cleaning" },
  { id: "tap", label: "Leaking tap" },
  { id: "hotwater", label: "Hot water" },
];

const STEPS = ["Enquiry submitted", "Called back in 20s", "Job booked"];

type Stage = "form" | "timeline" | "call";
type CallPhase = "ringing" | "incall";

const sanitize = (v: string) => v.replace(/[^\p{L}\p{M}\s'’-]/gu, "").replace(/\s{2,}/g, " ").trimStart().slice(0, 20);

export default function SpeedToLeadDemo() {
  const pb = useCallPlayback(CUES, AUDIO_SRC);
  const m = useDemoMotion();
  const chat = useChatAutoScroll(`${pb.index}-${pb.status}`, !m.reduce);

  const [stage, setStage] = useState<Stage>("form");
  const [submitting, setSubmitting] = useState(false);
  const [callPhase, setCallPhase] = useState<CallPhase>("ringing");
  const [seconds, setSeconds] = useState(0);

  const [name, setName] = useState("Jordan");
  const [job, setJob] = useState("gutter");
  const [suburb, setSuburb] = useState("Parramatta");

  const timers = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  const safeName = sanitize(name).trim() || "Jordan";
  const safeSuburb = sanitize(suburb).trim() || "Parramatta";
  const jobLabel = JOB_OPTIONS.find((j) => j.id === job)!.label;

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Button morphs to spinner (~800ms) → stopwatch stage.
    timers.current.push(
      window.setTimeout(() => {
        setSubmitting(false);
        setStage("timeline");
        setSeconds(0);
        // Compress the 20s callback into ~2.6s of stopwatch.
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
            setStage("call");
            setCallPhase("ringing");
          }, runMs)
        );
        // Ring, then auto-answer into the live call.
        timers.current.push(
          window.setTimeout(() => {
            setCallPhase("incall");
            pb.start();
          }, runMs + 1300)
        );
      }, 800)
    );
  };

  const replay = () => {
    clearTimers();
    pb.reset();
    setSubmitting(false);
    setSeconds(0);
    setCallPhase("ringing");
    setStage("form");
  };

  const shown = pb.index >= 0 ? CUES.slice(0, pb.index + 1) : [];
  const ended = pb.status === "ended";
  const elapsed = pb.progress * TOTAL;
  const activeSpeaker: "ai" | "caller" | null = ended ? null : pb.status === "playing" ? (CUES[Math.max(0, pb.index)]?.speaker ?? "ai") : null;

  const activeStep = stage === "form" ? 0 : ended ? 2 : 1;

  return (
    <div style={{ maxWidth: "27rem", margin: "0 auto", width: "100%" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={pb.audioRef} src={AUDIO_SRC} preload="none" />

      <DemoHeader>
      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
        {STEPS.map((label, i) => {
          const done = i < activeStep;
          const current = i === activeStep;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  flex: 1,
                  minWidth: 0,
                  background: current ? "var(--color-accent-soft)" : "transparent",
                  border: `1px solid ${current ? "var(--color-accent-border-soft)" : done ? "var(--color-accent-border-soft)" : "var(--color-border)"}`,
                  borderRadius: "2rem",
                  padding: "0.28rem 0.5rem",
                }}
              >
                <span
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 999,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.56rem",
                    fontWeight: 800,
                    background: done || current ? "var(--color-accent)" : "var(--color-fill-subtle)",
                    color: done || current ? "var(--color-on-accent)" : "var(--color-text-faint)",
                  }}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: current ? "var(--color-accent)" : done ? "var(--color-text-bright)" : "var(--color-text-faint)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live status chip */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {stage === "form" && <StatusChip tone="muted">Fill it in like a real customer would</StatusChip>}
        {stage === "timeline" && <StatusChip tone="live">Calling {safeName} back…</StatusChip>}
        {stage === "call" && callPhase === "ringing" && <StatusChip tone="live">Ringing {safeName}…</StatusChip>}
        {stage === "call" && callPhase === "incall" && !ended && <StatusChip tone="live">On the call — {mmss(elapsed)}</StatusChip>}
        {ended && <StatusChip tone="success">Booked ✓ · Friday afternoon</StatusChip>}
      </div>
      </DemoHeader>

      {/* ── Browser window: form + stopwatch ── */}
      {(stage === "form" || stage === "timeline") && (
        <div style={{ height: FRAME_H, maxWidth: "27rem", margin: "0 auto", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1rem", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px var(--color-phone-shadow-soft)" }}>
          {/* Window controls + tab */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.55rem 0.75rem 0", background: "var(--color-bg-subtle)" }}>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--color-win-close)" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--color-win-min)" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--color-win-max)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderBottom: "none", borderRadius: "0.5rem 0.5rem 0 0", padding: "0.35rem 0.7rem", fontSize: "0.68rem", color: "var(--color-text-muted)", fontWeight: 600, maxWidth: "62%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <Monogram size={13} label="H" />
              Harbourline Plumbing
            </div>
          </div>
          {/* Address bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.75rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flex: 1, background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "2rem", padding: "0.3rem 0.7rem", fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
              <LockSimple size={12} weight="fill" style={{ color: "var(--color-accent)" }} />
              harbourlineplumbing.com.au
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.1rem 1.15rem" }}>
            {stage === "form" && (
              <motion.div initial={m.fade.initial} animate={m.fade.animate} transition={m.fade.transition}>
                <p style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "var(--color-accent)", marginBottom: "0.3rem" }}>Book a plumber</p>
                <h4 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>Get a fast callback</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "1rem" }}>Pop your details in and we&apos;ll ring you straight back.</p>

                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  <Field label="First name">
                    <input value={name} onChange={(e) => setName(sanitize(e.target.value))} maxLength={20} placeholder="Jordan" style={inputStyle} />
                  </Field>
                  <Field label="What do you need?">
                    <div style={{ position: "relative" }}>
                      <select value={job} onChange={(e) => setJob(e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: "2rem", cursor: "pointer" }}>
                        {JOB_OPTIONS.map((j) => (
                          <option key={j.id} value={j.id}>{j.label}</option>
                        ))}
                      </select>
                      <CaretDown size={13} weight="bold" style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-faint)", pointerEvents: "none" }} />
                    </div>
                  </Field>
                  <Field label="Suburb">
                    <input value={suburb} onChange={(e) => setSuburb(sanitize(e.target.value))} maxLength={20} placeholder="Parramatta" style={inputStyle} />
                  </Field>
                  <Field label="Phone">
                    <input value="0491 570 156" readOnly aria-readonly style={{ ...inputStyle, color: "var(--color-text-muted)", background: "var(--color-bg-subtle)", cursor: "default" }} />
                  </Field>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ marginTop: "0.3rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "var(--color-accent)", color: "var(--color-on-accent)", border: "none", borderRadius: "0.7rem", padding: "0.75rem 1.25rem", fontSize: "0.85rem", fontWeight: 700, cursor: submitting ? "default" : "pointer" }}
                  >
                    {submitting ? (
                      <>
                        <motion.span
                          animate={m.reduce ? undefined : { rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          style={{ width: 15, height: 15, borderRadius: 999, border: "2px solid var(--color-on-dark-30)", borderTopColor: "var(--color-on-accent)", display: "inline-block" }}
                        />
                        Sending…
                      </>
                    ) : (
                      "Request my callback"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {stage === "timeline" && (
              <motion.div initial={m.fade.initial} animate={m.fade.animate} transition={m.fade.transition} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1.4rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "var(--color-accent)" }}>
                  <CheckCircle size={20} weight="fill" />
                  <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Enquiry received</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "var(--color-text-faint)" }}>Calling you back in</span>
                  <p style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "3.6rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                    {seconds.toFixed(1)}s
                  </p>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", maxWidth: "18rem", lineHeight: 1.5 }}>No waiting on hold. The agent rings {safeName} while the enquiry is still hot.</p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── Phone: ringing + live call ── */}
      {stage === "call" && (
        <PhoneFrame time="2:14 pm">
          {callPhase === "ringing" ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 1.5rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.74rem", color: "var(--color-on-dark-text-faint)", letterSpacing: "0.03em" }}>Incoming call</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!m.reduce && <RingPulse size={96} />}
                  <Monogram size={96} label="HP" wiggle={!m.reduce} />
                </div>
                <div>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-on-dark-text)" }}>Harbourline Plumbing</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-on-dark-text-muted)", marginTop: "0.2rem" }}>calling you back…</p>
                </div>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-faint)" }}>~20 seconds after you hit submit</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.25rem 0.9rem 0.7rem", borderBottom: "1px solid var(--color-on-dark-07)", flexShrink: 0 }}>
                <Monogram size={32} label="HP" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.15 }}>Harbourline Plumbing</p>
                  <p style={{ fontSize: "0.66rem", color: "var(--color-on-dark-text-faint)" }}>Speed-to-lead callback</p>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: ended ? "var(--color-on-dark-text-muted)" : "var(--color-accent)", fontVariantNumeric: "tabular-nums" }}>
                  {ended ? `Ended ${mmss(TOTAL)}` : mmss(elapsed)}
                </span>
              </div>

              {/* Waveform + decorative controls */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "0.55rem 0.9rem 0.45rem", flexShrink: 0 }}>
                <Waveform active={activeSpeaker} reduce={m.reduce} />
                <div style={{ display: "flex", gap: "1.4rem" }}>
                  <CallGlyph label="Mute"><MicrophoneSlash size={17} /></CallGlyph>
                  <CallGlyph label="Keypad"><GridFour size={17} /></CallGlyph>
                  <CallGlyph label="Speaker"><SpeakerSimpleHigh size={17} /></CallGlyph>
                </div>
                <span style={{ fontSize: "0.6rem", color: "var(--color-on-dark-text-faint)" }}>Example call — your typed details show on the cards</span>
              </div>

              {/* Transcript (internal scroll) + booking card */}
              <div
                ref={chat.ref}
                onScroll={chat.onScroll}
                onWheel={chat.onWheel}
                data-demo-scroll="speedtolead"
                style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.7rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.45rem", minHeight: 0 }}
              >
                <AnimatePresence initial={false}>
                  {shown.map((c, i) => (
                    <CallBubble
                      key={i}
                      ai={c.speaker === "ai"}
                      label={c.speaker === "ai" ? "AI agent" : safeName}
                      text={c.text}
                      time={clockAt(2, 14, "pm", c.startSec)}
                      motionProps={m.bubble}
                    />
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {ended && (
                    <motion.div
                      initial={m.card.initial}
                      animate={m.card.animate}
                      transition={{ ...m.card.transition, delay: 0.15 }}
                      style={{ marginTop: "0.4rem", background: "var(--color-accent-tint)", border: "1px solid var(--color-accent-border)", borderRadius: "1rem", padding: "0.8rem 0.85rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                        <CheckCircle size={15} weight="fill" style={{ color: "var(--color-accent)" }} />
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-on-dark-text)" }}>Booking confirmed — {safeName}</p>
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.6 }}>{jobLabel} · {safeSuburb}</p>

                      {/* Mini calendar row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.55rem" }}>
                        {[
                          { d: "Wed", n: "16" },
                          { d: "Thu", n: "17" },
                          { d: "Fri", n: "18", active: true },
                          { d: "Sat", n: "19" },
                        ].map((day) => (
                          <div
                            key={day.d}
                            style={{
                              flex: 1,
                              textAlign: "center",
                              borderRadius: "0.6rem",
                              padding: "0.35rem 0.1rem",
                              background: day.active ? "var(--color-accent)" : "var(--color-on-dark-07)",
                              border: `1px solid ${day.active ? "var(--color-accent)" : "var(--color-on-dark-10)"}`,
                            }}
                          >
                            <p style={{ fontSize: "0.54rem", fontWeight: 700, color: day.active ? "var(--color-on-accent)" : "var(--color-on-dark-text-faint)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{day.d}</p>
                            <p style={{ fontSize: "0.8rem", fontWeight: 800, color: day.active ? "var(--color-on-accent)" : "var(--color-on-dark-text-muted)" }}>{day.n}</p>
                            {day.active && <p style={{ fontSize: "0.5rem", fontWeight: 700, color: "var(--color-on-accent)" }}>PM</p>}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.55rem", color: "var(--color-accent)" }}>
                        <CalendarBlank size={13} weight="fill" />
                        <p style={{ fontSize: "0.72rem", fontWeight: 600 }}>Friday afternoon · notes sent to plumber</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress hairline */}
              <div style={{ height: 2, background: "var(--color-on-dark-07)", flexShrink: 0 }}>
                <div style={{ height: "100%", width: `${pb.progress * 100}%`, background: "var(--color-accent)", transition: "width 0.1s linear" }} />
              </div>
            </>
          )}
        </PhoneFrame>
      )}

      {/* Replay */}
      {stage !== "form" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
          <button
            onClick={replay}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--color-bg-subtle)", color: "var(--color-text)", border: "1px solid var(--color-border)", borderRadius: "2rem", padding: "0.5rem 1.1rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
          >
            <ArrowClockwise size={14} weight="bold" /> Replay from the form
          </button>
        </div>
      )}

      {ended && <Takeaway>You&apos;d have called back before the other quote even saw the enquiry.</Takeaway>}
      <FictionLabel business="Harbourline Plumbing" />
      <AuditCTA />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--color-bg-card)",
  border: "1px solid var(--color-border-strong)",
  borderRadius: "0.6rem",
  padding: "0.55rem 0.7rem",
  fontSize: "0.85rem",
  color: "var(--color-text)",
  fontFamily: "inherit",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: "0.64rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-faint)", fontWeight: 700, marginBottom: "0.3rem" }}>{label}</span>
      {children}
    </label>
  );
}
