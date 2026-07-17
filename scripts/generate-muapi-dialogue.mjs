// @ts-check
/**
 * Advanced Strata — Speed-to-Lead demo audio (via MuAPI).
 *
 * Generates ONE stitched dialogue MP3 for the Advanced Strata speed-to-lead
 * upsell demo using MuAPI's ElevenLabs text-to-dialogue-v3 endpoint. We route
 * through MuAPI (not ElevenLabs directly) to bypass the nearly-exhausted
 * ElevenLabs monthly quota while keeping the SAME Sarah (AI) + Charlie (caller)
 * voices as the receptionist demo, so it reads as the same assistant.
 *
 * SOURCE OF TRUTH: agent-os/clients/advanced-strata/speed-to-lead-script.md
 * (15 spoken lines, verbatim). Numbers already spelled as words in the script.
 *
 * SECURITY: MUAPI_API_KEY is read at runtime from ~/.hermes/.env (or
 * process.env). It is NEVER printed, logged, or committed.
 *
 * BALANCE GUARD: balance is very low. We (1) print the account balance first,
 * (2) submit and read the job's `cost`, (3) ABORT (no retry) if the cost would
 * exceed the balance or the poll reports an insufficient-funds/payment error.
 * On abort the component still ships silent (transcript-only via buildCues).
 *
 * OUTPUT: public/demos/advanced-strata-speedtolead.mp3 + an additive
 * AS_SPEEDTOLEAD_CUES block in components/demo/callCues.generated.ts. Because
 * the dialogue model returns a single stitched file (no per-line clips), cues
 * are APPROXIMATE — proportional to each line's character length, scaled to the
 * real ffprobe'd total duration. Approx sync is acceptable for this upsell demo.
 *
 * Usage:  node scripts/generate-muapi-dialogue.mjs
 * No new dependencies: global fetch + child_process (ffprobe on PATH). Node 20+.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "public", "demos");
const OUT_FILE = path.join(OUT_DIR, "advanced-strata-speedtolead.mp3");
const GEN_FILE = path.join(REPO_ROOT, "components", "demo", "callCues.generated.ts");

const BASE = "https://api.muapi.ai/api/v1";
const MODEL = "elevenlabs-text-to-dialogue-v3";
const CUE_EXPORT = "AS_SPEEDTOLEAD_CUES";

// Voices — SAME as the receptionist demo (Sarah = AI, Charlie = caller).
// NOTE: this endpoint REJECTS the raw ElevenLabs premade IDs
// (EXAVITQu4vr4xnSDxMaL / IKne3meq5aSn9XLyUdCD) as "Invalid voice parameter",
// even though they appear in the model's own enum. Passing the voice NAMES,
// which map to the same "Sarah - Soft" / "Charlie - Natural" premade voices,
// clears validation. Kept as names so voice consistency with the receptionist
// demo is preserved and the script is usable when the endpoint is healthy.
const SARAH = "Sarah"; // AI assistant  (id EXAVITQu4vr4xnSDxMaL)
const CHARLIE = "Charlie"; // caller     (id IKne3meq5aSn9XLyUdCD)

/* ─────────────────────────── dialogue (VERBATIM from script) ─────────────── */
/** @type {{ speaker: "ai"|"caller", voice_id: string, text: string }[]} */
const LINES = [
  { speaker: "ai", voice_id: SARAH, text: "Hi, it's the assistant from Advanced Strata — you just popped in an enquiry on our site about a strata report. Quick heads up, this call's recorded for training; happy to switch that off if you'd prefer. Have I caught you at an okay time?" },
  { speaker: "caller", voice_id: CHARLIE, text: "Oh — wow, that was quick. I literally just submitted the form." },
  { speaker: "ai", voice_id: SARAH, text: "We like to be quick — the sooner we get your report moving, the better, especially if there's a deadline. Which property's it for?" },
  { speaker: "caller", voice_id: CHARLIE, text: "Yeah, um — it's an apartment in Wollongong I'm looking at buying." },
  { speaker: "ai", voice_id: SARAH, text: "Lovely. And is there a cooling-off date you're working towards?" },
  { speaker: "caller", voice_id: CHARLIE, text: "Yeah, it ends Friday, so it's a bit tight." },
  { speaker: "ai", voice_id: SARAH, text: "Friday's doable — for that we'd do the urgent report: three hundred and sixty dollars plus GST, back within forty-eight hours. Did the agent give you a strata plan number, or just the address?" },
  { speaker: "caller", voice_id: CHARLIE, text: "Ah — just the address, I think. I don't have a plan number on me." },
  { speaker: "ai", voice_id: SARAH, text: "No problem at all — we can pull that from the address. What's the address?" },
  { speaker: "caller", voice_id: CHARLIE, text: "It's unit eight, forty Crown Street, Wollongong." },
  { speaker: "ai", voice_id: SARAH, text: "Unit eight, forty Crown Street — got it. I'll text you the order link now so you can lock it in, and I'll flag your Friday deadline as priority for Matthew. Is this the best number for the text — the one you're on?" },
  { speaker: "caller", voice_id: CHARLIE, text: "Yeah, this one's good." },
  { speaker: "ai", voice_id: SARAH, text: "Perfect. You'll have the link in a moment, and Matthew will make sure the inspection's booked in time for Friday. Anything else I can help with?" },
  { speaker: "caller", voice_id: CHARLIE, text: "No, that's great — honestly, that was so easy. Thanks so much." },
  { speaker: "ai", voice_id: SARAH, text: "My pleasure. Good luck with the apartment — bye for now." },
];

