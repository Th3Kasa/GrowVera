import type { Metadata } from "next";
import AdvancedStrataCallDemo from "@/components/demo/AdvancedStrataCallDemo";
import AdvancedStrataSpeedToLeadDemo from "@/components/demo/AdvancedStrataSpeedToLeadDemo";
import AdvancedStrataQuotingDemo from "@/components/demo/AdvancedStrataQuotingDemo";

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
        padding: "3rem 1.25rem 3.5rem",
        background: "var(--color-bg)",
      }}
    >
      {/* ── Hero: the receptionist (the thing Matthew's buying) ── */}
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

      {/* ── Divider + upsell section: "What we could add next" ── */}
      <div style={{ width: "100%", maxWidth: "34rem", marginTop: "3.5rem" }}>
        <div
          aria-hidden
          style={{ height: 1, background: "var(--color-border)", marginBottom: "2.5rem" }}
        />

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
            What we could add next
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cabinet), Outfit, sans-serif",
              fontSize: "clamp(1.5rem, 4.5vw, 2.1rem)",
              fontWeight: 800,
              lineHeight: 1.14,
              letterSpacing: "-0.02em",
              color: "var(--color-text-bright)",
              marginBottom: "0.9rem",
            }}
          >
            Your receptionist is step one.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.55,
              color: "var(--color-text-muted)",
              maxWidth: "30rem",
              marginInline: "auto",
            }}
          >
            Once the phone&apos;s covered, the same assistant can chase web enquiries and price jobs for your team. Two examples, built for Advanced Strata.
          </p>
        </div>

        {/* Upsell 1 — Speed-to-Lead callback */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "var(--color-text-bright)",
                marginBottom: "0.4rem",
              }}
            >
              1 · Speed-to-Lead callback
            </h3>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.55, color: "var(--color-text-muted)", maxWidth: "28rem", marginInline: "auto" }}>
              A buyer submits your web enquiry form — and the assistant rings them back in 18 seconds, while they&apos;re still deciding.
            </p>
          </div>
          <AdvancedStrataSpeedToLeadDemo />
        </div>

        {/* Upsell 2 — Internal quoting tool */}
        <div>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "var(--color-text-bright)",
                marginBottom: "0.4rem",
              }}
            >
              2 · Internal quoting tool
            </h3>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.55, color: "var(--color-text-muted)", maxWidth: "28rem", marginInline: "auto" }}>
              Your team picks the service and gets an itemised, GST-inclusive quote in seconds — and it flags anything without a set price rather than guessing.
            </p>
          </div>
          <AdvancedStrataQuotingDemo />
        </div>
      </div>
    </main>
  );
}
