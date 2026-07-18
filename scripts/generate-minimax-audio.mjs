// @ts-check
/**
 * Advanced Strata — Speed-to-Lead demo audio (via MuAPI · MiniMax TTS).
 *
 * The ElevenLabs text-to-dialogue endpoint we originally used (see
 * scripts/generate-muapi-dialogue.mjs) is broken, so — with the owner's sign-off,
 * accepting that these voices WON'T match the receptionist demo — we regenerate
 * this one demo's audio with MuAPI's MiniMax speech model instead.
 *
 * Unlike the dialogue endpoint, MiniMax is PER-LINE TTS: we render each of the 15
 * spoken lines to its own clip (female voice for the AI, male voice for the
 * caller), then stitch them with ffmpeg into a single MP3 with short silences
 * between. Because we own each clip, cues are EXACT — ffprobe each clip for its
 * real duration and lay them out with the exact inter-line gaps we insert.
 *
 * SOURCE OF TRUTH: the LINES array in
 * components/demo/AdvancedStrataSpeedToLeadDemo.tsx (copied verbatim below so the
 * generated cues line up with the shipped transcript, speaker order and all).
 *
 * SECURITY: MUAPI_API_KEY is read at runtime from ~/.hermes/profiles/main/.env
 * (fallback ~/.hermes/.env or process.env). It is NEVER printed, logged, committed.
 *
 * BALANCE GUARD: balance is very low (~$1.74). We (1) print the account balance
 * first, (2) sum each submit's reported cost as we go, and (3) STOP before any
 * call that would push the running total past the balance, reporting how many
 * lines completed. 15 short MiniMax lines should total well under $1.
 *
 * CACHE: each clip is cached OUTSIDE the repo (os.tmpdir()) keyed by
 * voice_id + text, so a re-run reuses existing clips and does NOT re-bill.
 * Discovered voice ids are cached too, so voice-discovery test calls run once.
 *
 * OUTPUT: public/demos/advanced-strata-speedtolead.mp3 + the AS_SPEEDTOLEAD_CUES
 * block in components/demo/callCues.generated.ts (that block ONLY — the
 * RECEPTIONIST / SPEEDTOLEAD / ADVANCED_STRATA blocks are never touched).
 *
 * Usage:  node scripts/generate-minimax-audio.mjs
 * No new dependencies: global fetch + child_process (ffmpeg/ffprobe on PATH). Node 20+.
 */

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "public", "demos");
const OUT_FILE = path.join(OUT_DIR, "advanced-strata-speedtolead.mp3");
const GEN_FILE = path.join(REPO_ROOT, "components", "demo", "callCues.generated.ts");

const CACHE_DIR = path.join(os.tmpdir(), "as-minimax-audio");

const BASE = "https://api.muapi.ai/api/v1";
const MODEL = "minimax-speech-2.6-hd";
const CUE_EXPORT = "AS_SPEEDTOLEAD_CUES";

// Inter-line silence. A touch more before the caller's "wow that was quick"
// reaction (line index 1) so it lands.
const GAP_MS = 300;
const GAP_BIG_MS = 550;

// Candidate MiniMax voice ids — the schema gives no enum, so we DISCOVER a
// working id per gender with a single cheap test call, first that validates wins.
// AU-accented ids tried first in case the engine has any.
const FEMALE_CANDIDATES = ["English_Aussie_Woman", "English_Graceful_Lady", "Wise_Woman", "English_CalmWoman", "Friendly_Person"];
const MALE_CANDIDATES = ["English_Aussie_Man", "English_Trustworth_Man", "Deep_Voice_Man", "English_ReservedYoungMan", "Friendly_Person"];

