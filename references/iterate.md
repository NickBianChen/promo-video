# Iterating an existing video

Video projects are git-tracked (inside the site repo). Every delivered cut is a commit + tag
`video/<variant>`, and outputs are named `<site>-<variant>-<landscape|portrait>-<N>s.mp4`.

Start by reading the project's TASKS.md, REVIEW.md and `promo-video.json` (theme, kit revision).

## New feature shipped / copy changed
1. Re-check the live site; update SCRIPT.md whitelist/forbidden list (a feature may now be allowed).
2. Recapture only affected shots: `capture.mjs <project> --only name1,name2`.
3. Update STORYBOARD.md for the touched shots, then the scenes. Keep cut points on beats; if a shot
   grows, shift later `data-start` values and SFX together.
4. Steps 7–8 of the main workflow (check, review, render, verify), new tag.

## New style, same story
1. `git switch -c video/<style>` (or commit first).
2. `<skill>/scripts/set-theme.sh <project> <theme>` — swaps `assets/css/theme.css`.
   Scenes use tokens and `pv.*`, so colors, radii, shadows, glow and easing follow.
3. `npm run check` — contrast changes with the canvas; fix in the theme (e.g. `--accent-text`), not per scene.
4. Snapshot every scene: hard-coded values in scenes (positions tuned for a shadow, cursor color
   on dark) may need touch-ups. Music/SFX may change with the mood (`/media-use`).
5. Render with the style in the output name.

## A new theme
Copy `themes/soft-light/` to `themes/<name>/`, change tokens (canvas, ink, muted-ink, border,
radius, shadow, `--accent-text`, `--glow-strength`, `--motion-*`; fonts via `@font-face` with files
in `kit/assets/fonts/`). Validate on a fresh scaffold: `new-video.sh /tmp/t --theme <name>`,
`npm run check` → 0 errors/warnings, snapshot. Commit to the skill repo.

## New story / structure
Different hook, order or length → new branch, rewrite SCRIPT/STORYBOARD, keep reusable scenes.
For an alternative cut that ships alongside the main one, add another root under `compositions/`
(e.g. `compositions/short-15s.html`) and render it with `-c`.

## Kit updates
`<skill>/scripts/sync-kit.sh <project>` lists kit-owned files that differ; `--apply` copies them.
Commit the project first, review `git diff`, re-run check. Project-owned files (roots, scenes,
brand.css, theme choice) are never touched.
