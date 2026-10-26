---
name: promo-video
description: Make or iterate a marketing/promo video for one of the user's websites with HyperFrames — scaffold the video project inside the site repo, research what is actually live, capture real UI screenshots, write script/storyboard, build landscape + portrait cuts from the shared kit (captions, before/after compare, CTA, cursor/click, themed backgrounds), mix music and SFX, check and render. Use for "给这个网站做营销视频 / 推广视频 / 宣传片", "re-make the promo with a new feature", "换一种风格重新生成视频", "update the video kit in this project".
---

# promo-video

Website promo videos from a reusable kit. The kit lives in this skill's folder
(`<skill>` below = the directory this SKILL.md is in, resolve symlinks with `readlink`/`realpath`).

```
<skill>/kit/          copied into every video project (components, base.css, motion.js, sfx, fonts)
<skill>/themes/       style presets: theme.css = canvas, ink, radius, shadow, glow, fonts, motion
<skill>/templates/    SCRIPT / DESIGN / STORYBOARD / TASKS / REVIEW + capture.json
<skill>/scripts/      new-video.sh, set-theme.sh, sync-kit.sh, capture.mjs, verify.mjs
<skill>/references/   components.md, pitfalls.md, iterate.md
<skill>/examples/stylemirror/   a finished 30s + 24s project (docs + scenes) to copy patterns from
```

## Before anything

1. HyperFrames authoring rules live in its own skills. If `/hyperframes`, `/hyperframes-cli`,
   `/hyperframes-registry`, `/media-use` are not loaded in this session, read them from
   `~/.agents/skills/<name>/SKILL.md` (they may be installed there instead of `~/.claude/skills`).
   Compositions written without them break.
2. Read `references/pitfalls.md` — each item cost real time on a previous video.
3. Decide which situation you're in:
   - **New site, first video** → full workflow below.
   - **Existing video, new feature / copy change / new style** → `references/iterate.md`.

## Hard rules (every video)

- **Only what is live.** Every on-screen claim must appear on the live site today. Diff source vs
  live: features in code but not deployed (404, feature-flagged, dev-only) never appear. Write the
  fact whitelist and the forbidden list in SCRIPT.md §4–§5 *before* building, then audit against it.
- **Real UI, untouched.** Screenshots/real images may be scaled, cropped, panned, tilted ≤ 6°.
  Never repaint text, colors or numbers; never fake a generation/progress screen, reviews or usage stats.
- **Brand from source.** Colors come from the site's CSS/tailwind theme into `brand.css`; verify
  the logo is the *current* one (old `icon.svg` files linger in repos).
- **Disclaimer visible** when results vary (AI output, examples).
- **Ask before building** (TASKS.md "待确认项"): formats and lengths, theme, music source/licence, output naming.

## Workflow (new video)

Location: `<site-repo>/marketing-video/` (next to the source, so features can be checked in code).

1. **Scaffold** — `<skill>/scripts/new-video.sh <site-repo>/marketing-video [--theme soft-light|bold-dark]`.
   Creates a checkable 10s demo (landscape `index.html`, portrait `compositions/portrait.html`),
   doc templates, `capture.json`, `.npmrc` (clean npx cache), `promo-video.json` (theme, kit rev).
   Run `npm run check` once to confirm the toolchain.
2. **Research** — read routes, i18n/copy, pricing/credits logic, feature flags; open the live site.
   Fill SCRIPT.md §1–§5. Note pages that 404 live.
3. **Capture** — edit `capture.json` (baseUrl, `hide` selectors for dev badges/toasts, shots,
   `actions` for clicks/uploads, `crops` for clean UI pieces), then
   `node <skill>/scripts/capture.mjs <project>` (needs `<skill>/scripts/install.sh` run once per machine).
   Copy real images, fonts, logo from the site's `public/`. **Look at every image you'll use**:
   dev badges, "Loading…" placeholders, mock-mode text, unreleased nav entries, overlapping layout → recapture or crop.
4. **Docs** — SCRIPT.md (copy per shot), DESIGN.md + `assets/css/brand.css`, STORYBOARD.md
   (per shot: purpose, picture, motion, transition, copy, assets, acceptance), TASKS.md.
   Get the user's OK on script + storyboard.
5. **Build** — one scene file per shot, copied from `compositions/scene-demo.html`; mount kit
   components by variables (`references/components.md`). Landscape and portrait are separate
   designs (portrait uses mobile screenshots, shorter copy, nothing in top/bottom 15%).
   After each scene: `npm run check`, `npx hyperframes snapshot --at …`, look at the PNGs.
6. **Audio** — music via `/media-use` (record track id + licence in TASKS.md), `npx hyperframes beats . --json`,
   put scene cuts on beats; SFX from `assets/sfx` on clicks, wipes, pops, CTA (volume 0.4–0.5);
   set `data-volume` on music so the mix doesn't clip.
7. **Review** — `npm run check` (0 errors), `snapshot --review`, audit every frame against
   SCRIPT.md whitelist + forbidden list, write REVIEW.md. Draft render (`--quality draft`) for the user.
8. **Render + verify** — `npm run render -- -o output/<site>-<variant>-landscape-<N>s.mp4`,
   `npx hyperframes render -c compositions/portrait.html -o output/<site>-<variant>-portrait-<N>s.mp4`, then
   `node <skill>/scripts/verify.mjs <mp4> --expect 1920x1080@30:<N> --frames 6` (per format) and look at the stills.
   Commit the project and tag the version (`git tag video/<variant>`).

Keep TASKS.md current as you go (`[x]`, findings, what's left) — it's how the next session resumes.

## When the kit itself should change

A fix or improvement to a kit component, theme or script found while making a video belongs in
this repo, not only in the project: edit `<skill>/kit/...`, verify with a fresh scaffold
(`new-video.sh /tmp/x && cd /tmp/x && npm run check`) on both themes, commit, push. Other projects
pick it up with `sync-kit.sh <project>` (dry run) → `--apply`. Add new lessons to `references/pitfalls.md`.
