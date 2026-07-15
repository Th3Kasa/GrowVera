import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative" style={{ background: "#050506", color: "#fff", borderTop: "1px solid var(--color-on-dark-06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <a href="/" className="inline-block mb-3" aria-label="GrowVera home"><Logo size="lg" /></a>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--color-on-dark-text-muted)" }}>AI receptionists and instant quoting for Australian trades and local services. Your phone answered 24/7, your quotes done in seconds — so you never miss a call or lose a job.</p>
            <div className="mt-6"><a href="mailto:contact.basemmorkos@gmail.com" className="footer-link text-sm font-medium transition-colors">contact.basemmorkos@gmail.com</a></div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: "var(--color-on-dark-30)" }}>Navigate</p>
            <ul className="space-y-3">
              {[{ label: "AI Receptionist", href: "/receptionist" }, { label: "Speed-to-Lead", href: "/speed-to-lead" }, { label: "AI Quoting", href: "/quoting" }, { label: "Marketing add-ons", href: "/services" }, { label: "Pricing", href: "/#pricing" }, { label: "Free AI audit", href: "/audit" }].map((link) => (
                <li key={link.label}><a href={link.href} className="footer-link text-sm transition-colors duration-200">{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: "var(--color-on-dark-30)" }}>Legal</p>
            <ul className="space-y-3">
              {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }].map((link) => (
                <li key={link.label}><a href={link.href} className="footer-link text-sm transition-colors duration-200">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-6 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-3" style={{ borderColor: "var(--color-on-dark-06)" }}>
          <p className="text-xs" style={{ color: "var(--color-on-dark-25)" }}>&copy; {year} GrowVera &middot; contact.basemmorkos@gmail.com &middot; Sydney, Australia &middot; ABN: 50 329 139 726</p>
          <p className="text-xs" style={{ color: "var(--color-on-dark-18)" }}>GrowVera is a trading name. Results may vary based on market conditions.</p>
        </div>
      </div>
    </footer>
  );
}
