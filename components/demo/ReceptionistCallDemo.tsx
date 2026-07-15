"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneDisconnect,
  Play,
  ArrowClockwise,
  SpeakerHigh,
  SpeakerSlash,
  ChatText,
  MicrophoneSlash,
  GridFour,
  SpeakerSimpleHigh,
} from "@phosphor-icons/react";
import { buildCues, useCallPlayback, type CueLine } from "./useCallPlayback";
import { RECEPTIONIST_CUES } from "./callCues.generated";
import { FictionLabel, AuditCTA, StatusChip, Takeaway, DemoHeader } from "./DemoChrome";
import { PhoneFrame, Monogram, RingPulse, Waveform, CallBubble, CallGlyph } from "./CallUI";
import { useDemoMotion, useChatAutoScroll, callLength, clockAt, mmss } from "./motion";

/**
 * "Hear it take a real call" — Demo 1.
 * A full smartphone shows an after-hours incoming call from Harbourline Plumbing;
 * Answer starts playback and the call plays with a live waveform + transcript,
 * then the owner's SMS summary slides in as a notification banner. Audio-optional:
 * tries /demos/receptionist-call.mp3, otherwise a transcript-only fallback.
 *
 * Cues: RECEPTIONIST_CUES (callCues.generated.ts) carry the EXACT startSec/dur
 * measured from the generated MP3 — used whenever available. LINES + buildCues()
 * is the transcript-only fallback used only if the generated cues go missing.
 */

const AUDIO_SRC = "/demos/receptionist-call.mp3";

