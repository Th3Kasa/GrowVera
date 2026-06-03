'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [visible, setVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      if (y < 60) setVisible(true)
      else if (y > lastScrollY) setVisible(false)
      else setVisible(true)
      setLastScrollY(y)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    // Fix #1: moved from centered (top-6 left-1/2 -translate-x-1/2) to left-aligned
    <nav
      className="fixed top-3 left-4 md:left-6 z-50"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="flex items-center gap-4 px-5 py-2.5 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-cabinet), sans-serif',
            fontWeight: 800,
            fontSize: '17px',
            letterSpacing: '-0.03em',
            color: '#0D0D0B',
            lineHeight: 1,
          }}>
            Grow<span style={{ color: '#1A5C3A' }}>Vera</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/#how-it-works"
            style={{ color: '#6B6B68', fontSize: '14px', fontWeight: 500, textDecoration: 'none', padding: '6px 12px', borderRadius: '100px' }}>
            How It Works
          </Link>
          <Link href="/services"
            style={{ color: '#6B6B68', fontSize: '14px', fontWeight: 500, textDecoration: 'none', padding: '6px 12px', borderRadius: '100px' }}>
            Services
          </Link>
        </div>

        <Link href="/audit" className="hidden md:inline-flex items-center"
          style={{
            background: '#1A5C3A',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: '100px',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}>
          Free Audit →
        </Link>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          aria-label="Toggle menu"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            {mobileOpen ? (
              <path d="M1 1L17 13M17 1L1 13" stroke="#0D0D0B" strokeWidth="1.75" strokeLinecap="round"/>
            ) : (
              <>
                <path d="M0 1H18" stroke="#0D0D0B" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M0 7H18" stroke="#0D0D0B" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M0 13H18" stroke="#0D0D0B" strokeWidth="1.75" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="mt-2 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
          <div className="p-3 flex flex-col gap-1">
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)}
              style={{ color: '#0D0D0B', fontSize: '15px', fontWeight: 500, textDecoration: 'none', padding: '10px 14px', borderRadius: '12px', display: 'block' }}>
              How It Works
            </Link>
            <Link href="/services" onClick={() => setMobileOpen(false)}
              style={{ color: '#0D0D0B', fontSize: '15px', fontWeight: 500, textDecoration: 'none', padding: '10px 14px', borderRadius: '12px', display: 'block' }}>
              Services
            </Link>
            <Link href="/audit" onClick={() => setMobileOpen(false)}
              style={{
                background: '#1A5C3A', color: '#fff', fontSize: '14px', fontWeight: 600,
                padding: '12px 14px', borderRadius: '12px', textDecoration: 'none',
                textAlign: 'center', display: 'block', marginTop: '4px',
              }}>
              Free Audit →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
