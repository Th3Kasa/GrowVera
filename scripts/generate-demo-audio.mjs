// @ts-check
/**
 * Growvera — demo call audio generator.
 *
 * Generates the two spoken-demo MP3s (Receptionist + Speed-to-Lead) with
 * ElevenLabs Australian voices, stitches per-line clips with exact silence gaps
 * via ffmpeg, ffprobes real durations, and emits components/demo/callCues.generated.ts
 * with exact cue start times for audio-synced transcript reveal.
 *
 * SOURCE OF TRUTH: ops/demo-call-scripts.md (Growvera repo sibling / ../agent-os).
 * Dialogue lines here are VERBATIM from that file.
 *
 * SECURITY: the ElevenLabs API key is read at runtime from
 *   ~/.hermes/profiles/main/.env  (ELEVENLABS_API_KEY=...)
 * or process.env.ELEVENLABS_API_KEY. It is NEVER printed, logged, or committed.
 *
 * Usage:  node scripts/generate-demo-audio.mjs
 *         node scripts/generate-demo-audio.mjs --dry   (no API calls; needs cache)
 *
 * No new dependencies: uses global fetch + child_process (ffmpeg/ffprobe on PATH).
 * Node 20+ (developed on 26).
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "public", "demos");
const GEN_FILE = path.join(REPO_ROOT, "components", "demo", "callCues.generated.ts");
// Clip cache OUTSIDE the repo so re-runs never re-bill unchanged lines.
const CACHE_DIR = path.join(os.tmpdir(), "growvera-demo-audio-cache");

const DRY = process.argv.includes("--dry");
const API = "https://api.elevenlabs.io";
const MODEL_ID = "eleven_multilingual_v2";
const OUTPUT_FORMAT = "mp3_44100_128";

/* ─────────────────────────── key loading (never printed) ────────────────── */

function loadApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const envPath = path.join(os.homedir(), ".hermes", "profiles", "main", ".env");
  let raw;
  try {
    raw = fs.readFileSync(envPath, "utf8");
  } catch {
    throw new Error(`Cannot read env file at ${envPath} and ELEVENLABS_API_KEY not set.`);
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.*)\s*$/);
    if (m) {
      let v = m[1].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      return v;
    }
  }
  throw new Error("ELEVENLABS_API_KEY not found in env file.");
}

/* ─────────────────────────── voice settings per role ────────────────────── */

