'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Marquee from '@/components/Marquee'

const ROTATING_WORDS = ['client', 'patient', 'family', 'case', 'customer']

const INCLUDED = [
  {
    title: 'Google Listing Setup & Maintenance',
    desc: 'We fully optimise your Google Business Profile — categories, services, photos, hours, Q&A, and ongoing updates so Google always sees an active, authoritative business.',
  },
  {
    title: 'Getting You More 5-Star Reviews',
    desc: 'We set up automated review request flows via SMS and email, respond to existing reviews, and help you build a steady stream of genuine 5-star feedback.',
  },
  {
    title: 'Getting Your Business Listed Everywhere',
    desc: 'We submit and maintain your business details across 50+ Australian directories, ensuring name, address, and phone are consistent everywhere — a key local ranking signal.',
  },
  {
    title: 'Seeing What Your Competitors Are Doing',
    desc: "We track how your top local competitors are ranking, what keywords they show up for, and where they're beating you — so we can close the gap.",
  },
  {
    title: 'Plain-English Monthly Updates',
    desc: "No confusing dashboards or vanity metrics. Just a clear monthly summary of what moved, what we did, and what we're doing next.",
  },
  {
    title: 'Showing Up in Google Search & Maps',
    desc: 'Everything we do is aimed at one outcome: your business appearing when local customers search for what you offer on Google Search and Maps.',
  },
]

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % ROTATING_WORDS.length)
        setFade(true)
      }, 250)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <span style={{
      color: '#1A5C3A',
      display: 'inline-block',
      opacity: fade ? 1 : 0,
      transform: fade ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
    }}>
      {ROTATING_WORDS[idx]}
    </span>
  )
}

