# CMS Production Deployment Report

**Date:** 2026-09-03
**Branch:** `phase-2-headless-visual-cms-remediation` @ `d019a9c`
**Outcome:** **DEPLOYMENT BLOCKED — PRODUCTION UNCHANGED**
**Author:** Claude Opus 5 (Claude Code)

---

## 1. Executive summary

The scoped production deployment of the WordPress Visual CMS **was not performed**.
Two mandatory gates could not be satisfied under the authorization available to
this session, and the brief requires that a blocked deployment make no partial
production change.

Production is in its pre-engagement state and verified so: 0 pages carry block
content, 0 `_gr_vcms` meta rows exist, the plugin is neither installed nor
active, the theme is the original, and all 88 public routes are byte-identical
to their captured baseline.

Two incidents occurred during preflight, both caused by this session, both fully
remediated, and both reported in full in §4. One of them briefly changed the
public site. Neither was authorized, and neither is presented here as an
acceptable cost of the work.

The engineering itself is in good shape: on a correctly isolated staging
environment the migration is byte-neutral across all 88 routes, idempotent,
reversible, and passes 132 unit assertions and all 11 marketing acceptance
tests under restricted roles. That evidence is real, and §12–§14 record it. It
is not sufficient to deploy, because deployment also requires the two gates in
§3 that remain closed.

---

## 2. Scope and withdrawn scope

### In scope
Deploying `gemreserve-visual-cms`, the updated `gemreserve` theme, and the
`gemreserve-core` capability change to production; migrating 58 page bodies from
`_gr_body_html` into editable Gutenberg blocks; preserving public output exactly.

### Explicitly out of scope — withdrawn by client
`GemReserve_On_Page_SEO_Strategy.pdf` is **OUT OF SCOPE — WITHDRAWN BY CLIENT**.

Nothing proposed exclusively by that document has been implemented. Specifically,
this work did **not**:

- change existing SEO titles or meta descriptions;
- replace H1/H2/H3 content based on its keyword strategy;
- introduce its recommended keywords;
- create its proposed gemstone or Learn/Education pages;
- create articles;
- change URLs or canonicals;
- add promotional, investment, trading, reserve or redemption claims;
- implement its backlink or Digital PR plan;
- modify structured data based on that strategy.

The PDF and all historical references to it are retained, not deleted.

The 30 gemstone, Learn and legal routes that exist in production
(`/burmese-ruby/`, `/what-is-rwa-tokenization/`, `/privacy-policy/`, …) are
**pre-existing production content**, present in the captured baseline before this
engagement began. They were not created here. They are also not migratable: they
carry no `_gr_body_html` and the migration never touches them (§6).

SEO preservation is proven by measurement, not assertion — see §9.

---

## 3. Blockers preventing deployment

### BLOCKER A — the production virtual host cannot be read (§8 of the brief)

`/etc/nginx` is `drwx------ root root`. The vhost is unreadable by this session.

The brief requires vhost readability to be *resolved*, forbids guessing its
contents, and forbids privilege escalation outside configured authorization.
Every authorized avenue was checked and none supplies it:

| Avenue | Result |
| --- | --- |
| Direct read of `/etc/nginx/sites-*` | Permission denied |
| `sudo` (`ALL : ALL`) | Requires a password this session does not have |
| `sudo -n /usr/bin/clpctlWrapper` (the one NOPASSWD entry) | Offers only `db:export`, `db:import`, `system:permissions:reset`, `varnish-cache:purge` — no vhost read |
| CloudPanel datastore `/home/clp/htdocs/app/data/db.sq3` | Permission denied (`/home/clp` is `drwx------ clp clp`) |

Observation is not a substitute, but for completeness: response headers on
`https://www.gemreserve.io/` carry `link: <…/wp-json/>; rel="https://api.w.org/"`,
so the public site is served by WordPress through nginx; no Varnish or CDN
headers are present; and `gemreserve-next.service` listens on `127.0.0.1:3000`
and is not on the public request path. That tells us the architecture is
probably simple. It does not tell us what `location` blocks, rate limits,
`/wp-admin` restrictions or fallbacks exist, and §14 of the brief requires
editor smoke-testing through `/wp-admin` on production.

