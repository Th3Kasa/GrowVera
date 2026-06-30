/**
 * Loads a local env file into process.env before any other module reads it.
 * Imported first in run.ts so config.ts sees OPENROUTER_API_KEY / GOOGLE_PLACES_
 * API_KEY etc. Uses Node's native loader (v20.12+/24) — no dotenv dependency.
 *
 * Tries `.env.local` first (the file this project actually uses), then `.env`.
 * In CI no file exists and env comes from the shell (GitHub secrets), which is
 * fine — a missing file is ignored.
 */
const proc = process as unknown as { loadEnvFile?: (path?: string) => void };
for (const file of [".env.local", ".env"]) {
  try {
    proc.loadEnvFile?.(file);
    break; // first one that loads wins
  } catch {
    // file not present — try the next
  }
}
