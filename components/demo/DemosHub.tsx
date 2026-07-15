"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

/**
 * Homepage "Try them yourself" gallery. The three demos are code-split via
 * next/dynamic (ssr:false) so the homepage stays fast — the demo bundles only
 * load on the client when this section mounts. Laid out as a responsive
 * three-across grid that collapses to a single column on smaller screens.
 */

const DemoSkeleton = () => (
  <div
    style={{
      minHeight: "440px",
      borderRadius: "1.25rem",
      background: "var(--color-bg-subtle)",
      border: "1px solid var(--color-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <span style={{ fontSize: "0.8rem", color: "var(--color-text-faint)" }}>Loading demo…</span>
  </div>
);

const ReceptionistCallDemo = dynamic(() => import("./ReceptionistCallDemo"), { ssr: false, loading: DemoSkeleton });
const SpeedToLeadDemo = dynamic(() => import("./SpeedToLeadDemo"), { ssr: false, loading: DemoSkeleton });
const QuotingDemo = dynamic(() => import("./QuotingDemo"), { ssr: false, loading: DemoSkeleton });

const CARDS = [
  { name: "24/7 AI Receptionist", pitch: "Hear it answer a real after-hours call, capture the job, and text the owner.", href: "/receptionist", linkLabel: "See the receptionist", Demo: ReceptionistCallDemo },
  { name: "Speed-to-Lead Agent", pitch: "Submit a mock enquiry and watch the 20-second callback book the job.", href: "/speed-to-lead", linkLabel: "See speed-to-lead", Demo: SpeedToLeadDemo },
  { name: "AI Quoting Agent", pitch: "Build a sample plumbing quote yourself — job type, detail, urgency, itemised total.", href: "/quoting", linkLabel: "See quoting", Demo: QuotingDemo },
];

export default function DemosHub() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {CARDS.map(({ name, pitch, href, linkLabel, Demo }) => (
        <div
          key={name}
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "1.5rem",
            padding: "clamp(1.25rem, 3vw, 1.75rem)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em" }}>{name}</h3>
              <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--color-accent)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
                {linkLabel} <ArrowRight size={12} weight="bold" />
              </Link>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55, marginTop: "0.4rem" }}>{pitch}</p>
          </div>
          <div style={{ marginTop: "auto" }}>
            <Demo />
          </div>
        </div>
      ))}
    </div>
  );
}
