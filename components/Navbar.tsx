"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import MagneticButton from "./MagneticButton";
import Logo from "./Logo";

const navLinks = [
  { label: "24/7 Receptionist", href: "/receptionist" },
  { label: "What's next", href: "/#ladder" },
  { label: "Demos", href: "/#demos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-3 left-4 md:left-6 z-50"
        style={{ scale: scrolled ? 0.97 : 1, transition: "scale 0.3s ease" }}
      >
        <div
          className="flex items-center gap-6 px-6 py-3 rounded-full"
          style={{
            background: scrolled ? "var(--color-glass-strong)" : "var(--color-glass)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--color-border)",
            boxShadow: scrolled ? "0 8px 32px rgba(21,24,26,0.14)" : "0 8px 32px rgba(21,24,26,0.08)",
            transition: "all 0.3s ease",
          }}
        >
          <a href="/" aria-label="GrowVera home"><Logo size="sm" dark /></a>

          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--color-text-brightest)")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--color-text-muted)")}
              >{link.label}</a>
            ))}
          </div>

          <div className="hidden md:block">
            <MagneticButton
              as="a" href="/audit"
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
              style={{ background: "var(--color-accent)", color: "var(--color-on-accent)", "--hover-bg": "var(--color-accent-hover)" } as React.CSSProperties}
            >
              Free AI audit
            </MagneticButton>
          </div>

          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{ color: "var(--color-text)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={18} weight="bold" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <List size={18} weight="bold" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{ background: "var(--color-bg)" }}
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-2">
              {[...navLinks, { label: "Free AI audit", href: "/audit" }].map((link, i) => (
                <motion.a
                  key={link.label} href={link.href}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: [0.32, 0.72, 0, 1] }}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl font-bold py-3 px-6 rounded-2xl transition-colors"
                  style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", color: link.label === "Free AI audit" ? "var(--color-accent)" : "var(--color-text)" }}
                >{link.label}</motion.a>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pb-10 text-center">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>contact.basemmorkos@gmail.com</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
