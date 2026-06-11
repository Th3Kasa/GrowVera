import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "The Engines — GrowVera",
  description: "GrowVera builds and installs two custom AI automation engines for Australian mid-market businesses: Vera Reach, a speed-to-lead voice agent, and Vera Quote, an automated internal quoting engine.",
};

const engines = [
  {
    number: "01",
    title: "Vera Reach — Speed-to-Lead Voice Agent",
    badge: "Outbound automation",
    description:
      "The moment a lead submits a form on your website or landing page, Vera Reach triggers an automated outbound call via your CRM in 20 seconds. It qualifies the prospect, handles FAQs using your exact script, and books them directly into your calendar — before your competitor has even seen the notification.",
    items: [
      "20-second outbound trigger from CRM lead capture",
      "Prospect qualification using your exact script constraints",
      "Common FAQ handling — no staff involvement required",
      "Direct calendar booking on qualification",
      "Scales instantly to 100 simultaneous calls",
      "Never misses a lead — not for lunch, not on weekends",
      "Replaces a full-time admin or sales assistant salary",
    ],
  },
  {
    number: "02",
    title: "Vera Quote — Internal Quoting Engine",
    badge: "Internal staff tool",
    description:
      "A centralised, secure chat engine built exclusively for your staff. Your employee inputs the vehicle or project type and the problem. Vera Quote connects to your parts suppliers via API, pulls live pricing, overlays your SOPs, factors in labour rates and travel distance, and returns an exact, margin-protected price guide in under 5 seconds.",
    items: [
      "Secure internal dashboard — works on any device",
      "Live API synchronisation with your parts suppliers",
      "Current pricing pulled on every request — not cached",
      "Your SOPs, labour rates, and target margins built in",
      "Travel distance and surcharge factored automatically",
      "Error-free quote in under 5 seconds, every time",
      "Eliminates underquoting and margin leakage",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main style={{ background: "#FAFAF8" }}>
      <section style={{ background: "#F4F3EF" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#1A5C3A", marginBottom: "1rem" }}>
            What We Build
          </p>
          <h1
            style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.035em", color: "#0D0D0B", marginBottom: "18px" }}
          >
            Two engines. One job — stop your<br />business from bleeding revenue.
          </h1>
          <p style={{ color: "#6B6B68", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto" }}>
            We build and install custom AI automation engines into your existing CRM and tech stack. Flat setup fee. Monthly retainer. No lock-in.
          </p>
        </div>
      </section>

      <section>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {engines.map((engine) => (
              <div
                key={engine.number}
                style={{ background: "#fff", border: "1px solid #E2E1DC", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "12px", color: "#1A5C3A", letterSpacing: "0.06em" }}>{engine.number}</span>
                    <h2 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 700, fontSize: "clamp(1.05rem, 3vw, 1.375rem)", color: "#0D0D0B", letterSpacing: "-0.02em" }}>{engine.title}</h2>
                  </div>
                  <span style={{ background: "rgba(26,92,58,0.07)", color: "#1A5C3A", fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "100px", whiteSpace: "nowrap" }}>
                    {engine.badge}
                  </span>
                </div>
                <p style={{ color: "#6B6B68", fontSize: "14px", lineHeight: 1.75, marginBottom: "22px", maxWidth: "560px" }}>{engine.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {engine.items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <CheckCircle size={15} weight="fill" style={{ color: "#1A5C3A", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ color: "#4A4A47", fontSize: "14px", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "56px", background: "#1A5C3A", borderRadius: "20px", padding: "clamp(32px, 5vw, 52px)", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", color: "#fff", marginBottom: "14px" }}>
              Find out what your business is losing.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "340px", margin: "0 auto 28px" }}>
              Book a free 15-minute Pipeline Audit — no obligation, no sales pitch.
            </p>
            <Link
              href="/audit"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#1A5C3A", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", letterSpacing: "-0.01em" }}
            >
              Book the Pipeline Audit →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
