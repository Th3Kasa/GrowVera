'use client'

const INDUSTRIES = [
  'Dental Practices', 'Med Spas', 'NDIS Providers', 'Physio Clinics',
  'Law Firms', 'Accounting Firms', 'Trades', 'Childcare Centres',
  'Podiatry Clinics', 'Chiropractic Practices',
]

export default function Marquee() {
  const doubled = [...INDUSTRIES, ...INDUSTRIES]
  return (
    <div style={{ overflow: 'hidden' }}>
      <div className="animate-marquee" style={{ display: 'flex', width: 'max-content' }}>
        {doubled.map((name, i) => (
          <span key={i} style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            padding: '0 28px',
          }}>
            {name}
            <span style={{ marginLeft: '28px', color: 'rgba(255,255,255,0.2)' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
