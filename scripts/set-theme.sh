#!/usr/bin/env bash
# Switch a project's style: copies themes/<name>/theme.css over assets/css/theme.css.
#   scripts/set-theme.sh <project-dir> <theme>
set -euo pipefail
source "$(dirname "$0")/_common.sh"
[ $# -eq 2 ] || die "usage: set-theme.sh <project-dir> <theme> (have: $(ls "$KIT_ROOT/themes" | tr '\n' ' '))"
project="$1" theme="$2"
[ -f "$KIT_ROOT/themes/$theme/theme.css" ] || die "unknown theme '$theme'"
[ -f "$project/index.html" ] || die "$project is not a video project"
cp "$KIT_ROOT/themes/$theme/theme.css" "$project/assets/css/theme.css"
if [ -f "$project/promo-video.json" ]; then
  sed -i.bak "s/\"theme\": \"[^\"]*\"/\"theme\": \"$theme\"/" "$project/promo-video.json" && rm -f "$project/promo-video.json.bak"
fi
echo "theme -> $theme. Re-run check and review frames: contrast and glow change with the theme."
