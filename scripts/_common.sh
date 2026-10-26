# shared by the promo-video shell scripts
KIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HF_VERSION="${HF_VERSION:-0.8.186}"
# a half-written ~/.npm/_npx entry makes plain `npx hyperframes` fail with
# ENOTEMPTY; a dedicated cache sidesteps it
export npm_config_cache="${PROMO_NPM_CACHE:-$HOME/.cache/promo-video-npm}"
hf() { npx --yes "hyperframes@$HF_VERSION" "$@"; }
die() { echo "error: $*" >&2; exit 1; }
# files the kit owns: sync-kit.sh may overwrite these in a project.
# Everything else (roots, scenes, brand, theme choice) belongs to the project.
KIT_OWNED=(
  compositions/bg-landscape.html
  compositions/bg-portrait.html
  compositions/caption-rise.html
  compositions/compare.html
  compositions/cta.html
  assets/css/base.css
  assets/js/motion.js
  assets/vendor/gsap.min.js
  assets/sfx/CREDITS.md
  assets/sfx/chime.mp3
  assets/sfx/click.mp3
  assets/sfx/pop.mp3
  assets/sfx/whoosh-short.mp3
)
