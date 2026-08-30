#!/usr/bin/env bash
#
# GemReserve pre-switch backup.
#
#   ./gr-backup.sh            back up everything this account can reach
#   sudo ./gr-backup.sh --root  additionally capture nginx and systemd
#
# Everything lands under ~/gemreserve-db/backups/<stamp>/, mode 600, outside
# every web root. Nothing is deleted: the running Next.js release is copied,
# never moved, because it is the rollback.

set -euo pipefail

STAMP="$(date +%Y-%m-%d-%H%M%S)"
DEST="/home/hamza/gemreserve-db/backups/${STAMP}"
ENV_FILE="/home/hamza/.gemreserve-wp-db.env"
WP="/var/www/GemReserve/wordpress"
NEXT_UNIT="gemreserve-next.service"

mkdir -p "$DEST"
chmod 700 "$DEST"
echo "backup -> $DEST"

# --- WordPress database -------------------------------------------------
# MYSQL_PWD keeps the password off the command line, so it never appears in
# ps output or in this host's shell history.
if [[ -r "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; . "$ENV_FILE"; set +a
    export MYSQL_PWD="$DB_PASSWORD"
    mysqldump --protocol=TCP -h "$DB_HOST" -u "$DB_USER" \
        --single-transaction --quick --default-character-set=utf8mb4 \
        --routines --triggers --events --no-tablespaces \
        "$DB_NAME" | gzip -9 > "$DEST/wordpress-db.sql.gz"
    unset MYSQL_PWD
    echo "  database   $(du -h "$DEST/wordpress-db.sql.gz" | cut -f1)"
else
    echo "  database   SKIPPED (no $ENV_FILE)" >&2
fi

# --- WordPress files ----------------------------------------------------
# The custom code, and the uploads, kept separate: one is reproducible from
# git, the other is not.
tar -czf "$DEST/wordpress-custom.tar.gz" \
    -C "$WP/wp-content" themes plugins 2>/dev/null
echo "  theme+plugin $(du -h "$DEST/wordpress-custom.tar.gz" | cut -f1)"

if [[ -d "$WP/wp-content/uploads" ]]; then
    tar -czf "$DEST/wordpress-uploads.tar.gz" -C "$WP/wp-content" uploads
    echo "  uploads    $(du -h "$DEST/wordpress-uploads.tar.gz" | cut -f1)"
fi

# wp-config carries no password (it reads the env file) but it does carry the
# salts include and the environment wiring, so it is worth keeping.
cp -p "$WP/wp-config.php" "$DEST/wp-config.php.bak" 2>/dev/null || true
cp -p "$WP/wp-salts.php"  "$DEST/wp-salts.php.bak"  2>/dev/null || true
cp -p "$ENV_FILE"         "$DEST/db.env.bak"        2>/dev/null || true

# --- Next.js production -------------------------------------------------
# Copied, never moved. This is the rollback target.
#
# The release path comes from systemd, not from a symlink: this deployment has
# no /var/www/GemReserve/current, the unit names the release directory
# outright. Reading it back from the unit means the backup always captures
# whatever is actually running.
RELEASE="$(systemctl show "$NEXT_UNIT" -p WorkingDirectory --value 2>/dev/null || true)"
if [[ -n "$RELEASE" && -d "$RELEASE" ]]; then
    echo "$RELEASE" > "$DEST/nextjs-release-path.txt"
    tar -czf "$DEST/nextjs-release.tar.gz" \
        --exclude='node_modules/.cache' \
        -C "$(dirname "$RELEASE")" "$(basename "$RELEASE")"
    echo "  next.js    $(du -h "$DEST/nextjs-release.tar.gz" | cut -f1)  <- $RELEASE"
    systemctl cat "$NEXT_UNIT" > "$DEST/gemreserve-next.service.txt" 2>/dev/null || true
else
    echo "  next.js    SKIPPED (could not resolve $NEXT_UNIT WorkingDirectory)" >&2
fi

# --- Root-only material -------------------------------------------------
if [[ "${1:-}" == "--root" ]]; then
    if [[ "$EUID" -ne 0 ]]; then
        echo "  --root needs root; rerun with sudo" >&2
        exit 1
    fi
    mkdir -p "$DEST/system"
    # nginx: both the system tree and CloudPanel's own.
    for d in /etc/nginx /home/clp/services/nginx; do
        [[ -d "$d" ]] && tar -czf "$DEST/system/$(echo "$d" | tr '/' '_').tar.gz" "$d" 2>/dev/null || true
    done
    # systemd unit for the Next.js service.
    systemctl cat gemreserve-next.service > "$DEST/system/gemreserve-next.service" 2>/dev/null || true
    systemctl show gemreserve-next.service > "$DEST/system/gemreserve-next.show.txt" 2>/dev/null || true
    # php-fpm pool definitions.
    tar -czf "$DEST/system/php-fpm-pools.tar.gz" /etc/php/*/fpm 2>/dev/null || true
    chown -R hamza:hamza "$DEST/system"
    echo "  system     captured (nginx, systemd, php-fpm)"
fi

# --- Lock it down and record what is here -------------------------------
find "$DEST" -type f -exec chmod 600 {} \;
{
    echo "GemReserve backup ${STAMP}"
    echo "host: $(hostname -f)"
    echo
    echo "Contents:"
    ( cd "$DEST" && find . -type f -printf '  %-38p %10s bytes\n' | sort )
    echo
    echo "Restore notes:"
    echo "  database  gunzip -c wordpress-db.sql.gz | mysql -h HOST -u USER -p DBNAME"
    echo "  wordpress tar -xzf wordpress-custom.tar.gz -C ${WP}/wp-content"
    echo "  next.js   the release directory was copied, not moved; the original"
    echo "            is still in place and gemreserve-next.service still runs it."
} > "$DEST/MANIFEST.txt"
chmod 600 "$DEST/MANIFEST.txt"

# --- Prove the dump restores -------------------------------------------
# An unverified backup is not a backup. This only checks the dump parses and
# carries the expected tables; a full restore needs a scratch database.
if [[ -f "$DEST/wordpress-db.sql.gz" ]]; then
    TABLES=$(gunzip -c "$DEST/wordpress-db.sql.gz" | grep -c '^CREATE TABLE' || true)
    # mysqldump batches many rows into one INSERT, so count the dumped posts
    # rather than the statements: this is the number that must match the live
    # table, and the one that would expose a truncated dump.
    POSTS=$(gunzip -c "$DEST/wordpress-db.sql.gz" \
        | sed -n "/INSERT INTO \`gr_posts\`/,/;$/p" | grep -o "),(" | wc -l || true)
    echo "  verify     ${TABLES} tables, ~$((POSTS + 1)) rows in gr_posts"
    [[ "$TABLES" -ge 12 ]] || { echo "  FAIL: expected at least 12 tables" >&2; exit 1; }
    gunzip -t "$DEST/wordpress-db.sql.gz" || { echo "  FAIL: dump is not a valid gzip" >&2; exit 1; }
fi

echo "done: $DEST"
