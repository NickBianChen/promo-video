# Pitfalls (learned on real videos)

Each entry: symptom → cause → what to do. Add new ones at the bottom with the project name.

## Toolchain

- **`npx hyperframes` fails with ENOTEMPTY** → a half-written entry in `~/.npm/_npx`. Projects
  scaffolded by `new-video.sh` carry `.npmrc` with `cache=${HOME}/.cache/promo-video-npm`; for
  ad-hoc commands export `npm_config_cache` the same way. Always use the pinned version
  (`npx --yes hyperframes@<ver>` from package.json). First download into a fresh cache takes minutes.
- **`hyperframes init` is slow / hangs** → it checks skills on GitHub. `HYPERFRAMES_SKIP_SKILLS=1`
  (new-video.sh sets it). Never init over an existing folder; init in a temp dir and merge.
- **`npx hyperframes capture` times out with no output** (seen on Next.js sites) → use
  `scripts/capture.mjs` (Playwright) instead.
- **GSAP from CDN** makes renders depend on the network → the kit ships `assets/vendor/gsap.min.js`.
- **One root per project.** `index.html` is the only root; the portrait root lives at
  `compositions/portrait.html`, rendered with `render -c compositions/portrait.html`. Running
  `lint` in the project treats it as a sub-composition and warns about its audio start times;
  those warnings vanish when it's rendered as root, but check the SFX timing in the render.
- **Fonts** must be `@font-face` with paths relative to the CSS file (`../fonts/…`); names alone
  don't resolve. Check variable-font weights actually change in a snapshot.

## Components

- **Registry components with baked-in duration** exit early (text gone at 3.5s) → every kit
  component takes a `duration` variable; always pass the host's `data-duration` value.
- **Opaque component background** flashes white between stacked hosts → kit components are transparent.
- **Compare chip below 28px** fails craft `text_below_floor` on small hosts → chip has a 28px floor.
- **Text colors tied to `--ink`** inside white UI chips disappear on dark themes → UI-styled chips use
  literal dark text; brand-colored text uses `--accent-text` (themes lighten it on dark canvases).
- **Ripple visible at t=0** at the click target → set ripple `opacity: 0` in CSS and only animate it
  with `fromTo` at the click time.

## Content and screenshots

- **Local dev artifacts in screenshots**: framework dev badges, "mock mode" placeholder text,
  "Loading face analyzer…" states → `hide` selectors in capture.json, type real example input
  via `actions`, wait for loaded state, or crop to the clean part (`crops`).
- **Old logo in the repo** (`public/icon.svg` not matching the header) → rebuild from the header
  component or ask; don't ship the stale one.
- **Internal scroll areas** (long lists inside panels) clip badly in full screenshots and can overlap
  the next heading → use crops of the clean region.
- **Badges on otherwise-allowed pages can carry forbidden claims** ("No sign-up", unreleased
  "glasses" in a description) → audit text *inside* screenshots against the forbidden list, not only captions.
- **Pages listed in nav that 404 live** (pricing, tools) → never show them.

## Craft checks (`check`)

- `first_frame_empty`: frame 0 is the social thumbnail → the first scene shows its key image at t=0 (no fade-in).
- `multiple_caption_tracks`: all caption hosts on one `data-track-index`.
- End card: domain and fine print need ≥ 2s on screen; hold the last frame ≥ 1s.
- Layout "info" overlaps at crossfade seams (0.2s host overlap) are expected.

## Audio

- Library music can arrive hot (0 dBTP, clipping) → set `data-volume` (~0.8) on the music `<audio>`
  and measure the draft with `verify.mjs`: aim ≈ -14 LUFS (−16 is fine), true peak ≤ −1 dBFS.
- "royalty-free" in a catalogue description is not a verified commercial licence → record the track
  id and ask the user to confirm the licence before publishing.
- Music shorter than the film → pick another track or cut the film to the music; the portrait cut
  can simply end earlier with a fade.