const SETTINGS = {
  // AI receptionist / caller (female AU): warm, consistent, low style.
  A: { stability: 0.55, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
  // Homeowner caller D1 (male AU): more expressive for stress→relief arc.
  B1: { stability: 0.45, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
  // Recipient D2 (same male voice, lighter/brighter): relaxed, pleasantly surprised.
  B2: { stability: 0.5, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true },
};

/* ─────────────────────────── dialogue data (VERBATIM) ───────────────────── */
/**
 * Each line -> one transcript cue. `parts` splits a line at a marked mid-line
 * (0.5s pause); the pause is rendered as `pauseAfterMs` silence BETWEEN the two
 * spoken sub-clips (cleaner than an SSML break, per the script's own advice).
 * `gapAfterMs` is the silence inserted AFTER this line before the next one.
 */
const GAP = 300; // default inter-line silence (ms)
const BEAT = 500; // stretched gap after the emotional beat (ms)
const MIDPAUSE = 500; // mid-line (0.5s pause) rendered as silence (ms)

/** @typedef {{ text: string, pauseAfterMs?: number }} Part */
/** @typedef {{ speaker: "ai"|"caller", role: "A"|"B1"|"B2", parts: Part[], gapAfterMs: number }} Line */

/** @type {{ id: string, out: string, lines: Line[] }[]} */
const DIALOGUES = [
  {
    id: "receptionist",
    out: "receptionist-call.mp3",
    lines: [
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Good evening, you've reached Harbourline Plumbing's after-hours assistant. I can take your details and get you booked in — what's going on tonight?" },
      ] },
      { speaker: "caller", role: "B1", gapAfterMs: GAP, parts: [
        { text: "Yeah, hi — I've got a tap under the kitchen sink that's leaking, and it's sort of getting worse. There's water pooling in the cupboard now." },
      ] },
      // Line 3: (0.5s pause before "First things".)
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Okay, water in the cupboard — let's sort that.", pauseAfterMs: MIDPAUSE },
        { text: "First things, have you been able to shut the water off to it, or is it still running?" },
      ] },
      { speaker: "caller", role: "B1", gapAfterMs: GAP, parts: [
        { text: "Ah — there's a little valve under there, I think I turned it. It's slowed right down but it's still dripping." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Good on you, that's exactly the right move — that'll keep the damage down overnight. Whereabouts are you? Which suburb?" },
      ] },
      { speaker: "caller", role: "B1", gapAfterMs: GAP, parts: [
        { text: "Marrickville." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Beautiful, we cover Marrickville. Can I grab your name and the best number to reach you on?" },
      ] },
      { speaker: "caller", role: "B1", gapAfterMs: GAP, parts: [
        { text: "It's Dave — 0400 123 456." },
      ] },
      // Line 9: (0.5s pause before the price.)
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Thanks Dave. So you know what to expect,", pauseAfterMs: MIDPAUSE },
        { text: "our call-out starts from $120, and the plumber gives you an exact quote once he's had a look — no surprises." },
      ] },
      { speaker: "caller", role: "B1", gapAfterMs: GAP, parts: [
        { text: "Yeah, that's fine." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Easy. I can get someone out to you first thing — does eight in the morning suit?" },
      ] },
      // Line 12: emotional beat -> 500ms gap after.
      { speaker: "caller", role: "B1", gapAfterMs: BEAT, parts: [
        { text: "Eight's perfect, yeah. That'd be a big relief, honestly." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Done — you're booked for 8am. I'll text you a confirmation with all the details in just a moment, and the owner gets a summary of this tonight, so it's all in hand." },
      ] },
      { speaker: "caller", role: "B1", gapAfterMs: GAP, parts: [
        { text: "Ah, brilliant. Thanks so much for that." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: 0, parts: [
        { text: "No worries at all, Dave. Keep that valve turned down and we'll see you in the morning. Night now." },
      ] },
    ],
  },
  {
    id: "speedtolead",
    out: "speedtolead-call.mp3",
    lines: [
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Hi, this is the assistant from Harbourline Plumbing — you just popped in a request for gutter cleaning on a two-storey in Parramatta. Have I caught you at an okay time?" },
      ] },
      { speaker: "caller", role: "B2", gapAfterMs: GAP, parts: [
        { text: "Oh — wow, that was fast. I literally just hit submit." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "We like to be quick! Just a couple of things so we can quote it properly. Is there safe ladder access around the place, or anything tricky like a steep pitch?" },
      ] },
      { speaker: "caller", role: "B2", gapAfterMs: GAP, parts: [
        { text: "Nah, access is fine. There's a bit of a slope out the back but nothing mad." },
      ] },
      // Line 5: (0.5s pause before "And roughly".)
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Perfect.", pauseAfterMs: MIDPAUSE },
        { text: "And roughly how long since they were last done?" },
      ] },
      { speaker: "caller", role: "B2", gapAfterMs: GAP, parts: [
        { text: "Ooh — probably a good two years. They're pretty full." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "No dramas, that's a common one this time of year. I've got a spot Thursday morning or Friday afternoon — which works better for you?" },
      ] },
      { speaker: "caller", role: "B2", gapAfterMs: GAP, parts: [
        { text: "Friday arvo would be good." },
      ] },
      { speaker: "ai", role: "A", gapAfterMs: GAP, parts: [
        { text: "Locked in for Friday afternoon. I'll shoot you a text now with the confirmation and what to expect. Thanks for that — talk soon." },
      ] },
      { speaker: "caller", role: "B2", gapAfterMs: 0, parts: [
        { text: "Great, thanks!" },
      ] },
    ],
  },
];

/** Full spoken text of a line (for the transcript cue) = parts joined by a space. */
function lineText(line) {
  return line.parts.map((p) => p.text).join(" ");
}

/* ─────────────────────────── ffmpeg / ffprobe helpers ───────────────────── */

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(`${cmd} exited ${r.status}: ${r.stderr || r.stdout}`);
  }
  return r;
}

function probeDurationSec(file) {
  const r = run("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", file,
  ]);
  const d = parseFloat(r.stdout.trim());
  if (!Number.isFinite(d)) throw new Error(`ffprobe gave no duration for ${file}`);
  return d;
}