/* ─────────────────────────── key loading (never printed) ─────────────────── */

function loadKey() {
  if (process.env.MUAPI_API_KEY) return process.env.MUAPI_API_KEY.trim();
  const candidates = [
    path.join(os.homedir(), ".hermes", ".env"),
    path.join(os.homedir(), ".hermes", "profiles", "main", ".env"),
  ];
  for (const envPath of candidates) {
    let raw;
    try {
      raw = fs.readFileSync(envPath, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*MUAPI_API_KEY\s*=\s*(.*)\s*$/);
      if (m) {
        let v = m[1].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        return v;
      }
    }
  }
  throw new Error("MUAPI_API_KEY not found (checked ~/.hermes/.env and process.env).");
}

/* ─────────────────────────── ffprobe helper ──────────────────────────────── */

function probeDurationSec(file) {
  const r = spawnSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", file,
  ], { encoding: "utf8" });
  if (r.error) throw r.error;
  const d = parseFloat((r.stdout || "").trim());
  if (!Number.isFinite(d)) throw new Error(`ffprobe gave no duration for ${file}`);
  return d;
}

/* ─────────────────────────── approximate cues ────────────────────────────── */
/**
 * Distribute the real total duration across lines proportional to character
 * length. Contiguous (no gaps) so cue i+1 starts where cue i ends — good enough
 * for transcript reveal on an upsell demo. Trailing 0.4s of the file is left as
 * tail so the last line doesn't over-run.
 */
function buildApproxCues(lines, totalDur) {
  const speakable = Math.max(0.5, totalDur - 0.4);
  const totalChars = lines.reduce((n, l) => n + l.text.length, 0);
  let t = 0;
  return lines.map((l) => {
    const dur = (l.text.length / totalChars) * speakable;
    const cue = { speaker: l.speaker, text: l.text, startSec: Number(t.toFixed(2)), dur: Number(dur.toFixed(2)) };
    t += dur;
    return cue;
  });
}

/* ─────────────────────────── additive cue emit ───────────────────────────── */

function emitCues(cues) {
  const serialize = cues
    .map((c) => `  { speaker: ${JSON.stringify(c.speaker)}, startSec: ${c.startSec}, dur: ${c.dur}, text: ${JSON.stringify(c.text)} },`)
    .join("\n");
  const block = `\nexport const ${CUE_EXPORT}: Cue[] = [\n${serialize}\n];\n`;

  let body = "";
  try {
    body = fs.readFileSync(GEN_FILE, "utf8");
  } catch {
    throw new Error(`Cannot read ${GEN_FILE}`);
  }
  // CRLF-tolerant additive replace: rewrite our block if present, else append.
  const re = new RegExp(`\\r?\\nexport const ${CUE_EXPORT}: Cue\\[\\] = \\[[\\s\\S]*?\\r?\\n\\];\\r?\\n`);
  body = re.test(body) ? body.replace(re, block) : body.replace(/\s*$/, "\n") + block;
  fs.writeFileSync(GEN_FILE, body);
  console.log(`Wrote ${path.relative(REPO_ROOT, GEN_FILE)} block: ${CUE_EXPORT} (${cues.length} lines)`);
}

