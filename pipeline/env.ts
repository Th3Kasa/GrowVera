/**
 * Loads `.env` into process.env before any other module reads it. Imported first
 * in run.ts so config.ts sees OPENROUTER_API_KEY / ANTHROPIC_API_KEY etc.
 * Uses Node's native loader (v20.12+/24) — no dotenv dependency. If there's no
 * .env file, that's fine; env vars can still come from the shell.
 */
const proc = process as unknown as { loadEnvFile?: (path?: string) => void };
try {
  proc.loadEnvFile?.();
} catch {
  // no .env file present — ignore
}
