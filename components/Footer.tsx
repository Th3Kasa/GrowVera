import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0D0D0B' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '3.5rem', paddingBottom: '2.5rem' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.03em', marginBottom: '10px' }}>
              <span style={{ color: '#fff' }}>Grow</span><span style={{ color: '#1A5C3A' }}>Vera</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.7, maxWidth: '200px', marginBottom: '12px' }}>
              More local clients. Less guesswork.
            </p>
            <a href="mailto:admin@growvera.com.au" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', textDecoration: 'none' }}>
              admin@growvera.com.au
            </a>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Navigate</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/services" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', textDecoration: 'none' }}>Services</Link>
              <Link href="/#how-it-works" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', textDecoration: 'none' }}>How It Works</Link>
              <Link href="/audit" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', textDecoration: 'none' }}>Free Audit</Link>
            </div>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', textDecoration: 'none' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '40px', paddingTop: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', lineHeight: 1.7 }}>
            © 2026 GrowVera · admin@growvera.com.au · Sydney, Australia · ABN: 50 329 139 726
          </p>
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', marginTop: '6px' }}>
            GrowVera is a trading name. Results may vary based on market conditions.
          </p>
        </div>
      </div>
    </footer>
  )
}
