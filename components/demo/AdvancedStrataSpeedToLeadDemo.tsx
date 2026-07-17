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
  Warning,
  Lightning,
  ChatText,
} from "@phosphor-icons/react";
import { buildCues, useCallPlayback, type CueLine } from "./useCallPlayback";
import { AS_SPEEDTOLEAD_CUES } from "./callCues.generated";
import { StatusChip, Takeaway, DemoHeader } from "./DemoChrome";
import { PhoneFrame, Monogram, RingPulse, Waveform, CallBubble, CallGlyph } from "./CallUI";
import { useDemoMotion, useChatAutoScroll, callLength, clockAt, mmss, FRAME_H } from "./motion";

/**
 * Advanced Strata — Speed-to-Lead callback (upsell demo).
 * Adapted from SpeedToLeadDemo, rebranded for Advanced Strata (a strata
 * inspection business, not a tradie). A buyer fills the enquiry form on
 * advancedstrata.com.au → "Submit enquiry" → an ~18-second stopwatch → the same
 * smartphone frame rings → the callback plays (audio-optional) → a PRIORITY
 * booking card routes to Matthew, flagging the Friday cooling-off deadline.
 *
 * VOICE: audio is generated separately via MuAPI (scripts/generate-muapi-dialogue.mjs)
 * to /demos/advanced-strata-speedtolead.mp3 with the SAME Sarah/Charlie voices as
 * the receptionist demo. Until that file lands, useCallPlayback gracefully falls
 * back to a reading-pace timer over these cues — the transcript still plays
 * end-to-end, silently. Cues: AS_SPEEDTOLEAD_CUES (exact, once generated) else
 * buildCues(LINES) — same pattern as the other spoken demos.
 */

const AUDIO_SRC = "/demos/advanced-strata-speedtolead.mp3";

const LINES: CueLine[] = [
  { speaker: "ai", text: "Hi, it's the assistant from Advanced Strata — you just popped in an enquiry on our site about a strata report. Quick heads up, this call's recorded for training; happy to switch that off if you'd prefer. Have I caught you at an okay time?" },
  { speaker: "caller", text: "Oh — wow, that was quick. I literally just submitted the form." },
  { speaker: "ai", text: "We like to be quick — the sooner we get your report moving, the better, especially if there's a deadline. Which property's it for?" },
  { speaker: "caller", text: "Yeah, um — it's an apartment in Wollongong I'm looking at buying." },
  { speaker: "ai", text: "Lovely. And is there a cooling-off date you're working towards?" },
  { speaker: "caller", text: "Yeah, it ends Friday, so it's a bit tight." },
  { speaker: "ai", text: "Friday's doable — for that we'd do the urgent report: three hundred and sixty dollars plus GST, back within forty-eight hours. Did the agent give you a strata plan number, or just the address?" },
  { speaker: "caller", text: "Ah — just the address, I think. I don't have a plan number on me." },
  { speaker: "ai", text: "No problem at all — we can pull that from the address. What's the address?" },
  { speaker: "caller", text: "It's unit eight, forty Crown Street, Wollongong." },
  { speaker: "ai", text: "Unit eight, forty Crown Street — got it. I'll text you the order link now so you can lock it in, and I'll flag your Friday deadline as priority for Matthew. Is this the best number for the text — the one you're on?" },
  { speaker: "caller", text: "Yeah, this one's good." },
  { speaker: "ai", text: "Perfect. You'll have the link in a moment, and Matthew will make sure the inspection's booked in time for Friday. Anything else I can help with?" },
  { speaker: "caller", text: "No, that's great — honestly, that was so easy. Thanks so much." },
  { speaker: "ai", text: "My pleasure. Good luck with the apartment — bye for now." },
];

const CUES = AS_SPEEDTOLEAD_CUES?.length ? AS_SPEEDTOLEAD_CUES : buildCues(LINES);
const TOTAL = callLength(CUES);

const ENQUIRY_OPTIONS = [
  { id: "prepurchase", label: "Pre-purchase strata report" },
  { id: "review", label: "Strata report review" },
  { id: "section108", label: "Section 108 inspection" },
];