/* ─────────────────────── lines (VERBATIM from the component) ─────────────── */
/** @type {{ speaker: "ai"|"caller", text: string }[]} */
const LINES = [
  { speaker: "ai", text: "Hi, it's the assistant from Advanced Strata — you just popped in an enquiry on our site about a strata report. Quick heads up, this call's recorded for training; happy to switch that off if you'd prefer. Have I caught you at an okay time?" },
  { speaker: "caller", text: "Oh — wow, that was quick. I literally just submitted the form." },
  { speaker: "ai", text: "We like to be quick — the sooner we get your report moving, the better, especially if there's a deadline. Which property's it for?" },
  { speaker: "caller", text: "Yeah, um — it's an apartment in Wollongong I'm looking at buying." },
  { speaker: "ai", text: "Lovely. And is there a cooling-off date you're working towards?" },
  { speaker: "caller", text: "Yeah, it ends Friday, so it's a bit tight." },
  { speaker: "ai", text: "Friday's doable — for that we'd do the urgent report: three hundred and sixty dollars plus GST, back within forty-eight hours. Did the agent give you a strata plan number, or just the address?" },
  { speaker: "caller", text: "Ah — just the address, I think. I don't have a plan number on me." },
  { speaker: "ai", text: "No problem at all — we can pull that from the address. What's the address?" },
  { speaker: "caller", text: "It's unit eight, forty Crown Street, Wollongong." },
  { speaker: "ai", text: "Unit eight, forty Crown Street — got it. I'll text you the order link now so you can lock it in, and I'll flag your Friday deadline as priority for Matthew. Is this the best number for the text — the one you're on?" },
  { speaker: "caller", text: "Yeah, this one's good." },
  { speaker: "ai", text: "Perfect. You'll have the link in a moment, and Matthew will make sure the inspection's booked in time for Friday. Anything else I can help with?" },
  { speaker: "caller", text: "No, that's great — honestly, that was so easy. Thanks so much." },
  { speaker: "ai", text: "My pleasure. Good luck with the apartment — bye for now." },
];

/* ─────────────────────────── key loading (never printed) ─────────────────── */

function loadKey() {
  if (process.env.MUAPI_API_KEY) return process.env.MUAPI_API_KEY.trim();
  const candidates = [
    path.join(os.homedir(), ".hermes", "profiles", "main", ".env"),
    path.join(os.homedir(), ".hermes", ".env"),
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
  throw new Error("MUAPI_API_KEY not found (checked ~/.hermes/profiles/main/.env, ~/.hermes/.env, process.env).");
}

/* ─────────────────────────── ffmpeg / ffprobe helpers ────────────────────── */

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status}): ${(r.stderr || "").slice(-500)}`);
  return r;
}

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

function probeChannels(file) {
  const r = spawnSync("ffprobe", [
    "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=channels",
    "-of", "default=noprint_wrappers=1:nokey=1", file,
  ], { encoding: "utf8" });
  const c = parseInt((r.stdout || "").trim(), 10);
  return Number.isFinite(c) && c > 0 ? c : 1;
}

/* ─────────────────────────── MuAPI calls ─────────────────────────────────── */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Normalise a MuAPI `cost` field (number, or {amount_usd}/{total}) to a USD number. */
function costUsd(cost) {
  if (typeof cost === "number") return cost;
  if (cost && typeof cost === "object") {
    if (typeof cost.amount_usd === "number") return cost.amount_usd;
    if (typeof cost.total === "number") return cost.total;
    if (typeof cost.usd === "number") return cost.usd;
  }
  return 0;
}

/** Submit one TTS line. Returns { request_id, cost, raw }. */
async function submitLine(text, voiceId, headers) {
  const res = await fetch(`${BASE}/${MODEL}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt: text,
      voice_id: voiceId,
      sample_rate: 44100,
      bitrate: 128000,
      format: "mp3",
      language_boost: "English",
      emotion: "neutral",
      speed: 1,
    }),
  });
  const json = await res.json();
  return { request_id: json.request_id, cost: json.cost, raw: json };
}