/* ─────────────────────────── voice discovery ────────────────────────────── */

function isAU(labels = {}) {
  const acc = (labels.accent || labels.Accent || "").toString().toLowerCase();
  const desc = (labels.description || "").toString().toLowerCase();
  return acc.includes("australia") || desc.includes("australia");
}
function genderOf(labels = {}) {
  return (labels.gender || labels.Gender || "").toString().toLowerCase();
}

async function api(pathname, key, init = {}) {
  const res = await fetch(API + pathname, {
    ...init,
    headers: { "xi-api-key": key, "content-type": "application/json", ...(init.headers || {}) },
  });
  return res;
}

/**
 * Resolve a female AU + male AU voice. Strategy:
 *  1) existing account PREMADE voices with Australian accent (premade = always
 *     callable via the TTS API on any plan tier)
 *  2) shared voice library (add up to 2, free-tier slot-safe) — NOTE: on a
 *     free-tier account, ElevenLabs blocks TTS API calls against
 *     library-sourced voices ("payment_required") even after they're added
 *     to the account. We still add them (useful once the plan is upgraded)
 *     but verify usability before committing to them for this run.
 *  3) premade fallback: Charlie (male AU) + best-matched conversational female
 * Returns { female:{voice_id,name,source}, male:{...}, notes:[] }
 */
async function resolveVoices(key) {
  const notes = [];
  const vres = await api("/v1/voices", key);
  if (!vres.ok) throw new Error(`GET /v1/voices failed: ${vres.status} ${await safeText(vres)}`);
  const voices = (await vres.json()).voices || [];
  const premade = voices.filter((v) => v.category === "premade");

  const auFemale = premade.find((v) => isAU(v.labels) && genderOf(v.labels) === "female");
  const auMale = premade.find((v) => isAU(v.labels) && genderOf(v.labels) === "male");

  let female = auFemale && { voice_id: auFemale.voice_id, name: auFemale.name, source: "account (AU, premade)" };
  let male = auMale && { voice_id: auMale.voice_id, name: auMale.name, source: "account (AU, premade)" };

  if (female) notes.push(`Female: using existing account AU premade voice "${female.name}".`);
  if (male) notes.push(`Male: using existing account AU premade voice "${male.name}".`);

  // 2) shared library for whatever's missing. Verify usability (free-tier
  // accounts can add library voices but cannot call them via the TTS API).
  if (!female || !male) {
    const shared = await fetchSharedAU(key);
    if (!female && shared.female) {
      const added = await addSharedVoice(key, shared.female, notes, "female");
      if (added && (await isVoiceApiUsable(key, added.voice_id, notes, "female", added.name))) {
        female = added;
      }
    }
    if (!male && shared.male) {
      const added = await addSharedVoice(key, shared.male, notes, "male");
      if (added && (await isVoiceApiUsable(key, added.voice_id, notes, "male", added.name))) {
        male = added;
      }
    }
  }

  // 3) premade fallbacks.
  if (!male) {
    const charlie = premade.find((v) => /charlie/i.test(v.name));
    if (charlie) {
      male = { voice_id: charlie.voice_id, name: charlie.name, source: "premade fallback (Charlie, AU)" };
      notes.push(`Male: FELL BACK to premade "Charlie" (Australian) — no other AU male available.`);
    }
  }
  if (!female) {
    // Ranked by closest match to the brief ("warm, unhurried, competent...
    // reassuring register... not bubbly, not robotic; calm/conversational not
    // narration/news") among this account's PREMADE (API-usable) voices —
    // no AU premade female exists on this account, so this is a non-AU
    // fallback, in the order the source md itself allows.
    const prefs = ["Sarah", "Matilda", "Jessica", "Alice", "Charlotte", "Bella", "Lily", "Rachel"];
    let f;
    for (const name of prefs) {
      f = premade.find((v) => v.name.split(" ")[0].toLowerCase() === name.toLowerCase() && genderOf(v.labels) === "female");
      if (f) break;
    }
    if (!f) f = premade.find((v) => genderOf(v.labels) === "female");
    if (f) {
      female = { voice_id: f.voice_id, name: f.name, source: "premade fallback (non-AU)" };
      notes.push(`Female: FELL BACK to premade "${f.name}" (${f.labels?.accent || "non-AU"}) — no AU female voice is usable on this account's plan tier. Chosen for closest personality match to the brief ("${f.labels?.descriptive || ""}, ${f.labels?.use_case || ""}").`);
    }
  }

  if (!female || !male) {
    throw new Error("Could not resolve both a female and male voice.");
  }
  return { female, male, notes };
}

