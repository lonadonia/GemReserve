#!/usr/bin/env bash
#
# Apply the production ownership model to the WordPress tree.
#
#   sudo ./gr-permissions.sh [--dry-run] [/path/to/wordpress]
#
# The model, and why it is not `chown -R www-data`:
#
#   php-fpm runs as www-data. If www-data owns the tree, then any bug that
#   reaches PHP file writes — a plugin flaw, an upload handler, a deserialisation
#   bug — can rewrite WordPress core, the theme or the plugin, and the change
#   survives every restart because it is now the source. Giving the runtime user
#   write access to the code it executes removes the single most useful boundary
#   in a PHP deployment.
#
#   So the code is owned by the deploy user and only READ by the runtime user:
#
#     code            hamza:www-data   dirs 755, files 644   (www-data: read)
#     wp-config.php   root:www-data    640                   (www-data: read)
#     wp-salts.php    root:www-data    640                   (www-data: read)
#     uploads/        www-data:www-data dirs 755, files 644  (www-data: write)
#     secrets         outside the web root entirely
#
#   uploads/ is the one place php-fpm can write, which is why the vhost refuses
#   to execute anything ending in .php underneath it. The two halves only work
#   together.
#
# Operational consequence, worth knowing before you hit it: wp-config.php is
# root:www-data 640, so the deploy user cannot read it, and `wp` run as that
# user will fail with a database error. On production run wp-cli as the web
# user instead:
#
#     sudo -u www-data wp --path=/var/www/GemReserve/wordpress <command>
#
# which is also what keeps anything wp-cli creates owned correctly.

set -euo pipefail

DRY=0
TARGET=/var/www/GemReserve/wordpress
for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY=1 ;;
        /*) TARGET="$arg" ;;
        *) echo "unknown argument: $arg" >&2; exit 2 ;;
    esac
done

CODE_USER=hamza
WEB_USER=www-data

# Refuse to touch a directory that is not a WordPress install. A typo in the
# path would otherwise chown something unrelated.
if [[ ! -f "$TARGET/wp-load.php" ]]; then
    echo "Not a WordPress install: $TARGET (no wp-load.php)" >&2
    exit 1
fi
if ! id "$WEB_USER" >/dev/null 2>&1; then
    echo "No such user: $WEB_USER" >&2
    exit 1
fi
if ! id "$CODE_USER" >/dev/null 2>&1; then
    echo "No such user: $CODE_USER" >&2
    exit 1
fi
if [[ "$DRY" -eq 0 && "$EUID" -ne 0 ]]; then
    echo "Needs root (it sets root-owned config files). Re-run with sudo, or pass --dry-run." >&2
    exit 1
fi

run() {
    if [[ "$DRY" -eq 1 ]]; then
        printf '  would: %s\n' "$*"
    else
        "$@"
    fi
}

echo "target: $TARGET"

# 1. The code. Deploy user owns it; web user reads it through the group.
run chown -R "$CODE_USER:$WEB_USER" "$TARGET"
if [[ "$DRY" -eq 1 ]]; then
    echo "  would: chmod 755 on every directory, 644 on every file"
else
    find "$TARGET" -type d -exec chmod 755 {} +
    find "$TARGET" -type f -exec chmod 644 {} +
fi

# 2. Uploads. The one writable directory, owned by the runtime user.
if [[ -d "$TARGET/wp-content/uploads" ]]; then
    run chown -R "$WEB_USER:$WEB_USER" "$TARGET/wp-content/uploads"
    if [[ "$DRY" -eq 1 ]]; then
        echo "  would: chmod 755 dirs / 644 files under wp-content/uploads"
    else
        find "$TARGET/wp-content/uploads" -type d -exec chmod 755 {} +
        find "$TARGET/wp-content/uploads" -type f -exec chmod 644 {} +
    fi
else
    run mkdir -p "$TARGET/wp-content/uploads"
    run chown "$WEB_USER:$WEB_USER" "$TARGET/wp-content/uploads"
    run chmod 755 "$TARGET/wp-content/uploads"
fi

# 3. Config. Root writes, web user reads, nobody else sees it.
for f in wp-config.php wp-salts.php; do
    if [[ -f "$TARGET/$f" ]]; then
        run chown "root:$WEB_USER" "$TARGET/$f"
        run chmod 640 "$TARGET/$f"
    fi
done

# 4. Nothing that is not a WordPress entry point should be executable content
#    in the web root. The vhost denies these too; this is the second layer.
for f in router.php; do
    [[ -f "$TARGET/$f" ]] && run rm -f "$TARGET/$f"
done

# 5. Report, so the result is checked rather than assumed.
echo
echo "resulting state:"
for p in "" wp-config.php wp-salts.php wp-content/uploads wp-content/themes/gemreserve index.php; do
    t="$TARGET${p:+/$p}"
    [[ -e "$t" ]] && stat -c '  %U:%G %a  %n' "$t"
done

echo
echo "checks:"
if [[ "$DRY" -eq 0 ]]; then
    # The property that matters: can the runtime user write to the code?
    if sudo -u "$WEB_USER" test -w "$TARGET/index.php"; then
        echo "  FAIL  $WEB_USER can write $TARGET/index.php"
        exit 1
    fi
    echo "  ok    $WEB_USER cannot write WordPress core"
    if ! sudo -u "$WEB_USER" test -r "$TARGET/wp-config.php"; then
        echo "  FAIL  $WEB_USER cannot read wp-config.php — the site will not boot"
        exit 1
    fi
    echo "  ok    $WEB_USER can read wp-config.php"
    if ! sudo -u "$WEB_USER" test -w "$TARGET/wp-content/uploads"; then
        echo "  FAIL  $WEB_USER cannot write uploads — media uploads will fail"
        exit 1
    fi
    echo "  ok    $WEB_USER can write uploads"
fi
echo "done."
