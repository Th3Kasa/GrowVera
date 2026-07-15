"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";

/**
 * Shared honesty + conversion furniture reused by all four demos:
 *  - FictionLabel: the required "fictional example business" disclaimer.
 *  - AuditCTA: the small CTA row every demo ends on, linking to /audit.
 *  - StatusChip: the live "Ringing… / On the call / Booked ✓" comprehension chip.
 *  - Takeaway: the honest closing line shown after each demo's end-state.
 * Colours are tokens only.
 */

/** Live status chip shown inside each demo so the state is always legible. */
export function StatusChip({ tone = "muted", children }: { tone?: "live" | "success" | "muted"; children: ReactNode }) {
  const palette =
    tone === "live"
      ? { bg: "var(--color-accent-soft)", border: "var(--color-accent-border-soft)", text: "var(--color-accent)", dot: "var(--color-accent)" }
      : tone === "success"
        ? { bg: "var(--color-accent-card)", border: "var(--color-accent-border)", text: "var(--color-accent-deep)", dot: "var(--color-accent)" }
        : { bg: "var(--color-fill-subtle)", border: "var(--color-border)", text: "var(--color-text-muted)", dot: "var(--color-text-faint)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        borderRadius: "2rem",
        padding: "0.22rem 0.65rem",
        fontSize: "0.68rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {tone === "live" && <span className="gv-pulse" style={{ width: 6, height: 6, borderRadius: 999, background: palette.dot, display: "inline-block" }} />}
      {children}
    </span>
  );
}

/**
 * Fixed-height slot that sits directly above every demo frame (holding the
 * status chip and, for speed-to-lead, the step indicator). Keeping it a constant
 * height and bottom-aligned guarantees all three device/window frames start at
 * the SAME vertical position and stay aligned across the hub grid, whatever each
 * demo puts inside it.
 */
export function DemoHeader({ children }: { children: ReactNode }) {
  return (
    <div style={{ height: "4rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "0.5rem", paddingBottom: "0.75rem" }}>
      {children}
    </div>
  );
}

/** Honest closing takeaway shown once a demo reaches its end-state. */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        marginTop: "0.9rem",
        textAlign: "center",
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "var(--color-text-bright)",
        lineHeight: 1.5,
      }}
    >
      {children}
    </p>
  );
}

export function FictionLabel({ business }: { business: string }) {
  return (
    <p
      style={{
        textAlign: "center",
        fontSize: "0.7rem",
        color: "var(--color-text-faint)",
        marginTop: "0.9rem",
        lineHeight: 1.5,
      }}
    >
      Demo — &ldquo;{business}&rdquo; is a fictional example business. Scripted conversation.
    </p>
  );
}

export function AuditCTA({ prompt = "Want this on YOUR phone?" }: { prompt?: string }) {
  return (
    <div
      style={{
        marginTop: "0.9rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem 0.65rem",
        background: "var(--color-accent-soft)",
        border: "1px solid var(--color-accent-border-soft)",
        borderRadius: "0.85rem",
        padding: "0.7rem 1rem",
      }}
    >
      <span style={{ fontSize: "0.8rem", color: "var(--color-text-bright)", fontWeight: 600 }}>{prompt}</span>
      <a
        href="/audit"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          color: "var(--color-accent)",
          fontSize: "0.8rem",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Get your free AI audit <ArrowRight size={13} weight="bold" />
      </a>
    </div>
  );
}
