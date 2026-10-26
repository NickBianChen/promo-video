#!/usr/bin/env bash
# Scaffold a promo-video project: HyperFrames init + kit components + theme + doc templates.
#   scripts/new-video.sh <target-dir> [--theme soft-light] [--name my-site]
set -euo pipefail
source "$(dirname "$0")/_common.sh"

target="" theme="soft-light" name=""
while [ $# -gt 0 ]; do
  case "$1" in
    --theme) theme="$2"; shift 2 ;;
    --name) name="$2"; shift 2 ;;
    -h|--help) sed -n 2,3p "$0"; exit 0 ;;
    *) [ -z "$target" ] || die "unexpected argument: $1"; target="$1"; shift ;;
  esac
done
[ -n "$target" ] || die "usage: new-video.sh <target-dir> [--theme name] [--name site]"
[ -f "$KIT_ROOT/themes/$theme/theme.css" ] || die "unknown theme '$theme' (have: $(ls "$KIT_ROOT/themes" | tr '\n' ' '))"
[ ! -e "$target/index.html" ] || die "$target already has an index.html; refusing to overwrite"
mkdir -p "$target"
target="$(cd "$target" && pwd)"
name="${name:-$(basename "$(dirname "$target")")}"

# 1. HyperFrames scaffold in a temp dir, merged without touching existing files
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
if HYPERFRAMES_SKIP_SKILLS=1 hf init "$tmp/p" --non-interactive --skill=hyperframes >"$tmp/init.log" 2>&1; then
  (cd "$tmp/p" && find . -type f ! -name index.html ! -path './compositions/*' ! -path './assets/*') | while read -r f; do
    [ -e "$target/$f" ] || { mkdir -p "$target/$(dirname "$f")"; cp "$tmp/p/$f" "$target/$f"; }
  done
else
  echo "warning: hyperframes init failed (log below); using bundled project files" >&2
  tail -20 "$tmp/init.log" >&2
fi
for f in package.json hyperframes.json; do
  [ -e "$target/$f" ] || sed "s/__HF_VERSION__/$HF_VERSION/g; s/__NAME__/$name-video/g" "$KIT_ROOT/templates/project/$f" >"$target/$f"
done

for f in package.json meta.json; do
  [ -f "$target/$f" ] && sed -i.bak -E 's/"(name|id)": "p"/"\1": "'"$name"'-video"/' "$target/$f" && rm -f "$target/$f.bak"
done

# 2. kit, theme, docs
cp -R "$KIT_ROOT/kit/." "$target/"
cp "$KIT_ROOT/themes/$theme/theme.css" "$target/assets/css/theme.css"
for f in "$KIT_ROOT"/templates/docs/*; do
  [ -e "$target/$(basename "$f")" ] || cp "$f" "$target/"
done
[ -e "$target/capture.json" ] || cp "$KIT_ROOT/templates/capture.json" "$target/capture.json"
mkdir -p "$target/assets/website" "$target/output"

# 3. npm cache (npm run check/render use it too), git hygiene, provenance
[ -e "$target/.npmrc" ] || echo 'cache=${HOME}/.cache/promo-video-npm' >"$target/.npmrc"
touch "$target/.gitignore"
for line in "output/" ".hyperframes/" "node_modules/" ".DS_Store"; do
  grep -qxF "$line" "$target/.gitignore" || echo "$line" >>"$target/.gitignore"
done
kit_rev="$(git -C "$KIT_ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
cat >"$target/promo-video.json" <<JSON
{
  "site": "$name",
  "theme": "$theme",
  "kit": "$kit_rev",
  "hyperframes": "$HF_VERSION",
  "created": "$(date +%Y-%m-%d)"
}
JSON

echo "scaffolded $target (theme: $theme, kit: $kit_rev)"
echo "next: fill brand.css + capture.json, then: (cd \"$target\" && npm run check)"
