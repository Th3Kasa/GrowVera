import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Services — GrowVera",
  description:
    "GrowVera delivers done-for-you websites, social content, and managed paid ads for Sydney small businesses and creators. One retainer, the whole growth stack.",
};

const services = [
  {
    number: "01",
    title: "Websites — built and run for you",
    badge: "Web presence",
    description:
      "We build a bespoke, cinematic AI website around your real photos and brand — no templates, no placeholders. Then we host it, keep it current, and handle every edit you need via your client portal. Same-day turnaround on changes.",
    items: [
      "Bespoke design built around your real brand and photos",
      "Hosted and maintained — no servers for you to manage",
      "Unlimited edits via your client portal, same-day turnaround",
      "Mobile-first, fast-loading, Google-ready",
      "Google Business Profile kept sharp",
    ],
  },
  {
    number: "02",
    title: "Content — planned, made, and posted for you",
    badge: "Social content",
    description:
      "We plan your content calendar, write the copy, design the carousels, cut the short-form video, and post it across every platform — weekly. You never open Canva or CapCut. We produce it; you approve it from your phone in one tap.",
    items: [
      "8–20 content assets per month (carousels, clips, motion)",
      "Short-form video and AI spokesperson series",
      "Competitor-tracked strategy — we know what's working in your niche",
      "Cross-posted to 9 platforms via automation",
      "Monthly analytics and content report",
    ],
  },
  {
    number: "03",
    title: "Ads — managed Meta and Instagram campaigns",
    badge: "Paid growth",
    description:
      "We run your Meta and Instagram ads end to end. We create the UGC ad creative, validate it through Instagram Trial Reels before we spend a dollar, then launch and optimise the campaign. You never open Ads Manager.",
    items: [
      "Full Meta / Instagram campaign management",
      "UGC ad creative produced and validated before spend",
      "Trial Reel validation — we only promote what already performs",
      "Ad spend is separate — you control the budget",
      "Weekly ROAS reporting, no agency fluff",
    ],
  },
];

const addons = [
  { name: "Brand identity + design system", price: "$1,800" },
  { name: "AI avatar persona pack", price: "$1,200" },
  { name: "UGC ad pack (10 videos)", price: "$1,500" },
  { name: "Carousel pack (10)", price: "$600" },
  { name: "YouTube → Shorts repurposing (20 clips)", price: "$700" },
  { name: "Motion-graphic explainer video", price: "$450" },
];

export default function ServicesPage() {
  return (
    <main style={{ background: "#08080A" }}>
      {/* HEADER */}
      <section style={{ background: "#0E0E11" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#34D399", marginBottom: "1rem" }}>
            What we do
          </p>
          <h1
            style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.035em", color: "#F4F4F1", marginBottom: "18px" }}
          >
            The whole growth stack,<br />done for you.
          </h1>
          <p style={{ color: "#A2A2A0", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Websites, content, and ads — all coordinated, all delivered. One retainer, no briefing three agencies.
          </p>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(2rem, 4vw, 3rem)" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {services.map((s) => (
              <div
                key={s.number}
                style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "12px", color: "#34D399", letterSpacing: "0.06em" }}>{s.number}</span>
                    <h2 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 700, fontSize: "clamp(1.05rem, 3vw, 1.375rem)", color: "#F4F4F1", letterSpacing: "-0.02em" }}>{s.title}</h2>
                  </div>
                  <span style={{ background: "rgba(52,211,153,0.10)", color: "#34D399", fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "100px", whiteSpace: "nowrap" }}>
                    {s.badge}
                  </span>
                </div>
                <p style={{ color: "#A2A2A0", fontSize: "14px", lineHeight: 1.75, marginBottom: "22px", maxWidth: "560px" }}>{s.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {s.items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <CheckCircle size={15} weight="fill" style={{ color: "#34D399", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ color: "#C9C9C6", fontSize: "14px", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingBottom: "clamp(2rem, 4vw, 3rem)" }}
        >
          <div style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 700, fontSize: "1.25rem", color: "#F4F4F1", letterSpacing: "-0.02em", marginBottom: "6px" }}>Add-ons</h2>
            <p style={{ color: "#A2A2A0", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>One-off projects to complement your retainer.</p>
            <div style={{ display: "grid", gap: "0", gridTemplateColumns: "1fr" }}>
              {addons.map((a, i) => (
                <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "#C9C9C6", fontSize: "14px" }}>{a.name}</span>
                  <span style={{ color: "#34D399", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "1rem" }}>{a.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}
        >
          <div style={{ background: "linear-gradient(135deg, #16A34A 0%, #1A5C3A 100%)", borderRadius: "20px", padding: "clamp(32px, 5vw, 52px)", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", color: "#fff", marginBottom: "14px" }}>
              Book your free strategy call.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.80)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "380px", margin: "0 auto 28px" }}>
              We&apos;ll show you a free sample site and map a clear plan — no obligation, no agency waffle.
            </p>
            <Link
              href="/audit"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#0D2A1B", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", letterSpacing: "-0.01em" }}
            >
              Book your free strategy call →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