/**
 * A voice added from the shared library may still be un-callable via the TTS
 * API on a free-tier plan ("payment_required"). Probe with GET /v1/voices/{id}
 * and check `category` — only "premade" (and, if present, any category the
 * account plan actually permits) is trustworthy; anything else we treat as
 * unusable for THIS run and fall through to a premade voice instead.
 */
async function isVoiceApiUsable(key, voiceId, notes, label, name) {
  const res = await api(`/v1/voices/${voiceId}`, key);
  if (!res.ok) return false;
  const v = await res.json();
  if (v.category === "premade") return true;
  notes.push(
    `${label}: added AU library voice "${name}" to the account, but this plan's TTS API blocks library-sourced voices ("payment_required" on a free tier) — falling back to a premade voice for this run. The added voice will work once the ElevenLabs plan is upgraded.`
  );
  return false;
}

async function fetchSharedAU(key) {
  const out = { female: null, male: null };
  const tryQueries = [
    "/v1/shared-voices?page_size=100&accent=australian&language=en",
    "/v1/shared-voices?page_size=100&search=australian&language=en",
    "/v1/shared-voices?page_size=100&search=australian",
  ];
  for (const q of tryQueries) {
    const res = await api(q, key);
    if (!res.ok) continue;
    const data = await res.json();
    const list = (data.voices || []).filter((v) => {
      const acc = (v.accent || "").toLowerCase();
      const lang = (v.language || "").toLowerCase();
      return acc.includes("australia") && (lang === "en" || lang === "");
    });
    // Prefer conversational use-case; rank by popularity (cloned/usage counts).
    const rank = (v) =>
      (v.use_case && /conversational|social|characters/i.test(v.use_case) ? 1e9 : 0) +
      (v.cloned_by_count || 0) * 1000 + (v.usage_character_count_1y || 0);
    const females = list.filter((v) => (v.gender || "").toLowerCase() === "female").sort((a, b) => rank(b) - rank(a));
    const males = list.filter((v) => (v.gender || "").toLowerCase() === "male").sort((a, b) => rank(b) - rank(a));
    if (!out.female && females[0]) out.female = females[0];
    if (!out.male && males[0]) out.male = males[0];
    if (out.female && out.male) break;
  }
  return out;
}

async function addSharedVoice(key, shared, notes, label) {
  const publicId = shared.public_owner_id || shared.public_user_id;
  const voiceId = shared.voice_id;
  const newName = `GV ${shared.name}`.slice(0, 40);
  if (!publicId || !voiceId) {
    notes.push(`${label}: shared voice "${shared.name}" missing ids — skipped.`);
    return null;
  }
  const res = await api(`/v1/voices/add/${publicId}/${voiceId}`, key, {
    method: "POST",
    body: JSON.stringify({ new_name: newName }),
  });
  if (!res.ok) {
    const t = await safeText(res);
    notes.push(`${label}: could not add library voice "${shared.name}" (${res.status}${/slot|maximum|limit/i.test(t) ? ", slot limit" : ""}). Will fall back.`);
    return null;
  }
  const added = await res.json();
  notes.push(`${label}: added AU library voice "${shared.name}" (${shared.accent || "australian"}) from the voice library.`);
  return { voice_id: added.voice_id || voiceId, name: shared.name, source: "voice library (AU)" };
}

async function safeText(res) {
  try { return await res.text(); } catch { return ""; }
}

/* ─────────────────────────── TTS with cache ─────────────────────────────── */

let apiCallCount = 0;
let charsBilled = 0;

