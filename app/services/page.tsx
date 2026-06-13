import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "The system — GrowVera",
  description:
    "How the GrowVera autonomous web agency works: it finds local businesses with no website, gathers their real photos and data, builds each a bespoke deployed site, reviews it on desktop and mobile, and runs the pitch and follow-ups from a built-in CRM.",
};

const stages = [
  {
    number: "01",
    title: "Prospect — finds businesses with no website",
    badge: "Lead discovery",
    description:
      "Point it at a region. It scans public listings and maps for businesses with no website, ranks them with a proprietary scoring algorithm so the strongest opportunities surface first, and files every one into the CRM so it never works the same business twice.",
    items: [
      "Region-based discovery from public sources",
      "Proprietary opportunity scoring + ranking",
      "Automatic de-duplication into the CRM",
      "No website = your highest-intent prospect",
    ],
  },
  {
    number: "02",
    title: "Build — bespoke site, deployed live",
    badge: "Design + deploy",
    description:
      "It gathers each business's real photos and details from public sources, designs a unique site around them, and deploys it to a live URL. A second review agent then checks the result on desktop and mobile with fresh eyes and fixes what's off before anything ships.",
    items: [
      "Real photos and data — no stock, no placeholders",
      "A unique design per business, not a template",
      "Deployed live to a real URL automatically",
      "AI self-review on desktop + mobile before send",
    ],
  },
  {
    number: "03",
    title: "Pitch — outreach and follow-ups on autopilot",
    badge: "CRM + outreach",
    description:
      "It emails you each live site with a personalised pitch ready to send. The built-in CRM runs a five-touch sequence, sorts replies, flags lapsed leads, and remembers the design and tone preferences you teach it — so the system improves with every run.",
    items: [
      "Personalised pitch drafted per business",
      "Five-touch follow-up sequence built in",
      "Reply sorting + lapsed-lead detection",
      "Learns your preferences across runs",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main style={{ background: "#08080A" }}>
      <section style={{ background: "#0E0E11" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>
            The system
          </p>
          <h1
            style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.035em", color: "#F4F4F1", marginBottom: "18px" }}
          >
            One pipeline. The whole<br />agency, automated.
          </h1>
          <p style={{ color: "#A2A2A0", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Prospect, build, and pitch — end to end, around the clock. Month to month, cancel anytime.
          </p>
        </div>
      </section>

      <section>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {stages.map((stage) => (
              <div
                key={stage.number}
                style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "12px", color: "#34D399", letterSpacing: "0.06em" }}>{stage.number}</span>
                    <h2 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 700, fontSize: "clamp(1.05rem, 3vw, 1.375rem)", color: "#F4F4F1", letterSpacing: "-0.02em" }}>{stage.title}</h2>
                  </div>
                  <span style={{ background: "rgba(52,211,153,0.10)", color: "#34D399", fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "100px", whiteSpace: "nowrap" }}>
                    {stage.badge}
                  </span>
                </div>
                <p style={{ color: "#A2A2A0", fontSize: "14px", lineHeight: 1.75, marginBottom: "22px", maxWidth: "560px" }}>{stage.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {stage.items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <CheckCircle size={15} weight="fill" style={{ color: "#34D399", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ color: "#C9C9C6", fontSize: "14px", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "56px", background: "linear-gradient(135deg, #16A34A 0%, #1A5C3A 100%)", borderRadius: "20px", padding: "clamp(32px, 5vw, 52px)", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", color: "#fff", marginBottom: "14px" }}>
              Start your free trial today.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.80)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "360px", margin: "0 auto 28px" }}>
              Pick a region and let it build your first sites tonight. Cancel anytime.
            </p>
            <Link
              href="/#pricing"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#0D2A1B", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", letterSpacing: "-0.01em" }}
            >
              See plans →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
