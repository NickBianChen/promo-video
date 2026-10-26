#!/usr/bin/env bash
# Register this repo as the `promo-video` skill (Claude Code + other agents) and
# install the capture dependency.
#   scripts/install.sh
set -euo pipefail
source "$(dirname "$0")/_common.sh"
for dir in "$HOME/.claude/skills" "$HOME/.agents/skills"; do
  mkdir -p "$dir"
  ln -sfn "$KIT_ROOT" "$dir/promo-video"
  echo "linked $dir/promo-video -> $KIT_ROOT"
done
(cd "$KIT_ROOT/scripts" && npm install --no-audit --no-fund >/dev/null && echo "playwright installed (run 'npx playwright install chromium' in scripts/ if no browser is cached)")
