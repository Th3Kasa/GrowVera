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
  Warning,
  MicrophoneSlash,
  GridFour,
  SpeakerSimpleHigh,
} from "@phosphor-icons/react";
import { buildCues, useCallPlayback, type CueLine } from "./useCallPlayback";
import { ADVANCED_STRATA_CUES } from "./callCues.generated";
import { StatusChip, Takeaway, DemoHeader } from "./DemoChrome";
import { PhoneFrame, Monogram, RingPulse, Waveform, CallBubble, CallGlyph } from "./CallUI";
import { useDemoMotion, useChatAutoScroll, callLength, clockAt, mmss } from "./motion";

/**
 * Advanced Strata — PRIVATE personalised prospect demo.
 * Adapted from ReceptionistCallDemo: same phone frame, useCallPlayback engine,
 * waveform, internal scroll and fixed FRAME_H. A 7:40pm first-time buyer,
 * partway through cooling-off, calls not knowing what a strata report is; the
 * assistant explains plainly, quotes the real urgent tier, removes friction on
 * the missing SP number (auto-lookup), honestly escalates the special-levy
 * question to the inspector + Matthew, captures the lead, and texts a PRIORITY
 * summary to Matthew.
 *
 * No audit CTA — this is a private link. Cues: ADVANCED_STRATA_CUES carry the
 * exact startSec/dur measured from the generated MP3; LINES + buildCues() is the
 * transcript-only fallback used only if the generated cues go missing.
 */

const AUDIO_SRC = "/demos/advanced-strata-call.mp3";

const LINES: CueLine[] = [
  { speaker: "ai", text: "Good evening, you've reached Advanced Strata's assistant — quick heads up, this call's recorded for training; if you'd rather it wasn't, just let me know. What can I help with?" },
  { speaker: "caller", text: "Yeah, hi — so, um, I'm buying my first apartment down in Wollongong, and the agent said I need a strata report before I sign. I'll be honest, I don't really know what that is." },
  { speaker: "ai", text: "You're in the right place — that's exactly what we do. In plain terms it's a health check on the building before you buy: the finances, any special levies coming up, past defects and repairs, the by-laws and insurance — so you know what you're walking into. Have you got a deadline you're working to?" },
  { speaker: "caller", text: "Oh — right, okay. Yeah, my cooling-off ends Thursday, so it's pretty tight." },
  { speaker: "ai", text: "Thursday's doable — for that we'd do the urgent report: three hundred and sixty dollars plus GST, back within forty-eight hours. Can I grab the property address?" },
  { speaker: "caller", text: "Yeah, it's, um — unit five, twelve Corrimal Street, Wollongong." },
  { speaker: "ai", text: "Unit five, twelve Corrimal Street — got it. Do you have the strata plan number? It's on the contract, usually starts with S-P." },
  { speaker: "caller", text: "Ahh — I don't think I've got that in front of me, sorry." },
  { speaker: "ai", text: "No stress at all — we can pull that from the address on our end. One less thing for you to chase down." },
  { speaker: "caller", text: "Oh, good. Um — can I ask, the agent mentioned there might be a special levy coming up. Is that something you'd pick up?" },
  { speaker: "ai", text: "Good question — I can't put a figure on that myself, but it's exactly what the report digs into. I'll flag it so the inspector checks the meeting minutes and the building's finances for anything coming up, and Matthew can walk you through what he finds." },
  { speaker: "caller", text: "Yeah — that'd be great, thanks." },
  { speaker: "ai", text: "Easy. And your name and the best number for the confirmation text?" },
  { speaker: "caller", text: "Daniel — oh four nine one, five seven oh, one five seven." },
  { speaker: "ai", text: "Perfect, Daniel — and that's oh four nine one, five seven oh, one five seven?" },
  { speaker: "caller", text: "That's it." },
  { speaker: "ai", text: "Beautiful. I've marked your Thursday deadline as priority and noted the levy question for the inspector. You'll get a text with the order link now, and I'll send all of this to Matthew so he can book the inspection first thing." },
  { speaker: "caller", text: "Honestly — that was so much easier than I expected. Thanks so much." },
  { speaker: "ai", text: "My pleasure. Good luck with the apartment — we'll be in touch soon. Bye now." },
];

const CUES = ADVANCED_STRATA_CUES?.length ? ADVANCED_STRATA_CUES : buildCues(LINES);
const TOTAL = callLength(CUES);