async function ttsPart(key, voiceId, text, settings) {
  const hash = createHash("sha1")
    .update([voiceId, MODEL_ID, OUTPUT_FORMAT, JSON.stringify(settings), text].join(" "))
    .digest("hex")
    .slice(0, 16);
  const file = path.join(CACHE_DIR, `${hash}.mp3`);
  if (fs.existsSync(file) && fs.statSync(file).size > 0) {
    return { file, cached: true };
  }
  if (DRY) throw new Error(`--dry: missing cached clip for text "${text.slice(0, 30)}..."`);

  const res = await api(`/v1/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`, key, {
    method: "POST",
    headers: { accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: settings }),
  });
  if (!res.ok) throw new Error(`TTS failed (${res.status}): ${await safeText(res)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(file, buf);
  apiCallCount++;
  charsBilled += text.length;
  await sleep(500); // ~500ms between calls
  return { file, cached: false };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─────────────────────────── silence generation ─────────────────────────── */

function silenceFile(ms) {
  const file = path.join(CACHE_DIR, `sil_${ms}.mp3`);
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return file;
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  run("ffmpeg", [
    "-y", "-f", "lavfi", "-t", (ms / 1000).toFixed(3),
    "-i", "anullsrc=r=44100:cl=mono", "-c:a", "libmp3lame", "-b:a", "128k", file,
  ]);
  return file;
}

/* ─────────────────────────── stitch a dialogue ──────────────────────────── */

async function buildDialogue(key, dlg, voices) {
  console.log(`\n=== ${dlg.id} ===`);
  // 1) Render every part, collect segment file list + measured durations.
  /** @type {{file:string, durSec:number}[]} */
  const segments = [];
  /** @type {{speaker:string,text:string,startSec:number,dur:number}[]} */
  const cues = [];

  let timeline = 0; // seconds, running position at the START of each line

  for (let li = 0; li < dlg.lines.length; li++) {
    const line = dlg.lines[li];
    const voiceId = line.role === "A" ? voices.female.voice_id : voices.male.voice_id;
    const settings = SETTINGS[line.role];
    const lineStart = timeline;
    let lineDur = 0;

    for (let pi = 0; pi < line.parts.length; pi++) {
      const part = line.parts[pi];
      const { file, cached } = await ttsPart(key, voiceId, part.text, settings);
      const dur = probeDurationSec(file);
      segments.push({ file, durSec: dur });
      lineDur += dur;
      timeline += dur;
      console.log(`  [${String(li + 1).padStart(2)}${line.parts.length > 1 ? "." + (pi + 1) : "  "}] ${cached ? "cache" : "TTS  "} ${dur.toFixed(2)}s  ${line.role}  ${part.text.slice(0, 42)}...`);

      // Mid-line pause between sub-clips.
      if (part.pauseAfterMs && pi < line.parts.length - 1) {
        const sf = silenceFile(part.pauseAfterMs);
        const sd = probeDurationSec(sf);
        segments.push({ file: sf, durSec: sd });
        lineDur += sd;
        timeline += sd;
      }
    }

    cues.push({
      speaker: line.speaker,
      text: lineText(line),
      startSec: Number(lineStart.toFixed(2)),
      dur: Number(lineDur.toFixed(2)),
    });

    // Inter-line gap (silence), except after the last line.
    if (line.gapAfterMs > 0 && li < dlg.lines.length - 1) {
      const sf = silenceFile(line.gapAfterMs);
      const sd = probeDurationSec(sf);
      segments.push({ file: sf, durSec: sd });
      timeline += sd;
    }
  }

  // 2) Stitch with ffmpeg concat filter (re-encode -> uniform mp3).
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, dlg.out);
  const inputs = [];
  const filters = [];
  segments.forEach((s, i) => {
    inputs.push("-i", s.file);
    filters.push(`[${i}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=mono[a${i}]`);
  });
  const concatIns = segments.map((_, i) => `[a${i}]`).join("");
  const filterComplex = `${filters.join(";")};${concatIns}concat=n=${segments.length}:v=0:a=1[out]`;
  run("ffmpeg", [
    "-y", ...inputs,
    "-filter_complex", filterComplex,
    "-map", "[out]", "-c:a", "libmp3lame", "-b:a", "128k", outFile,
  ]);

  const totalDur = probeDurationSec(outFile);
  const size = fs.statSync(outFile).size;
  console.log(`  -> ${dlg.out}  ${totalDur.toFixed(2)}s  ${(size / 1024).toFixed(1)} KB`);

  return { id: dlg.id, out: dlg.out, cues, totalDur, size };
}

/* ─────────────────────────── emit generated cues ────────────────────────── */

function emitGenerated(results) {
  const byId = Object.fromEntries(results.map((r) => [r.id, r]));
  const serialize = (cues) =>
    cues
      .map((c) => `  { speaker: ${JSON.stringify(c.speaker)}, startSec: ${c.startSec}, dur: ${c.dur}, text: ${JSON.stringify(c.text)} },`)
      .join("\n");

  const header = `// AUTO-GENERATED by scripts/generate-demo-audio.mjs — do not edit by hand.
// Exact cue timings measured from the stitched ElevenLabs demo MP3s so the
// transcript reveal syncs to real audio. Regenerate with:
//   node scripts/generate-demo-audio.mjs
// If the MP3s are missing at runtime, useCallPlayback falls back to a
// reading-pace timer over these same cues (transcript-only) — still animates.

import type { Cue } from "./useCallPlayback";
`;

  const body =
    `\nexport const RECEPTIONIST_CUES: Cue[] = [\n${serialize(byId.receptionist.cues)}\n];\n` +
    `\nexport const SPEEDTOLEAD_CUES: Cue[] = [\n${serialize(byId.speedtolead.cues)}\n];\n`;

  fs.writeFileSync(GEN_FILE, header + body);
  console.log(`\nWrote ${path.relative(REPO_ROOT, GEN_FILE)}`);
}

/* ─────────────────────────── quota reporting ────────────────────────────── */

async function fetchQuota(key) {
  try {
    const res = await api("/v1/user/subscription", key);
    if (!res.ok) return null;
    const s = await res.json();
    return {
      used: s.character_count,
      limit: s.character_limit,
      remaining: typeof s.character_limit === "number" ? s.character_limit - s.character_count : null,
      tier: s.tier,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────── main ───────────────────────────────────────── */

async function main() {
  const key = loadApiKey();
  console.log(`Cache dir: ${CACHE_DIR}`);
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  let voices;
  if (DRY) {
    // Dry run can't discover voices; use placeholders (cache is keyed on real ids
    // from a prior real run, so --dry only works to re-stitch, not re-cue).
    throw new Error("--dry requires a prior real run's voice ids; run without --dry first.");
  }
  const quotaBefore = await fetchQuota(key);
  voices = await resolveVoices(key);
  console.log("\nVoices resolved:");
  console.log(`  Female (AI A1/A2): ${voices.female.name}  [${voices.female.source}]`);
  console.log(`  Male   (B1/B2):    ${voices.male.name}  [${voices.male.source}]`);
  voices.notes.forEach((n) => console.log(`  - ${n}`));

  const results = [];
  for (const dlg of DIALOGUES) {
    results.push(await buildDialogue(key, dlg, voices));
  }

  emitGenerated(results);

  const quotaAfter = await fetchQuota(key);

  console.log("\n──────── REPORT ────────");
  console.log(`Female voice: ${voices.female.name} [${voices.female.source}]`);
  console.log(`Male voice:   ${voices.male.name} [${voices.male.source}]`);
  voices.notes.forEach((n) => console.log(`  note: ${n}`));
  for (const r of results) {
    console.log(`${r.out}: ${r.totalDur.toFixed(2)}s, ${(r.size / 1024).toFixed(1)} KB, ${r.cues.length} lines`);
  }
  console.log(`API TTS calls this run: ${apiCallCount}`);
  console.log(`Characters billed this run (new clips only): ${charsBilled}`);
  if (quotaBefore) console.log(`Quota before: ${quotaBefore.used}/${quotaBefore.limit} used (${quotaBefore.tier})`);
  if (quotaAfter) console.log(`Quota after:  ${quotaAfter.used}/${quotaAfter.limit} used, ~${quotaAfter.remaining} remaining`);

  // Emit machine-readable summary for the caller to parse.
  console.log("\n__RESULT_JSON__" + JSON.stringify({
    female: { name: voices.female.name, source: voices.female.source },
    male: { name: voices.male.name, source: voices.male.source },
    notes: voices.notes,
    files: results.map((r) => ({ out: r.out, dur: Number(r.totalDur.toFixed(2)), sizeKB: Number((r.size / 1024).toFixed(1)), lines: r.cues.length })),
    apiCalls: apiCallCount,
    charsBilled,
    quotaAfter,
  }));
}

main().catch((e) => {
  console.error("\nFATAL:", e.message);
  process.exit(1);
});
