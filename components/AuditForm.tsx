'use client'
import { useState } from 'react'

const BUSINESS_TYPES = [
  'Dental Practice',
  'Med Spa / Aesthetics',
  'NDIS Provider',
  'Physiotherapy Clinic',
  'Law Firm',
  'Accounting Firm',
  'Trade (Plumbing / Electrical / etc.)',
  'Childcare',
  'Podiatry Clinic',
  'Chiropractic Practice',
  'Other',
]

type FormData = {
  name: string
  email: string
  phone: string
  businessName: string
  businessType: string
  otherBusinessType: string
  suburb: string
  message: string
}

const INITIAL: FormData = {
  name: '', email: '', phone: '', businessName: '',
  businessType: '', otherBusinessType: '', suburb: '', message: '',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #E2E1DC',
  borderRadius: '10px',
  fontSize: '15px',
  color: '#0D0D0B',
  background: '#FAFAF8',
  outline: 'none',
  fontFamily: 'var(--font-dm-sans), sans-serif',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#0D0D0B',
  marginBottom: '6px',
}

export default function AuditForm() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'businessType' && value !== 'Other' ? { otherBusinessType: '' } : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#1A5C3A', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
            <path d="M1 9L7.5 15.5L21 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-cabinet)', fontWeight: 800, fontSize: '22px', color: '#0D0D0B', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          You&apos;re on the list!
        </h3>
        <p style={{ color: '#6B6B68', fontSize: '15px', lineHeight: 1.7, maxWidth: '320px', margin: '0 auto' }}>
          We&apos;ll send your free Google audit within 1–2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Full name *</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Jane Smith" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="jane@example.com.au" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Phone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="04XX XXX XXX" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Business name *</label>
          <input name="businessName" value={form.businessName} onChange={handleChange} required placeholder="Smith Dental" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Business type *</label>
        <select name="businessType" value={form.businessType} onChange={handleChange} required
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
          <option value="" disabled>Select your business type</option>
          {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Fix #3 — smooth reveal when Other is selected */}
      <div style={{
        maxHeight: form.businessType === 'Other' ? '100px' : '0',
        opacity: form.businessType === 'Other' ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
      }}>
        <label style={labelStyle}>Describe your business type *</label>
        <input
          name="otherBusinessType"
          value={form.otherBusinessType}
          onChange={handleChange}
          required={form.businessType === 'Other'}
          placeholder="e.g. Veterinary clinic, yoga studio…"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Your suburb *</label>
        <input name="suburb" value={form.suburb} onChange={handleChange} required placeholder="Surry Hills, Bondi, Parramatta…" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Anything else? (optional)</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={3}
          placeholder="What are you struggling with most right now?"
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <button type="submit" disabled={submitting} style={{
        width: '100%', background: '#1A5C3A', color: '#fff',
        fontFamily: 'var(--font-cabinet), sans-serif', fontWeight: 700, fontSize: '16px',
        padding: '16px', borderRadius: '12px', border: 'none',
        cursor: submitting ? 'wait' : 'pointer', letterSpacing: '-0.01em',
        opacity: submitting ? 0.8 : 1, transition: 'opacity 0.2s',
      }}>
        {submitting ? 'Submitting…' : 'Get my free audit →'}
      </button>

      <p style={{ textAlign: 'center', color: '#9E9E9A', fontSize: '13px' }}>
        Zero cost · Zero commitment · Takes 60 seconds
      </p>
    </form>
  )
}
