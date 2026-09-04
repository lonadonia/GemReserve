#!/usr/bin/env bash
#
# Fail if anything that looks like a backup, a source copy or an editor
# leftover is sitting inside the public document root.
#
# This exists because of a real incident. A deployment kept each replaced file
# beside its target as `<file>.gr-orig-<stamp>` so that rollback would be a
# rename. The vhost denies `wp-content/**/*.php`, but that rule matches paths
# *ending* in `.php` — and `page.php.gr-orig-20260904T002751Z` does not. Six
# theme and plugin source files were served as plain text for 74 minutes.
#
# The lesson is not "add more suffixes to the vhost". Suffix lists lose: `~`,
# `.save`, `.tmp` and `.php.<anything>` were all uncovered, and the next one
# will be something nobody listed. The rule that holds is that a backup never
# goes inside the document root at all, and this asserts it.
#
# Usage:  assert-no-webroot-backups.sh [document-root]
# Exit:   0 clean, 1 artefacts found.
set -Eeuo pipefail

ROOT="${1:-/var/www/GemReserve/wordpress}"
[[ -d "$ROOT" ]] || { echo "not a directory: $ROOT" >&2; exit 2; }

# Third-party plugins legitimately ship fixtures with these names; scanning them
# produces noise that trains people to ignore the check. Ours is the code we
# deploy, so that is what is asserted.
PRUNE=(-path "$ROOT/wp-content/plugins/redirection" -prune -o)

# wp-content/uploads is where WordPress legitimately stores what people upload,
# including plugin installers. An archive there is a user's file, not a
# deployment artefact, and the vhost already refuses it — verified returning 403
# for gemreserve-ai-center.zip. Source-copy names are still caught there,
# because a stray .php.bak in uploads would be as dangerous as anywhere else;
# only the plain archive extensions are exempted.
UPLOADS="$ROOT/wp-content/uploads"

mapfile -t hits < <(
    find "$ROOT" "${PRUNE[@]}" \( \
         -name '*.gr-orig*' -o -name '*.bak' -o -name '*.backup' -o -name '*.orig' \
      -o -name '*.old' -o -name '*.save' -o -name '*~' -o -name '*.swp' -o -name '*.swo' \
      -o -name '*.tmp' -o -name '*.temp' -o -name '*.patch' -o -name '*.rej' -o -name '*.diff' \
      -o -name '*.copy' \
    \) -print 2>/dev/null
    # Archives: everywhere except uploads, for the reason above.
    find "$ROOT" "${PRUNE[@]}" -path "$UPLOADS" -prune -o \( \
         -name '*.sql' -o -name '*.sql.gz' -o -name '*.tar' -o -name '*.tar.gz' \
      -o -name '*.tgz' -o -name '*.zip' \
    \) -print 2>/dev/null
    # The shape that defeated the vhost: a real extension followed by anything.
    find "$ROOT" "${PRUNE[@]}" -regextype posix-extended \
         -regex '.*\.(php|inc|env|json|ya?ml)\.[A-Za-z0-9_.-]+$' -print 2>/dev/null
    # Both passes can match the same path; report it once.
) ; mapfile -t hits < <(printf '%s\n' "${hits[@]}" | sort -u | sed '/^$/d')

if ((${#hits[@]})); then
    echo "FAIL: backup or source-copy artefacts inside the document root:" >&2
    printf '  %s\n' "${hits[@]}" >&2
    echo >&2
    echo "Move them outside ${ROOT}. A file the web server can reach is a file it can serve." >&2
    exit 1
fi

echo "OK: no backup or source-copy artefacts under ${ROOT}"
