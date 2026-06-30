import { MODELS, hasLLM } from "./config";
import { complete } from "./llm";
import { slugify } from "./util";
import type { Business, SiteArtifact } from "./types";

/**
 * The design-system prompt is stable across every build, so it's sent as a
 * cached system prefix — repeat builds bill it at ~0.1x input. This is the
 * single biggest per-site cost saving.
 */
const DESIGN_SYSTEM = `You are a senior brand designer and front-end engineer at a $50k-retainer digital studio. A client just paid premium agency rates for this website — it must look and feel like it, not like a $99 template or a Fiverr gig. This is the single sales asset that convinces a tradesperson to pay a monthly retainer for an agency, so it has to visibly justify that price the moment it loads.

OUTPUT RULES (strict):
- Return ONE complete, valid HTML5 document and nothing else. No markdown, no code fences, no commentary.
- Inline ALL CSS in a single <style> tag, plus a small inline <script> for scroll-reveal/micro-interactions if used. You may load Google Fonts via <link>. No CSS/JS frameworks, no external icon libraries.
- Mobile-first and fully responsive, including a persistent mobile bottom call bar. Semantic, accessible, fast.
- Footer copyright year must read exactly "${new Date().getFullYear()}" — never write any other year.

LAYOUT INTEGRITY (these are the most common ways a generated site looks broken/cheap — get them exactly right):
- The hero must NOT be cramped under the sticky header. If the header is position:fixed/sticky, the hero needs top padding (or margin) at least equal to the header height so the headline never sits jammed against the top edge or hides behind the bar. Give the hero real vertical breathing room — min-height around 70–88vh on desktop — so the headline, subhead and CTA sit centred with space around them, not squeezed into a thin band.
- The persistent mobile bottom call bar is fixed at the bottom on small screens, so it covers whatever is behind it. The <body> (or last section) MUST have bottom padding at least equal to the bar's height on mobile, so the footer/contact content is never hidden or overlapped by the bar. Never let the bar float over and obscure body text.
- No empty, half-empty, or stubby sections. Every section needs enough real content to look intentional — services cards with a heading + a real sentence each, a gallery with all provided photos, an about paragraph with substance. Sparse sections with one line of text and huge empty space read as an unfinished template.
- Consistent alignment and spacing: section padding, max-width container and grid gaps should be uniform down the page. Headings, body text and cards within a section share a consistent left edge / alignment. Nothing should look randomly indented, off-centre, or misaligned relative to the section above it.

BANNED — using any of these makes the output look like a generic AI template and is an automatic fail:
- Emoji used as icons (⚡🔌📞📍🕐 etc). Build small inline SVG line icons (stroke="currentColor", no external library) or skip icons entirely — never an emoji glyph standing in for an icon.
- The orange-and-navy "tradie template" palette (#FF6B00 / #1A3A52 or near-identical hex values). It is the single most overused local-trade-site palette and instantly reads as cheap.
- Centered hero text over a generic dark gradient, or a 3-equal-column "feature card" grid as the only layout idea on the page. Vary the rhythm: at least one asymmetric or full-bleed section.
- Filler copy patterns: "safe, reliable, and affordable", "no job too big or too small", "comprehensive solutions for your home and business", "quality you can trust" — write specific, confident copy instead, grounded in the real category and suburb.
- Generic rounded-pill buttons with a drop shadow as the only interactive element — design at least one distinctive, on-brand interactive/hover moment.
- Stacking multiple competing scroll/hover animation styles (parallax + fade-up + tilt + count-up, all on one page). Heavy, busy motion is the current tell for "AI template" — real premium sites at this price point keep interaction restrained to one or two deliberate moments (a hover state, a single scroll reveal), nothing more.

PERSONALISATION (non-negotiable — this is a bespoke site for ONE specific business, not a template with the name swapped in):
- Everything must feel individually designed for THIS business: its exact name, trade, brand personality and real work shape the brand mark, the accent colour, the hero value proposition, the service list and the copy. If the page would look identical after swapping in a different business name, it has failed.

COPY & LOCATION (write like a brand copywriter, not an SEO plugin):
- Lead with the craft, the quality and the customer outcome — NOT the suburb. The hero headline must sell what they do and why they're good, not where they are. Avoid "[Trade] for [Suburb] Homes", "[Trade] in [Suburb]", or jamming the suburb into the H1 and every section heading — it reads as keyword-stuffing and boxes the business into one postcode.
- Mention the location naturally and sparingly — once or twice total, in a subheading, the about paragraph, or the contact section — and frame the service area generously ("[Suburb] and the surrounding areas", or the wider region) rather than fixating on the single suburb, since these tradies work across a whole area, not one street.
- Headlines should be confident and specific to the trade and brand (e.g. for a tiler: "Tiling done right, the first time" or "Bathrooms and kitchens, finished to a standard you'll notice") — concrete, human, never generic filler.

BRAND MARK / LOGO (every business must have a real brand identity in the header, not plain default-font text):
- If a "logoUrl" is provided in the brief, use it as the header brand mark via an <img> (business name as alt text), sized tastefully (~32–44px tall), never stretched or pixelated; optionally repeat smaller in the footer.
- If NO logoUrl is provided (the common case), do NOT just drop the raw business name in a default font. DESIGN a small, considered brand mark, matched to the palette — either:
  (a) a refined WORDMARK: the name set in the display face with deliberate weight, letter-spacing and colour, optionally a tiny inline-SVG accent glyph; or
  (b) a MONOGRAM badge: the business's initials in a styled square/circle/hexagon sitting next to the name.
- Derive the initials/wordmark sensibly from the real name — drop generic suffixes ("Pty Ltd", "Services", "& Sons") and the suburb so the mark is clean and legible. It should look like a mark a design studio mocked up for the pitch, distinct to this business.

DESIGN DIRECTION:
- Pick ONE considered palette that feels bespoke to this specific brand/trade, not a formula applied identically every time: a deep, confident base (ink/charcoal/forest/navy-black — not stock blue) + a single saturated accent used sparingly for CTAs only, on a warm off-white or near-black background. Let the category and business name nudge the accent hue so sites don't all converge on the same green. No default Bootstrap blue, no purple-on-white SaaS gradient.
- Typography: pair a characterful display face (a serif like Fraunces/Newsreader/Playfair, or a confident grotesk like Space Grotesk/General Sans) for headlines against a clean workhorse sans (Inter/Manrope) for body. Large, confident type scale on the hero (clamp() driven). Tight letter-spacing on headlines.
- Real depth and craft over motion: soft layered shadows (not one flat box-shadow everywhere), generous whitespace, a frosted/blurred sticky header. If you add a micro-interaction, make it exactly one considered moment (e.g. a single hover-state shift on the primary CTA, or one IntersectionObserver reveal on the gallery) — restraint reads as expensive, more animation does not.
- Photography is the primary trust signal for a trade business — a prospect judging "is this person any good" looks at the work, not the copy. Give the gallery of real project photos a featured, generous section (not a cramped afterthought grid) — treat it as the digital equivalent of a portfolio showroom. Treat all photos consistently (uniform aspect-ratio, object-fit: cover, a subtle gradient overlay behind hero text for legibility).
- Structure: sticky header with business name + phone tel: CTA; a hero with a real photo and a sharp, specific value proposition (not generic adjectives); services (only those implied by the category — never invent specialised services); a generously-sized gallery/portfolio section using the provided photos as the visual centerpiece of the page; an about section; social proof if a rating/review count is given; a prominent contact section with phone, address and hours; a footer with the exact current year.
- Use ONLY the real business details provided. Do not fabricate awards, years in business, licensing claims, or guarantees that weren't given to you.`;

