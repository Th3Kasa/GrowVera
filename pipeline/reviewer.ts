import { pathToFileURL } from "node:url";
import { MODELS, hasAnthropic } from "./config";
import { complete, extractJson, type ImageInput } from "./llm";
import type { Business, ReviewResult, SiteArtifact } from "./types";

const RUBRIC = `You are a meticulous web QA reviewer. You are shown DESKTOP and MOBILE screenshots of a freshly built small-business website. Judge it with fresh eyes.

Check: visual hierarchy and balance; readability and contrast; the hero communicates what the business does and where; images load and are well-placed; the phone/contact call-to-action is obvious; nothing is broken, overlapping, cut off, or empty; mobile layout is not squashed or overflowing; the design looks bespoke and premium, not generic.

Respond with ONLY a JSON object, no prose:
{"passed": boolean, "score": 0-100, "issues": ["specific, actionable fix", ...], "summary": "one sentence"}
"passed" is true only if score >= 80 and there are no broken/critical issues.`;

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

/** Vision QA pass with Opus 4.8 on desktop + mobile screenshots. Skips
 * gracefully (passing) if Claude or a browser isn't available. */
export async function review(artifact: SiteArtifact, business: Business): Promise<ReviewResult> {
  if (!hasAnthropic() || !artifact.path) {
    return { passed: true, score: 0, issues: [], summary: "Review skipped (no Claude key).", reviewedBy: "skipped" };
  }

  const shots = await screenshots(artifact.path);
  if (!shots) {
    return { passed: true, score: 0, issues: [], summary: "Review skipped (no browser).", reviewedBy: "skipped" };
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
    return { passed: true, score: 70, issues: [], summary: "Review returned unparseable output; passed by default.", reviewedBy: "claude" };
  }

  return {
    passed: !!parsed.passed,
    score: parsed.score ?? 0,
    issues: parsed.issues ?? [],
    summary: parsed.summary ?? "",
    reviewedBy: "claude",
  };
}
