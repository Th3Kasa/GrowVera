'use client';

import { useState } from 'react';

const BUSINESS_TYPES = [
  'E-commerce',
  'SaaS / Software',
  'Agency / Services',
  'Local Business',
  'Startup',
  'Content / Creator',
  'Other',
];

export default function AuditRequestForm() {
  const [businessType, setBusinessType] = useState('');
  const [otherBusiness, setOtherBusiness] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="request-audit" className="py-12 sm:py-16 lg:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Request Received!</h2>
          <p className="text-zinc-400 text-lg">
            Thanks for submitting your audit request. We'll review your details and get back to you within 24–48 hours.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="request-audit" className="py-12 sm:py-16 lg:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Request Your Audit
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Fill out the form below and we'll get started on your custom growth audit.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Smith"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="john@company.com"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Website URL</label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Business Type</label>
            <div className="relative">
              <select
                value={businessType}
                onChange={(e) => {
                  setBusinessType(e.target.value);
                  if (e.target.value !== 'Other') setOtherBusiness('');
                }}
                required
                className="w-full appearance-none bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm cursor-pointer"
              >
                <option value="" disabled className="text-zinc-500">
                  Select your business type…
                </option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* "Other" business type — smooth reveal */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              businessType === 'Other' ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-0.5">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Describe Your Business
              </label>
              <input
                type="text"
                value={otherBusiness}
                onChange={(e) => setOtherBusiness(e.target.value)}
                required={businessType === 'Other'}
                placeholder="Tell us what your business does…"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Main Growth Challenge</label>
            <textarea
              rows={3}
              placeholder="What's the biggest growth challenge you're facing right now?"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-4 rounded-xl transition-all text-base shadow-lg shadow-emerald-500/20"
          >
            Request My Free Audit →
          </button>

          <p className="text-center text-zinc-500 text-xs">
            We respect your privacy. No spam, ever.
          </p>
        </form>
      </div>
    </section>
  );
}
