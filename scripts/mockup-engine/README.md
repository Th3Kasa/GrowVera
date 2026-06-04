# GrowVera Mock-Up Engine

Turns a single lead into a live, premium one-page website — automatically.

**Flow:** lead data → Claude writes tailored copy (fabrication-guarded) → premium template → static `index.html` → deploy to Vercel → send the live link to the prospect.

## Generate a mock-up

```bash
node scripts/mockup-engine/generate.mjs \
  --business="Western Sydney Plumbing" \
  --suburb="Penrith" \
  --niche="plumber" \
  --phone="0412 345 678" \
  --rating=4.7 \
  --reviews=92
```

Optional: `--heroImage="https://..."` to override the default trade hero photo.

Output lands in `scripts/mockup-engine/output/<slug>/`:
- `index.html` — the site (open it in a browser to preview)
- `mockup.json` — the lead + copy record (reproducible / auditable)

Requires `ANTHROPIC_API_KEY` in the environment.

## Supported trades (auto-detected from `--niche`)

plumber · electrician · landscaper · builder · painter · cleaner — anything else
falls back to a clean generic "local services" theme. Add more in `themes.mjs`.

## Deploy to Vercel

```bash
cd scripts/mockup-engine/output/<slug>
vercel --prod
```

First run links the folder to a Vercel project. The mock-up goes live at a
`*.vercel.app` URL you can send straight to the prospect.

## Two guards run on every mock-up

1. **Fabrication guard** (`copy.mjs`) — rejects invented qualifications GrowVera
   can't verify about a stranger's business: years in business, "family owned",
   licences, insurance, awards, "#1 / best / voted", specific guarantees. Only
   the verified facts passed in are ever stated as fact. Keeps outreach honest.
2. **Slop gate** (`slop-gate.mjs`) — rejects the design tells from `ANTI-SLOP.md`:
   purple/indigo, emoji icons, stock-photo heroes, default fonts, and uncrafted
   output. A fail throws — slop never ships.

## Design quality (the anti-slop method)

The template is built to `ANTI-SLOP.md`, distilled from the reference videos.
The art direction is **image-first**: each client gets a bespoke hero image
generated for free via **Pollinations** (no API key), which sets the palette and
mood — never a generic stock photo. Real Google Fonts pairing, inline SVG line
icons (never emoji), asymmetric editorial layout, and crafted "little things"
(grain texture, marquee, animated counters, scroll reveal, scroll-progress bar).

## The demo ribbon

Every mock-up carries a fixed bottom ribbon: *"This is a free preview built by
GrowVera for [business]. Like it? Let's make it yours."* It's removed when the
client signs and the site becomes their real, paid build.

## Files

| File | Role |
|------|------|
| `generate.mjs` | CLI orchestrator (copy → hero image → render → slop gate) |
| `copy.mjs` | Claude copy generation + fabrication guard |
| `template-elite.mjs` | the elite, anti-slop one-page template (active) |
| `slop-gate.mjs` | automated design-quality guard |
| `themes.mjs` | per-trade palettes, hero-image prompts, default services |
| `ANTI-SLOP.md` | the design quality bar, distilled from the reference videos |
| `template.mjs` | legacy v1 template — superseded by `template-elite.mjs`, kept for reference |
