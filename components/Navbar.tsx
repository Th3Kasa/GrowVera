'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-3 left-4 md:left-6 z-50">
      {/* Pill container */}
      <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-full px-5 py-2.5 shadow-lg shadow-black/30">
        <span className="text-white font-bold text-base tracking-tight">GrowVera</span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="#how-it-works"
            className="text-zinc-400 hover:text-white text-sm px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
          >
            How It Works
          </a>
          <a
            href="#whats-included"
            className="text-zinc-400 hover:text-white text-sm px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
          >
            What's Included
          </a>
          <a
            href="#request-audit"
            className="ml-1 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-all"
          >
            Get My Audit
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="mt-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl px-3 py-3 flex flex-col gap-1 shadow-xl shadow-black/30 min-w-[200px]">
          <a
            href="#how-it-works"
            className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#whats-included"
            className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
            onClick={() => setIsOpen(false)}
          >
            What's Included
          </a>
          <a
            href="#request-audit"
            className="mt-1 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all text-center"
            onClick={() => setIsOpen(false)}
          >
            Get My Audit
          </a>
        </div>
      )}
    </nav>
  );
}
