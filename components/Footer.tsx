import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative"
      style={{ background: "#0D0D0B", color: "#fff" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block mb-3" aria-label="GrowVera home">
              <Logo size="lg" dark />
            </a>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "#9E9E9A" }}
            >
              More local clients. Less guesswork. We help Sydney&apos;s best
              local businesses dominate Google Maps.
            </p>
            <div className="mt-6">
              <a
                href="mailto:admin@growvera.com.au"
                className="footer-link text-sm font-medium transition-colors"
              >
                admin@growvera.com.au
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Navigate
            </p>
            <ul className="space-y-3">
              {[
                { label: "Services", href: "/services" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Free Audit", href: "/audit" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer-link text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Legal
            </p>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer-link text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            &copy; {year} GrowVera &middot; admin@growvera.com.au &middot;
            Sydney, Australia &middot; ABN: 50 329 139 726
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
            GrowVera is a trading name. Results may vary based on market
            conditions.
          </p>
        </div>
      </div>
    </footer>
  );
}
