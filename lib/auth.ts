/**
 * Minimal single-admin auth for /admin. One password (ADMIN_PASSWORD) → a signed
 * httpOnly cookie. Right-sized for a solo founder; no user table, no Supabase.
 * The signature is an HMAC of a fixed payload with ADMIN_PASSWORD as the key, so
 * a valid cookie can only be produced by someone who knows the password.
 *
 * Edge-safe: uses Web Crypto (works in middleware) — no node:crypto import.
 */
export const ADMIN_COOKIE = "gv_admin";
const PAYLOAD = "growvera-admin-v1";

async function hmac(message: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** The cookie value to set after a correct password. */
export async function makeToken(password: string): Promise<string> {
  return hmac(PAYLOAD, password);
}

/** True when the provided password matches ADMIN_PASSWORD. */
export function passwordOk(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  return !!expected && password === expected;
}

/** Validate a cookie value against ADMIN_PASSWORD. */
export async function tokenValid(token: string | undefined): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !token) return false;
  const want = await makeToken(expected);
  return token === want;
}