### BLOCKER B — production WordPress cannot be driven faithfully

`/var/www/GemReserve/wordpress/wp-config.php` is `-rw-r----- root www-data`.
This session is uid `hamza`, not in group `www-data`, and cannot read it.

Consequences:

- WP-CLI cannot bootstrap production. `wp` fails with
  *"Strange wp-config.php file: wp-settings.php is not loaded directly."*
- The migration is not a SQL operation. It needs a live WordPress: the block
  parser/serialiser, `wp_kses`, the decomposer and the slot engine. It cannot be
  performed from the database side.
- The plugin reads `GEMRESERVE_REVALIDATE_SECRET`, `GEMRESERVE_REVALIDATE_URL`,
  `GEMRESERVE_RENDERER_URL` and `GR_REQUIRE_MFA`, whose production values live in
  that unreadable file, alongside the site's salts.

A parallel wp-config could be fabricated from `~/.gemreserve-wp-db.env`, but it
would run production under a *reconstructed* constant set — different secrets,
different salts, possibly different behaviour — and would be a deliberate
circumvention of a permission boundary the operator set on purpose. The brief
forbids bypassing permissions or security controls. I did not do it.

### What would unblock this

Either is sufficient on its own for Blocker B; Blocker A needs the first or third:

1. A shell as a user that can read `/etc/nginx` and `wp-config.php` — e.g. the
   sudo password, or adding `hamza` to `www-data` plus a readable vhost.
2. An operator running the §13 sequence themselves from the runbook, with this
   session verifying each step read-only.
3. A copy of the vhost and the relevant wp-config constants provided out of band.

---

## 4. Incidents

Both incidents were caused by this session. Both are disclosed here in full.

### INCIDENT 1 — unauthorized writes to the production database

**What happened.** A WP-CLI wrapper I created for staging,
`$SCRATCH/staging/swp`, did not export `GR_DB_ENV`. The staging `wp-config.php`
resolves credentials from a candidate chain whose last entry is
`~/.gemreserve-wp-db.env` — the **production** credentials
(`DB_HOST=127.0.0.1`, i.e. port 3306; `DB_USER=gemreservewp`). The wrapper
therefore ran the *staging filesystem* against the *production database*,
silently, and reported success.

The staging web server on `:8899` was correctly isolated the whole time
(`GR_DB_ENV=$STG/wp.env`, port 13306). That is why the two disagreed and why the
discrepancy surfaced: the REST API reported `migrated: false` for pages the CLI
had just reported migrating.

**What it changed on production.** Between roughly 20:06 and 20:26 UTC:

- `gemreserve-visual-cms` added to `gr_options.active_plugins` (the plugin files
  were never on production, so WordPress skipped it);
- `gr_posts.post_content` rewritten to block markup for 58 pages, across four
  `migrate --apply` runs, one single-page rollback, one full rollback and a
  re-migration;
- one import of a dump over the production database, from a second wrapper
  (`testwp/twp`) created before its `GR_DB_ENV` was added.

**Public impact — measured, not estimated.** All 88 live routes were captured
during the incident and again after restoration, and compared byte for byte.
57 routes differed. The difference was uniform and was, in its entirety:

```html
<section class="container-wide" style="margin-top:var(--section-gap)">
    <div class="motion-reveal is-visible page-copy"></div>
</section>
```

An **empty section wrapper**, 169 bytes, appended to the page. Production's
theme is the original, which has no block branch, so it called `the_content()`
on post content that was no longer empty; the blocks were unregistered, so they
rendered to nothing inside a section the template still emitted.

No content was lost, duplicated or altered. No text changed. No title, meta
description, canonical, Open Graph value or robots directive changed — verified
by metadata comparison across all 88 routes. The visible effect was one
section-gap of extra whitespace at the foot of 57 pages, for about 20 minutes.

**Restoration.** The current (incident) state was dumped first, so the restore
itself is reversible:
`/var/www/GemReserve/backups/incident-20260903T2025Z/prod-db-incident-state.sql`
(11,240,882 bytes, 34 tables, SHA-256 recorded). Production was then restored
from the verified pre-change backup taken at 19:56 UTC.

