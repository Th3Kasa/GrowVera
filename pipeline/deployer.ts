import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { OUTPUT_DIR } from "./config";
import type { SiteArtifact } from "./types";

/**
 * Two deploy modes controlled by DEPLOY_TARGET env var:
 *
 *   "hosted" (default in CI/GitHub Actions):
 *     Returns url = ${NEXT_PUBLIC_SITE_URL}/demo/${businessId}.
 *     The HTML is NOT written to disk — it's stored on the Lead via demoHtml
 *     and served from Airtable by the /demo/[id] Next.js route on Vercel.
 *     No per-demo deployments, no extra cost.
 *
 *   "local" (default locally when DEPLOY_TARGET is unset):
 *     Writes pipeline/output/<slug>/index.html and returns a file:// URL.
 *     Good for quick local testing without needing Vercel/Airtable round-trips.
 */
export async function deploy(artifact: SiteArtifact): Promise<{ path: string; url: string; html?: string }> {
  const target = process.env.DEPLOY_TARGET ?? "local";

  if (target === "hosted") {
    const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || "https://growvera.com.au").replace(/\/$/, "");
    const url = `${siteBase}/demo/${artifact.businessId}`;
    return { path: "", url, html: artifact.html };
  }

  // local mode — write to disk
  const dir = path.join(OUTPUT_DIR, artifact.slug);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, "index.html");
  await fs.writeFile(file, artifact.html, "utf8");
  return { path: file, url: pathToFileURL(file).href };
}
