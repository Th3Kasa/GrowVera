# GROWVERA BRAND TOKEN SHEET v1.0
> Phase 3 — Locked after Phase 4 approval. Do not modify without Marchi sign-off.

---

## COLOR SYSTEM

```
--color-bg:           #FAFAF8   /* warm off-white — primary background (LOCKED) */
--color-bg-section:   #F4F3EF   /* 6% warmer — alternating section wash */
--color-bg-subtle:    #EEECEA   /* card backgrounds, input fills */
--color-text:         #0D0D0B   /* near-black — primary text (LOCKED) */
--color-text-muted:   #6B6B68   /* secondary text, captions, labels */
--color-text-faint:   #9E9E9A   /* placeholder text, disabled states */
--color-accent:       #1A5C3A   /* deep forest green — CTA, links, highlights (LOCKED) */
--color-accent-hover: #143F28   /* accent darkened 12% for hover */
--color-accent-light: #E8F2EC   /* accent at 8% opacity — badge backgrounds, tag fills */
--color-border:       #E2E1DC   /* subtle border — cards, dividers, inputs */
--color-border-strong:#C8C7C1   /* focused inputs, active states */
--color-white:        #FFFFFF   /* pure white — elevated card surfaces */
```

### Palette Rationale
The locked green (#1A5C3A) is the kind of color that reads "forest, permanence, trust" — not a tech startup, not a bank, not a garden center. At this depth it avoids the tired "eco green" association and instead commands authority. Against #FAFAF8 it lands with the same quiet confidence as a Loro Piana tag or a Pentagram invoice. The warm off-white is the key: pure #FFFFFF would turn clinical; this warmth says "considered, Sydney studio, not shipped from a template." The muted text and border family are all warm-shifted (slight yellow bias) so nothing looks lifted from a Bootstrap component.

---

## TYPOGRAPHY

### Font Selection
- **Display / Hero:** Cabinet Grotesk — Variable, use Extrabold (800) and Bold (700)
- **Body / UI:** Satoshi — Variable, use Regular (400) and Medium (500)

### Why this beats Inter/Roboto
Cabinet Grotesk has pinched stroke connections and ink-trap-style terminals that give it genuine personality at large sizes — it does not look like a template. Satoshi sits underneath it perfectly because both come from the Indian Type Foundry's design philosophy: geometric bones, humanist corrections. Together they read as one deliberate choice, not two fonts fighting. Inter would make this look like every SaaS. Roboto would make it look like Google Docs. This pairing reads "editorial agency, Sydney, 2026."

### Type Scale (base 16px, 1.25 ratio)

| Token | Size | Weight | Line-height | Letter-spacing | Use |
|---|---|---|---|---|---|
| `--t-hero` | 72px / 4.5rem | 800 | 1.0 | -0.04em | Hero headline, above fold only |
| `--t-h1` | 56px / 3.5rem | 800 | 1.05 | -0.03em | Page-level H1 |
| `--t-h2` | 40px / 2.5rem | 700 | 1.1 | -0.025em | Section headings |
| `--t-h3` | 28px / 1.75rem | 700 | 1.2 | -0.02em | Card headings, sub-sections |
| `--t-h4` | 20px / 1.25rem | 600 | 1.3 | -0.01em | Feature labels |
| `--t-body-lg` | 18px / 1.125rem | 400 | 1.7 | 0 | Lead paragraphs, intros |
| `--t-body` | 16px / 1rem | 400 | 1.65 | 0 | Standard body copy |
| `--t-body-sm` | 14px / 0.875rem | 400 | 1.6 | 0.005em | Secondary copy, metadata |
| `--t-caption` | 12px / 0.75rem | 500 | 1.5 | 0.01em | Captions, footnotes — use `--color-text-muted` |
| `--t-eyebrow` | 11px / 0.6875rem | 700 | 1.4 | 0.12em | ALL CAPS eyebrow labels above headings |
| `--t-cta` | 15px / 0.9375rem | 600 | 1 | 0.01em | Button labels |
| `--t-mono` | 13px / 0.8125rem | 400 | 1.6 | 0 | Code, stat labels, technical data |

### Eyebrow treatment
Always uppercase, always `--color-accent`, always paired with an 18px left border in `--color-accent-light`. Example: `GOOGLE BUSINESS PROFILE` before "We make you the obvious choice."

---

## SPACING SCALE
8px base grid, major third progression.

```
--space-1:   4px    /* hairline gaps */
--space-2:   8px    /* tight internal spacing */
--space-3:   12px   /* compact rows */
--space-4:   16px   /* default component padding */
--space-5:   24px   /* card padding, section gutters */
--space-6:   32px   /* between components */
--space-7:   48px   /* between sections (mobile) */
--space-8:   64px   /* between sections (desktop) */
--space-9:   96px   /* large section breaks */
--space-10:  128px  /* hero vertical padding */
--space-11:  192px  /* max vertical section spacing */
```

Max content width: `1200px`. Horizontal padding: `--space-5` mobile, `--space-8` desktop.

---

## BORDER RADIUS

```
--radius-sm:    4px    /* inputs, badges, tags */
--radius-md:    8px    /* buttons, small cards */
--radius-lg:    12px   /* standard cards */
--radius-xl:    16px   /* feature cards, image containers */
--radius-2xl:   24px   /* hero image, testimonial cards */
--radius-full:  9999px /* pills, avatar rings */
```

Principle: radius scales with component size. Small interactive elements stay tight. Large surfaces breathe more. Never uniform.

---

## SHADOW SYSTEM

```
--shadow-subtle:
  0 1px 2px rgba(13, 13, 11, 0.04),
  0 1px 3px rgba(13, 13, 11, 0.03);
  /* borders, divider-replacement on flat surfaces */

--shadow-card:
  0 2px 4px rgba(13, 13, 11, 0.04),
  0 4px 16px rgba(13, 13, 11, 0.06),
  0 1px 0px rgba(13, 13, 11, 0.02);
  /* standard card elevation */

--shadow-elevated:
  0 4px 8px rgba(13, 13, 11, 0.05),
  0 12px 32px rgba(13, 13, 11, 0.10),
  0 1px 0px rgba(13, 13, 11, 0.03);
  /* modals, dropdowns, hover-lifted cards */

--shadow-accent:
  0 4px 24px rgba(26, 92, 58, 0.18),
  0 2px 8px rgba(26, 92, 58, 0.12);
  /* CTA buttons, accent elements on hover */
```

All shadows use warm-black tones (no pure blue-gray). The accent shadow is used sparingly — only on the primary CTA.

---

## MOTION LANGUAGE

```
--ease-standard:    cubic-bezier(0.25, 0.1, 0.25, 1.0)   /* default transitions */
--ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1)         /* entrances — elements arriving */
--ease-in-out-back: cubic-bezier(0.34, 1.56, 0.64, 1)     /* micro-interactions with spring */
--ease-linear:      linear                                  /* progress bars, counters */

--duration-fast:    100ms   /* hover states, checkbox toggles */
--duration-base:    180ms   /* button states, link colors */
--duration-medium:  280ms   /* card transitions, dropdown opens */
--duration-slow:    420ms   /* page entrances, hero text */
--duration-crawl:   700ms   /* number counters, signature animations */
```

**Motion principle:** GrowVera moves like a practitioner, not a performer. Transitions confirm action, they do not demand attention. The only element allowed to "show off" is the hero counter — watching a number climb toward a result is the product promise made visible.

---

## SIGNATURE MOTIF

**The Precision Arc.**

A single, partial circle arc — roughly 220 degrees, not closed — rendered at hairline stroke weight (1px–1.5px) in `--color-accent`. It appears in three contexts:

1. **Behind the logomark** — as a quiet orbital ring, implying trajectory, not containment.
2. **In section dividers** — large-scale (600px+ diameter), clipped at the viewport edge, barely visible at 15% opacity against the warm-white background. Feels like infrastructure, not decoration.
3. **As a data-completion metaphor** — in the stats section, each key metric animates an arc from 0 to its completion percentage before the number counts up. The arc is the proof before the number.

Why this works: the arc is geometric discipline (Stripe) plus forward motion (growth agency). It never forms a full circle — full circles say "complete, finished." An open arc says "this is momentum." And unlike most agency motifs (arrows, charts, checkmarks) it is abstract enough to own exclusively. You will not find this exact treatment on any SEO agency site.

---

## LOGOMARK DIRECTION

**Direction: The Monogram Ligature — "GV" with embedded arc.**

The mark is a custom-drawn ligature connecting a capital G and V in a single stroke. The G's horizontal bar extends rightward and curves up to form the left stem of the V — the two letters share one continuous stroke. At the junction, the Precision Arc passes behind the letterforms, like an orbit.

Rendered in deep forest green (#1A5C3A) at all times. No gradients. No shadows. No color variants except a reversed white version for dark backgrounds.

Wordmark: "GrowVera" in Cabinet Grotesk Bold, tracked at -0.02em, with "Grow" in #0D0D0B and "Vera" in #1A5C3A. The color split is the brand narrative in two syllables: the action (grow) is yours, the certainty (vera = truth) is ours.

**Why this looks $40k:** The ligature demands a custom drawing — you cannot assemble it from any font. The stroke logic is rationalized (same pen weight as the arc motif). The color split wordmark is distinctive and strategically intentional, not decorative. It will reproduce cleanly at 16px favicon size and at 400px wide on a billboard.

---

## SLOP BLACKLIST COMPLIANCE CHECK

- Default violet/blue primary — No. Deep forest green.
- Inter for everything — No. Cabinet Grotesk + Satoshi.
- Symmetric headline-left / chart-right hero — No. Hero is full-width typographic, asymmetric.
- Untouched Shadcn cards — No. Custom radius, shadow, and border system.
- Emoji logo — No. Custom SVG ligature mark.
- Fake "Trusted by 10,000+" with Logoipsum — Banned outright.
- Gradient on everything — No. Zero gradients. One accent shadow on CTA only.

---

*Token sheet locked by Marchi — GrowVera Phase 3 — 2026-06-01*
*Handoff to Max/ui-craft pending Phase 4 approval.*