function WhatsIncluded() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ border: '1px solid #E2E1DC', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
      {INCLUDED.map((item, i) => (
        <div key={i} style={{ borderBottom: i < INCLUDED.length - 1 ? '1px solid #E2E1DC' : 'none' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '20px 24px',
              background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#1A5C3A',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 600, fontSize: '15px', color: '#0D0D0B', letterSpacing: '-0.01em' }}>
                {item.title}
              </span>
            </div>
            <span style={{ color: '#9E9E9A', fontSize: '20px', flexShrink: 0, fontWeight: 300, lineHeight: 1 }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          <div style={{
            maxHeight: open === i ? '200px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}>
            <p style={{ padding: '0 24px 20px 56px', color: '#6B6B68', fontSize: '14px', lineHeight: 1.75 }}>
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <main>

      {/* Hero — Fix #2: clamp() padding instead of fixed large values */}
      <section style={{ background: '#FAFAF8' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: 'clamp(6rem, 14vw, 9rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(26,92,58,0.06)', border: '1px solid rgba(26,92,58,0.14)',
            borderRadius: '100px', padding: '6px 14px', marginBottom: '28px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1A5C3A', display: 'inline-block' }}/>
            <span style={{ color: '#1A5C3A', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em' }}>
              SYDNEY · LOCAL GROWTH AGENCY
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cabinet)',
            fontWeight: 800,
            fontSize: 'clamp(2.6rem, 9vw, 5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            color: '#0D0D0B',
            maxWidth: '700px',
          }}>
            Your next <RotatingWord /> is{' '}
            <span style={{
              color: '#1A5C3A',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(26,92,58,0.35)',
              textUnderlineOffset: '6px',
            }}>
              searching
            </span>{' '}
            Google.
          </h1>

          <p style={{ marginTop: '24px', color: '#6B6B68', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '480px' }}>
            We help Sydney businesses show up when it matters most — on Google Maps and local search. No lock-in. Results in 30–60 days.
          </p>

          <div style={{ marginTop: '40px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: '2rem', color: '#0D0D0B', letterSpacing: '-0.04em', lineHeight: 1 }}>#1</div>
              <div style={{ color: '#9E9E9A', fontSize: '13px', marginTop: '4px', maxWidth: '130px', lineHeight: 1.4 }}>our goal — get your business to the top of local search</div>
            </div>
            <div style={{ width: '1px', height: '44px', background: '#E2E1DC', marginTop: '2px' }}/>
            <div>
              <div style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: '2rem', color: '#0D0D0B', letterSpacing: '-0.04em', lineHeight: 1 }}>50+</div>
              <div style={{ color: '#9E9E9A', fontSize: '13px', marginTop: '4px', maxWidth: '130px', lineHeight: 1.4 }}>Australian directories where we list your business</div>
            </div>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <Link href="/audit" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#1A5C3A', color: '#fff', fontWeight: 700, fontSize: '15px',
              padding: '14px 28px', borderRadius: '100px', textDecoration: 'none', letterSpacing: '-0.01em',
            }}>
              Get your free audit →
            </Link>
            <Link href="/#how-it-works" style={{
              display: 'inline-flex', alignItems: 'center',
              color: '#6B6B68', fontWeight: 500, fontSize: '14px', textDecoration: 'none',
              padding: '14px 20px', borderRadius: '100px',
              border: '1px solid #E2E1DC', background: '#fff',
            }}>
              See how it works
            </Link>
          </div>

          {/* Google Maps mockup */}
          <div style={{ marginTop: '52px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #D4E4D7', height: '180px', position: 'relative', background: '#C8DCC9' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #d4e8d7 0%, #bcd8c0 50%, #a8c9ad 100%)' }}/>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
              {[20, 40, 60, 80].map(pct => (
                <div key={pct} style={{ position: 'absolute', left: 0, right: 0, top: `${pct}%`, height: '1px', background: '#2D6B42' }}/>
              ))}
              {[16, 33, 50, 66, 83].map(pct => (
                <div key={pct} style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: '1px', background: '#2D6B42' }}/>
              ))}
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: '#1A5C3A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(26,92,58,0.45)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
            <div style={{
              position: 'absolute', top: '14px', right: '14px',
              background: '#1A5C3A', color: '#fff',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
              padding: '6px 12px', borderRadius: '100px',
            }}>
              #1 LOCAL PACK
            </div>
          </div>
        </div>
      </section>

      {/* Dark stats + marquee */}
      <section style={{ background: '#0D0D0B' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '3.5rem', paddingBottom: '2.5rem' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { stat: '30–60 days', label: 'Get found faster' },
              { stat: '50+', label: 'Australian directories' },
              { stat: '2 mo', label: 'Average to results' },
              { stat: 'Free', label: 'Audit, no obligation' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 1.875rem)', color: '#fff', letterSpacing: '-0.03em' }}>
                  {item.stat}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '6px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '18px 0' }}>
          <Marquee />
        </div>
      </section>

      {/* How It Works — Fix #2: clamp() padding */}
      <section id="how-it-works" style={{ background: '#F4F3EF' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: 'clamp(3rem, 7vw, 5.5rem)', paddingBottom: 'clamp(3rem, 7vw, 5.5rem)' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ color: '#9E9E9A', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>The process</div>
            <h2 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(1.75rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: '#0D0D0B', maxWidth: '440px' }}>
              Three steps. Zero stress.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { n: '01', title: 'We find out why Google is ignoring you', desc: "We run a full audit of your Google Business Profile, local citations, and review profile. You get a clear report showing exactly what's holding you back." },
              { n: '02', title: "We fix it — you don't lift a finger", desc: 'Our team handles everything: optimising your listing, building citations, setting up review flows, and tracking your competitors. No tech knowledge needed.' },
              { n: '03', title: 'Your phone starts ringing more', desc: "Within 30–60 days you'll see your business climbing in local results. We keep working each month to push you higher and hold your position." },
            ].map((step, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #E2E1DC' }}>
                <div style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: '13px', color: '#1A5C3A', letterSpacing: '0.04em', marginBottom: '18px' }}>{step.n}</div>
                <h3 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 700, fontSize: '17px', color: '#0D0D0B', letterSpacing: '-0.02em', marginBottom: '10px', lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ color: '#6B6B68', fontSize: '14px', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included — Fix #2: clamp() padding eliminates gap on mobile */}
      <section style={{ background: '#FAFAF8' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: 'clamp(3rem, 7vw, 5.5rem)', paddingBottom: 'clamp(3rem, 7vw, 5.5rem)' }}>
          <div style={{ marginBottom: '36px' }}>
            <div style={{ color: '#9E9E9A', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>What you get</div>
            <h2 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(1.75rem, 5vw, 3rem)', letterSpacing: '-0.03em', color: '#0D0D0B' }}>Everything included.</h2>
          </div>
          <WhatsIncluded />
        </div>
      </section>

      {/* Guarantee */}
      <section style={{ background: '#F4F3EF' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: 'clamp(3rem, 7vw, 5.5rem)', paddingBottom: 'clamp(3rem, 7vw, 5.5rem)' }}>
          <div style={{
            border: '1.5px solid #1A5C3A', borderRadius: '20px',
            padding: 'clamp(28px, 5vw, 52px)',
            display: 'flex', alignItems: 'flex-start', gap: '36px', flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ color: '#9E9E9A', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Our guarantee</div>
              <h2 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(1.3rem, 4vw, 2rem)', letterSpacing: '-0.03em', color: '#0D0D0B', lineHeight: 1.25, marginBottom: '14px' }}>
                If your Google Maps visibility doesn&apos;t measurably improve in 60 days &mdash; your next month is free.
              </h2>
              <p style={{ color: '#6B6B68', fontSize: '14px', lineHeight: 1.75 }}>
                We stand behind our work. If we can&apos;t move the needle within 60 days, you don&apos;t pay for the next month. No fine print.
              </p>
            </div>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%', border: '2px solid #1A5C3A',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: '28px', color: '#1A5C3A', lineHeight: 1 }}>60</span>
              <span style={{ color: '#1A5C3A', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>DAYS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: '#1A5C3A' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ paddingTop: 'clamp(3.5rem, 8vw, 6.5rem)', paddingBottom: 'clamp(3.5rem, 8vw, 6.5rem)' }}>
          <h2 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.03em', color: '#fff', marginBottom: '18px' }}>
            Start with a free audit.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 36px' }}>
            No sales pitch. No obligation. Just a clear picture of where your business stands — and what to do about it.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '36px' }}>
            {['Google Maps ranking', 'GBP health score', 'Review analysis', 'Top 3 action items'].map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)',
                fontSize: '13px', fontWeight: 500, padding: '7px 14px', borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L3.5 7L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {item}
              </span>
            ))}
          </div>
          <Link href="/audit" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#fff', color: '#1A5C3A', fontWeight: 700, fontSize: '16px',
            padding: '16px 36px', borderRadius: '100px', textDecoration: 'none', letterSpacing: '-0.01em',
          }}>
            Get my free audit →
          </Link>
          <div style={{ marginTop: '14px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Takes 60 seconds · Zero cost · Zero commitment
          </div>
        </div>
      </section>
    </main>
  )
}