const STEPS = ["Enquiry submitted", "Called back in 18s", "Booked"];

type Stage = "form" | "timeline" | "call";
type CallPhase = "ringing" | "incall";

const sanitize = (v: string) => v.replace(/[^\p{L}\p{M}\s'’.-]/gu, "").replace(/\s{2,}/g, " ").trimStart().slice(0, 24);

export default function AdvancedStrataSpeedToLeadDemo() {
  const pb = useCallPlayback(CUES, AUDIO_SRC);
  const m = useDemoMotion();
  const chat = useChatAutoScroll(`${pb.index}-${pb.status}`, !m.reduce);

  const [stage, setStage] = useState<Stage>("form");
  const [submitting, setSubmitting] = useState(false);
  const [callPhase, setCallPhase] = useState<CallPhase>("ringing");
  const [seconds, setSeconds] = useState(0);

  const [name, setName] = useState("Josh M.");
  const [enquiry, setEnquiry] = useState("prepurchase");
  const [suburb, setSuburb] = useState("Wollongong");

  const timers = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  const safeName = sanitize(name).trim() || "Josh M.";
  const safeSuburb = sanitize(suburb).trim() || "Wollongong";
  const enquiryLabel = ENQUIRY_OPTIONS.find((j) => j.id === enquiry)!.label;

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
        // Compress the 18s callback into ~2.6s of stopwatch.
        const runMs = 2600;
        const startTs = performance.now();
        const tick = () => {
          const p = Math.min(1, (performance.now() - startTs) / runMs);
          setSeconds(Number((p * 18).toFixed(1)));
          if (p < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        timers.current.push(
          window.setTimeout(() => {
            setSeconds(18);
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
          {stage === "form" && <StatusChip tone="muted">Fill it in like a real buyer would</StatusChip>}
          {stage === "timeline" && <StatusChip tone="live">Calling {safeName} back…</StatusChip>}
          {stage === "call" && callPhase === "ringing" && <StatusChip tone="live">Ringing {safeName}…</StatusChip>}
          {stage === "call" && callPhase === "incall" && !ended && <StatusChip tone="live">On the call — {mmss(elapsed)}</StatusChip>}
          {ended && <StatusChip tone="success">Booked ✓ · PRIORITY to Matthew</StatusChip>}
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
              <Monogram size={13} label="A" />
              Advanced Strata
            </div>
          </div>
          {/* Address bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.75rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flex: 1, background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "2rem", padding: "0.3rem 0.7rem", fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
              <LockSimple size={12} weight="fill" style={{ color: "var(--color-accent)" }} />
              advancedstrata.com.au
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.1rem 1.15rem" }}>
            {stage === "form" && (
              <motion.div initial={m.fade.initial} animate={m.fade.animate} transition={m.fade.transition}>
                <p style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "var(--color-accent)", marginBottom: "0.3rem" }}>Request a report</p>
                <h4 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>Get a fast callback</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "1rem" }}>Pop your details in and we&apos;ll ring you straight back.</p>

                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  <Field label="Your name">
                    <input value={name} onChange={(e) => setName(sanitize(e.target.value))} maxLength={24} placeholder="Josh M." style={inputStyle} />
                  </Field>
                  <Field label="What do you need?">
                    <div style={{ position: "relative" }}>
                      <select value={enquiry} onChange={(e) => setEnquiry(e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: "2rem", cursor: "pointer" }}>
                        {ENQUIRY_OPTIONS.map((j) => (
                          <option key={j.id} value={j.id}>{j.label}</option>
                        ))}
                      </select>
                      <CaretDown size={13} weight="bold" style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-faint)", pointerEvents: "none" }} />
                    </div>
                  </Field>
                  <Field label="Property location">
                    <input value={suburb} onChange={(e) => setSuburb(sanitize(e.target.value))} maxLength={24} placeholder="Wollongong" style={inputStyle} />
                  </Field>
                  <Field label="Phone">
                    <input value="0491 570 158" readOnly aria-readonly style={{ ...inputStyle, color: "var(--color-text-muted)", background: "var(--color-bg-subtle)", cursor: "default" }} />
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
                      "Submit enquiry"
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
                <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", maxWidth: "18rem", lineHeight: 1.5 }}>No waiting on hold. The assistant rings {safeName} while the enquiry is still hot.</p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── Phone: ringing + live call ── */}
      {stage === "call" && (
        <PhoneFrame time="3:20 pm">
          {callPhase === "ringing" ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 1.5rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.74rem", color: "var(--color-on-dark-text-faint)", letterSpacing: "0.03em" }}>Incoming call</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!m.reduce && <RingPulse size={96} />}
                  <Monogram size={96} label="AS" wiggle={!m.reduce} />
                </div>
                <div>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-on-dark-text)" }}>Advanced Strata</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-on-dark-text-muted)", marginTop: "0.2rem" }}>calling you back…</p>
                </div>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-faint)" }}>~18 seconds after you hit submit</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.25rem 0.9rem 0.7rem", borderBottom: "1px solid var(--color-on-dark-07)", flexShrink: 0 }}>
                <Monogram size={32} label="AS" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.15 }}>Advanced Strata</p>
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
                <span style={{ fontSize: "0.6rem", color: "var(--color-on-dark-text-faint)" }}>Example callback — your typed details show on the card</span>
              </div>

              {/* Transcript (internal scroll) + booking card */}
              <div
                ref={chat.ref}
                onScroll={chat.onScroll}
                onWheel={chat.onWheel}
                data-demo-scroll="as-speedtolead"
                style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.7rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.45rem", minHeight: 0 }}
              >
                <AnimatePresence initial={false}>
                  {shown.map((c, i) => (
                    <CallBubble
                      key={i}
                      ai={c.speaker === "ai"}
                      label={c.speaker === "ai" ? "AI assistant" : safeName}
                      text={c.text}
                      time={clockAt(3, 20, "pm", c.startSec)}
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
                      style={{ marginTop: "0.4rem", background: "var(--color-phone-bubble)", border: "1px solid var(--color-on-dark-danger-border)", borderRadius: "1rem", padding: "0.8rem 0.85rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                        <ChatText size={13} weight="fill" style={{ color: "var(--color-on-dark-text-muted)" }} />
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--color-on-dark-text-muted)", letterSpacing: "0.03em" }}>MESSAGES · to Matthew · now</span>
                      </div>
                      {/* PRIORITY cooling-off strip */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--color-on-dark-danger-soft)", border: "1px solid var(--color-on-dark-danger-border)", borderRadius: "0.6rem", padding: "0.4rem 0.55rem", marginBottom: "0.5rem" }}>
                        <Warning size={13} weight="fill" style={{ color: "var(--color-on-dark-danger)", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-on-dark-danger-text)", lineHeight: 1.3 }}>New web enquiry — PRIORITY · cooling-off ends Friday</span>
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55 }}>{safeName} (from web form) · {enquiryLabel}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55, marginTop: "0.2rem" }}>Unit 8/40 Crown St, {safeSuburb} · SP: auto-lookup from address</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55, marginTop: "0.2rem" }}>Urgent 48-hr report — $396 incl. GST · order link sent</p>
                      {/* Speed line */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem", color: "var(--color-accent)" }}>
                        <Lightning size={13} weight="fill" />
                        <p style={{ fontSize: "0.72rem", fontWeight: 700 }}>Called back 18 seconds after form submission</p>
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-danger)", fontWeight: 600, lineHeight: 1.55, marginTop: "0.4rem" }}>Notes sent to Matthew for first-thing booking</p>
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

      {ended && <Takeaway>You&apos;d have rung the buyer back before the other inspector even opened the enquiry.</Takeaway>}

      {/* Demo disclosure — scripted example, real published prices */}
      <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--color-text-faint)", marginTop: "0.9rem", lineHeight: 1.5 }}>
        Demo — a scripted example callback. &ldquo;Josh&rdquo; and the property are fictional; pricing and turnaround are Advanced Strata&apos;s real published figures.
      </p>
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