Before restoring I confirmed nothing would be lost: every row modified since the
backup was mine — 58 posts and 58 revisions, all `post_author = 0` (WP-CLI),
timestamped 20:18 — with no comments, no bookings and no human edits in the
window.

**Verified after restore:** 0 block posts, 0 `_gr_vcms` meta, 58 legacy bodies
intact, 88 published pages, plugin absent from `active_plugins`, 0 posts modified
since 19:56, and all 88 routes byte-identical on two captures 20 minutes apart.

**Root cause and fix.** The destructive command trusted its environment. It now
does not: `wp gemreserve migrate --apply` and `rollback --apply` refuse when
`home_url()` is not local, name the likely cause in the error, and require an
explicit `--allow-production` to proceed (commit `d019a9c`). Verified to fire on
both verbs and to be overridable. This guard would have caught the incident,
because the production fallback env sets `WP_HOME=https://www.gemreserve.io`.
The staging `wp-config.php` was additionally pinned to a single env file so it
can no longer reach production even with the variable unset.

### INCIDENT 2 — production Next.js service restarted

**What happened.** `pkill -9 -f "next-server"`, intended for my own staging
server on port 3400, matched the production `gemreserve-next.service` process.

**Impact.** systemd restarted it automatically; it was ready 527 ms later, and
down for at most a second or two. The service listens on `127.0.0.1:3000` and is
not on the public request path — nginx serves WordPress directly — so no public
request was affected. All sampled routes returned 200 immediately after.

This still violates the standing prohibition on restarting Next.js. Process
management is now PID-scoped by port lookup, never by name pattern.

---

## 5. Preflight

| Check | Result |
| --- | --- |
| Working tree clean | Yes, apart from untracked `contracts/`, `services/` (Phase 3–6, untouched) |
| Phase 3–6 branches/contracts/services modified | No |
| Unrelated work reset, stashed or deleted | No |
| Secrets in tracked files | None; only `.env.example`, which is a template |
| Credentials printed | One staging DB password was echoed to the transcript early on — an ephemeral loopback-only credential generated for the scratchpad MySQL on :13306, never committed. Subsequent access went through a wrapper. No production secret was displayed. |
| PHP syntax, all plugin + theme files | Clean |
| TypeScript `tsc --noEmit` | Clean |
| ESLint | 0 errors (2 pre-existing warnings in `themes/gemreserve/assets/js/gemreserve.js`) |
| `next build` | Succeeds, 152 static pages |
| `npm audit --omit=dev` | 0 vulnerabilities |

---

## 6. Production state reconciliation

Counted, not assumed (the brief warns against assuming 15 changed pages or
exactly 58 public pages):

| Quantity | Count |
| --- | --- |
| Published `page` + `gemstone` records | **88** |
| Carrying `_gr_body_html` (migratable) | **58** |
| Ordinary WordPress content, never touched by the migration | **30** |
| Public routes captured and compared | **88** |

The 58 comprise 40 pages and 18 gemstones. Gemstones are included deliberately:
they store bodies in `_gr_body_html` exactly as pages do, and an earlier
revision of the query covered only pages, which would have migrated 40 of 58
routes while reporting complete success.

---

## 7. Plugin environment and drift

17 plugins are active on production. All were reproduced on staging, from
production copies, with no secrets copied into source control.

Drift grew during the engagement and is recorded in
`CMS_DEPLOYMENT_READINESS.md`. No production plugin was deactivated, replaced,
upgraded or downgraded — the deployment does not require it.

One interaction matters and is documented rather than worked around:

**`gemreserve-empty-alt-fix` is an `ob_start()` plugin** that rewrites the entire
HTTP response, replacing `alt=""` with descriptive text. It applies to WordPress
HTML on **both** the legacy and the block path — the stored markup is identical
on both, verified directly — so it has no bearing on this deployment.

