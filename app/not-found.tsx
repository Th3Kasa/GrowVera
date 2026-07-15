import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found — GrowVera",
  description: "The page you were looking for isn't here. Head back home or get a free AI audit.",
};

/**
 * Branded 404. Nav + footer come from the root layout automatically, so this
 * renders only the centred content between them. Light theme, tokens only.
 */
export default function NotFound() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "68vh",
        padding: "6rem 1.5rem",
        background: "var(--color-bg)",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontWeight: 600,
          color: "var(--color-accent)",
          marginBottom: "1rem",
        }}
      >
        Page not found
      </p>

      <h1
        style={{
          fontFamily: "var(--font-cabinet)",
          fontWeight: 800,
          fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
          letterSpacing: "-0.035em",
          color: "var(--color-text)",
          lineHeight: 1.05,
          marginBottom: "1rem",
          maxWidth: "18ch",
        }}
      >
        We can&rsquo;t find that page.
      </h1>

      <p
        style={{
          fontSize: "1.05rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
          maxWidth: "42ch",
          marginBottom: "2.25rem",
        }}
      >
        It may have moved when we updated the site.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-on-accent)",
            boxShadow: "0 4px 24px var(--color-accent-border-soft)",
          }}
        >
          Back to home
        </Link>
        <Link
          href="/audit"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200"
          style={{
            background: "transparent",
            color: "var(--color-text)",
            border: "1px solid var(--color-overlay-strong)",
          }}
        >
          Get a free AI audit
        </Link>
      </div>
    </section>
  );
}
