#!/usr/bin/env node
// Verify rendered MP4s before delivery: format, loudness, black frames.
//   node scripts/verify.mjs <file.mp4>... [--expect 1920x1080@30:30] [--frames 6]
// --expect WxH@FPS:SECONDS applies to every file given (run once per format).
// --frames N extracts N evenly spaced stills next to the video for a visual pass.
// Exits 1 when a check fails.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const expect = opt("expect");
const frames = Number(opt("frames") ?? 0);
const files = args;
if (files.length === 0) {
  console.error("usage: verify.mjs <file.mp4>... [--expect 1920x1080@30:30] [--frames 6]");
  process.exit(2);
}

const TARGET_LUFS = -14; // common social target
const MAX_TRUE_PEAK = -1; // dBTP

let failed = false;
for (const file of files) {
  const problems = [];
  const probe = JSON.parse(
    execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", file], { encoding: "utf8" }),
  );
  const video = probe.streams.find((s) => s.codec_type === "video");
  const audio = probe.streams.find((s) => s.codec_type === "audio");
  const [num, den] = video.avg_frame_rate.split("/").map(Number);
  const fps = Math.round((num / den) * 100) / 100;
  const duration = Number(probe.format.duration);

  if (expect) {
    const m = expect.match(/^(\d+)x(\d+)@([\d.]+):([\d.]+)$/);
    if (!m) throw new Error(`bad --expect: ${expect}`);
    const [, w, h, f, d] = m.map(Number);
    if (video.width !== w || video.height !== h) problems.push(`size ${video.width}x${video.height}, expected ${w}x${h}`);
    if (Math.abs(fps - f) > 0.01) problems.push(`fps ${fps}, expected ${f}`);
    if (Math.abs(duration - d) > 0.1) problems.push(`duration ${duration.toFixed(2)}s, expected ${d}s`);
  }
  if (!audio) problems.push("no audio stream");

  // loudness (EBU R128) + true peak
  let lufs = null, peak = null;
  if (audio) {
    const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" });
    const summary = r.stderr.slice(r.stderr.lastIndexOf("Summary:"));
    lufs = Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]);
    peak = Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
    if (peak > MAX_TRUE_PEAK) problems.push(`true peak ${peak} dBFS > ${MAX_TRUE_PEAK} (clipping risk)`);
  }

  // black frames (≥0.1s)
  const b = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-vf", "blackdetect=d=0.1:pix_th=0.10", "-an", "-f", "null", "-"], { encoding: "utf8" });
  const blacks = [...b.stderr.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => `${m[1]}–${m[2]}s`);
  if (blacks.length) problems.push(`black frames at ${blacks.join(", ")}`);

  console.log(`\n${path.basename(file)}`);
  console.log(`  video  ${video.codec_name} ${video.width}x${video.height} @ ${fps}fps, ${duration.toFixed(2)}s`);
  console.log(`  audio  ${audio ? `${audio.codec_name} ${audio.sample_rate}Hz` : "none"}`);
  if (lufs !== null) {
    const gap = (lufs - TARGET_LUFS).toFixed(1);
    console.log(`  loud   ${lufs} LUFS (${gap >= 0 ? "+" : ""}${gap} vs ${TARGET_LUFS}), true peak ${peak} dBFS`);
  }
  console.log(`  black  ${blacks.length ? blacks.join(", ") : "none"}`);

  if (frames > 0) {
    const dir = path.join(path.dirname(file), "frames", path.basename(file, path.extname(file)));
    mkdirSync(dir, { recursive: true });
    for (let i = 0; i < frames; i++) {
      const t = ((i + 0.5) * duration) / frames;
      execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", t.toFixed(2), "-i", file, "-frames:v", "1", path.join(dir, `${String(i + 1).padStart(2, "0")}-${t.toFixed(1)}s.png`)]);
    }
    console.log(`  stills ${frames} -> ${dir}`);
  }

  if (problems.length) {
    failed = true;
    for (const p of problems) console.log(`  FAIL   ${p}`);
  } else {
    console.log("  OK");
  }
}
process.exit(failed ? 1 : 0);
