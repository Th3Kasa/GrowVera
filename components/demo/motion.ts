"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * One spring language shared across all three demos. Transform/opacity only.
 * Every looping/entrance animation resolves through useDemoMotion() so that
 * `prefers-reduced-motion` collapses everything to simple, short fades with no
 * transforms. Import the presets — never hand-roll per-component curves.
 */

export const SPRING = { type: "spring", stiffness: 440, damping: 34, mass: 0.9 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 240, damping: 28, mass: 0.9 } as const;

/** Consistent fixed frame height for every demo device/window (never grows). */
export const FRAME_H = "34rem";

export type MotionPreset = {
  initial: Record<string, number>;
  animate: Record<string, number>;
  transition: Record<string, unknown>;
};

export type DemoMotion = {
  reduce: boolean;
  /** chat bubbles entering the scroll area */
  bubble: MotionPreset;
  /** end-state cards (SMS summary, booking, quote sheet) */
  card: MotionPreset;
  /** a notification banner sliding down from the top of the phone screen */
  banner: MotionPreset;
  /** generic soft fade+lift for stage swaps */
  fade: MotionPreset;
};

export function useDemoMotion(): DemoMotion {
  const reduce = !!useReducedMotion();
  if (reduce) {
    const fade: MotionPreset = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } };
    return { reduce, bubble: fade, card: { ...fade, transition: { duration: 0.25 } }, banner: { ...fade, transition: { duration: 0.25 } }, fade };
  }
  return {
    reduce,
    bubble: { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { ...SPRING } },
    card: { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { ...SPRING_SOFT } },
    banner: { initial: { opacity: 0, y: -64 }, animate: { opacity: 1, y: 0 }, transition: { ...SPRING_SOFT } },
    fade: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { ...SPRING_SOFT } },
  };
}

/**
 * Internal chat auto-scroll with standard pin/unpin. Pins to the newest message
 * while the reader is at (or near) the bottom; unpins the moment they scroll up
 * to re-read; re-pins as soon as they return to the bottom. Pass `smooth=false`
 * (reduced motion) to jump instead of animate.
 */
export function useChatAutoScroll(trigger: unknown, smooth = true) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pinned = useRef(true);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
    pinned.current = gap < 28;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !pinned.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, [trigger, smooth]);

  return { ref, onScroll };
}

/** Seconds → "M:SS". */
export function mmss(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

/** Total scripted call length (last cue end), used for the honest in-call timer. */
export function callLength(cues: { startSec: number; dur: number }[]): number {
  const last = cues[cues.length - 1];
  return last ? last.startSec + last.dur : 0;
}

/** Wall-clock label for a message sent `offsetSec` into a call starting at base time. */
export function clockAt(baseHour: number, baseMin: number, meridiem: string, offsetSec: number): string {
  const totalMin = baseMin + Math.floor(offsetSec / 60);
  const m = totalMin % 60;
  const h = baseHour + Math.floor(totalMin / 60);
  return `${h}:${m.toString().padStart(2, "0")} ${meridiem}`;
}
