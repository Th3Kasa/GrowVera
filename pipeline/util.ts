import crypto from "node:crypto";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function stableId(name: string, address = ""): string {
  return crypto.createHash("sha1").update(`${name}|${address}`.toLowerCase()).digest("hex").slice(0, 12);
}

export function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}
