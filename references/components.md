# Kit components

All components are HyperFrames sub-compositions mounted by a host `<div>` in a root. Common host
attributes: `data-composition-id`, `data-composition-src`, `data-start`, `data-duration`,
`data-track-index`, `data-track-kind`, `data-width`/`data-height` (= host box), inline `style`
for position, and `data-variable-values='{…}'`. **Always pass `"duration"` equal to `data-duration`.**

Colors come from `theme.css` (style) + `brand.css` (site colors) via tokens; never hard-code brand
colors in scenes.

## caption-rise — big on-screen copy
Words rise in with a blur-to-sharp settle, hold still, optional exit.
`text`, `split` (word|char), `accent` (green = `--accent-text`/brand, ink, blue, violet),
`size` (% of host width, 0 = auto fit), `cues` (comma seconds per word landing), `exit` (none|fade|up), `duration`.
Put every caption host on the same `data-track-index` and `data-track-kind="captions"`.

```html
<div id="cap-l1" data-composition-id="caption-rise" data-composition-src="compositions/caption-rise.html"
  data-start="0.15" data-duration="3.05" data-track-index="20" data-track-kind="captions"
  data-width="900" data-height="560" style="left:100px;top:260px;width:900px;height:560px;z-index:30;"
  data-variable-values='{"text":"Not sure about that haircut?","accent":"ink","size":11,"exit":"fade","duration":3.05}'></div>
```

## compare — before/after wipe
Before on the left as base, after wipes in from the left to `rest_split`, white round handle.
`before_src`, `after_src`, `label_a`, `label_b` (blank hides), `rest_split` (0–100), `wipe_at` (s),
`accent`, `exit`, `duration`. Style the host as the card (radius, shadow, overflow hidden).
Chain several hosts back to back (each 3–3.5s) for multiple examples; last one `exit: fade`.

## cta — end card
Logo + brand name, headline, offer chip (check mark), button, domain (mono), fine print.
`logo_src`, `brand_name`, `headline`, `chip`, `cta`, `url`, `fine`, `duration`; blank hides a line.
Landscape: full-frame host. Portrait: host at `top:288px;height:1344px` (keeps out of the 15% bands).
Copy must match SCRIPT.md whitelist (offer wording exactly as on the site).

## bg-landscape / bg-portrait — background
Canvas color + two slow brand-tinted glows (`--glow-strength` from theme). Mount at track 0 for
the whole film.

## scene-demo — starter scene
Copy per shot. Shows: `.clip` stage, `.ui-card` screenshot frame, cursor (tip offset 7,4),
`click()` ripple helper, theme-driven motion (`pv.ease("enter"|"exit"|"pop"|"move")`, `pv.d()`,
`pv.t()`, `pv.push`). Rename every id and the `window.__timelines` key.

More patterns in `examples/stylemirror/compositions/`:
- `land-l2.html` drag a photo onto an upload area, swap to the real "selected" screenshot
- `land-l3.html` click through tabs (cross-fading real screenshots), press a button
- `land-l5.html` beat-synced grid pop-in, then real page crops
- `portrait-p2.html` portrait UI walkthrough inside the safe band
- `index.html`, `portrait.html` full roots with music + 14–16 SFX hosts

## Registry
Search `npx hyperframes catalog` / `/hyperframes-registry` before hand-building a named visual.
Installed registry items go to `compositions/components/`; adapt a copy (transparent background,
`duration` variable, token colors) and consider promoting it into the kit.
