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
 * to re-read; re-pins as soon as they return to the bottom.
 *
 * Implementation notes (this replaced a native `scrollTo({behavior:"smooth"})`
 * version that could strand the scroller at the top): browsers cancel in-flight
 * smooth scrolls when the DOM mutates, and programmatic smooth-scroll events are
 * indistinguishable from user scrolls in a plain scroll handler — which made the
 * old pin logic misread its own animation as a user scroll-up and permanently
 * unpin. This version drives the follow itself with a rAF easing loop
 * (recomputes the growing target every frame, immune to native cancellation)
 * and distinguishes user intent explicitly:
 *  - scroll events during our own writes are ignored (`auto` flag);
 *  - scrollTop moving UP against our last write (wheel, drag, or a script
 *    setting scrollTop=0) unpins immediately;
 *  - the plain scroll handler re-pins whenever the reader returns to within
 *    28px of the bottom.
 * A ~1.2s keep-alive window after each trigger also catches end-state cards
 * that mount with a small animation delay, so they're scrolled into view.
 * Pass `smooth=false` (reduced motion) to jump instead of ease.
 */
export function useChatAutoScroll(trigger: unknown, smooth = true) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pinned = useRef(true);
  const auto = useRef(false); // our rAF loop is writing scrollTop
  const lastWrite = useRef(0); // last scrollTop we wrote
  const rafId = useRef<number | null>(null);
  const deadline = useRef(0);

  const stopLoop = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
    auto.current = false;
  }, []);

  const follow = useCallback(() => {
    deadline.current = performance.now() + 1200;
    if (rafId.current) return; // loop already running; it picks up the new deadline
    const step = () => {
      const el = ref.current;
      if (!el || !pinned.current) {
        stopLoop();
        return;
      }
      // User yanked the scroller upward against our writes → unpin, hand over.
      if (auto.current && el.scrollTop < lastWrite.current - 30) {
        pinned.current = false;
        stopLoop();
        return;
      }
      const target = el.scrollHeight - el.clientHeight;
      const gap = target - el.scrollTop;
      if (gap > 1) {
        auto.current = true;
        el.scrollTop = smooth ? el.scrollTop + Math.max(1, gap * 0.22) : target;
        lastWrite.current = el.scrollTop;
      } else if (performance.now() > deadline.current) {
        stopLoop();
        return;
      } else {
        // At the bottom but inside the keep-alive window (delayed end-state
        // cards may still grow the content) — watch without writing.
        auto.current = false;
      }
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  }, [smooth, stopLoop]);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (auto.current) return; // our own write — not a user scroll
    const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (gap < 28) {
      pinned.current = true; // reader returned to the bottom → re-pin
    } else {
      pinned.current = false; // genuine user scroll away from the bottom
      stopLoop();
    }
  }, [stopLoop]);

  /** Wheel-up is unambiguous user intent — unpin before the scroll even lands. */
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.deltaY < 0) {
        pinned.current = false;
        stopLoop();
      }
    },
    [stopLoop]
  );

  useEffect(() => {
    if (!pinned.current) return;
    follow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, follow]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  return { ref, onScroll, onWheel };
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
