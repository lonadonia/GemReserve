#!/usr/bin/env bash
#
# Deploy the Git-managed GemReserve custom code into a WordPress installation.
#
#   deploy/deploy.sh --target /var/www/GemReserve/wordpress [--dry-run]
#
# What it touches: wp-content/themes/gemreserve and
# wp-content/plugins/gemreserve-core, plus the two generated asset trees.
#
# What it never touches: wp-config.php, wp-salts.php, uploads, the database, or
# any plugin it did not put there. Those are runtime state and secrets; a deploy
# that can overwrite them is a deploy that can destroy a site.
#
# The generated assets — the stylesheet and 508 image derivatives — are copied
# from the Next.js tree rather than committed twice. See
# themes/gemreserve/assets/css/README.md for why.

set -Eeuo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NEXT_DIR="$(cd "${SRC_DIR}/.." && pwd)"
TARGET=""
DRY_RUN=0

usage() {
    sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit "${1:-0}"
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --target) TARGET="${2:-}"; shift 2 ;;
        --dry-run) DRY_RUN=1; shift ;;
        -h|--help) usage 0 ;;
        *) echo "Unknown argument: $1" >&2; usage 1 ;;
    esac
done

[[ -n "$TARGET" ]] || { echo "ERROR: --target is required." >&2; exit 2; }

# Refuse to write into anything that is not a WordPress installation. Without
# this a mistyped --target would scatter a theme across an unrelated directory.
[[ -f "${TARGET}/wp-load.php" ]] || {
    echo "ERROR: ${TARGET} is not a WordPress root (no wp-load.php)." >&2
    exit 2
}
WP_CONTENT="${TARGET}/wp-content"
[[ -d "$WP_CONTENT" ]] || { echo "ERROR: ${WP_CONTENT} missing." >&2; exit 2; }

RSYNC_FLAGS=(-a --delete --checksum)
[[ $DRY_RUN -eq 1 ]] && RSYNC_FLAGS+=(--dry-run --itemize-changes)

say() { printf '  %s\n' "$*"; }

echo "GemReserve WordPress deploy"
say "source:  ${SRC_DIR}"
say "target:  ${TARGET}"
say "mode:    $([[ $DRY_RUN -eq 1 ]] && echo 'DRY RUN — nothing will be written' || echo 'apply')"
echo

# --- 1. Theme and plugin -------------------------------------------------
# --delete is safe here and only here: both directories are wholly owned by
# this repository, so a file missing from source is a file that was removed.
echo "Theme and plugin"
rsync "${RSYNC_FLAGS[@]}" \
    --exclude 'assets/css/gemreserve.css' \
    --exclude 'assets/images/' \
    --exclude 'assets/brand/' \
    "${SRC_DIR}/themes/gemreserve/" "${WP_CONTENT}/themes/gemreserve/"
say "themes/gemreserve"

rsync "${RSYNC_FLAGS[@]}" \
    "${SRC_DIR}/plugins/gemreserve-core/" "${WP_CONTENT}/plugins/gemreserve-core/"
say "plugins/gemreserve-core"

if [[ -d "${SRC_DIR}/mu-plugins" ]] && [[ -n "$(ls -A "${SRC_DIR}/mu-plugins" 2>/dev/null)" ]]; then
    mkdir -p "${WP_CONTENT}/mu-plugins"
    rsync "${RSYNC_FLAGS[@]}" "${SRC_DIR}/mu-plugins/" "${WP_CONTENT}/mu-plugins/"
    say "mu-plugins"
fi

# --- 2. Generated assets -------------------------------------------------
# No --delete: these are copies of another tree, and a partial source must not
# be able to empty the theme's asset directory.
echo
echo "Generated assets (from the Next.js tree)"
CSS_SRC="${NEXT_DIR}/app/globals.css"
if [[ -f "$CSS_SRC" ]]; then
    if [[ $DRY_RUN -eq 0 ]]; then
        mkdir -p "${WP_CONTENT}/themes/gemreserve/assets/css"
        cp "$CSS_SRC" "${WP_CONTENT}/themes/gemreserve/assets/css/gemreserve.css"
    fi
    say "gemreserve.css  <- app/globals.css ($(wc -l < "$CSS_SRC") lines)"
else
    echo "ERROR: ${CSS_SRC} not found. The theme cannot render without it." >&2
    exit 3
fi

for tree in images brand; do
    ASSET_SRC="${NEXT_DIR}/public/${tree}"
    if [[ -d "$ASSET_SRC" ]]; then
        if [[ $DRY_RUN -eq 0 ]]; then
            mkdir -p "${WP_CONTENT}/themes/gemreserve/assets/${tree}"
            rsync -a "${ASSET_SRC}/" "${WP_CONTENT}/themes/gemreserve/assets/${tree}/"
        fi
        say "assets/${tree}     <- public/${tree} ($(find "$ASSET_SRC" -type f | wc -l) files)"
    else
        echo "ERROR: ${ASSET_SRC} not found." >&2
        exit 3
    fi
done

# --- 3. Permissions ------------------------------------------------------
if [[ $DRY_RUN -eq 0 ]]; then
    find "${WP_CONTENT}/themes/gemreserve" "${WP_CONTENT}/plugins/gemreserve-core" \
        -type d -exec chmod 755 {} +
    find "${WP_CONTENT}/themes/gemreserve" "${WP_CONTENT}/plugins/gemreserve-core" \
        -type f -exec chmod 644 {} +
fi

# --- 4. Verify -----------------------------------------------------------
echo
if [[ $DRY_RUN -eq 1 ]]; then
    echo "Dry run complete. Nothing was written."
    exit 0
fi

fail=0
for f in themes/gemreserve/functions.php themes/gemreserve/style.css \
         themes/gemreserve/assets/css/gemreserve.css \
         plugins/gemreserve-core/gemreserve-core.php; do
    [[ -f "${WP_CONTENT}/${f}" ]] || { echo "MISSING: ${f}" >&2; fail=1; }
done

# Every PHP file must parse. A deploy that ships a syntax error is a deploy that
# takes the site down.
while IFS= read -r php; do
    php -l "$php" >/dev/null 2>&1 || { echo "SYNTAX ERROR: ${php}" >&2; fail=1; }
done < <(find "${WP_CONTENT}/themes/gemreserve" "${WP_CONTENT}/plugins/gemreserve-core" -name '*.php')

[[ $fail -eq 0 ]] || { echo "Deploy finished with errors." >&2; exit 4; }

echo "Deploy OK. Every PHP file parses and all required files are present."
