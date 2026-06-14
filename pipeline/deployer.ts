import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { OUTPUT_DIR } from "./config";
import type { SiteArtifact } from "./types";

/**
 * Default deployer: writes the site to pipeline/output/<slug>/index.html and
 * returns a file:// URL. This keeps the loop free and offline — defer buying a
 * real domain until a prospect converts.
 *
 * To deploy live for real, implement one of these against the same signature and
 * swap it in run.ts:
 *   - Vercel:     POST https://api.vercel.com/v13/deployments (files inline)
 *   - Cloudflare: Pages Direct Upload API
 * Both can deploy to a free *.vercel.app / *.pages.dev subdomain.
 */
export async function deploy(artifact: SiteArtifact): Promise<{ path: string; url: string }> {
  const dir = path.join(OUTPUT_DIR, artifact.slug);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, "index.html");
  await fs.writeFile(file, artifact.html, "utf8");
  return { path: file, url: pathToFileURL(file).href };
}
