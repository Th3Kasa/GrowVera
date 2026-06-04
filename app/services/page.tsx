import type { Metadata } from "next";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "GrowVera — Services",
  description:
    "Custom website design, hosting, and maintenance for Sydney local businesses. We build a site that turns Google searches into phone calls — see a free live mock-up before you pay a cent.",
};

const services = [
  {
    id: "design",
    number: "01",
    title: "Custom Website Design",
    tagline: "A site that looks like you spent thousands.",
    description:
      "We design and build a website tailored to your business — not a stock template with your logo dropped in. Clean, modern, and built to make a visitor pick up the phone. You see it live before you pay a cent.",
    bullets: [
      "Bespoke design matched to your trade and brand",
      "Home, services, about, and contact pages",
      "Copywriting polish so it reads professionally",
      "Stock imagery licensed for your industry",
      "Click-to-call and clear calls to action throughout",
      "Built on fast, modern technology — no clunky page builders",
      "A free live mock-up before you commit to anything",
    ],
    impact: "Turns the people already searching for you into phone calls.",
  },
  {
    id: "mobile",
    number: "02",
    title: "Mobile & Speed",
    tagline: "Most of your customers are on their phone.",
    description:
      "More than half of local searches happen on a mobile, and people leave a slow site within seconds. Every site we build loads fast and looks perfect on phones, tablets, and desktops — because a site nobody waits for is a site that loses jobs.",
    bullets: [
      "Fully responsive — flawless on every screen size",
      "Optimised images and code for fast load times",
      "Tap-to-call and tap-for-directions on mobile",
      "Passes Google's Core Web Vitals checks",
      "Tested across iPhone, Android, and desktop",
    ],
    impact: "Stops you losing customers to a slow or broken-looking site.",
  },
  {
    id: "leadcapture",
    number: "03",
    title: "Lead Capture & Booking",
    tagline: "Make it dead simple to contact you.",
    description:
      "A website should do more than sit there — it should bring you work. We build the forms, booking requests, and contact paths that turn a curious visitor into an enquiry landing in your inbox or phone.",
    bullets: [
      "Quote and enquiry forms that email you instantly",
      "Booking / appointment request forms",
      "Click-to-call and WhatsApp / SMS links",
      "Google Maps and directions embedded",
      "Optional CRM and email list integration (Premium)",
    ],
    impact: "Converts website visitors into real enquiries you can close.",
  },
  {
    id: "seo",
    number: "04",
    title: "Local SEO Setup",
    tagline: "Get found for '[your service] near me'.",
    description:
      "A beautiful site is no good if nobody finds it. We set up the on-page foundations so Google understands who you are, what you do, and which suburbs you serve — so you show up when locals search for your service.",
    bullets: [
      "Keyword-aware page titles and descriptions",
      "LocalBusiness schema so Google reads your details correctly",
      "Suburb and service targeting in your page content",
      "Google Business Profile connected to your site",
      "Clean structure search engines can read easily",
    ],
    impact: "Helps the right local customers find you on Google.",
  },
  {
    id: "hosting",
    number: "05",
    title: "Hosting & Maintenance",
    tagline: "We keep it live, safe, and current.",
    description:
      "Once your site is live, we host it and look after it — so you never deal with hosting bills, security scares, or a site that goes down. Your low monthly covers everything, plus a set number of edits whenever you need a change.",
    bullets: [
      "Secure, fast hosting included",
      "SSL certificate so visitors see the padlock",
      "Daily backups and uptime monitoring",
      "Security updates handled automatically",
      "A monthly edit allowance for content changes",
      "One person to call when you need something — no ticket queues",
    ],
    impact: "Peace of mind — your site stays online and you never touch the tech.",
  },
  {
    id: "support",
    number: "06",
    title: "Ongoing Support",
    tagline: "A real person, not a help desk.",
    description:
      "Need a new photo added, your hours changed, or a special promotion put up? Just message us. Your retainer includes regular edits, and anything larger is quoted clearly upfront — no surprise invoices, ever.",
    bullets: [
      "Included monthly edits (1–4 depending on your plan)",
      "Fast turnaround on small changes",
      "Clear, upfront quotes for larger work",
      "Direct contact — email or message, no call centre",
      "Optional seasonal updates and new pages as you grow",
    ],
    impact: "Your site keeps up with your business as it changes.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    build: "$1,000",
    retainer: "$49",
    pages: "1–3 pages",
    description: "A clean, fast site that turns Google searches into phone calls. Perfect for a single-location trade or local business.",
    features: [
      "Home, services & contact pages",
      "Mobile-responsive design",
      "Click-to-call & contact form",
      "Google reviews + map embed",
      "Opening hours & SSL security",
      "Basic on-page SEO (titles & meta)",
      "2 design revisions",
    ],
    highlight: false,
  },
  {
    name: "Professional",
    build: "$1,800–2,500",
    retainer: "$79",
    pages: "5–8 pages",
    description: "A complete site built to win you customers — booking, gallery, and proof. Where most local businesses land.",
    features: [
      "Everything in Starter, plus:",
      "About + detailed service pages",
      "Gallery & testimonials section",
      "Quote / booking request form",
      "Copywriting polish & stock imagery",
      "Google Business sync",
      "Foundational SEO · 3 revisions",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    build: "$3,000+",
    retainer: "$129",
    pages: "8+ pages",
    description: "A full multi-page presence with a custom domain, blog, and lead-capture built in. Quoted to your needs.",
    features: [
      "Everything in Professional, plus:",
      "Multi-page architecture",
      "Custom domain setup",
      "Blog / news capability",
      "CRM & email lead-capture",
      "Structured SEO across all pages",
      "Performance optimisation · unlimited revisions in scope",
    ],
    highlight: false,
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "#FAFAF8" }}>
      {/* Header */}
      <section
        className="pt-40 pb-24"
        style={{ background: "#F4F3EF" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-4">
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                style={{ color: "#1A5C3A" }}
              >
                Websites that win you customers
              </span>
            </div>
            <h1
              className="font-bold tracking-tight leading-[0.95] mb-6"
              style={{
                fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                color: "#0D0D0B",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              }}
            >
              Everything you need
              <br />
              to win customers online.
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl mb-8"
              style={{ color: "#6B6B68" }}
            >
              We design, build, host, and look after your website — so the people
              already searching for you end up calling you instead of a competitor.
              See a free live mock-up of your new site before you pay a cent.
            </p>

            {/* CTA */}
            <a
              href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: "#1A5C3A",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(26,92,58,0.25)",
              }}
            >
              Get my free mock-up
              <ArrowRight size={14} weight="bold" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Service sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {services.map((service, i) => (
          <ScrollReveal key={service.id} delay={0.05}>
            <section
              className="py-16 md:py-20"
              style={{
                borderBottom:
                  i < services.length - 1
                    ? "1px solid rgba(13,13,11,0.06)"
                    : "none",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 items-start">
                {/* Left */}
                <div className="md:sticky md:top-32">
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                    style={{ color: "#1A5C3A" }}
                  >
                    {service.number}
                  </span>
                  <h2
                    className="text-2xl md:text-3xl font-bold tracking-tight mt-2 mb-2 leading-snug"
                    style={{
                      fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                      color: "#0D0D0B",
                    }}
                  >
                    {service.title}
                  </h2>
                  <p
                    className="text-base font-medium mb-4"
                    style={{ color: "#1A5C3A" }}
                  >
                    {service.tagline}
                  </p>

                  {/* Impact badge */}
                  <div
                    className="px-3.5 py-2.5 rounded-xl text-sm leading-snug"
                    style={{
                      background: "#E8F2EC",
                      color: "#1A5C3A",
                      borderLeft: "2px solid #1A5C3A",
                    }}
                  >
                    <strong>Impact:</strong> {service.impact}
                  </div>
                </div>

                {/* Right */}
                <div>
                  <p
                    className="text-base leading-relaxed mb-8"
                    style={{ color: "#6B6B68" }}
                  >
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    {service.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3">
                        <CheckCircle
                          size={16}
                          weight="fill"
                          style={{
                            color: "#1A5C3A",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "#0D0D0B" }}
                        >
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>
        ))}
      </div>

      {/* Pricing */}
      <section className="py-24" style={{ background: "#FAFAF8", borderTop: "1px solid rgba(13,13,11,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-4">
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                style={{ color: "#1A5C3A" }}
              >
                Simple, honest pricing
              </span>
            </div>
            <h2
              className="font-bold tracking-tight leading-[0.95] mb-4 text-center"
              style={{
                fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                color: "#0D0D0B",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
              }}
            >
              One build fee. One small monthly.
            </h2>
            <p
              className="text-base leading-relaxed max-w-xl mx-auto mb-14 text-center"
              style={{ color: "#6B6B68" }}
            >
              A fixed price to build your site — then a low monthly that keeps it
              hosted, secure, and up to date. No surprises, no lock-in tricks.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {pricingTiers.map((tier) => (
              <ScrollReveal key={tier.name} delay={0.05}>
                <div
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{
                    background: tier.highlight ? "#0D0D0B" : "#fff",
                    border: tier.highlight
                      ? "1px solid #0D0D0B"
                      : "1px solid rgba(13,13,11,0.08)",
                    boxShadow: tier.highlight
                      ? "0 12px 40px rgba(13,13,11,0.18)"
                      : "0 2px 16px rgba(13,13,11,0.04)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-lg font-bold tracking-tight"
                      style={{
                        fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                        color: tier.highlight ? "#fff" : "#0D0D0B",
                      }}
                    >
                      {tier.name}
                    </span>
                    {tier.highlight && (
                      <span
                        className="text-[9px] uppercase tracking-[0.16em] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "#4ade80", color: "#0D0D0B" }}
                      >
                        Most popular
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs font-medium mb-5"
                    style={{ color: tier.highlight ? "rgba(255,255,255,0.45)" : "#9E9E9A" }}
                  >
                    {tier.pages}
                  </p>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-3xl font-bold tracking-tight"
                        style={{
                          fontFamily: "var(--font-cabinet), Outfit, sans-serif",
                          color: tier.highlight ? "#fff" : "#0D0D0B",
                        }}
                      >
                        {tier.build}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: tier.highlight ? "rgba(255,255,255,0.45)" : "#9E9E9A" }}
                      >
                        one-time build
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span
                        className="text-base font-semibold"
                        style={{ color: tier.highlight ? "#4ade80" : "#1A5C3A" }}
                      >
                        + {tier.retainer}/mo
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: tier.highlight ? "rgba(255,255,255,0.45)" : "#9E9E9A" }}
                      >
                        hosting & maintenance
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: tier.highlight ? "rgba(255,255,255,0.6)" : "#6B6B68" }}
                  >
                    {tier.description}
                  </p>

                  <div className="space-y-2.5 mb-7 flex-1">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <CheckCircle
                          size={15}
                          weight="fill"
                          style={{
                            color: tier.highlight ? "#4ade80" : "#1A5C3A",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <span
                          className="text-[13px] leading-snug"
                          style={{ color: tier.highlight ? "rgba(255,255,255,0.85)" : "#0D0D0B" }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="/audit"
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200"
                    style={
                      tier.highlight
                        ? { background: "#4ade80", color: "#0D0D0B" }
                        : { background: "#1A5C3A", color: "#fff" }
                    }
                  >
                    Get my free mock-up
                    <ArrowRight size={14} weight="bold" />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <p
              className="text-xs leading-relaxed max-w-2xl mx-auto mt-10 text-center"
              style={{ color: "#9E9E9A" }}
            >
              Hosting & maintenance covers secure hosting, SSL, daily backups,
              uptime monitoring, and security updates — plus a monthly edit
              allowance (Starter: 1 · Professional: 2 · Premium: 4 small changes).
              Larger changes are quoted separately. All prices in AUD.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "#F4F3EF" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", color: "#0D0D0B" }}
            >
              See your new site first — free.
            </h2>
            <p
              className="text-base leading-relaxed mb-8 max-w-lg mx-auto"
              style={{ color: "#6B6B68" }}
            >
              We&apos;ll build a live mock-up of your new website and show it to
              you — no cost, no obligation. If you love it, we make it yours and
              keep it running. If not, you&apos;ve lost nothing.
            </p>
            <a
              href="/audit"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: "#1A5C3A",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(26,92,58,0.25)",
              }}
            >
              Get my free mock-up — see it live before you pay
              <ArrowRight size={15} weight="bold" />
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
