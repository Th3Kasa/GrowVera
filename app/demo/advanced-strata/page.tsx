import type { Metadata } from "next";
import AdvancedStrataCallDemo from "@/components/demo/AdvancedStrataCallDemo";

export const metadata: Metadata = {
  title: "Advanced Strata — private demo | Growvera",
  robots: { index: false, follow: false },
};

export default function AdvancedStrataDemoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.25rem 3.5rem",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "34rem", textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "0.9rem",
          }}
        >
          Prepared for Advanced Strata
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cabinet), Outfit, sans-serif",
            fontSize: "clamp(1.7rem, 5vw, 2.4rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: "var(--color-text-bright)",
            marginBottom: "0.9rem",
          }}
        >
          Your phone, answered — even mid-inspection.
        </h1>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.55,
            color: "var(--color-text-muted)",
            marginBottom: "2.5rem",
            maxWidth: "30rem",
            marginInline: "auto",
          }}
        >
          Press play. This is what a 7:40pm buyer call sounds like when you can&apos;t pick up.
        </p>

        <AdvancedStrataCallDemo />
      </div>
    </main>
  );
}
