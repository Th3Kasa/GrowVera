import type { Metadata } from "next";
import { CheckCircle, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import CalEmbed from "@/components/CalEmbed";
import ScrollReveal from "@/components/ScrollReveal";
import { getLeadByLeadId } from "@/lib/leads";
import { TIERS, formatAud } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Your new website — GrowVera",
  description: "We built you a real website. See it live, see the price, and book a quick call if you'd like it made yours.",
  robots: { index: false, follow: false }, // personalised pages shouldn't be indexed
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OfferPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await getLeadByLeadId(id);

  const business = lead?.business ?? "your business";
  const category = lead?.category ? lead.category.toLowerCase() : "local business";
  const region = lead?.region ?? "your area";
  const demoUrl = lead?.demoUrl;

  return (
    <div style={{ background: "var(--color-bg)" }}>
      {/* HERO */}
      <section style={{ background: "var(--color-bg-section)" }}>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}
        >
          <ScrollReveal>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "1rem" }}>
              Built for {business} · No obligation
            </p>
            <h1 style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.6rem)", letterSpacing: "-0.035em", color: "var(--color-text)", lineHeight: 1.05, marginBottom: "1.1rem" }}>
              {business}, here&apos;s your<br />
              <span style={{ color: "var(--color-accent)" }}>new website.</span>
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
              We noticed a {category} in {region} like yours could win more work online — so we went ahead and built you a real, live site. Have a look. If you like it, book a quick call and we&apos;ll make it yours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* DEMO PREVIEW */}
      {demoUrl && (
        <section style={{ paddingTop: "clamp(2rem, 4vw, 3rem)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div style={{ borderRadius: "1.25rem", overflow: "hidden", border: "1px solid var(--color-border)", background: "var(--color-bg-card)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderBottom: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--color-text-faint)" }}>Your live demo site</span>
                  <a href={demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>
                    Open full site <ArrowSquareOut size={14} weight="bold" />
                  </a>
                </div>
                <iframe
                  src={demoUrl}
                  title={`${business} demo site`}
                  loading="lazy"
                  style={{ width: "100%", height: "560px", border: "none", background: "#fff" }}
                />
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--color-accent-muted)", marginTop: "0.9rem", maxWidth: "44rem", lineHeight: 1.6, display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <CheckCircle size={15} weight="fill" style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "2px" }} />
                <span>This is a starting concept we built from your public information to show what&apos;s possible. Once we have a quick chat and you come on board, your full custom website is designed and built properly with you — your branding, your photos, your content.</span>
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* PRICE GATE — they see the price before they can book */}
      <section style={{ paddingTop: "clamp(3rem, 6vw, 4.5rem)", paddingBottom: "clamp(1rem, 2vw, 2rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--color-accent)", marginBottom: "0.75rem" }}>
                What it costs — no surprises
              </p>
              <h2 style={{ fontFamily: "var(--font-cabinet)", fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Done-for-you, from {formatAud(TIERS[0].priceMonthly)}/month.
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginTop: "0.75rem", maxWidth: "40rem", marginInline: "auto", lineHeight: 1.6 }}>
                A one-off setup &amp; build, then a simple monthly retainer. We run it all for you. Cancel anytime. Prices in AUD.
              </p>
            </div>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))" }}>
              {TIERS.map((tier) => (
                <div key={tier.id} style={{ background: tier.highlight ? "var(--gradient-card-featured)" : "var(--color-bg-card)", border: tier.highlight ? "1px solid var(--color-accent-border-vivid)" : "1px solid var(--color-border)", borderRadius: "1.1rem", padding: "1.4rem" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.2rem" }}>{tier.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.9rem", lineHeight: 1.5, minHeight: "2.4rem" }}>{tier.outcome}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-faint)" }}>from</span>
                    <span style={{ fontFamily: "var(--font-cabinet)", fontSize: "1.9rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1 }}>{formatAud(tier.priceMonthly)}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-faint)" }}>/mo</span>
                  </div>
                  <p style={{ fontSize: "0.74rem", color: "var(--color-accent-muted)", marginTop: "0.4rem" }}>{tier.priceNote}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* BOOK — Cal embed tagged with this lead for attribution */}
      <section style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "var(--font-cabinet)", fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em" }}>
                Like it? Book a 15-minute call.
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginTop: "0.6rem" }}>
                We&apos;ll walk through the site, answer your questions, and — if it&apos;s a fit — make it yours.
              </p>
            </div>
            <CalEmbed metadata={lead ? { leadId: lead.leadId } : undefined} prefill={lead?.email ? { email: lead.email } : undefined} />
            <div style={{ marginTop: "2rem", textAlign: "center", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.25rem" }}>
              {["The site is yours to keep", "No commitment required", "We comply with the Spam Act 2003"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <CheckCircle size={14} weight="fill" style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
