"use client";

import { ArrowRight } from "@phosphor-icons/react";

/**
 * Shared honesty + conversion furniture reused by all four demos:
 *  - FictionLabel: the required "fictional example business" disclaimer.
 *  - AuditCTA: the small CTA row every demo ends on, linking to /audit.
 * Colours are tokens only.
 */

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
