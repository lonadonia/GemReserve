#!/usr/bin/env bash
#
# Build the deployment package for the visual CMS remediation.
#
# The package is built *from committed source only* — the script refuses to run
# on a dirty tree — so that what ships can be reproduced from a commit hash by
# anyone, later, without this machine. §28 asks for reproducibility, and a
# package assembled from a working directory is reproducible only by whoever
# happened to be sitting at it.
#
# It builds. It does not deploy. Nothing here touches a running site, restarts a
# service, or connects to production. Deployment is a separate, authorised act —
# see CMS_DEPLOYMENT_READINESS.md.
#
# Usage:  wordpress/deploy/build-cms-package.sh [output-dir]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT_ROOT="${1:-$REPO_ROOT/dist}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
PKG="$OUT_ROOT/gemreserve-cms-$STAMP"

cd "$REPO_ROOT"

# ---------------------------------------------------------------- provenance
COMMIT="$(git rev-parse HEAD)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

DIRTY="$(git status --porcelain -- wordpress lib components app qa/cms | grep -v '^??' || true)"
if [ -n "$DIRTY" ]; then
	echo "Refusing to build: tracked files are modified." >&2
	echo "The package must be reproducible from a commit, so commit or stash first." >&2
	echo "$DIRTY" >&2
	exit 1
fi

echo "Building from $BRANCH @ ${COMMIT:0:12}"
mkdir -p "$PKG"/{wordpress,renderer,docs}

# ---------------------------------------------------------------- artefacts
# `git archive` rather than `cp`: it takes what is committed, not what is on
# disk, which is the whole point.
git archive "$COMMIT" wordpress/plugins/gemreserve-visual-cms \
	| tar -x -C "$PKG/wordpress" --strip-components=2
git archive "$COMMIT" wordpress/plugins/gemreserve-core \
	| tar -x -C "$PKG/wordpress" --strip-components=2
git archive "$COMMIT" wordpress/themes/gemreserve \
	| tar -x -C "$PKG/wordpress" --strip-components=1

git archive "$COMMIT" lib/cms components/cms app/api app/cms | tar -x -C "$PKG/renderer"
git archive "$COMMIT" qa/cms | tar -x -C "$PKG/renderer"

git archive "$COMMIT" docs/phase-2/cms-remediation | tar -x -C "$PKG/docs" --strip-components=3

# The theme's stylesheet is generated from the Next.js source and is not
# committed (see themes/gemreserve/assets/css/README.md). Say so rather than
# ship a package that looks complete and renders unstyled.
cat > "$PKG/wordpress/gemreserve/assets/css/MISSING.txt" <<'NOTE'
gemreserve.css is NOT in this package.

It is a byte-for-byte copy of the Next.js build's app/globals.css and is
deliberately not committed — two copies of one 434 KB file in one repository is
a divergence waiting to happen.

wordpress/deploy/deploy.sh copies it in, along with the image derivatives under
public/. Run that, or copy it by hand, before serving this theme. Without it the
site renders unstyled.
NOTE

# ---------------------------------------------------------------- checksums
( cd "$PKG" && find . -type f ! -name SHA256SUMS -print0 \
	| sort -z | xargs -0 sha256sum > SHA256SUMS )

# ---------------------------------------------------------------- manifest
cat > "$PKG/MANIFEST.md" <<MANIFEST
# GemReserve Visual CMS — deployment package

    built     $STAMP
    branch    $BRANCH
    commit    $COMMIT
    files     $(find "$PKG" -type f | wc -l)

Built from committed source with \`git archive\`. Verify with:

    sha256sum -c SHA256SUMS

## Contents

    wordpress/gemreserve-visual-cms/   the CMS plugin
    wordpress/gemreserve-core/         the content model, with the settings
                                       capability fix
    wordpress/gemreserve/              the theme, with the block-rendering branch
    renderer/lib/cms/                  typed client and validators
    renderer/components/cms/           block renderer and preview banner
    renderer/app/api/                  preview, exit-preview, revalidate
    renderer/app/cms/                  the CMS-driven route
    renderer/qa/cms/                   acceptance, parity and visual suites
    docs/                              every document for this remediation

## Not included, and why

    gemreserve.css     generated from the Next.js source; see
                       wordpress/gemreserve/assets/css/MISSING.txt
    uploads/           site content, not code
    .env / secrets     never packaged; see ENVIRONMENT.md below
    node_modules/      install from the committed lockfile

## Deployment order

Each step is reversible on its own, and each is verifiable before the next.

1. Back up and **verify** the backup (CMS_BACKUP_AND_ROLLBACK.md §1).
2. Capture the pre-deployment route baseline.
3. Install the theme and both plugins. Do not activate the CMS plugin yet.
4. Copy in gemreserve.css.
5. Activate gemreserve-visual-cms. Nothing changes yet: activation does not
   migrate, and un-migrated pages still render from the legacy body.
6. Run \`wp gemreserve migrate\` — the dry run. Read every row.
7. Run \`wp gemreserve migrate --apply\` only if every row reads identical=yes.
8. Compare all 58 routes against the baseline. Expect 58/58.
9. Deploy the renderer only if the Next.js cutover is separately authorised.

## Rollback triggers

Roll back immediately on any non-200 route, visibly wrong markup, missing
content, an editor that will not load, or an unintended SEO change.

The first lever is \`wp plugin deactivate gemreserve-visual-cms\`, which restores
the previous rendering with no database change.

## Environment

    # WordPress — constants in wp-config.php, never options.
    GEMRESERVE_RENDERER_URL       https://renderer.example
    GEMRESERVE_REVALIDATE_URL     https://renderer.example/api/revalidate
    GEMRESERVE_REVALIDATE_SECRET  <32+ random bytes, hex>

    # Renderer — unprefixed, so they stay server-side.
    GEMRESERVE_CMS_URL            https://www.gemreserve.io
    GEMRESERVE_REVALIDATE_SECRET  <the same value>

No secret is included in this package. Generate the shared secret with
\`openssl rand -hex 32\` and confirm both sides agree before relying on it:

    POST /wp-json/gemreserve/v1/revalidate-test   → {"valid":true,"reason":"ok"}

## Cron

Scheduled publishing needs a real cron entry; wp-cron fires on visitor traffic
and a low-traffic marketing site publishes late. Not applied — §4 forbids
altering production cron without approval.

    define('DISABLE_WP_CRON', true);
    */5 * * * * cd /path/to/wordpress && wp cron event run --due-now --quiet

## Post-deployment smoke tests

    curl -sS \$SITE/wp-json/gemreserve/v1/health
    # pagesMigrated should equal pagesWithLegacyBody

    wp gemreserve verify        # every page matches its snapshot
    wordpress/gemreserve-visual-cms/tools/compare-routes.sh \\
        compare ./baseline ./after routes.txt
MANIFEST

# ---------------------------------------------------------------- archive
( cd "$OUT_ROOT" && tar -czf "gemreserve-cms-$STAMP.tar.gz" "gemreserve-cms-$STAMP" )
sha256sum "$OUT_ROOT/gemreserve-cms-$STAMP.tar.gz" > "$OUT_ROOT/gemreserve-cms-$STAMP.tar.gz.sha256"

echo
echo "package : $PKG"
echo "archive : $OUT_ROOT/gemreserve-cms-$STAMP.tar.gz"
echo "files   : $(find "$PKG" -type f | wc -l)"
echo "size    : $(du -h "$OUT_ROOT/gemreserve-cms-$STAMP.tar.gz" | cut -f1)"
echo
echo "Nothing was deployed. See docs/CMS_DEPLOYMENT_READINESS.md."