export default function AdvancedStrataCallDemo() {
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
          {isIdle && <StatusChip tone="live">Evening call incoming</StatusChip>}
          {pb.status === "playing" && <StatusChip tone="live">On the call — {mmss(elapsed)}</StatusChip>}
          {ended && <StatusChip tone="success">Captured ✓ · call ended {mmss(TOTAL)}</StatusChip>}
        </div>
      </DemoHeader>

      <PhoneFrame time="7:40 pm">
        {isIdle ? (
          /* ── Incoming-call screen ── */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 1.5rem 1.75rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.74rem", color: "var(--color-on-dark-text-faint)", letterSpacing: "0.03em" }}>Incoming call</p>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!m.reduce && <RingPulse size={96} />}
                <Monogram size={96} label="AS" wiggle={!m.reduce} />
              </div>
              <div>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.2 }}>Advanced Strata</p>
                <p style={{ fontSize: "0.82rem", color: "var(--color-on-dark-text-muted)", marginTop: "0.2rem" }}>Assistant · 24/7</p>
                <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-faint)", marginTop: "0.1rem" }}>mobile · NSW</p>
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
                    That&apos;s the buyer you&apos;d miss — tap <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>Answer</span> to hear it caught.
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
            {/* SMS notification banner (slides from the top on call end) — PRIORITY summary to Matthew */}
            <AnimatePresence>
              {ended && (
                <motion.div
                  initial={m.banner.initial}
                  animate={m.banner.animate}
                  transition={{ ...m.banner.transition, delay: 0.5 }}
                  style={{ position: "absolute", top: "2.4rem", left: "0.55rem", right: "0.55rem", zIndex: 5, background: "var(--color-phone-bubble)", border: "1px solid var(--color-on-dark-danger-border)", borderRadius: "1.1rem", padding: "0.75rem 0.85rem", boxShadow: "0 16px 34px var(--color-phone-shadow)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                    <ChatText size={13} weight="fill" style={{ color: "var(--color-on-dark-text-muted)" }} />
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--color-on-dark-text-muted)", letterSpacing: "0.03em" }}>MESSAGES · to Matthew · now</span>
                  </div>
                  {/* Priority cooling-off strip */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--color-on-dark-danger-soft)", border: "1px solid var(--color-on-dark-danger-border)", borderRadius: "0.6rem", padding: "0.4rem 0.55rem", marginBottom: "0.5rem" }}>
                    <Warning size={13} weight="fill" style={{ color: "var(--color-on-dark-danger)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-on-dark-danger-text)", lineHeight: 1.3 }}>New enquiry — PRIORITY · cooling-off ends Thursday</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55 }}>Daniel · 0491 570 157 (confirmed)</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55, marginTop: "0.2rem" }}>Unit 5/12 Corrimal St, Wollongong · SP: auto-lookup from address</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-text-bright)", lineHeight: 1.55, marginTop: "0.2rem" }}>Urgent 48-hr report — $396 incl. GST · order link sent</p>
                  {/* Special-levy flag — inspector to verify. Styled like the PRIORITY banner. */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", background: "var(--color-on-dark-danger-soft)", border: "1px solid var(--color-on-dark-danger-border)", borderRadius: "0.6rem", padding: "0.4rem 0.55rem", marginTop: "0.45rem" }}>
                    <Warning size={13} weight="fill" style={{ color: "var(--color-on-dark-danger)", flexShrink: 0, marginTop: "0.1rem" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--color-on-dark-danger-text)", lineHeight: 1.35 }}>Buyer flagged possible upcoming special levy — inspector to check minutes + finances</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-on-dark-danger)", fontWeight: 600, lineHeight: 1.55, marginTop: "0.45rem" }}>Notes sent to Matthew for first-thing booking</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.25rem 0.9rem 0.7rem", borderBottom: "1px solid var(--color-on-dark-07)", flexShrink: 0 }}>
              <Monogram size={32} label="AS" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-on-dark-text)", lineHeight: 1.15 }}>Advanced Strata</p>
                <p style={{ fontSize: "0.66rem", color: "var(--color-on-dark-text-faint)" }}>Assistant · 24/7</p>
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
              data-demo-scroll="advanced-strata"
              style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.7rem 0.4rem", display: "flex", flexDirection: "column", gap: "0.45rem", minHeight: 0 }}
            >
              <AnimatePresence initial={false}>
                {shown.map((c, i) => (
                  <CallBubble
                    key={i}
                    ai={c.speaker === "ai"}
                    label={c.speaker === "ai" ? "AI assistant" : "Caller"}
                    text={c.text}
                    time={clockAt(7, 40, "pm", c.startSec)}
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

      {ended && <Takeaway>That&apos;s a buyer on a Thursday deadline — captured at 7:40pm instead of ringing the next inspector.</Takeaway>}

      {/* Demo disclosure — exact wording per the approved script */}
      <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--color-text-faint)", marginTop: "0.9rem", lineHeight: 1.5 }}>
        Demo — a scripted example call. &ldquo;Daniel&rdquo; is fictional; pricing and turnaround are Advanced Strata&apos;s real published figures.
      </p>

      {/* Quiet footer — private prospect link, no audit CTA */}
      <p style={{ textAlign: "center", fontSize: "0.68rem", color: "var(--color-text-faint)", marginTop: "0.6rem", lineHeight: 1.5 }}>
        Prepared by Growvera for Advanced Strata · growvera.com.au
      </p>
    </div>
  );
}
