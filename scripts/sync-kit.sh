#!/usr/bin/env bash
# Pull kit component updates into an existing project. Dry run by default.
#   scripts/sync-kit.sh <project-dir> [--apply]
set -euo pipefail
source "$(dirname "$0")/_common.sh"
project="${1:-}"; apply="${2:-}"
[ -f "$project/index.html" ] || die "usage: sync-kit.sh <project-dir> [--apply]"
changed=0
for f in "${KIT_OWNED[@]}"; do
  src="$KIT_ROOT/kit/$f" dst="$project/$f"
  if [ ! -e "$dst" ]; then
    echo "new      $f"; changed=1
  elif ! cmp -s "$src" "$dst"; then
    echo "changed  $f"; changed=1
  else
    continue
  fi
  if [ "$apply" = "--apply" ]; then mkdir -p "$(dirname "$dst")"; cp "$src" "$dst"; fi
done
[ $changed -eq 1 ] || { echo "project is up to date with the kit"; exit 0; }
if [ "$apply" = "--apply" ]; then
  echo "applied. Run check + snapshot: local edits to these files were overwritten (see git diff)."
else
  echo "dry run. Re-run with --apply to copy (commit the project first so git diff shows the change)."
fi
