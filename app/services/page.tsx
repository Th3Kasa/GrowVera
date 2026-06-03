import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services – GrowVera',
  description: 'Local SEO services for Sydney businesses. GBP optimisation, review generation, citations, and more.',
}

const SERVICES = [
  {
    number: '01', title: 'Google Business Profile Optimisation', badge: 'Most impactful',
    description: 'Your GBP is the single biggest driver of local visibility. Most businesses have incomplete or poorly optimised profiles — and Google notices.',
    items: ['Complete profile setup and category optimisation', 'Service and product listings with keyword-rich descriptions', 'Photo uploads and ongoing management', 'Hours, attributes, and Q&A populated', 'Weekly Google Posts to show activity', 'Spam fighter monitoring', 'Ongoing updates as your business changes'],
  },
  {
    number: '02', title: 'Review Generation', badge: 'AHPRA-aware',
    description: 'More 5-star reviews = higher rankings and more trust. We set up ethical, automated flows that make it easy for happy clients to leave reviews.',
    items: ['SMS and email review request sequences', 'Responses drafted and posted to existing reviews', 'AHPRA-compliant process for health professionals', 'Negative review protocol', 'Monthly review velocity reporting'],
  },
  {
    number: '03', title: 'Local Citations & Directory Management', badge: '50+ AU directories',
    description: 'Consistent NAP (name, address, phone) data across the web is a core local ranking signal. We clean up inconsistencies and build new citations.',
    items: ['Submission to 50+ Australian directories', 'NAP consistency audit and cleanup', 'Industry-specific directory submissions', 'Ongoing monitoring for changes', 'Google Maps pin verification'],
  },
  {
    number: '04', title: 'Local SEO', badge: 'On-page & technical',
    description: 'Your website needs to support your local rankings. We make the on-page and technical changes that help Google connect your site to your location.',
    items: ['Local keyword research and mapping', 'Title tags, meta descriptions, and headings', 'Location pages created or optimised', 'Schema markup (LocalBusiness, reviews)', 'Google Search Console setup and monitoring', 'Core Web Vitals assessment'],
  },
  {
    number: '05', title: 'Competitor Analysis', badge: 'Ongoing',
    description: "You don't just need to be good — you need to be better than your local competitors. We track them so we know exactly where to focus.",
    items: ['Local competitor identification', 'Ranking comparison on key terms', 'GBP strength analysis vs. competitors', 'Review gap analysis', 'Opportunity identification monthly'],
  },
  {
    number: '06', title: 'Monthly Reporting', badge: 'Plain English',
    description: "No confusing dashboards. No vanity metrics. Just a clear monthly update on what moved, what we did, and what's next.",
    items: ['Google Maps ranking movement', 'GBP views, calls, and direction requests', 'Review count and average rating', 'Citation coverage', 'Actions completed this month', 'Focus for next month'],
  },
]

export default function ServicesPage() {
  return (
    <main style={{ background: '#FAFAF8' }}>
      <section style={{ background: '#F4F3EF' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: 'clamp(6rem, 12vw, 9rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <h1 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.035em', color: '#0D0D0B', marginBottom: '18px' }}>
            Everything you need to rank locally.
          </h1>
          <p style={{ color: '#6B6B68', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto' }}>
            We handle the full local SEO stack so you can focus on running your business.
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'clamp(4rem, 8vw, 7rem)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {SERVICES.map((svc, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E1DC', borderRadius: '20px', padding: 'clamp(24px, 4vw, 40px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: '12px', color: '#1A5C3A', letterSpacing: '0.06em' }}>{svc.number}</span>
                    <h2 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 700, fontSize: 'clamp(1.05rem, 3vw, 1.375rem)', color: '#0D0D0B', letterSpacing: '-0.02em' }}>{svc.title}</h2>
                  </div>
                  <span style={{ background: 'rgba(26,92,58,0.07)', color: '#1A5C3A', fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '100px', whiteSpace: 'nowrap' }}>{svc.badge}</span>
                </div>
                <p style={{ color: '#6B6B68', fontSize: '14px', lineHeight: 1.75, marginBottom: '22px', maxWidth: '560px' }}>{svc.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {svc.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(26,92,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3 5.5L8 1" stroke="#1A5C3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span style={{ color: '#4A4A47', fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '56px', background: '#1A5C3A', borderRadius: '20px', padding: 'clamp(32px, 5vw, 52px)', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', color: '#fff', marginBottom: '14px' }}>Ready to start growing?</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px', maxWidth: '340px', margin: '0 auto 28px' }}>Start with a free audit — no commitment required.</p>
            <Link href="/audit" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', color: '#1A5C3A', fontWeight: 700, fontSize: '15px',
              padding: '14px 32px', borderRadius: '100px', textDecoration: 'none', letterSpacing: '-0.01em',
            }}>Get my free audit →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