It does **not** reach the REST payload, where JSON escaping renders the quotes as
`\"` and the plugin's regex correctly does not match. Consequently the headless
Next.js renderer receives `alt=""`. This is a property of the headless cutover,
not of the migration, and it generalises: **output-buffering plugins do not reach
API consumers.** It must be resolved before any headless cutover. It is not a
blocker here, because the cutover is not part of this deployment.

---

## 8. Backups

Taken before any change, at `/var/www/GemReserve/backups/cms-deploy-20260903T195619Z/`:

| Artefact | Size |
| --- | --- |
| `prod-db-20260903T195619Z.sql` | 3,397,780 B — 34 tables, complete dump trailer, SHA-256 verified |
| `wp-plugins-20260903T195619Z.tar.gz` | 5,077,379 B |
| `wp-theme-20260903T195619Z.tar.gz` | 43,250,138 B |
| `wp-uploads-20260903T195619Z.tar.gz` | 203,723 B |

`dump.err` records one benign warning — no `PROCESS` privilege for tablespace
dumping, which does not affect table data.

Backups live outside the Git repository and are not committed.

**This backup was used, and it worked.** It is what restored production in §4.
That is a stronger verification than a test restore.

---

## 9. SEO preservation

Measured three ways, all across all 88 routes:

1. **Byte comparison** — the whole document is identical before and after
   activation and migration on staging. This subsumes every metadata question.
2. **Metadata comparison** — `seo-snapshot.sh` extracts title, meta description,
   canonical, `og:title`, `og:description`, `og:url`, robots and Twitter card,
   plus tag counts. Identical at activation and after migration.
3. **Duplicate-tag counts on live production** — exactly one `<title>`, one
   canonical and one `meta name="description"` per page on all 88 routes. No
   evidence of two SEO plugins contending for a field.

During Incident 1, the same metadata comparison confirmed **no SEO value
changed** on production at any point.

---

## 10. Deployment package

Built by `wordpress/deploy/build-cms-package.sh` from committed source only
(`git archive`; refuses a dirty tree).

- Source: `phase-2-headless-visual-cms-remediation @ a4d3fcb1f595`
- 100 files, 240 KB
- Contents: `gemreserve-visual-cms`, `gemreserve` theme, `gemreserve-core`,
  renderer sources, docs

---

## 11. Defect found and fixed before any deployment

Activating the plugin over the production dataset changed 28 of 88 routes by
exactly +16 bytes each — before the migration had run at all.

Cause: wrapping the theme's legacy body branch in `} else {` indented the literal
markup one level deeper. PHP emits everything outside its tags verbatim, so the
template's own indentation is page output. Four spaces × four lines = 16 bytes,
on every page that takes that branch.

Fixed in `page.php` and `single-gemstone.php` by returning the markup to its
original column — the closing `<?php` line included, since its indentation also
emits — with a comment explaining why it does not line up with the block around
it (commit `a4d3fcb`). Activation is now byte-neutral on all 88 routes.

This is exactly the class of defect the byte-identity invariant exists to catch.

---

## 12. Staging verification

All results below are from the **correctly isolated** staging environment
(WordPress files in the scratchpad, MySQL on `:13306`, PHP on `:8899`), re-run
from scratch after Incident 1 invalidated the earlier migration results.

| Gate | Result |
| --- | --- |
| Plugin install + activation, 88 routes | **88 identical / 0 differ** |
| SEO surface at activation, 88 routes | **Identical** |
| Migration dry run | 58 ready, 0 refused, 0 error, all byte-identical |
| Migration applied | **58 migrated**, 0 refused, 0 error |
| Post-migration, 88 routes | **88 identical / 0 differ** |
| Post-migration SEO, 88 routes | **Identical** |
| Idempotency (3 consecutive applies) | Identical content hash `fa1def84…` each time; 88/88 routes identical |
| Single-page rollback | Clean; 88/88 identical |
| Full rollback | 0 block posts, 58 legacy bodies intact; 88/88 identical |
| `gemreserve verify` | 58/58 match snapshot |
| Plugin unit suite | **132 passed, 0 failed** |

Every state — pre-migration, migrated, partially rolled back, fully rolled back —
renders byte-identically. The legacy `_gr_body_html` is never deleted, so
rollback is a metadata flip rather than a deploy.