/* ─────────────────────────── main ────────────────────────────────────────── */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const key = loadKey();
  const headers = { "x-api-key": key, "Content-Type": "application/json" };

  // 1) Balance FIRST.
  let balance = null;
  try {
    const br = await fetch(`${BASE}/account/balance`, { headers });
    const bj = await br.json();
    balance = typeof bj.balance === "number" ? bj.balance : (typeof bj.amount_usd === "number" ? bj.amount_usd : bj);
    console.log("MuAPI balance:", JSON.stringify(bj));
  } catch (e) {
    console.log("Could not read balance:", e.message);
  }

  // 2) Pre-flight cost estimate (dynamic pricing) — abort BEFORE billing if the
  //    estimate would exceed the balance.
  const dialogue = LINES.map((l) => ({ text: l.text, voice_id: l.voice_id }));
  try {
    const er = await fetch(`${BASE}/models/${MODEL}/estimate-cost`, {
      method: "POST",
      headers,
      body: JSON.stringify({ dialogue, stability: 0.5 }),
    });
    const ej = await er.json();
    const est = typeof ej.cost === "number" ? ej.cost : null;
    console.log(`Estimated cost: ${est != null ? "$" + est : JSON.stringify(ej)}`);
    if (est != null && typeof balance === "number" && est > balance) {
      console.error(`\nABORT: estimated cost $${est} exceeds balance $${balance}. MuAPI balance too low — needs top-up, Speed-to-Lead audio deferred.`);
      process.exit(2);
    }
  } catch (e) {
    console.log("Cost estimate unavailable:", e.message);
  }

  // 3) Submit dialogue job.
  console.log(`\nSubmitting ${dialogue.length} dialogue lines to ${MODEL}…`);
  const sub = await fetch(`${BASE}/${MODEL}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ dialogue, stability: 0.5 }),
  });
  const subJson = await sub.json();
  const cost = subJson.cost;
  console.log("Submit response:", JSON.stringify({ request_id: subJson.request_id, status: subJson.status, cost, detail: subJson.detail, error: subJson.error }));

  if (!subJson.request_id) {
    const msg = (subJson.detail || subJson.error || "").toString().toLowerCase();
    if (/insufficient|payment|balance|fund|credit/.test(msg)) {
      console.error("\nABORT: MuAPI reports insufficient funds. Balance too low — needs top-up, Speed-to-Lead audio deferred.");
      process.exit(2);
    }
    console.error("\nABORT: submit did not return a request_id.", subJson.detail || subJson.error || "");
    process.exit(1);
  }

  // 3) Cost vs balance guard (only when both are numeric).
  const costUsd = cost && typeof cost.amount_usd === "number" ? cost.amount_usd : null;
  if (costUsd != null && typeof balance === "number" && costUsd > balance) {
    console.error(`\nABORT: job cost $${costUsd} exceeds balance $${balance}. MuAPI balance too low — needs top-up, Speed-to-Lead audio deferred.`);
    process.exit(2);
  }

  // 4) Poll for the result.
  const id = subJson.request_id;
  let outUrl = null;
  for (let i = 0; i < 80; i++) {
    await sleep(3000);
    const pr = await fetch(`${BASE}/predictions/${encodeURIComponent(id)}/result`, { headers });
    const pj = await pr.json();
    // The result endpoint nests the record under `detail` (both for in-progress
    // and error/success payloads), so read through it.
    const d = pj.detail && typeof pj.detail === "object" ? pj.detail : pj;
    const status = (d.status || "").toString().toLowerCase();
    console.log(`  poll ${i + 1}: status=${status || "(pending)"}`);
    if (status === "completed" || status === "succeeded" || status === "success") {
      outUrl = (d.outputs && d.outputs[0]) || (Array.isArray(d.output) ? d.output[0] : d.output) || null;
      break;
    }
    if (status === "failed" || status === "error" || d.error) {
      const msg = (d.error || "").toString().toLowerCase();
      if (/insufficient|payment|balance|fund|credit/.test(msg)) {
        console.error("\nABORT: MuAPI reports insufficient funds during poll. Balance too low — needs top-up, Speed-to-Lead audio deferred.");
        process.exit(2);
      }
      console.error("\nABORT: job failed:", pj.error || status);
      process.exit(1);
    }
  }

  if (!outUrl) {
    console.error("\nABORT: no output URL after polling. Speed-to-Lead audio deferred.");
    process.exit(1);
  }

  // 5) Download the stitched MP3.
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const audioRes = await fetch(outUrl);
  if (!audioRes.ok) {
    console.error(`\nABORT: download failed (${audioRes.status}).`);
    process.exit(1);
  }
  const buf = Buffer.from(await audioRes.arrayBuffer());
  fs.writeFileSync(OUT_FILE, buf);
  const totalDur = probeDurationSec(OUT_FILE);
  console.log(`\nSaved ${path.relative(REPO_ROOT, OUT_FILE)} — ${totalDur.toFixed(2)}s, ${(buf.length / 1024).toFixed(1)} KB`);

  // 6) Emit approximate cues scaled to the real duration.
  const cues = buildApproxCues(LINES, totalDur);
  emitCues(cues);

  console.log("\n__RESULT_JSON__" + JSON.stringify({
    ok: true,
    balance,
    cost: costUsd,
    file: path.relative(REPO_ROOT, OUT_FILE),
    durationSec: Number(totalDur.toFixed(2)),
    sizeKB: Number((buf.length / 1024).toFixed(1)),
    lines: cues.length,
  }));
}

main().catch((e) => {
  console.error("\nFATAL:", e.message);
  process.exit(1);
});