/** Poll a request to completion. Returns the output URL, or throws. */
async function pollResult(id, headers, { label = "" } = {}) {
  for (let i = 0; i < 80; i++) {
    await sleep(2500);
    const pr = await fetch(`${BASE}/predictions/${encodeURIComponent(id)}/result`, { headers });
    const pj = await pr.json();
    // Result may nest the record under `detail` (mirror the dialogue script).
    const d = pj.detail && typeof pj.detail === "object" ? pj.detail : pj;
    const status = (d.status || "").toString().toLowerCase();
    if (label) process.stdout.write(`\r    ${label} poll ${i + 1}: ${status || "(pending)"}   `);
    if (status === "completed" || status === "succeeded" || status === "success") {
      const url = (d.outputs && d.outputs[0]) || (Array.isArray(d.output) ? d.output[0] : d.output) || null;
      if (label) process.stdout.write("\n");
      if (!url) throw new Error("completed but no output URL");
      return url;
    }
    if (status === "failed" || status === "error" || d.error) {
      if (label) process.stdout.write("\n");
      throw new Error((d.error || pj.error || status || "failed").toString());
    }
  }
  throw new Error("timed out polling for result");
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed (${res.status})`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

/* ─────────────────────────── cue emit (this block only) ──────────────────── */

function emitCues(cues) {
  const serialize = cues
    .map((c) => `  { speaker: ${JSON.stringify(c.speaker)}, startSec: ${c.startSec}, dur: ${c.dur}, text: ${JSON.stringify(c.text)} },`)
    .join("\n");
  const comment =
    "// Advanced Strata — Speed-to-Lead upsell demo.\n" +
    "// Per-line MiniMax TTS (MuAPI) stitched by scripts/generate-minimax-audio.mjs.\n" +
    "// Voices differ from the receptionist demo by design (dialogue endpoint was down).\n" +
    "// Cues are EXACT — measured per clip with ffprobe plus the inter-line gaps.";
  const block = `${comment}\nexport const ${CUE_EXPORT}: Cue[] = [\n${serialize}\n];\n`;

  let body = fs.readFileSync(GEN_FILE, "utf8");
  // Replace the existing comment+export for THIS block only. Matches both the
  // empty placeholder (`= [];`) and any previously-generated multiline block.
  const re = /\/\/ Advanced Strata — Speed-to-Lead[\s\S]*?export const AS_SPEEDTOLEAD_CUES: Cue\[\] = \[[\s\S]*?\];\n?/;
  if (!re.test(body)) throw new Error("Could not locate the AS_SPEEDTOLEAD_CUES block to replace.");
  body = body.replace(re, block);
  fs.writeFileSync(GEN_FILE, body);
  console.log(`Wrote ${path.relative(REPO_ROOT, GEN_FILE)} → ${CUE_EXPORT} (${cues.length} exact cues)`);
}

/* ─────────────────────────── voice discovery ─────────────────────────────── */

async function discoverVoice(candidates, gender, headers, spend) {
  for (const voiceId of candidates) {
    process.stdout.write(`  testing ${gender} voice "${voiceId}"… `);
    spend.guard(); // don't test-call if we're already at the ceiling
    let sub;
    try {
      sub = await submitLine("Hello there, testing.", voiceId, headers);
    } catch (e) {
      console.log(`submit error (${e.message}) — next`);
      continue;
    }
    if (!sub.request_id) {
      const msg = JSON.stringify(sub.raw?.detail || sub.raw?.error || sub.raw || "").slice(0, 160);
      console.log(`rejected (${msg}) — next`);
      continue;
    }
    spend.add(costUsd(sub.cost));
    try {
      await pollResult(sub.request_id, headers);
      console.log("OK");
      return voiceId;
    } catch (e) {
      console.log(`failed (${e.message}) — next`);
    }
  }
  throw new Error(`no working ${gender} voice among: ${candidates.join(", ")}`);
}

/* ─────────────────────────── main ────────────────────────────────────────── */

async function main() {
  const key = loadKey();
  const headers = { "x-api-key": key, "Content-Type": "application/json" };
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  // 1) Balance first.
  let balance = null;
  try {
    const br = await fetch(`${BASE}/account/balance`, { headers });
    const bj = await br.json();
    balance = typeof bj.balance === "number" ? bj.balance
      : typeof bj.amount_usd === "number" ? bj.amount_usd
      : typeof bj === "number" ? bj : null;
    console.log("MuAPI balance:", JSON.stringify(bj));
  } catch (e) {
    console.log("Could not read balance:", e.message);
  }

  // Running-spend guard. If balance is unknown, use a conservative $1.50 ceiling.
  const ceiling = typeof balance === "number" ? balance : 1.5;
  let running = 0;
  const spend = {
    add(c) { running += (c || 0); },
    guard(next = 0) {
      if (running + next > ceiling + 1e-9) {
        throw Object.assign(new Error(`balance guard: running $${running.toFixed(4)} + $${next.toFixed(4)} would exceed ceiling $${ceiling.toFixed(4)}`), { balanceStop: true });
      }
    },
  };

  // 2) Discover / reuse voices.
  const voicesCache = path.join(CACHE_DIR, "voices.json");
  let voices = null;
  try {
    voices = JSON.parse(fs.readFileSync(voicesCache, "utf8"));
    if (voices?.female && voices?.male) console.log(`Reusing cached voices: female="${voices.female}", male="${voices.male}"`);
    else voices = null;
  } catch { voices = null; }

  if (!voices) {
    console.log("\nDiscovering voices…");
    const female = await discoverVoice(FEMALE_CANDIDATES, "female", headers, spend);
    const male = await discoverVoice(MALE_CANDIDATES, "male", headers, spend);
    voices = { female, male };
    fs.writeFileSync(voicesCache, JSON.stringify(voices, null, 2));
  }
  const voiceFor = (speaker) => (speaker === "ai" ? voices.female : voices.male);

  // 3) Generate (or reuse cached) each line.
  console.log(`\nGenerating ${LINES.length} lines (female="${voices.female}" AI, male="${voices.male}" caller)…`);
  const clipFiles = [];
  let completed = 0;
  for (let i = 0; i < LINES.length; i++) {
    const l = LINES[i];
    const voiceId = voiceFor(l.speaker);
    const hash = crypto.createHash("md5").update(voiceId + "\n" + l.text).digest("hex").slice(0, 12);
    const clip = path.join(CACHE_DIR, `line_${String(i).padStart(2, "0")}_${hash}.mp3`);

    if (fs.existsSync(clip) && fs.statSync(clip).size > 0) {
      console.log(`  [${i + 1}/${LINES.length}] cached ${l.speaker} (${path.basename(clip)})`);
      clipFiles.push(clip);
      completed++;
      continue;
    }

    // Would this call blow the budget? Stop cleanly if so.
    try { spend.guard(); } catch (e) {
      if (e.balanceStop) { console.error(`\nSTOP: ${e.message}. Completed ${completed}/${LINES.length} lines before hitting the balance ceiling.`); process.exit(2); }
      throw e;
    }

    process.stdout.write(`  [${i + 1}/${LINES.length}] ${l.speaker}: submitting… `);
    const sub = await submitLine(l.text, voiceId, headers);
    if (!sub.request_id) {
      const msg = JSON.stringify(sub.raw?.detail || sub.raw?.error || sub.raw || "").slice(0, 200);
      if (/insufficient|payment|balance|fund|credit/i.test(msg)) {
        console.error(`\nSTOP: MuAPI reports insufficient funds. Completed ${completed}/${LINES.length}. ${msg}`);
        process.exit(2);
      }
      throw new Error(`line ${i + 1} submit returned no request_id: ${msg}`);
    }
    spend.add(costUsd(sub.cost));
    const url = await pollResult(sub.request_id, headers, { label: `[${i + 1}]` });
    await download(url, clip);
    if (!fs.existsSync(clip) || fs.statSync(clip).size === 0) throw new Error(`line ${i + 1} downloaded empty clip`);
    console.log(`    saved (${(fs.statSync(clip).size / 1024).toFixed(1)} KB, running $${running.toFixed(4)})`);
    clipFiles.push(clip);
    completed++;
  }

  if (clipFiles.length !== LINES.length) {
    console.error(`\nSTOP: only ${clipFiles.length}/${LINES.length} clips ready — not stitching a partial demo.`);
    process.exit(2);
  }

  // 4) Probe clip durations + channel layout for silence generation.
  const durations = clipFiles.map(probeDurationSec);
  const channels = probeChannels(clipFiles[0]);

  // 5) Build matching silence clips, then stitch via the concat demuxer.
  const silSmall = path.join(CACHE_DIR, `sil_${GAP_MS}ms_${channels}ch.mp3`);
  const silBig = path.join(CACHE_DIR, `sil_${GAP_BIG_MS}ms_${channels}ch.mp3`);
  const makeSilence = (file, ms) => run("ffmpeg", [
    "-y", "-f", "lavfi", "-i", `anullsrc=r=44100:cl=${channels === 1 ? "mono" : "stereo"}`,
    "-t", (ms / 1000).toFixed(3), "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100", file,
  ]);
  makeSilence(silSmall, GAP_MS);
  makeSilence(silBig, GAP_BIG_MS);

  // Concat list: clip, gap, clip, gap, … (bigger gap BEFORE line index 1).
  const listLines = [];
  const gapBefore = [];
  for (let i = 0; i < clipFiles.length; i++) {
    if (i > 0) {
      const gapFile = i === 1 ? silBig : silSmall;
      const gapMs = i === 1 ? GAP_BIG_MS : GAP_MS;
      listLines.push(`file '${gapFile.replace(/\\/g, "/")}'`);
      gapBefore[i] = gapMs / 1000;
    } else {
      gapBefore[i] = 0;
    }
    listLines.push(`file '${clipFiles[i].replace(/\\/g, "/")}'`);
  }
  const listFile = path.join(CACHE_DIR, "concat.txt");
  fs.writeFileSync(listFile, listLines.join("\n") + "\n");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  run("ffmpeg", [
    "-y", "-f", "concat", "-safe", "0", "-i", listFile,
    "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100", OUT_FILE,
  ]);
  const totalDur = probeDurationSec(OUT_FILE);
  const sizeKB = fs.statSync(OUT_FILE).size / 1024;
  console.log(`\nStitched ${path.relative(REPO_ROOT, OUT_FILE)} — ${totalDur.toFixed(2)}s, ${sizeKB.toFixed(1)} KB`);

  // 6) Build EXACT cues: cumulative offset = Σ(prev clip durs + gaps).
  const cues = [];
  let t = 0;
  for (let i = 0; i < LINES.length; i++) {
    t += gapBefore[i]; // gap that precedes this clip
    cues.push({
      speaker: LINES[i].speaker,
      startSec: Number(t.toFixed(2)),
      dur: Number(durations[i].toFixed(2)),
      text: LINES[i].text,
    });
    t += durations[i];
  }
  emitCues(cues);

  console.log("\n__RESULT_JSON__" + JSON.stringify({
    ok: true,
    voices,
    balanceBefore: balance,
    costTotal: Number(running.toFixed(4)),
    balanceAfter: typeof balance === "number" ? Number((balance - running).toFixed(4)) : null,
    file: path.relative(REPO_ROOT, OUT_FILE),
    durationSec: Number(totalDur.toFixed(2)),
    sizeKB: Number(sizeKB.toFixed(1)),
    lines: cues.length,
    cachedReused: completed, // per-line; re-run reports how many came from cache
  }));
}

main().catch((e) => {
  console.error("\nFATAL:", e.message);
  process.exit(1);
});
