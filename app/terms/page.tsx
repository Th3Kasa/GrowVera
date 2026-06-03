import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service – GrowVera' }

export default function TermsPage() {
  return (
    <main style={{ background: '#FAFAF8' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(6rem, 12vw, 9rem)', paddingBottom: 'clamp(4rem, 7vw, 7rem)' }}>
        <h1 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: '#0D0D0B', marginBottom: '10px' }}>Terms of Service</h1>
        <p style={{ color: '#9E9E9A', fontSize: '14px', marginBottom: '48px' }}>Last updated: January 2026</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {[
            { title: 'Services', content: 'GrowVera provides local SEO and Google Business Profile management services for businesses in Australia. Services are delivered on a month-to-month basis unless otherwise agreed in writing.' },
            { title: 'Payment', content: 'Fees are invoiced monthly in advance. Payment is due within 7 days of invoice. Late payment may result in suspension of services.' },
            { title: 'Results Guarantee', content: "If your Google Maps visibility does not measurably improve within 60 days of service commencement, your next month of service is provided at no cost. This guarantee applies to the first 60 days of the initial service period only." },
            { title: 'Cancellation', content: 'You may cancel at any time with 14 days notice. No lock-in contracts. Unused portions of prepaid months are not refunded.' },
            { title: 'Limitation of Liability', content: "GrowVera's liability is limited to the fees paid in the preceding month. We are not liable for indirect or consequential losses. Results depend on market conditions, competition, and factors outside our control." },
            { title: 'Governing Law', content: 'These terms are governed by the laws of New South Wales, Australia.' },
            { title: 'Contact', content: 'For terms-related inquiries: admin@growvera.com.au' },
          ].map((s, i) => (
            <div key={i}>
              <h2 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 700, fontSize: '18px', color: '#0D0D0B', letterSpacing: '-0.02em', marginBottom: '12px' }}>{s.title}</h2>
              <p style={{ color: '#6B6B68', fontSize: '15px', lineHeight: 1.8 }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