const LINES: CueLine[] = [
  { speaker: "ai", text: "Good evening, you've reached Harbourline Plumbing's after-hours assistant. I can take your details and get you booked in — what's going on tonight?" },
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

const CUES = RECEPTIONIST_CUES?.length ? RECEPTIONIST_CUES : buildCues(LINES);
const TOTAL = callLength(CUES);

export default function ReceptionistCallDemo() {
  const pb = useCallPlayback(CUES, AUDIO_SRC);
  const m = useDemoMotion();
  const chat = useChatAutoScroll(`${pb.index}-${pb.status}`, !m.reduce);
  const [declined, setDeclined] = useState(false);

  const replay = () => {
    pb.reset();
    requestAnimationFrame(() => pb.start());
  };

  const answer = () => {
    setDeclined(false);
    pb.start();
  };

  const shown = pb.index >= 0 ? CUES.slice(0, pb.index + 1) : [];
  const isIdle = pb.status === "idle";
  const ended = pb.status === "ended";
  const elapsed = pb.progress * TOTAL;
  const activeSpeaker: "ai" | "caller" | null = ended ? null : pb.status === "playing" ? (CUES[Math.max(0, pb.index)]?.speaker ?? "ai") : null;

  return (
    <div style={{ maxWidth: "22rem", margin: "0 auto", width: "100%" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={pb.audioRef} src={AUDIO_SRC} preload="none" />

      {/* Comprehension chip */}
      <DemoHeader>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {isIdle && <StatusChip tone="live">After-hours call incoming</StatusChip>}
          {pb.status === "playing" && <StatusChip tone="live">On the call — {mmss(elapsed)}</StatusChip>}
          {ended && <StatusChip tone="success">Booked ✓ · call ended {mmss(TOTAL)}</StatusChip>}
        </div>
      </DemoHeader>

      <PhoneFrame time="9:04 pm">
        {isIdle ? (
          /* ── Incoming-call screen ── */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 1.5rem 1.75rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.74rem", color: "var(--color-on-dark-text-faint)", letterSpacing: "0.03em" }}>Incoming call</p>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!m.reduce && <RingPulse size={96} />}
                <Monogram size={96} label="HP" wiggle={!m.reduce} />
              </div>
              <div>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.2 }}>Harbourline Plumbing</p>
                <p style={{ fontSize: "0.82rem", color: "var(--color-on-dark-text-muted)", marginTop: "0.2rem" }}>After Hours</p>
                <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-faint)", marginTop: "0.1rem" }}>mobile · Sydney</p>
              </div>
            </div>

            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                <button
                  onClick={() => setDeclined(true)}
                  aria-label="Decline call"
                  style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <span style={{ width: 56, height: 56, borderRadius: 999, background: "var(--color-call-decline)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px var(--color-phone-shadow-soft)" }}>
                    <PhoneDisconnect size={26} weight="fill" style={{ color: "var(--color-on-accent)" }} />
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-on-dark-text-muted)", fontWeight: 600 }}>Decline</span>
                </button>
                <button
                  onClick={answer}
                  style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <motion.span
                    animate={m.reduce ? undefined : { scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 56, height: 56, borderRadius: 999, background: "var(--color-call-accept)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px var(--color-accent-glow)" }}
                  >
                    <Phone size={26} weight="fill" style={{ color: "var(--color-on-accent)" }} />
                  </motion.span>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-on-dark-text)", fontWeight: 700 }}>Answer</span>
                </button>
              </div>
              <AnimatePresence>
                {declined && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-muted)", marginTop: "0.9rem", lineHeight: 1.5 }}
                  >
                    That&apos;s the call you&apos;d miss — tap <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>Answer</span> to hear it caught.
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                onClick={answer}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem", background: "var(--color-on-dark-07)", color: "var(--color-on-dark-text)", border: "1px solid var(--color-on-dark-10)", borderRadius: "2rem", padding: "0.5rem 1rem", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}
              >
                <Play size={13} weight="fill" /> Play the call
              </button>
            </div>
          </div>
        ) : (
          /* ── In-call screen ── */
          <>
            {/* SMS notification banner (slides from the top on call end) */}
            <AnimatePresence>
              {ended && (
                <motion.div
                  initial={m.banner.initial}
                  animate={m.banner.animate}
                  transition={{ ...m.banner.transition, delay: 0.5 }}
                  style={{ position: "absolute", top: "2.4rem", left: "0.55rem", right: "0.55rem", zIndex: 5, background: "var(--color-phone-bubble)", border: "1px solid var(--color-accent-border)", borderRadius: "1.1rem", padding: "0.75rem 0.85rem", boxShadow: "0 16px 34px var(--color-phone-shadow)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <ChatText size={13} weight="fill" style={{ color: "var(--color-accent)" }} />
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--color-on-dark-text-muted)", letterSpacing: "0.03em" }}>MESSAGES · now</span>
                  </div>
                  <p style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--color-on-dark-text)", marginBottom: "0.3rem" }}>New after-hours booking</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.5 }}>Dave · Unit 2/14 Station St, Marrickville · 0491 570 156 (confirmed)</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55, marginTop: "0.2rem" }}>Leaking kitchen tap — mixer type, water pooling (valve shut, slow drip)</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55, marginTop: "0.2rem" }}>Booked: tomorrow 8:00am · notes sent to assigned plumber</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-accent)", fontWeight: 600, lineHeight: 1.55 }}>Customer confirmed via text.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.25rem 0.9rem 0.7rem", borderBottom: "1px solid var(--color-on-dark-07)", flexShrink: 0 }}>
              <Monogram size={32} label="HP" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.15 }}>Harbourline Plumbing</p>
                <p style={{ fontSize: "0.66rem", color: "var(--color-on-dark-text-faint)" }}>After-hours assistant</p>
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: ended ? "var(--color-on-dark-text-muted)" : "var(--color-accent)", fontVariantNumeric: "tabular-nums" }}>
                {ended ? `Ended ${mmss(TOTAL)}` : mmss(elapsed)}
              </span>
            </div>

            {/* Waveform + decorative controls */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.55rem", padding: "0.6rem 0.9rem 0.5rem", flexShrink: 0 }}>
              <Waveform active={activeSpeaker} reduce={m.reduce} />
              <div style={{ display: "flex", gap: "1.4rem" }}>
                <CallGlyph label="Mute"><MicrophoneSlash size={17} /></CallGlyph>
                <CallGlyph label="Keypad"><GridFour size={17} /></CallGlyph>
                <CallGlyph label="Speaker"><SpeakerSimpleHigh size={17} /></CallGlyph>
              </div>
            </div>

            {/* Transcript (internal scroll) */}
            <div
              ref={chat.ref}
              onScroll={chat.onScroll}
              onWheel={chat.onWheel}
              data-demo-scroll="receptionist"
              style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.7rem 0.4rem", display: "flex", flexDirection: "column", gap: "0.45rem", minHeight: 0 }}
            >
              <AnimatePresence initial={false}>
                {shown.map((c, i) => (
                  <CallBubble
                    key={i}
                    ai={c.speaker === "ai"}
                    label={c.speaker === "ai" ? "AI receptionist" : "Caller"}
                    text={c.text}
                    time={clockAt(9, 4, "pm", c.startSec)}
                    motionProps={m.bubble}
                  />
                ))}
              </AnimatePresence>
              {ended && (
                <p style={{ textAlign: "center", fontSize: "0.66rem", color: "var(--color-on-dark-text-faint)", marginTop: "0.4rem" }}>Call ended · {mmss(TOTAL)}</p>
              )}
            </div>

            {/* Progress hairline */}
            <div style={{ height: 2, background: "var(--color-on-dark-07)", flexShrink: 0 }}>
              <div style={{ height: "100%", width: `${pb.progress * 100}%`, background: "var(--color-accent)", transition: "width 0.1s linear" }} />
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.9rem", flexShrink: 0 }}>
              <button
                onClick={replay}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--color-on-dark-10)", color: "var(--color-on-dark-text)", border: "none", borderRadius: "2rem", padding: "0.45rem 0.95rem", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer" }}
              >
                <ArrowClockwise size={13} weight="bold" /> {ended ? "Replay" : "Restart"}
              </button>
              {pb.usingAudio && (
                <button
                  onClick={pb.toggleMute}
                  aria-label={pb.muted ? "Unmute" : "Mute"}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "var(--color-on-dark-10)", color: "var(--color-on-dark-text)", border: "none", borderRadius: 999, cursor: "pointer" }}
                >
                  {pb.muted ? <SpeakerSlash size={14} weight="fill" /> : <SpeakerHigh size={14} weight="fill" />}
                </button>
              )}
              <span style={{ marginLeft: "auto", fontSize: "0.64rem", color: "var(--color-on-dark-text-faint)" }}>{pb.usingAudio ? "Audio + transcript" : "Transcript demo"}</span>
            </div>
          </>
        )}
      </PhoneFrame>

      {ended && <Takeaway>That&apos;s a 9pm call captured that would&apos;ve gone to voicemail.</Takeaway>}
      <FictionLabel business="Harbourline Plumbing" />
      <AuditCTA />
    </div>
  );
}
