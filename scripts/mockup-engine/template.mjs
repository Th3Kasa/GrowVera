/**
 * Premium one-page tradie site template.
 * Self-contained HTML (inline CSS, no build step) so each mock-up deploys
 * to Vercel as a static file instantly. Injected with verified lead data +
 * Claude-written copy. Designed to make a local business owner say "that's MY business".
 */

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SERVICE_ICONS = ["⚡", "🔧", "🛠️", "✓", "★", "◆"];

export function renderSite({ lead, copy, theme }) {
  const name = esc(lead.businessName);
  const suburb = esc(lead.suburb || "your area");
  const phone = esc(lead.phone || "");
  const phoneHref = (lead.phone || "").replace(/[^\d+]/g, "");
  const rating = lead.rating ? esc(lead.rating) : null;
  const reviews = lead.reviewCount ? esc(lead.reviewCount) : null;
  const heroImg = esc(lead.heroImage || theme.hero);
  const year = new Date().getFullYear();

  const stars = rating ? "★".repeat(Math.round(parseFloat(lead.rating))).padEnd(5, "☆") : "";

  const servicesHTML = copy.services
    .map(
      (s, i) => `
      <article class="svc">
        <div class="svc-icon">${SERVICE_ICONS[i % SERVICE_ICONS.length]}</div>
        <h3>${esc(s.name)}</h3>
        ${s.blurb ? `<p>${esc(s.blurb)}</p>` : ""}
      </article>`
    )
    .join("");

  const whyHTML = (copy.whyUs || [])
    .map((w) => `<li><span class="tick">✓</span>${esc(w)}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${name} — ${esc(theme.label)} in ${suburb}</title>
<meta name="description" content="${esc(copy.heroSub)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    --accent: ${theme.accent};
    --accent-dark: ${theme.accentDark};
    --accent-soft: ${theme.accentSoft};
    --ink: #14181F;
    --muted: #5B6470;
    --line: #E7EAEE;
    --bg: #FFFFFF;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--bg); line-height: 1.6; }
  h1, h2, h3, .brand { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.02em; }
  a { color: inherit; text-decoration: none; }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; font-weight: 700; font-size: 15px; padding: 14px 26px; border-radius: 999px; transition: transform .15s, box-shadow .15s; box-shadow: 0 8px 24px ${theme.accent}33; }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px ${theme.accent}44; }
  .btn-ghost { background: #fff; color: var(--accent); border: 1.5px solid var(--accent); box-shadow: none; }

  /* Nav */
  nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 72px; }
  .brand { font-weight: 800; font-size: 21px; }
  .brand .dot { color: var(--accent); }
  .nav-links { display: flex; align-items: center; gap: 30px; font-weight: 600; font-size: 15px; color: var(--muted); }
  .nav-links a:hover { color: var(--ink); }
  .nav-cta { display: flex; align-items: center; gap: 14px; }
  .nav-phone { font-weight: 700; color: var(--ink); }

  /* Hero */
  .hero { position: relative; min-height: 600px; display: flex; align-items: center; color: #fff; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background: url('${heroImg}') center/cover; }
  .hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, ${theme.accentDark}F2 0%, ${theme.accentDark}CC 45%, ${theme.accent}66 100%); }
  .hero-inner { position: relative; z-index: 2; padding: 96px 0; max-width: 680px; }
  .hero .pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25); padding: 7px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 22px; }
  .hero h1 { font-size: clamp(36px, 5.5vw, 60px); font-weight: 800; line-height: 1.04; margin-bottom: 18px; }
  .hero p { font-size: 19px; opacity: .92; margin-bottom: 32px; max-width: 540px; }
  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .hero .btn-ghost { background: rgba(255,255,255,.12); color: #fff; border-color: rgba(255,255,255,.4); }

  /* Trust bar */
  .trust { background: var(--ink); color: #fff; }
  .trust-inner { display: flex; flex-wrap: wrap; justify-content: space-around; gap: 24px; padding: 26px 0; text-align: center; }
  .trust-item .big { font-family: 'Plus Jakarta Sans'; font-weight: 800; font-size: 26px; }
  .trust-item .lbl { font-size: 13px; opacity: .7; }
  .stars { color: #FFC83D; letter-spacing: 2px; }

  /* Sections */
  section { padding: 84px 0; }
  .eyebrow { color: var(--accent); font-weight: 700; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 12px; }
  .sec-title { font-size: clamp(28px, 4vw, 40px); font-weight: 800; margin-bottom: 16px; }
  .sec-lead { color: var(--muted); font-size: 18px; max-width: 640px; }

  /* Services */
  .svc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; margin-top: 46px; }
  .svc { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 30px; transition: transform .18s, box-shadow .18s, border-color .18s; }
  .svc:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(20,24,31,.08); border-color: transparent; }
  .svc-icon { width: 52px; height: 52px; border-radius: 13px; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; font-size: 24px; margin-bottom: 18px; }
  .svc h3 { font-size: 20px; margin-bottom: 8px; }
  .svc p { color: var(--muted); font-size: 15px; }

  /* About / why */
  .about { background: var(--accent-soft); }
  .about-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 56px; align-items: center; }
  .why-list { list-style: none; margin-top: 24px; display: grid; gap: 14px; }
  .why-list li { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 17px; }
  .tick { width: 26px; height: 26px; border-radius: 50%; background: var(--accent); color: #fff; display: grid; place-items: center; font-size: 14px; flex-shrink: 0; }
  .about-card { background: #fff; border-radius: 20px; padding: 38px; box-shadow: 0 20px 50px rgba(20,24,31,.08); }
  .about-card .rate { font-size: 56px; font-weight: 800; font-family: 'Plus Jakarta Sans'; color: var(--accent); line-height: 1; }

  /* CTA banner */
  .cta-banner { background: linear-gradient(120deg, var(--accent-dark), var(--accent)); color: #fff; text-align: center; }
  .cta-banner h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; margin-bottom: 12px; }
  .cta-banner p { font-size: 18px; opacity: .9; margin-bottom: 28px; }
  .cta-banner .btn { background: #fff; color: var(--accent-dark); box-shadow: 0 10px 30px rgba(0,0,0,.18); }

  /* Contact */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 46px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; }
  .field input, .field textarea { width: 100%; padding: 13px 15px; border: 1px solid var(--line); border-radius: 11px; font-size: 15px; font-family: inherit; }
  .field input:focus, .field textarea:focus { outline: none; border-color: var(--accent); }
  .contact-info { display: grid; gap: 22px; align-content: start; }
  .ci-item { display: flex; gap: 14px; align-items: flex-start; }
  .ci-ico { width: 44px; height: 44px; border-radius: 11px; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; font-size: 20px; flex-shrink: 0; }
  .ci-item .lbl { font-size: 13px; color: var(--muted); }
  .ci-item .val { font-weight: 700; font-size: 17px; }

  /* Footer */
  footer { background: var(--ink); color: #fff; padding: 44px 0; }
  .foot-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .foot-inner .brand { color: #fff; }
  .foot-meta { font-size: 13px; opacity: .55; }

  /* Mock-up ribbon — makes clear this is a free demo (removed on the real build) */
  .demo-ribbon { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: var(--ink); color: #fff; text-align: center; padding: 11px 16px; font-size: 14px; }
  .demo-ribbon a { color: #6EE7B7; font-weight: 700; }

  @media (max-width: 860px) {
    .nav-links { display: none; }
    .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 32px; }
    .hero-inner { padding: 64px 0; }
  }
</style>
</head>
<body>

<nav>
  <div class="wrap nav-inner">
    <div class="brand">${name}</div>
    <div class="nav-links">
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
    <div class="nav-cta">
      ${phone ? `<span class="nav-phone">${phone}</span>` : ""}
      <a class="btn" href="#contact">${esc(copy.ctaPrimary || "Get a Quote")}</a>
    </div>
  </div>
</nav>

<header class="hero">
  <div class="hero-bg"></div>
  <div class="wrap hero-inner">
    <span class="pill">${esc(theme.label)} · ${suburb}</span>
    <h1>${esc(copy.heroHeadline)}</h1>
    <p>${esc(copy.heroSub)}</p>
    <div class="hero-actions">
      <a class="btn" href="#contact">${esc(copy.ctaPrimary || "Get a Quote")}</a>
      ${phone ? `<a class="btn btn-ghost" href="tel:${phoneHref}">Call ${phone}</a>` : ""}
    </div>
  </div>
</header>

<div class="trust">
  <div class="wrap trust-inner">
    ${rating ? `<div class="trust-item"><div class="big stars">${stars}</div><div class="lbl">${rating} on Google</div></div>` : ""}
    ${reviews ? `<div class="trust-item"><div class="big">${reviews}</div><div class="lbl">Google reviews</div></div>` : ""}
    <div class="trust-item"><div class="big">${suburb}</div><div class="lbl">Local & nearby</div></div>
    <div class="trust-item"><div class="big">Fast</div><div class="lbl">Quotes & callbacks</div></div>
  </div>
</div>

<section id="services">
  <div class="wrap">
    <div class="eyebrow">What we do</div>
    <h2 class="sec-title">Our services</h2>
    <p class="sec-lead">Quality ${esc((lead.niche || theme.label).toLowerCase())} work for homes and businesses across ${suburb} and surrounding suburbs.</p>
    <div class="svc-grid">${servicesHTML}</div>
  </div>
</section>

<section id="about" class="about">
  <div class="wrap about-grid">
    <div>
      <div class="eyebrow">Why ${name}</div>
      <h2 class="sec-title">${esc(copy.aboutTitle)}</h2>
      <p class="sec-lead">${esc(copy.aboutBody)}</p>
      <ul class="why-list">${whyHTML}</ul>
    </div>
    <div class="about-card">
      ${rating ? `<div class="rate">${rating}★</div><p style="color:var(--muted);margin-top:8px">${reviews ? reviews + " genuine Google reviews from " : "Trusted by "}${suburb} locals.</p>` : `<p style="color:var(--muted)">Trusted by ${suburb} locals for honest, reliable work.</p>`}
      <a class="btn" style="margin-top:22px;width:100%;justify-content:center" href="#contact">${esc(copy.ctaPrimary || "Get a Quote")}</a>
    </div>
  </div>
</section>

<section class="cta-banner">
  <div class="wrap">
    <h2>${esc(copy.ctaBannerTitle)}</h2>
    <p>${esc(copy.ctaBannerSub)}</p>
    ${phone ? `<a class="btn" href="tel:${phoneHref}">Call ${phone}</a>` : `<a class="btn" href="#contact">${esc(copy.ctaPrimary || "Get in Touch")}</a>`}
  </div>
</section>

<section id="contact">
  <div class="wrap">
    <div class="eyebrow">Get in touch</div>
    <h2 class="sec-title">Request a quote</h2>
    <p class="sec-lead">Tell us what you need and we'll get back to you. Servicing ${suburb} and nearby.</p>
    <div class="contact-grid">
      <form onsubmit="event.preventDefault(); this.innerHTML='<p style=&quot;font-weight:600&quot;>Thanks — this is a demo form. On your live site this sends straight to your inbox.</p>';">
        <div class="field"><label>Your name</label><input type="text" required/></div>
        <div class="field"><label>Phone</label><input type="tel" required/></div>
        <div class="field"><label>What do you need?</label><textarea rows="4" required></textarea></div>
        <button class="btn" type="submit" style="border:none;cursor:pointer">${esc(copy.ctaPrimary || "Send Enquiry")}</button>
      </form>
      <div class="contact-info">
        ${phone ? `<div class="ci-item"><div class="ci-ico">📞</div><div><div class="lbl">Call us</div><a class="val" href="tel:${phoneHref}">${phone}</a></div></div>` : ""}
        <div class="ci-item"><div class="ci-ico">📍</div><div><div class="lbl">Service area</div><div class="val">${suburb} & surrounds</div></div></div>
        <div class="ci-item"><div class="ci-ico">🕒</div><div><div class="lbl">Response</div><div class="val">Fast quotes & callbacks</div></div></div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap foot-inner">
    <div class="brand">${name}</div>
    <div class="foot-meta">${esc(theme.label)} · ${suburb}, Sydney · © ${year}</div>
  </div>
</footer>

<div class="demo-ribbon">
  This is a free preview built by <a href="https://growvera.com.au" target="_blank">GrowVera</a> for ${name}. Like it? Let's make it yours.
</div>

</body>
</html>`;
}