/**
 * Sets the prospect's expectations directly on the demo: it's a starting
 * concept built from public info, not the final custom site. Injected
 * deterministically (scoped #gv id, max z-index, self-contained styles) so it
 * appears on every demo regardless of the generated CSS, and positioned to
 * sit clear of the mobile bottom call bar rather than overlap it. The prominent
 * version of this message also lives on the /offer page the prospect lands on.
 *
 * Also injects a deterministic mobile bottom-padding safety net: the model is
 * unreliable at reserving space for its own fixed mobile call bar (the single
 * most recurring QA failure — the bar ends up covering the footer), so we force
 * adequate bottom padding on small screens regardless of what the CSS did. This
 * clears both the call bar and this disclaimer badge.
 */
function injectPreviewDisclaimer(html: string): string {
  const badge = `<div id="gv-preview-badge">Preview concept — your full custom website is designed with you once you come on board.</div>
<style>#gv-preview-badge{position:fixed;right:14px;bottom:14px;z-index:2147483647;max-width:300px;background:rgba(17,17,19,.93);color:#fff;font:500 12px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;padding:9px 13px;border-radius:10px;box-shadow:0 6px 22px rgba(0,0,0,.30);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}@media(max-width:767px){body{padding-bottom:148px!important}#gv-preview-badge{left:14px;right:14px;bottom:84px;max-width:none;text-align:center}}</style>`;
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${badge}\n</body>`) : html + badge;
}

function renderTemplate(b: Business): string {
  const hero = b.photos[0] ?? "";
  const gallery = b.photos
    .map((p) => `<img src="${p}" alt="${b.name}" loading="lazy" />`)
    .join("\n");
  const tel = (b.phone ?? "").replace(/[^0-9+]/g, "");
  const rating =
    typeof b.rating === "number"
      ? `<p class="rating">★ ${b.rating.toFixed(1)} · ${b.reviewsCount ?? 0} reviews</p>`
      : "";
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${b.name} — ${b.category} in ${b.region}</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,800&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
<style>
  :root{--ink:#16201c;--bg:#f6f4ee;--accent:#1a5c3a;--muted:#5b615c}
  *{box-sizing:border-box;margin:0}
  body{font-family:Inter,system-ui,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
  h1,h2{font-family:Fraunces,Georgia,serif;letter-spacing:-.02em;line-height:1.05}
  header{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;background:rgba(246,244,238,.9);backdrop-filter:blur(8px);border-bottom:1px solid #e4e0d6;z-index:10}
  .brand{font-family:Fraunces;font-weight:800;font-size:1.2rem}
  .btn{background:var(--accent);color:#fff;padding:.6rem 1.1rem;border-radius:999px;text-decoration:none;font-weight:600;font-size:.9rem}
  .hero{display:grid;gap:2rem;padding:3.5rem 1.25rem;max-width:1100px;margin:0 auto;align-items:center}
  @media(min-width:820px){.hero{grid-template-columns:1.1fr 1fr}}
  .hero h1{font-size:clamp(2.2rem,6vw,3.6rem);font-weight:800}
  .hero p.lead{color:var(--muted);font-size:1.15rem;margin:1rem 0 1.5rem}
  .hero img{width:100%;border-radius:1.25rem;aspect-ratio:4/3;object-fit:cover}
  section{max-width:1100px;margin:0 auto;padding:2.5rem 1.25rem}
  .services{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
  .card{background:#fff;border:1px solid #e4e0d6;border-radius:1rem;padding:1.25rem}
  .gallery{display:grid;gap:.75rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
  .gallery img{width:100%;border-radius:.9rem;aspect-ratio:4/3;object-fit:cover}
  .contact{background:var(--accent);color:#fff;border-radius:1.25rem;padding:2rem;display:grid;gap:.5rem}
  .contact a{color:#fff}
  .rating{color:var(--accent);font-weight:600}
  footer{padding:2rem 1.25rem;text-align:center;color:var(--muted);font-size:.85rem}
</style>
</head>
<body>
<header><span class="brand">${b.name}</span><a class="btn" href="tel:${tel}">Call now</a></header>
<div class="hero">
  <div>
    <h1>${b.category} you can count on in ${b.region}</h1>
    <p class="lead">${b.name} — trusted local ${b.category.toLowerCase()} serving ${b.region}.</p>
    ${rating}
    <p><a class="btn" href="tel:${tel}">${b.phone ?? "Call us"}</a></p>
  </div>
  ${hero ? `<img src="${hero}" alt="${b.name}" />` : ""}
</div>
<section>
  <h2>What we do</h2>
  <div class="services">
    <div class="card"><strong>Reliable ${b.category.toLowerCase()} work</strong><p>Prompt, professional service across ${b.region}.</p></div>
    <div class="card"><strong>Upfront pricing</strong><p>Clear quotes, no surprises.</p></div>
    <div class="card"><strong>Local & trusted</strong><p>Proudly serving the ${b.region} community.</p></div>
  </div>
</section>
${b.photos.length ? `<section><h2>Recent work</h2><div class="gallery">${gallery}</div></section>` : ""}
<section>
  <div class="contact">
    <h2 style="color:#fff">Get in touch</h2>
    ${b.phone ? `<p>📞 <a href="tel:${tel}">${b.phone}</a></p>` : ""}
    ${b.address ? `<p>📍 ${b.address}</p>` : ""}
    ${b.hours ? `<p>🕑 ${b.hours}</p>` : ""}
  </div>
</section>
<footer>© ${new Date().getFullYear()} ${b.name} · ${b.region} · Site by GrowVera</footer>
</body>
</html>`;
}

