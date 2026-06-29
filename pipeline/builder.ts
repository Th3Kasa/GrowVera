import { MODELS, hasLLM } from "./config";
import { complete } from "./llm";
import { slugify } from "./util";
import type { Business, SiteArtifact } from "./types";

/**
 * The design-system prompt is stable across every build, so it's sent as a
 * cached system prefix — repeat builds bill it at ~0.1x input. This is the
 * single biggest per-site cost saving.
 */
const DESIGN_SYSTEM = `You are a senior web designer and front-end engineer at an elite studio. You build bespoke, premium marketing websites for local service businesses.

OUTPUT RULES (strict):
- Return ONE complete, valid HTML5 document and nothing else. No markdown, no code fences, no commentary.
- Inline ALL CSS in a single <style> tag. You may load Google Fonts via <link>. No CSS/JS frameworks.
- Mobile-first and fully responsive. Semantic, accessible, fast.

DESIGN:
- A distinct, characterful design tailored to THIS business and trade — never generic "AI slop", no purple-on-white gradients, no default system fonts.
- Choose a cohesive palette and type pairing that suits the trade and locale (Australian small business).
- Include: sticky header with the business name and a phone call-to-action (tel: link); a hero using one real photo and a clear value proposition; services (only those implied by the category — do not invent specialised services); a gallery using the provided photos; an about section; social proof if a rating/review count is given; a prominent contact section with phone, address and hours; a footer.
- Use ONLY the real business details provided. Do not fabricate awards, years in business, or specific claims.`;

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
    return { businessId: business.id, slug, html, generatedBy: "ai" };
  } catch (err) {
    console.warn(`  [builder] AI build failed (${(err as Error).message}); using template.`);
    return { businessId: business.id, slug, html: renderTemplate(business), generatedBy: "template" };
  }
}