---

## 13. Acceptance tests

All 11 executed against staging through the real Gutenberg interface, as
restricted marketing roles (`gr_marketing_editor`, `gr_marketing_publisher`),
not as administrator. **11 passed, 0 failed (4.9 min).**

| ID | Test | Result |
| --- | --- | --- |
| AT-01 | Edit the content of an existing page | Pass (23.6s) |
| AT-02 | Replace text and images | Pass (23.1s) |
| AT-03 | Add and remove a page section | Pass (17.6s) |
| AT-04 | Reorder sections | Pass (18.4s) |
| AT-05 | Add and duplicate a card | Pass (24.5s) |
| AT-06 | Modify navigation and footer | Pass (13.8s) |
| AT-07 | Update page SEO | Pass (25.4s) |
| AT-08 | Preview desktop and mobile output | Pass (16.8s) |
| AT-09 | Save a draft and publish it | Pass (45.2s) |
| AT-10 | Create a new page from the approved design | Pass (52.3s) |
| AT-11 | Restore a previous version | Pass (31.3s) |

The QA personas exist only on the isolated staging database and were never
created on production.

Role separation verified: `gr_marketing_editor` cannot publish or edit theme
options; `gr_marketing_publisher` can publish and edit Site Settings but cannot
`manage_options`, install or activate plugins.

---

## 14. Renderer parity (headless path)

58 routes, 268 sections compared: **262 byte-identical**. Three routes diverge;
neither cause is a migration regression, and both sit outside the WordPress path
this deployment would change.

1. **`/`** — the theme renders the home page from `front-page.php`, which carries
   its own markup, while the Next.js home page is the hand-written
   `app/page.tsx`. They have always differed (`aria-label="Why GemReserve?"`
   versus `"GemReserve trust pillars"`). Pre-existing, unrelated to blocks.
2. **`/how-it-works/`, `/participant-portal/`** — `alt=""` versus
   `alt="GemReserve"`, caused by the `ob_start()` plugin interaction in §7.

Both must be closed before a headless cutover. Neither affects the live site.

---

## 15. Visual regression

8 representative routes × 4 viewports (1440, 1024, 768, 390) = 32 fresh
screenshots before and after migration. No previous evidence was reused.

Differences of up to 4.4% appeared — **and a control run rejected them.**
Capturing twice in the *same* database state produced the same magnitude of
difference, with several files reporting identical percentages in both
comparisons (`documents-1024` 2.381%, `about-1024` 1.858%,
`governance-1440` 0.607%).

The differences are capture nondeterminism from scroll-reveal animations and
lazy-loaded images, not migration effects. At this tolerance the pixel
comparison cannot discriminate, and I am not presenting it as a pass. The
byte-identical HTML comparison across all 88 routes is the authoritative
evidence and is strictly stronger: with identical HTML, identical CSS and
verified-identical asset checksums, there is nothing left for a pixel to differ
about.

---

## 16. Security

| Check | Result |
| --- | --- |
| Block attribute sanitisation (SEC-1 regression guard) | Event handlers stripped: `<section onload=…><img onerror=…>` → `<section class="x"><img src="x">` |
| Unauthenticated REST write endpoints | 404 (not exposed) |
| Preview token without a valid nonce | 403 |
| Secret scan across tracked files | Clean |
| `.env` / key / credential files tracked | None |
| Dependency audit | 0 vulnerabilities |
| Destructive CLI production guard | Added and verified (§4) |

No KYC, wallet, token, financial or compliance data is stored in WordPress.

---

## 17. Production deployment sequence — NOT EXECUTED

Prepared and unexecuted. For an operator with the access in §3:

1. Verify backups (`cms-deploy-20260903T195619Z`, SHA-256).
2. `rsync` the package's `gemreserve-visual-cms` into `wp-content/plugins/`.
3. `rsync` the `gemreserve` theme and `gemreserve-core`.
4. Capture all 88 routes.
5. `wp plugin activate gemreserve-visual-cms`.
6. Re-capture; **require 88/88 identical** before proceeding.
7. `wp gemreserve migrate` (dry run); review.
8. `wp gemreserve migrate --apply --allow-production`.
9. Re-capture; **require 88/88 identical** and an identical SEO snapshot.
10. Smoke-test the editor on a **dedicated private/noindex draft page** — never
    an existing public page.

