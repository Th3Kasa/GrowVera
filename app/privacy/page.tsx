import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy – GrowVera' }

export default function PrivacyPage() {
  return (
    <main style={{ background: '#FAFAF8' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(6rem, 12vw, 9rem)', paddingBottom: 'clamp(4rem, 7vw, 7rem)' }}>
        <h1 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: '#0D0D0B', marginBottom: '10px' }}>Privacy Policy</h1>
        <p style={{ color: '#9E9E9A', fontSize: '14px', marginBottom: '48px' }}>Last updated: January 2026</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {[
            { title: 'Information We Collect', content: 'We collect information you provide when requesting a free audit: name, email address, phone number, business name, and suburb. We also collect standard analytics data via privacy-safe tools.' },
            { title: 'How We Use Your Information', content: 'We use your information to deliver the free audit report and follow up about our services if you express interest. We do not sell, rent, or share your personal information with third parties for marketing purposes.' },
            { title: 'Data Storage', content: 'Your data is stored securely on Australian-based servers. We retain your information for up to 2 years unless you request earlier deletion.' },
            { title: 'Your Rights', content: 'Under the Australian Privacy Act 1988, you have the right to access, correct, or request deletion of your personal information. Contact us at admin@growvera.com.au to exercise these rights.' },
            { title: 'Contact', content: 'For privacy-related inquiries: admin@growvera.com.au' },
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