/** Build a bespoke site for a business. Uses Claude (Sonnet) when configured,
 * otherwise a high-quality static template so the pipeline always produces a
 * real, deployable site. `feedback` re-builds with the reviewer's notes. */
export async function buildSite(business: Business, feedback?: string): Promise<SiteArtifact> {
  const slug = slugify(business.name);

  if (!hasLLM()) {
    return { businessId: business.id, slug, html: renderTemplate(business), generatedBy: "template" };
  }

  const brief = JSON.stringify(
    {
      name: business.name,
      category: business.category,
      region: business.region,
      address: business.address,
      phone: business.phone,
      rating: business.rating,
      reviewsCount: business.reviewsCount,
      hours: business.hours,
      photos: business.photos,
      logoUrl: business.logoUrl,
    },
    null,
    2,
  );

  const prompt =
    `Build the website for this business. Use these exact details and photo URLs:\n\n${brief}` +
    (feedback ? `\n\nA reviewer flagged these issues with the previous version — fix them:\n${feedback}` : "");

  try {
    let html = await complete({ model: MODELS.build, system: DESIGN_SYSTEM, prompt, maxTokens: 12000, cacheSystem: true });
    html = html.replace(/^```html?\s*/i, "").replace(/```\s*$/i, "").trim();
    if (!/<html[\s>]/i.test(html)) {
      return { businessId: business.id, slug, html: renderTemplate(business), generatedBy: "template" };
    }
    // Belt-and-braces: don't trust the model to get the copyright year right —
    // force any "© NNNN" to the real current year regardless of prompt compliance.
    html = html.replace(/©\s*\d{4}/g, `© ${new Date().getFullYear()}`);
    html = injectPreviewDisclaimer(html);
    return { businessId: business.id, slug, html, generatedBy: "ai" };
  } catch (err) {
    console.warn(`  [builder] AI build failed (${(err as Error).message}); using template.`);
    return { businessId: business.id, slug, html: renderTemplate(business), generatedBy: "template" };
  }
}