Rollback at any step: `wp gemreserve rollback --apply --allow-production`, then
deactivate the plugin, then restore files. The legacy `_gr_body_html` is never
removed, so no step is one-way.

Nothing in this sequence touches nginx, DNS, TLS, PHP-FPM ports or the Next.js
service.

---

## 18. Monitoring

Not applicable — nothing was deployed. Production was polled read-only
throughout, never blocking for more than a few seconds at a time, and is
confirmed healthy: 88/88 routes HTTP 200, ~0.18 s median response.

---

## 19. Git and release records

| Commit | Subject |
| --- | --- |
| `a4d3fcb` | Stop the template's own indentation leaking into the page |
| `d019a9c` | Refuse to migrate a production site without being told to |

Branch `phase-2-headless-visual-cms-remediation`. Not pushed, not merged, not
force-pushed. No release tag was created, because there was no release.

---

## 20. Notion status recommendation

```
Phase 2 — In Progress — CMS DEPLOYMENT BLOCKED, PRODUCTION UNCHANGED
```

Phase 2 must **not** be marked Completed. Phase 3–6 statuses are unmodified.

The engineering is deployment-ready; the access required to deploy it is not
available to this session. See §3 for the three ways to unblock.

---

## 21. Evidence index

Under `/tmp/claude-1006/-var-www-GemReserve-GemReserve/7d861dd9-bd4b-450a-be56-94d618a0523f/scratchpad/`:

| Path | Contents |
| --- | --- |
| `staging/pre88`, `staging/act-final` | 88-route captures, pre-change and post-activation |
| `staging/stg-mig`, `staging/stg-mig3` | Post-migration and post-3×-migration captures |
| `staging/stg-rb1`, `staging/stg-rball` | Post-rollback captures |
| `staging/seo-*.tsv` | SEO snapshots at each stage |
| `staging/vr-pre`, `vr-post`, `vr-ctrl` | 32 screenshots each, incl. the control run |
| `prod-live-now` | Live production during Incident 1 |
| `prod-live-restored`, `prod-final` | Live production after restoration, 20 min apart |
| `qa/cms/results/acceptance.json` | Acceptance suite results |

Backups: `/var/www/GemReserve/backups/cms-deploy-20260903T195619Z/` (pre-change)
and `incident-20260903T2025Z/` (incident state, preserved).

---

## 22. Assessment

The claims inherited from the prior phase were **not** taken on trust; they were
reproduced. Doing so found a real defect that would have shipped — the +16-byte
indentation leak in §11 — and the byte-identity invariant is what caught it.

Against that, this session caused two incidents it should not have. Incident 1
put unauthorized writes on the production database and briefly changed 57 public
pages. The measured impact was small and fully reverted, and the pre-change
backup did its job. But it happened because a tool of mine trusted its
environment, and the detection came from a later cross-check rather than from
the tool itself. That gap is now closed in code, and the fix is verified.

The honest summary: the CMS is technically ready and well evidenced on staging;
production is untouched and verified; and deployment requires access this
session does not have.

---

## 23. Recommended next steps

1. Grant one of the three access routes in §3, or have an operator run §17 with
   this session verifying read-only.
2. Before any headless cutover, close the two parity gaps in §14 — particularly
   the `ob_start()` plugin class of problem, which will affect every API
   consumer, not just these two routes.
3. Marketing acceptance against the staging environment, which is migrated and
   ready.

---

## 24. Statement on production state

At the time of writing, production is byte-identical to its pre-engagement
baseline across all 88 public routes, verified twice, 20 minutes apart. No
plugin was installed. No theme file was changed. No page content, SEO metadata,
URL or canonical differs. The database matches the 19:56 UTC backup exactly.

---

## 25. Decision

**CMS DEPLOYMENT BLOCKED — PRODUCTION UNCHANGED**
