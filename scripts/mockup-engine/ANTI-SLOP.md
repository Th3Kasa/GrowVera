# The Anti-Slop Playbook

Distilled from 7 transcripts (~31k words): "Stop Building AI Slop Websites", "The
7 Levels of Building ELITE Websites with Claude Code", "Nano Banana 2 = $10k
Websites", "$10k Brand Identity in 16 min", the two "Anti-Slop Website" build
videos, and "Claude Code + Stitch 2.0".

This is the quality bar the GrowVera mock-up engine must hit — using **only free
tools**.

---

## The core insight

> **Don't prompt for a website template. Prompt for a visual composition system.**

AI slop happens because everyone prompts "build me a landing page" → the model
falls back to the same skeleton every time: left-text / right-image hero, one
sub-headline, two buttons, flat cards, purple gradient. The fix is to give the
model a **real visual target first**, then make it implement *to that target*.

---

## The image-to-site workflow (the money method)

1. **Generate a design REFERENCE image first** — 16:9, with an explicit instruction:
   *"don't use a conventional website hero layout."* Feed it business context +
   composition direction + palette.
2. **Derive a clean background plate** — the same image with logos/nav/text
   removed — to use as the actual coded hero background.
3. **Feed both to the coding agent** with a master prompt that forces it to:
   *analyze the reference → write a design spec → implement → review its build
   against the reference.*
4. **Fidelity pass** — a second prompt: check composition, hierarchy, spacing,
   typography vs the reference; enforce mobile responsiveness.
5. **Extract the "Art Bible"** — turn the finished hero into a style-guide `.md`
   (palette, typography, spacing rules, layout grammar).
6. **Build the rest of the page from the Art Bible** → coherent, not generic.

## The 7 levels (skill progression)

1. Bare prompt → slop (purple gradients). 2. **Skills** inject anti-slop
checklists (UI/UX Pro Max, front-end design). 3. **Visual director** — feed real
screenshots from Awwwards / godly.website / Pinterest / Dribbble; combine
multiple references. 4. **Cloner** — view-source (Ctrl+U), grab full HTML+CSS+JS,
have Claude teach you the techniques. 5. **Custom** — components from 21st.dev /
CodePen + a bespoke AI hero image with *visual storytelling* tied to the brand.
6. **Outside tools** — Stitch / pencil.dev to iterate visually; add the "little
things" (load hesitation, ticker, animated counters, scroll-progress bar,
glassmorphism with weight). 7. WebGL/shaders/3D — out of scope.

---

## THE SLOP BLACKLIST (auto-reject these)

- Purple / indigo / violet gradients (the #1 AI tell)
- Default Tailwind blue/indigo as the brand colour
- Left-text / right-image hero with two buttons and a sub-headline (the skeleton)
- Emoji used as feature icons (🔧 ⚡ ✓)
- Generic stock photos as the hero
- Everything centred
- Card-inside-card-inside-card
- Flat, identical sections repeated down the page
- System/default fonts with no pairing or contrast

## THE TASTE CHECKLIST (push toward these)

- A real, intentional palette (often one bold accent + restrained neutrals)
- Editorial typography: big scale contrast, a real display/body font pairing
  (Google Fonts — free)
- Asymmetry and negative space, not centred symmetry
- A bespoke hero image with visual storytelling tied to the business
- Subtle, tasteful motion (CSS/parallax) — never a video-game background
- "Little things": load states, hover polish, scroll progress, animated counts
- Mobile: serve a still image, never a heavy video

---

## Free-tool map (the "$0 to run" constraint)

| Video used (paid) | Our FREE equivalent | Already available? |
|---|---|---|
| GPT Image 2 / Midjourney / Nano Banana | **Pollinations.ai** (no key) or **Gemini image free tier** | Pollinations: instant |
| Stitch (visual editor) | **Stitch** — it's free | **MCP already connected** |
| UI/UX Pro Max skill | same skill | **`ui-ux-pro-max` installed** |
| front-end design skill | `taste-skill`, `soft-skill`, `redesign-skill`, `imagegen-frontend-web`, `image-to-code-skill` | **installed** |
| Higgsfield / Kling / VEO video | **CSS animation / Ken-Burns / parallax** | built-in |
| Fonts | **Google Fonts** | free |
| Hosting | **Vercel free tier** | in workflow |

**Net recurring cost: $0.**

---

## How it reconciles with batch automation (the honest tension)

The videos show *hand-crafted, iterative, one-off* elite sites — lots of human
tinkering. The engine needs *one-shot, per-lead, $0* output. You cannot fully
automate L3–L6 human tinkering per client. The resolution:

- **Do the craft ONCE per niche, not per client.** Build ONE genuinely elite
  reference template per trade using the full method above + the free skills +
  Stitch. Extract its Art Bible.
- **Per client, the engine only swaps** the data, the Claude-written copy, and a
  **bespoke hero image** (Pollinations/Gemini free tier, prompted from that
  niche's art-direction recipe). The elite layout/type/motion is already locked.
- **The slop gate** runs the blacklist on every output; a fail regenerates.

That's the only path that is simultaneously *video-quality*, *batch-automatable*,
and *free*.
