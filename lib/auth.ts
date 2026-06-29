/**
 * Minimal single-admin auth for /admin. One password (ADMIN_PASSWORD) → a signed
 * httpOnly cookie. The signature is an HMAC of a fixed payload with ADMIN_PASSWORD
 * as the key, so a valid cookie can only be produced by someone who knows the password.
 *
 * Edge-safe: uses Web Crypto (works in middleware) — no node:crypto import.
 * Constant-time comparisons via crypto.subtle.timingSafeEqual prevent timing attacks.
 */
export const ADMIN_COOKIE = "gv_admin";
const PAYLOAD = "growvera-admin-v1";

async function hmac(message: string, key: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return new Uint8Array(sig);
}

function toHex(buf: Uint8Array): string {
  return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison of two Uint8Arrays. */
function safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  // XOR every byte and OR all diffs — result is 0 only if all bytes match.
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** The cookie value to set after a correct password. */
export async function makeToken(password: string): Promise<string> {
  return toHex(await hmac(PAYLOAD, password));
}

/** True when the provided password matches ADMIN_PASSWORD (constant-time). */
export async function passwordOk(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !password) return false;
  // Compare HMACs of both values — constant-time, never compares raw passwords.
  const [a, b] = await Promise.all([
    hmac(PAYLOAD, password),
    hmac(PAYLOAD, expected),
  ]);
  return safeEqual(a, b);
}

/** Validate a cookie value against ADMIN_PASSWORD (constant-time). */
export async function tokenValid(token: string | undefined): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !token) return false;
  const want = await hmac(PAYLOAD, expected);
  const enc = new TextEncoder();
  const got = enc.encode(token);
  const wantHex = enc.encode(toHex(want));
  return safeEqual(got, wantHex);
}
