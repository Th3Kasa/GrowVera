import type { Metadata } from 'next'
import AuditForm from '@/components/AuditForm'

export const metadata: Metadata = {
  title: 'Free Google Audit – GrowVera',
  description: "Get your free Google Business Profile audit. We'll show you exactly where you stand and the top 3 things to fix.",
}

export default function AuditPage() {
  return (
    <main style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(6rem, 12vw, 9rem)', paddingBottom: 'clamp(3rem, 7vw, 6rem)' }}>

        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(26,92,58,0.06)', border: '1px solid rgba(26,92,58,0.14)',
            borderRadius: '100px', padding: '6px 14px', marginBottom: '20px',
          }}>
            <span style={{ color: '#1A5C3A', fontSize: '13px', fontWeight: 600 }}>Zero cost · Zero commitment</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(2rem, 6vw, 3.25rem)', letterSpacing: '-0.035em', color: '#0D0D0B', marginBottom: '14px' }}>
            Get your free Google audit.
          </h1>
          <p style={{ color: '#6B6B68', fontSize: '1rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
            Takes 60 seconds. We&apos;ll send you a clear breakdown of how your business appears on Google — and what to fix first.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3"
            style={{ background: '#fff', border: '1px solid #E2E1DC', borderRadius: '20px', padding: 'clamp(24px, 4vw, 40px)' }}>
            <AuditForm />
          </div>

          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ border: '1px solid #E2E1DC', borderRadius: '16px', padding: '28px', background: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 700, fontSize: '15px', color: '#0D0D0B', letterSpacing: '-0.02em', marginBottom: '18px' }}>
                What&apos;s in your audit
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Google Maps ranking', 'GBP score out of 100', 'Review velocity vs competitors', 'Citation consistency', 'Top 3 actions to take now'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#1A5C3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span style={{ color: '#0D0D0B', fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid #E2E1DC', borderRadius: '16px', padding: '24px', background: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: '🔒', text: 'Your details are never sold or shared' },
                  { icon: '📋', text: 'No lock-in contracts — ever' },
                  { icon: '⚡', text: 'Delivered in 1–2 business days' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ color: '#6B6B68', fontSize: '14px', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#F4F3EF', border: '1px solid #E2E1DC', borderRadius: '16px', padding: '22px' }}>
              <p style={{ color: '#6B6B68', fontSize: '14px', lineHeight: 1.7 }}>
                <strong style={{ color: '#0D0D0B' }}>Sydney-based team.</strong> We know the local market, the suburbs, and what it takes to rank in Australian Google results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
