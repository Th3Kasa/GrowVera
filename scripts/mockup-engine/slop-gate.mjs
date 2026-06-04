/**
 * The Slop Gate — automated quality guard, run on every rendered mock-up.
 * Mirrors the fabrication guard: a hard checklist drawn from ANTI-SLOP.md.
 * Returns { pass, violations } so generate.mjs can refuse to ship slop.
 */

export function slopGate(html, { heroBytes = 0 } = {}) {
  const v = [];
  const lower = html.toLowerCase();

  // 1. No purple/indigo/violet — the #1 AI tell.
  const purpleHex = /#(8b5cf6|6366f1|7c3aed|a855f7|818cf8|6d28d9|4f46e5|7c3aed)/i;
  if (purpleHex.test(html) || /\b(purple|indigo|violet)\b/.test(lower)) {
    v.push("purple/indigo/violet detected (slop tell)");
  }

  // 2. No pictographic emoji used as feature/section iconography (the 🔧⚡ kind).
  //    We use inline SVG line icons. Star rating glyphs (★☆) are legitimate typography, not slop.
  const emoji = /[\u{1F000}-\u{1FAFF}\u{2700}-\u{27BF}]/u;
  if (emoji.test(html)) v.push("pictographic emoji found in markup (use SVG icons, not emoji)");

  // 3. No stock-photo hero (must be a generated/local image asset).
  if (/images\.unsplash\.com|images\.pexels\.com|istockphoto|shutterstock/i.test(lower)) {
    v.push("stock-photo URL in hero (use a generated bespoke image)");
  }

  // 4. A real font pairing must be present (no system-default-only).
  if (!/fonts\.googleapis\.com/i.test(lower)) v.push("no Google Fonts pairing (default fonts = slop)");

  // 5. The bespoke hero image must actually exist and be non-trivial.
  if (heroBytes > 0 && heroBytes < 8000) v.push(`hero image too small (${heroBytes} bytes) — likely failed generation`);

  // 6. Crafted "little things" must be present (proxy: scroll reveal + counters).
  if (!/IntersectionObserver/.test(html)) v.push("missing scroll-reveal/counters (uncrafted)");

  return { pass: v.length === 0, violations: v };
}
