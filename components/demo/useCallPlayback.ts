"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared, audio-optional call-playback engine for the two spoken demos
 * (ReceptionistCallDemo, SpeedToLeadDemo).
 *
 * Design: on start() we try to play the MP3. If it loads, cues are driven off
 * the real audio timeline (timeupdate). If the file 404s or fails to decode,
 * play() rejects and we fall back to a reading-pace timer — the transcript
 * still animates end-to-end. No MP3s ship yet, so the timer path is the live
 * one; audio "lights up" automatically once the files land in /public/demos.
 *
 * Never autoplays — start() is only ever called from a user gesture.
 */

export type CueLine = { speaker: "ai" | "caller"; text: string };
export type Cue = CueLine & { startSec: number; dur: number };

/**
 * Transcript-only (no-audio) playback runs faster than a true reading pace so the
 * silent fallback doesn't drag. This multiplier ONLY affects the timer path in
 * runTimer(); when a real MP3 loads, cues still sync to audio.currentTime against
 * the unscaled startSec values from buildCues(). Gaps scale uniformly, so the
 * rhythm between lines is preserved — just compressed ~1.7×.
 */
const TRANSCRIPT_SPEED = 1.7;

/**
 * Turn a flat transcript into timed cues. Estimate: ~2.6 words/sec speaking
 * pace + a 0.3s gap between lines (matches the ElevenLabs stitch spec in
 * ops/demo-call-scripts.md). These start times are estimates and will be
 * fine-tuned by hand once the real audio is generated.
 */
export function buildCues(lines: CueLine[]): Cue[] {
  const WORDS_PER_SEC = 2.6;
  const GAP = 0.3;
  let t = 0;
  return lines.map((line) => {
    const words = line.text.trim().split(/\s+/).length;
    const dur = words / WORDS_PER_SEC;
    const cue: Cue = { ...line, startSec: Number(t.toFixed(2)), dur: Number(dur.toFixed(2)) };
    t += dur + GAP;
    return cue;
  });
}

export type Playback = {
  status: "idle" | "playing" | "ended";
  /** last revealed cue index (-1 before the first line shows). */
  index: number;
  /** 0..1 overall progress for the hairline. */
  progress: number;
  /** true only when a real audio file is driving playback. */
  usingAudio: boolean;
  muted: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  start: () => void;
  reset: () => void;
  toggleMute: () => void;
};

export function useCallPlayback(cues: Cue[], audioSrc?: string): Playback {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timers = useRef<number[]>([]);
  const rafId = useRef<number | null>(null);
  const startTs = useRef<number>(0);
  const startedRef = useRef(false);
  const usingAudioRef = useRef(false);

  const [status, setStatus] = useState<"idle" | "playing" | "ended">("idle");
  const [index, setIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [usingAudio, setUsingAudio] = useState(false);
  const [muted, setMuted] = useState(false);

  const last = cues[cues.length - 1];
  const endSec = last ? last.startSec + last.dur + 0.4 : 0;

  const clearAll = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
  }, []);

  const runTimer = useCallback(() => {
    usingAudioRef.current = false;
    setUsingAudio(false);
    startTs.current = performance.now();
    // Compress the reading-pace timeline for the silent fallback only.
    const scale = 1 / TRANSCRIPT_SPEED;
    const scaledEnd = endSec * scale;
    cues.forEach((c, i) => {
      timers.current.push(window.setTimeout(() => setIndex(i), c.startSec * scale * 1000));
    });
    timers.current.push(
      window.setTimeout(() => {
        setStatus("ended");
        setProgress(1);
      }, scaledEnd * 1000)
    );
    const tick = () => {
      const elapsed = (performance.now() - startTs.current) / 1000;
      setProgress(Math.min(1, elapsed / scaledEnd));
      if (elapsed < scaledEnd) rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
  }, [cues, endSec]);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    clearAll();
    setStatus("playing");
    setIndex(-1);
    setProgress(0);
    const audio = audioRef.current;
    if (audio && audioSrc) {
      audio.muted = muted;
      try {
        audio.currentTime = 0;
      } catch {
        /* not yet loaded — ignore */
      }
      audio
        .play()
        .then(() => {
          usingAudioRef.current = true;
          setUsingAudio(true);
        })
        .catch(() => {
          // Missing / undecodable file — graceful transcript-only fallback.
          runTimer();
        });
    } else {
      runTimer();
    }
  }, [audioSrc, muted, clearAll, runTimer]);

  const reset = useCallback(() => {
    startedRef.current = false;
    usingAudioRef.current = false;
    clearAll();
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    setStatus("idle");
    setIndex(-1);
    setProgress(0);
    setUsingAudio(false);
  }, [clearAll]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  // Audio-driven cue sync (only active once a real file is playing).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (!usingAudioRef.current) return;
      const t = audio.currentTime;
      let idx = -1;
      for (let i = 0; i < cues.length; i++) {
        if (cues[i].startSec <= t) idx = i;
        else break;
      }
      setIndex(idx);
      if (audio.duration) setProgress(Math.min(1, t / audio.duration));
    };
    const onEnded = () => {
      if (!usingAudioRef.current) return;
      setStatus("ended");
      setProgress(1);
      setIndex(cues.length - 1);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [cues]);

  useEffect(() => () => clearAll(), [clearAll]);

  return { status, index, progress, usingAudio, muted, audioRef, start, reset, toggleMute };
}
