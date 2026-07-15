"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CellSignalHigh, WifiHigh, BatteryHigh } from "@phosphor-icons/react";
import { FRAME_H, type MotionPreset } from "./motion";

/**
 * Shared smartphone chrome for the two spoken demos (Receptionist, Speed-to-Lead)
 * so both read as the *same* device. A rounded OLED-dark body (phone-shell
 * tokens), punch-hole camera dot, and a slim status bar. Fixed to FRAME_H — the
 * screen never grows with content; message areas scroll internally.
 * Colours are tokens only.
 */

function StatusBar({ time }: { time: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.55rem 1.15rem 0.4rem",
        fontSize: "0.72rem",
        color: "var(--color-on-dark-text)",
        flexShrink: 0,
      }}
    >
      <span style={{ fontWeight: 600, letterSpacing: "0.02em" }}>{time}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--color-on-dark-text-bright)" }}>
        <CellSignalHigh size={14} weight="fill" />
        <WifiHigh size={14} weight="fill" />
        <BatteryHigh size={17} weight="fill" />
      </span>
    </div>
  );
}

export function PhoneFrame({ time = "9:04 pm", children }: { time?: string; children: ReactNode }) {
  return (
    <div
      style={{
        height: FRAME_H,
        maxWidth: "20rem",
        width: "100%",
        margin: "0 auto",
        background: "var(--color-phone-shell)",
        border: "1px solid var(--color-on-dark-10)",
        borderRadius: "2.4rem",
        padding: "0.5rem",
        boxShadow: "0 24px 60px var(--color-phone-shadow)",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          background: "var(--color-phone-screen)",
          borderRadius: "2rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Punch-hole camera */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 9,
            height: 9,
            borderRadius: 999,
            background: "var(--color-phone-notch)",
            border: "1px solid var(--color-on-dark-12)",
            zIndex: 4,
          }}
        />
        <StatusBar time={time} />
        {children}
      </div>
    </div>
  );
}

/** Circular brand monogram avatar (e.g. "HP" for Harbourline Plumbing). */
export function Monogram({ size = 92, label = "HP", wiggle = false }: { size?: number; label?: string; wiggle?: boolean }) {
  const inner = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: "var(--color-accent-tint)",
        border: "1px solid var(--color-accent-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-accent)",
        fontFamily: "var(--font-cabinet), Outfit, sans-serif",
        fontWeight: 800,
        fontSize: size * 0.34,
        letterSpacing: "-0.01em",
      }}
    >
      {label}
    </div>
  );
  if (!wiggle) return inner;
  return (
    <motion.div animate={{ rotate: [0, -3, 3, -3, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} style={{ display: "inline-flex" }}>
      {inner}
    </motion.div>
  );
}

/** Concentric ring-pulse behind an avatar on the incoming-call screen. */
export function RingPulse({ size = 92 }: { size?: number }) {
  return (
    <>
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.9 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: i * 1 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size,
            height: size,
            marginTop: -size / 2,
            marginLeft: -size / 2,
            borderRadius: 999,
            border: "2px solid var(--color-accent-border)",
          }}
        />
      ))}
    </>
  );
}

/**
 * 5-bar speaking waveform. Colour + motion track WHICHEVER party is currently
 * speaking (active). Falls back to short static bars under reduced motion or
 * when nobody is speaking.
 */
export function Waveform({ active, reduce }: { active: "ai" | "caller" | null; reduce: boolean }) {
  const color = active === "caller" ? "var(--color-on-dark-text-muted)" : "var(--color-accent)";
  const peaks = [0.45, 0.72, 1, 0.62, 0.5];
  return (
    <div aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 24 }}>
      {peaks.map((p, i) => {
        if (reduce || !active) {
          return (
            <span
              key={i}
              style={{
                width: 4,
                height: 24 * (active ? p * 0.7 : 0.28),
                background: active ? color : "var(--color-on-dark-12)",
                borderRadius: 2,
                opacity: active ? 0.85 : 0.6,
              }}
            />
          );
        }
        return (
          <motion.span
            key={i}
            animate={{ scaleY: [p * 0.4, p, p * 0.55, p * 0.85, p * 0.4] }}
            transition={{ duration: 0.7 + i * 0.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
            style={{ width: 4, height: 24, transformOrigin: "center", background: color, borderRadius: 2 }}
          />
        );
      })}
    </div>
  );
}

/** A chat bubble on the dark phone screen, with speaker label + timestamp. */
export function CallBubble({
  ai,
  label,
  text,
  time,
  motionProps,
}: {
  ai: boolean;
  label: string;
  text: string;
  time: string;
  motionProps: MotionPreset;
}) {
  return (
    <motion.div
      initial={motionProps.initial}
      animate={motionProps.animate}
      transition={motionProps.transition}
      style={{ alignSelf: ai ? "flex-start" : "flex-end", maxWidth: "82%" }}
    >
      <div
        style={{
          background: ai ? "var(--color-accent-tint)" : "var(--color-phone-bubble)",
          border: ai ? "1px solid var(--color-accent-border)" : "1px solid var(--color-on-dark-07)",
          color: ai ? "var(--color-on-dark-text)" : "var(--color-on-dark-text-bright)",
          borderRadius: "1rem",
          borderBottomLeftRadius: ai ? "0.3rem" : "1rem",
          borderBottomRightRadius: ai ? "1rem" : "0.3rem",
          padding: "0.5rem 0.72rem",
          fontSize: "0.8rem",
          lineHeight: 1.5,
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: ai ? "var(--color-accent)" : "var(--color-on-dark-text-faint)",
            marginBottom: "0.2rem",
          }}
        >
          {label}
        </span>
        {text}
      </div>
      <p
        style={{
          fontSize: "0.56rem",
          color: "var(--color-on-dark-text-faint)",
          marginTop: "0.2rem",
          textAlign: ai ? "left" : "right",
          paddingInline: "0.3rem",
        }}
      >
        {time}
      </p>
    </motion.div>
  );
}

/** Decorative in-call control glyph (mute / keypad / speaker). Non-interactive. */
export function CallGlyph({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      aria-hidden
      title={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: 999,
        background: "var(--color-on-dark-07)",
        border: "1px solid var(--color-on-dark-10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-on-dark-text-muted)",
      }}
    >
      {children}
    </div>
  );
}
