import { pathToFileURL } from "node:url";
import { MODELS, hasLLM } from "./config";
import { complete, extractJson, type ImageInput } from "./llm";
import type { Business, ReviewResult, SiteArtifact } from "./types";

const RUBRIC = `You are a meticulous web QA reviewer. You are shown DESKTOP and MOBILE screenshots of a freshly built small-business website. Judge it with fresh eyes.

Check: visual hierarchy and balance; readability and contrast; the hero headline sells the craft/quality (the suburb should NOT dominate the headline — flag "[Trade] for [Suburb] Homes"-style geo-stuffing); images load and are well-placed; the phone/contact call-to-action is obvious; nothing is broken, overlapping, cut off, or empty; mobile layout is not squashed or overflowing; the design looks bespoke and premium, not generic.

Respond with ONLY a JSON object, no prose:
{"passed": boolean, "score": 0-100, "issues": ["specific, actionable fix", ...], "summary": "one sentence"}
"passed" is true only if score >= 80 and there are no broken/critical issues.`;

const HTML_RUBRIC = `You are a ruthless senior front-end designer reviewing the RAW HTML+CSS of a freshly generated small-business website before it is shown to the actual business owner — the most important moment, because if it looks cheap or broken they walk away instantly. You cannot see a screenshot, so reason carefully about how this CSS actually renders.

Read the markup and styles and catch anything that would render broken, misaligned, cramped or cheap. Pay special attention to these common failures:
- Hero cramped under a fixed/sticky header: if the header is position:fixed or sticky, the hero/first section MUST have enough top padding or margin to clear the header height — otherwise the headline hides behind or jams against the bar. Flag if missing.
- (Do NOT flag mobile bottom-bar spacing: adequate mobile bottom padding is enforced automatically downstream, so never raise an issue about the fixed mobile call bar overlapping the footer — it is already handled.)
- Empty, stubby, or half-built sections: a section with a heading and almost no content, or huge empty space, reads as unfinished.
- Inconsistent spacing/alignment: differing container widths, section padding, or grid gaps that make the page look misaligned down the column.
- Low contrast text (light text on light bg / dark on dark), placeholder/lorem text, broken or missing image references, fabricated claims.
- Suburb keyword-stuffing: the hero headline built around the suburb ("[Trade] for [Suburb] Homes", "[Trade] in [Suburb]") or the suburb repeated in many section headings. The headline should sell the craft; location belongs in a subheading/about/contact, mentioned naturally once or twice.
- Generic AI-template look: emoji used as icons, the orange/navy tradie palette, filler copy.
- No real brand identity: the header shows the business name as plain default-font text with no designed wordmark or monogram treatment (and no logo image). A bespoke site should have a considered brand mark, not raw text.

Be demanding — this must look like a real agency built it. Respond with ONLY a JSON object, no prose:
{"passed": boolean, "score": 0-100, "issues": ["specific, actionable fix the builder can apply", ...], "summary": "one sentence"}
"passed" is true only if score >= 80 with no broken/critical layout issues. List the concrete issues so the builder can fix them on a revision pass.`;

async function screenshots(filePath: string): Promise<{ desktop: string; mobile: string } | null> {
  try {
    // Imported lazily so the rest of the pipeline runs even if Playwright
    // browsers aren't installed.
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await page.goto(pathToFileURL(filePath).href, { waitUntil: "load", timeout: 15000 });
      await page.waitForTimeout(800);
      const desktop = (await page.screenshot({ type: "png" })).toString("base64");
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(300);
      const mobile = (await page.screenshot({ type: "png" })).toString("base64");
      return { desktop, mobile };
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.warn(`  [reviewer] screenshot skipped (${(err as Error).message}). Run: npx playwright install chromium`);
    return null;
  }
}

/** Browserless QA pass on the raw HTML+CSS. This is the gate that runs in CI /
 * hosted mode (no Playwright browser, no on-disk file): the design model reads
 * the markup and flags layout/UX defects so the build can be revised before it
 * ships. Far from perfect vs. real screenshots, but it means every demo is
 * actually reviewed instead of silently passing. */
async function reviewHtml(artifact: SiteArtifact, business: Business): Promise<ReviewResult> {
  // Cap the payload so a huge document can't blow the context; the <head>/CSS
  // and first screenful (where layout defects live) are what matter most.
  const html = artifact.html.slice(0, 24000);
  const text = await complete({
    model: MODELS.build, // text model — the vision model isn't needed for markup
    system: HTML_RUBRIC,
    prompt: `Business: ${business.name} — ${business.category} in ${business.region}.\nReview this generated website's HTML and CSS:\n\n${html}`,
    maxTokens: 1200,
    cacheSystem: true,
  });
  const parsed = extractJson<{ passed: boolean; score: number; issues: string[]; summary: string }>(text);
  if (!parsed) {
    return { passed: true, score: 70, issues: [], summary: "HTML review returned unparseable output; passed by default.", reviewedBy: "ai" };
  }
  return {
    passed: !!parsed.passed,
    score: parsed.score ?? 0,
    issues: parsed.issues ?? [],
    summary: parsed.summary ?? "",
    reviewedBy: "ai",
  };
}

/** QA pass before a demo ships. Prefers a vision review on desktop + mobile
 * screenshots when a browser is available (local); otherwise falls back to a
 * browserless HTML/CSS critique so the gate STILL runs in CI / hosted mode
 * instead of silently passing. Only skips entirely when no LLM is configured. */
export async function review(artifact: SiteArtifact, business: Business): Promise<ReviewResult> {
  if (!hasLLM()) {
    return { passed: true, score: 0, issues: [], summary: "Review skipped (no model configured).", reviewedBy: "skipped" };
  }

  // Best path: real screenshots (needs an on-disk file + a Playwright browser).
  const shots = artifact.path ? await screenshots(artifact.path) : null;
  if (!shots) {
    // CI / hosted mode: no browser or no file on disk — critique the markup
    // directly rather than skipping, so nothing ships unreviewed.
    return reviewHtml(artifact, business);
  }

  const images: ImageInput[] = [
    { mediaType: "image/png", base64: shots.desktop },
    { mediaType: "image/png", base64: shots.mobile },
  ];

  const text = await complete({
    model: MODELS.review,
    system: RUBRIC,
    prompt: `Business: ${business.name} — ${business.category} in ${business.region}. First image is desktop, second is mobile. Review the site.`,
    images,
    maxTokens: 1500,
    cacheSystem: true,
  });

  const parsed = extractJson<{ passed: boolean; score: number; issues: string[]; summary: string }>(text);
  if (!parsed) {
    return { passed: true, score: 70, issues: [], summary: "Review returned unparseable output; passed by default.", reviewedBy: "ai" };
  }

  return {
    passed: !!parsed.passed,
    score: parsed.score ?? 0,
    issues: parsed.issues ?? [],
    summary: parsed.summary ?? "",
    reviewedBy: "ai",
  };
}
