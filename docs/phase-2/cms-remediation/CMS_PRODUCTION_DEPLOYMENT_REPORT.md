# CMS Production Deployment Report

**Date:** 2026-09-04
**Branch:** `phase-2-headless-visual-cms-remediation`
**Deployed commit:** `86fa52f` (supersedes `b86401e`)
**Outcome:** **CMS TECHNICALLY COMPLETE — HUMAN MARKETING SIGN-OFF PENDING**
**Author:** Claude Opus 5 (Claude Code)

---

## 0. Second deployment — the marketing permission gap is closed

This report covers two deployments on the same day. Sections 1–24 record the
first (`b86401e`, 01:11–02:25 UTC) and remain accurate. This section records
the second (`86fa52f`, 17:12 UTC), which closed the blocker the first one left
open.

### What changed

BLOCKER-A was that the marketing roles could not edit the 18 gemstone pages,
because `gemstone` shared its capability family with `gr_document`, the
compliance-controlled register. That is fixed — with a **smaller** grant, not a
bigger one:

| Change | Effect |
|---|---|
| `gemstone` and `gr_document` each get their own capability set | The two can be granted independently |
| Marketing roles gain the gemstone capabilities | All 88 routes are now editable by marketing |
| A 16-field marketing allowlist, 25 protected fields | Presentation and SEO editable; asset identity, specification, evidence, custody and lab report are not |
| `gr_manage_gemstone_record` | New capability, held by Administrator and Compliance only |
| Hero and SEO groups declared for `gemstone` | A gemstone's title tag was previously changeable only in the database |

**A second hole closed in passing.** While the two types shared capabilities, a
Marketing Publisher holding `publish_posts` could create and publish a
controlled document — it just could not edit an existing one, which is
presumably why nobody noticed. Separating the type ends that. Compliance and
administrators keep exactly what they had.

Full detail: `CMS_MARKETING_PERMISSION_MATRIX.md`.

### Enforcement

Five layers, server-side, because hiding a field is not a control:
the metadata API filters (the choke point every writer passes through), the
registered `auth_callback` for REST, a `save_post` guard that strips protected
keys out of `$_POST`, `is_protected_meta`, and only then the meta-box removal.
Everything in the `_gr_` namespace is protected unless allowlisted, so a field
added later is denied by default.

### Evidence

| Gate | Result |
|---|---|
| Unit assertions | **169 passed, 0 failed** (132 → 140 → 169) |
| — of which new permission assertions | **28**, exercising every write path as a restricted user |
| Browser tests | **15 passed, 0 failed** |
| — AT-G1 | now runs as **Marketing Publisher**, not administrator — the point of the work |
| — AT-P1/P2/P3 | asset record absent from the UI; SEO editable and reaching the head; raw-HTML pages editable visually |
| 88 routes, before vs after | **88 identical / 0 differ** |
| SEO surface, robots, sitemap | **identical** |
| Route matrix | **88/88 editable by both marketing roles, 88/88 publishable** |
| Swap window | **0.0085 s**, no downtime |
| Services restarted | **none** |

### Production changes

Five files, all inside the two GemReserve plugins. The theme was not touched.

    wp-content/plugins/gemreserve-visual-cms/includes/class-gemstone-policy.php   (new)
    wp-content/plugins/gemreserve-visual-cms/includes/class-roles.php
    wp-content/plugins/gemreserve-visual-cms/gemreserve-visual-cms.php
    wp-content/plugins/gemreserve-visual-cms/tests/run-tests.php
    wp-content/plugins/gemreserve-core/includes/fields.php

Plus one option: `gemreserve_vcms_caps_version = 2`.

### Backup and rollback

    backup   /var/www/GemReserve/backups/cms-caps-20260904T150707Z
    previous /var/www/GemReserve/backups/cms-caps-20260904T150707Z/pre-deploy-originals-20260904T171244Z/

Rollback, fastest first — unchanged in shape from §13, and all outside the
document root:

```bash
# 1. Deactivate. Reverts the capability model completely: the post types go
#    back to capability_type 'post' and the field policy stops loading.
wp plugin deactivate gemreserve-visual-cms

# 2. Restore the previous plugin and fields.php.
BK=/var/www/GemReserve/backups/cms-caps-20260904T150707Z
rsync -a --delete $BK/pre-deploy-originals-20260904T171244Z/plugins/gemreserve-visual-cms/   /var/www/GemReserve/wordpress/wp-content/plugins/gemreserve-visual-cms/
install -m 644 -o hamza -g www-data   $BK/pre-deploy-originals-20260904T171244Z/plugins/gemreserve-core/includes/fields.php   /var/www/GemReserve/wordpress/wp-content/plugins/gemreserve-core/includes/fields.php

# 3. Full restore, if ever needed (proven in 6 s into an isolated instance).
mysql "$DB" < $BK/prod-db-*.sql
```

### The security incident is closed

`CMS_SECURITY_INCIDENT_CLOSURE.md`. No secret was in the six exposed files —
checked, not assumed. No third party fetched them: nine requests exist across
all eight access logs and all nine are this engagement's own probes. The
document root now holds **zero** backup artefacts, the deployment writes
backups outside it by construction, and both a standalone script and a unit
assertion fail if that regresses.

### What is still open

**Human marketing sign-off.** The role is built, proven and deployed; no real
marketing user has performed the eleven acceptance actions.
`CMS_CLIENT_ACCEPTANCE_CHECKLIST.md` is written for them, and the isolated
acceptance environment is left running.

**No marketing account exists on production.** Assigning a least-privilege role
to whichever administrator happens to exist is the client's decision, not this
work's. The checklist carries the one command that creates one.

---

## 1. Executive summary

The scoped production deployment of the WordPress Visual CMS **was performed and
verified**. All 88 public routes are byte-identical to the pre-deployment
baseline, the SEO surface and sitemap are unchanged, and 58 page and gemstone
bodies — 40 pages and 18 gemstones — are now editable Gutenberg blocks.

The two gates that blocked the previous attempt were access, not engineering,
and this session was given the root authority that resolves both: the public
vhost at `/etc/nginx/sites-enabled/www.gemreserve.io.conf` was read rather than
inferred, and WP-CLI now bootstraps production as `www-data`.

Rebuilding staging from a **fresh** production backup — with all seventeen
production plugins active, which the previous engagement's staging copy did not
have — found two real defects that would otherwise have shipped:

1. **The migration moved 53 of 87 sitemap `<lastmod>` values** to the deployment
   timestamp, announcing that most of the site had changed on a day when not one
   byte of its public output did. Fixed in `c86a28d`.
2. **The 18 migrated gemstones were handed to the classic editor**, whose save
   path would have rewritten a 57,415-byte body down to 31,277. Fixed in
   `b86401e`.

One gap is **not** closed, and is reported rather than worked around: the
`gemstone` post type shares its capability family with `gr_document`, the
compliance-controlled type, so the only capabilities that would let a marketing
user reach a gemstone would also hand them the controlled documents. **An
administrator can edit the 18 gemstones; the marketing roles cannot.** Closing
that means giving the post type its own capability set in `gemreserve-core`,
which is a change to its content model and belongs in a separately reviewed
piece of work. See §14, BLOCKER-A.

**This session also caused an incident, and it is reported in full in §16.**
The deploy step kept each replaced file beside its target as
`<file>.gr-orig-<stamp>`. The vhost denies `wp-content/**/*.php`, but those names
do not end in `.php`, so nginx served six theme and plugin source files as plain
text for 74 minutes. No third party requested any of them — the only nine
requests in the log are this session's own probes — and none of the six contains
a credential. They were moved out of the web root and now return 404. It should
not have happened, and the check that caught it should have been inside the
deploy step rather than in the sweep afterwards.

Phase 2 remains **In Progress**. Technical deployment is complete; client
acceptance is not.

---

## 2. Scope, and the withdrawn document

### In scope, and deployed
`gemreserve-visual-cms`; the block-rendering branch in the `gemreserve` theme;
the settings-capability change in `gemreserve-core`; migration of 58 page and
gemstone bodies from `_gr_body_html` into editable Gutenberg blocks.

### Explicitly out of scope — withdrawn by client
`GemReserve_On_Page_SEO_Strategy.pdf` is **OUT OF SCOPE — WITHDRAWN BY CLIENT**,
and nothing it proposes was implemented. No SEO title, meta description,
canonical, heading, keyword, URL, robots directive, structured-data block or
page was created or changed to satisfy it. No article, gemstone page or
Learn/Education page was created. No backlink or Digital PR work was done.

The existing SEO surface was **preserved and measured**, not extended — §8.

The 30 routes without a legacy body (`/burmese-ruby/`, `/what-is-rwa-tokenization/`,
`/privacy-policy/`, the Learn hub and the rest) are **pre-existing production
content** authored by another party on 2026-09-02. They were counted, protected
and left untouched: they carry no `_gr_body_html`, so the migration never
selects them.

---

## 3. What was inspected

| Item | Established from |
|---|---|
| Public vhost | `/etc/nginx/sites-enabled/www.gemreserve.io.conf`, read directly |
| Request path | `visitor → Cloudflare → AWS ALB → nginx:80` — from the vhost, confirmed by `nginx -T` |
| Document root | `/var/www/GemReserve/wordpress` |
| Public renderer | **WordPress via PHP-FPM.** `fastcgi_pass 127.0.0.1:19000`; **0** `proxy_pass` directives and **0** references to `:3000` in the entire loaded config |
| PHP-FPM service | `php8.4-fpm.service`, pool `default`, `user = www-data` |
| Database | name and host from `/etc/gemreserve/wordpress.env` (root:www-data 0640); table prefix `gr_` |
| `home_url` / `site_url` | `https://www.gemreserve.io` |
| Active theme | `gemreserve` 1.0.0 (the only theme installed) |
| Active plugins | **17** before deployment, 18 after |
| Next.js rollback service | `gemreserve-next.service`, `127.0.0.1:3000`, release `2026-08-29-164814` — **not on the public path** |
| Routes | **88** published `page` + `gemstone` (68 pages, 20 gemstones) |

`sites-enabled/` also holds `www.gemreserve.io.conf-bk`. `nginx.conf` includes
`sites-enabled/*.conf`, so that file is **not** loaded; it was left alone.

The audit's earlier claim that WordPress was served from `127.0.0.1:3200` no
longer holds — the vhost passes to `:19000`. A stale PHP process still listens
on `:3200`; it is on no request path and was not touched.

---

## 4. The two previous incidents — root cause and remediation

Both were caused by the previous session. Both are closed, and the fixes were
exercised in this one.

### INCIDENT 1 — staging operations ran against the production database

**Root cause.** The staging `wp-config.php` resolved credentials from a
**candidate chain** whose last entry, `/home/hamza/.gemreserve-wp-db.env`, holds
production credentials. A WP-CLI wrapper that did not export `GR_DB_ENV`
therefore ran the staging filesystem against the production database and
reported success. The documented safety property of that file — "staging only …
cannot reach production" — was never true.

**Remediation, verified in this session.**

- `wp gemreserve migrate --apply` and `rollback --apply` refuse when `home_url()`
  is not local and require `--allow-production`. **Confirmed firing on production
  before the migration was run** (§7, step 3).
- The staging `wp-config.php` written for this deployment has **no chain at
  all**: `GR_DB_ENV` is required, an unset or unreadable value is fatal, and it
  additionally refuses to boot if `DB_NAME`, `DB_HOST`, `WP_HOME` or
  `WP_SITEURL` matches production. Both refusals were smoke-tested:

  ```
  GR_DB_ENV unset          → STAGING REFUSED: GR_DB_ENV is unset or unreadable. There is no fallback.
  env naming production    → STAGING REFUSED: DB_NAME matches production. Refusing to boot.
  ```
- Every staging command in this session ran through `staging/swp`, which exports
  `GR_DB_ENV` before anything else can run.
- `staging/assert-not-production.sh` was run before every destructive staging
  step and is reproduced in §6.

The underlying exposure (DRIFT-2) remains: `/home/hamza/.gemreserve-wp-db.env`
still holds production credentials readable by the `hamza` account. It was not
changed — altering it is a production credentials operation outside this
deployment — and it is listed as a remaining blocker in §14.

### INCIDENT 2 — the production Next.js service was restarted

**Root cause.** `pkill -9 -f "next-server"` matched `gemreserve-next.service`.

**Remediation.** No pattern-matched process management was used in this session.
No `pkill`, `killall` or wildcard match was issued at all. Background processes
this session started were tracked by their own PID files. `gemreserve-next.service`
was **not restarted, reloaded or signalled**; it has been running continuously
since `2026-09-03 20:21:26 UTC`, which predates this session.

**No service was restarted or reloaded during this deployment.** PHP-FPM runs
`opcache.validate_timestamps=1` with `opcache.revalidate_freq=2`, so it picks up
changed files within two seconds by itself. That was confirmed from
`/etc/php/8.4/fpm/php.ini` before the deployment and demonstrated by it: the
route capture taken four seconds after the file swap already reflected the new
code.

---

## 5. Preflight

| Check | Result |
|---|---|
| Production healthy before any change | 88/88 routes HTTP 200, ~0.19 s |
| Production at its restored baseline | 0 block posts, 0 `_gr_vcms` meta, 58 legacy bodies, plugin absent |
| Two captures 45 minutes apart | **88 identical / 0 differ** |
| Theme + `gemreserve-core` files vs `git main` | all six target files match `f3a46ad` exactly — no production-side drift |
| Theme assets | 512 files, checksums unchanged throughout |
| PHP syntax, plugin + theme + core | 44 files, all parse |
| TypeScript `tsc --noEmit` | clean |
| `npm audit --omit=dev` | 0 vulnerabilities |
| Secret scan, tracked files | clean — matches are documentation prose, a variable name, and `.env.example` |
| Phase 3–6 (`contracts/`, `services/`, branches) | untouched, still untracked |
| Working tree | clean apart from those two pre-existing untracked directories |

### Production reconciliation — counted, not assumed

| Quantity | Count |
|---|---|
| Published `page` + `gemstone` | **88** (68 pages, 20 gemstones) |
| Carrying `_gr_body_html` (migratable) | **58** (40 pages, 18 gemstones) |
| Newer content with no legacy body | **30** |

The brief anticipated "the reported 15 added pages". The measured figure is
**30** new routes, all created 2026-09-02 by another party: 28 carry ordinary
`post_content`, and two gemstones (`/sapphire/`, `/diamond/`) have neither a
legacy body nor content. All 30 are outside the migration by construction, and
all 30 were verified byte-identical after it.

---

## 6. Backup, and proof of recovery

Taken as root, **before any change**, at `/var/www/GemReserve/backups/cms-deploy-20260904T002751Z`
(mode 700, outside the Git repository, not committed).

| Artefact | Size |
|---|---|
| `prod-db-20260904T002751Z.sql` | 3,724,878 B — 34 tables, `Dump completed` trailer |
| `wp-content-20260904T002751Z.tar.gz` | 48,526,454 B — 1,448 entries |
| `theme-gemreserve-20260904T002751Z.tar.gz` | 43,241,860 B |
| `plugins-all-20260904T002751Z.tar.gz` | 5,072,484 B — all 19 plugin directories |
| `uploads-20260904T002751Z.tar.gz` | 203,662 B |
| `wp-config.php.bak`, `wp-salts.php.bak` | mode 600 |
| `etc-gemreserve-wordpress.env.bak` | mode 600 |
| `nginx-www.gemreserve.io.conf.bak`, `nginx-nginx.conf.bak` | vhost and global config |
| `php-fpm-8.4-pool-default.conf.bak` | the pool that serves the site |
| `git-state.txt`, `service-state.txt`, `permissions-manifest.txt` | branch, commit, working tree, services, ownership |

SHA-256 of every artefact is in `SHA256SUMS` (mode 600). The credentials file
used for `mysqldump` was written mode 600 inside the backup directory and its
contents were never printed.

`dump.err` records the one expected warning — no `PROCESS` privilege for
tablespace dumping — which does not affect table data.

### Recovery proven, not assumed

| Check | Result |
|---|---|
| 1. Readable | `sha256sum -c SHA256SUMS` — 16/16 OK |
| 2. Complete | 34 `CREATE TABLE`, dump trailer present, all four archives readable |
| 3. Restorable | restored into an **isolated** MySQL instance (own datadir, port 13307) — **3 s** |
| 4. Correct | 34 tables; 88 published; 58 legacy bodies; 17 active plugins; `home` = the production URL; 2 users |
| Files | `wp-content` extracted to a scratch directory — **byte-identical to production**, 512/512 asset checksums matching |

**Measured recovery time: 3 s for the database, 1 s for the files.** Restoration
was performed into a temporary environment, never over production.

---

## 7. Clean staging validation

Staging was rebuilt **from scratch** from the fresh backup above, and rebuilt
again from it after every run that mutated content.

### Isolation, asserted before every destructive step

| Axis | Staging | Production |
|---|---|---|
| `home_url()` | `http://127.0.0.1:8901` | `https://www.gemreserve.io` |
| `site_url` | `http://127.0.0.1:8901` | `https://www.gemreserve.io` |
| Database name | `gemreserve_stg_cms` | *(different)* |
| Database host | `127.0.0.1:13307` — a **separate mysqld**, own datadir | `127.0.0.1` (3306) |
| Filesystem path | scratchpad `staging/wp` | `/var/www/GemReserve/wordpress` |
| Env file | `staging/wp.env` (0600) | `/etc/gemreserve/wordpress.env` |
| Database user | `gr_stg_cms`, granted on that one database only | *(different)* |

`table_prefix` is **deliberately identical** (`gr_`): the restored dump carries
production's schema, and renaming it would mean testing a different site. It
routes nothing on its own — host, database name and filesystem path do, and all
three differ.

**This staging copy ran all seventeen production plugins**, which the previous
engagement's did not. That is what surfaced both defects in §9.

### Results — final code, clean instance

| Gate | Result |
|---|---|
| Files installed, plugin inactive — 88 routes | **88 identical / 0 differ** |
| Plugin activated — 88 routes | **88 identical / 0 differ** |
| Migration dry run | **58 ready, 0 refused, 0 skipped, 0 error**; every row `identical=yes` |
| Migration applied | **58 migrated, 0 refused, 0 error** |
| Post-migration — 88 routes | **88 identical / 0 differ** |
| Post-migration — SEO surface, 88 routes | **identical** |
| Post-migration — `sitemap.xml` | **identical** |
| Post-migration — `robots.txt` | **identical** |
| Post-migration — 88 rows (id, slug, parent, status, `post_date_gmt`, `post_modified_gmt`) | **identical** |
| Idempotency — three consecutive applies | identical content hash `a45b53d5…` each time; 88/88 identical |
| Single-page rollback | clean; 88/88 identical |
| Full rollback | 0 block posts, 58 legacy bodies intact; 88/88 identical; SEO, sitemap and `post_modified` all identical |
| `wp gemreserve verify` | 58/58 match snapshot |

Every state — pre-migration, migrated, thrice-migrated, partly rolled back,
fully rolled back — renders byte-identically. `_gr_body_html` is never deleted,
so rollback is a metadata flip, not a restore.

### The sitemap is nondeterministic by construction — control run

`gemreserve-sitemap-include-hubs` stamps `/resources/` and `/documents/` with
`gmdate()` — the current time — on **every request**. Two captures taken two
seconds apart with no change in between differ in exactly those two lines. That
control is why the sitemap comparison normalises those two values and nothing
else; the remaining 85 entries are compared exactly. This is a pre-existing
property of a production plugin, not a deployment effect.

---

## 8. Two defects found by the fresh staging, and fixed

Both were invisible to the previous engagement because its staging copy was
restored from a dump taken **before** the sitemap and SEO plugins were
installed. `CMS_DEPLOYMENT_READINESS.md` BLOCKER-3 predicted exactly this and
called re-verification "a precondition of deployment, not a formality". It was.

### DEFECT-1 — the migration moved 53 of 87 sitemap `<lastmod>` values (`c86a28d`)

`wp_insert_post()` rewrites `post_modified` and `post_modified_gmt` on every
update and offers no way to opt out; `wp_update_post()` passes straight through
it. `gemreserve-flat-sitemap` builds every `<lastmod>` from `post_modified_gmt`.

Measured on staging before the fix:

| | |
|---|---|
| `post_modified_gmt` rows changed | **58 of 88** |
| sitemap `<lastmod>` values changed | **53 of 87** |
| sitemap `<loc>` URLs changed | **0** |
| non-`lastmod` sitemap lines changed | **0** |

Announcing that most of the site changed, on a day when its public bytes did
not, is a false signal to every crawler.

**Fix.** Both migration and rollback now write through a helper that pins
`post_modified` across the update, scoped by post id via `wp_insert_post_data`.
Revisions carry `ID` 0 with the page in `post_parent`, so they keep their own
real timestamps and the Revisions panel still reads correctly. Four regression
assertions cover it.

### DEFECT-2 — the 18 migrated gemstones were handed to the classic editor (`b86401e`)

The migration converts 58 bodies: 40 pages **and 18 gemstones**. The filter that
re-enables Gutenberg named `page` alone. Three more gates had the same shape —
the allowed-block list, the "not migrated yet" notice, and both halves of the
signed preview link.

This was not merely unhelpful. TinyMCE posts content back through
`wp_kses_post()` and `wpautop()`, which strip the SVG diagrams and reflow the
markup. Measured on a migrated gemstone:

```
block markup before                 57,415 bytes
after wpautop(wp_kses_post(...))    31,277 bytes
identical                           NO — a classic save would rewrite it
```

Before the migration those bodies lived in post meta and `post_content` was
empty, so the classic editor had nothing to damage. **Migrating them is what put
them in its reach**, which makes closing it part of this deployment rather than
a follow-up.

**Fix.** `MIGRATED_POST_TYPES` states the list once and the migration's
candidate query reads it too, so adding a post type to the migration cannot
again leave it uneditable. The unit suite asserts both directions.

**Verified through a real browser (AT-G1):** a migrated gemstone opens in
Gutenberg with GemReserve blocks on the canvas — not TinyMCE — and an edit made
there reaches the public gemstone page. Rollback then restores it from its
snapshot and `verify` returns 58/58.

---

## 9. Tests

### WordPress unit suite — **140 passed, 0 failed**

| Group | Assertions |
|---|---|
| Block registration | 9 |
| Slot engine — fidelity | 15 |
| Icon sanitiser | 6 |
| Markup policy | 13 |
| Migration — every candidate route | 3 |
| Migration — idempotency and rollback | 6 |
| **Migration — every migrated post type is editable** | **4 (new)** |
| **Migration — post_modified is not disturbed** | **4 (new)** |
| Roles and capabilities | 17 |
| Stored XSS through block attributes | 12 |
| REST — published content only | 20 |
| Preview tokens | 11 |
| Normaliser | 7 |
| Media | 9 |
| Decomposer | 4 |

The brief's floor was 132. The suite is now **140** — the eight added assertions
are the regression guards for the two defects in §8.

### Security and API, probed against the running staging instance

| Probe | Result |
|---|---|
| `GET /wp-json/gemreserve/v1/health` | 200 |
| `GET .../page?route=/about/` | 200 |
| `GET .../page?route=https://evil.example/about/` | **404** (SEC-3 holds) |
| `GET .../page?route=/../../etc/passwd` | **404** |
| `GET .../preview` without a token | **400** |
| `POST .../revalidate-test` unsigned | **401** |
| `POST .../migrate`, `.../rollback` | **404** — not exposed over REST at all |
| Draft / pending / private / scheduled / password-protected, by route and by id | 404, no content leaked (20 assertions) |
| Preview token replayed | 403 — single use |
| Preview token expired / forged / malformed / repointed | 403 |
| Preview token after a later edit | 409 |
| Webhook: tampered body, wrong secret, replayed timestamp, missing header | 401 each |
| Stored XSS via block attributes | 12 payloads neutralised, legitimate markup byte-unchanged |
| SVG / PHP / HTML upload | refused by extension and MIME |
| Path traversal into theme assets | refused |

### Role separation, read from the live roles

| Capability | Marketing Editor | Marketing Publisher |
|---|:--:|:--:|
| `edit_published_pages` | yes | yes |
| `publish_pages` | **no** | yes |
| `gr_manage_globals` | no | yes |
| `manage_options` | **no** | **no** |
| `install_plugins` / `activate_plugins` | **no** | **no** |
| `edit_plugins` / `edit_themes` | **no** | **no** |
| `unfiltered_html` | **no** | **no** |
| `edit_users` | **no** | **no** |
| `export` / `import` | **no** | **no** |

### Database write footprint — characterised on staging, then asserted on production

| Table | Δ |
|---|---|
| `gr_posts` (revisions) | +58 — one per migrated page |
| `gr_postmeta` (`_gr_vcms_*`) | +174 — snapshot, checksum, provenance × 58 |
| `gr_options` | +1 (the capped audit log; transients aside) |
| published `page`+`gemstone`, `_gr_body_html`, users, comments, terms, term relationships, usermeta | **0** |

On staging the option count rose by 7 rather than 1; the other six were WordPress
transients (block-pattern and theme-file caches, `doing_cron`) which expire on
their own and which production had already warmed. The one durable addition is
`gemreserve_vcms_audit`, the editorial audit log — capped at 500 entries, stored
with `autoload=false`, and recording no IP addresses. **No option was removed.**

No filesystem write outside `wp-content/plugins/gemreserve-visual-cms`, the four
theme templates and the two `gemreserve-core` files — audited after deployment by
listing everything under the WordPress root modified since the deployment began,
which returned exactly those, and zero files under `uploads/`.

---

## 10. Production deployment — what actually changed

Deployed from the package built by `wordpress/deploy/build-cms-package.sh`,
which refuses a dirty tree and assembles with `git archive`, so what shipped is
reproducible from the commit hash.

**Seven artefacts. Nothing else on the installation was read, written, moved or
deleted.**

| # | Path | Change |
|---|---|---|
| 1 | `wp-content/plugins/gemreserve-visual-cms/` | **new** — 30 files |
| 2 | `wp-content/themes/gemreserve/page.php` | block-rendering branch |
| 3 | `wp-content/themes/gemreserve/single-gemstone.php` | block-rendering branch |
| 4 | `wp-content/themes/gemreserve/front-page.php` | block-rendering branch |
| 5 | `wp-content/themes/gemreserve/functions.php` | `gemreserve_render_block_body()`, `gemreserve_body_is_blocks()` |
| 6 | `wp-content/plugins/gemreserve-core/includes/admin-menu.php` | Site Settings capability |
| 7 | `wp-content/plugins/gemreserve-core/includes/settings.php` | the same capability, three coordinated places |

### Method — atomic and reversible

Each artefact was staged beside its target, syntax-checked **after** copying,
then moved into place with `rename()` on the same filesystem — so no request
ever saw a half-written file. The plugin went in as a single directory rename.
Every replaced file was kept as `*.gr-orig-20260904T002751Z` so rollback would
be a rename rather than an unpack — **beside its target, which was a mistake**.
The six were later found to be web-readable and were moved out of the document
root; see §16. Rollback capability is unchanged and now reads from
`<backup>/pre-deploy-originals/`.

Ownership and mode were taken from the file being replaced (`chown/chmod
--reference`). The new plugin directory was set to `hamza:www-data`, 755/644 —
matching `gemreserve-core`. **No recursive ownership change, no `chmod 777`, no
permission was widened anywhere.**

### Timeline (UTC)

| Step | Start | End | Duration |
|---|---|---|---|
| File swap | 01:11:02 | 01:11:04 | **0.036 s** in the rename window |
| 88-route verification | — | — | 88 identical |
| Plugin activation | 01:11:48 | 01:11:49 | ~1 s |
| 88-route + SEO verification | — | — | 88 identical, SEO identical |
| Migration dry run | 01:12 | 01:13 | 58 ready, 0 refused |
| `migrate --apply --allow-production` | 01:14:02 | 01:14:47 | 45 s |
| Full verification | 01:15 | 01:18 | see §11 |

**Measured downtime: none.** No route returned anything but 200 at any point,
in captures taken immediately after each step. The only window in which a
partial state could exist was the 36-millisecond rename sequence, and the theme
tolerates it by design: `gemreserve_body_is_blocks()` returns false when the
plugin class is absent, so a template that landed before the plugin still
rendered the legacy body.

### What was deliberately not done

- No nginx, DNS, SSL, PHP, Node.js or OS change. The vhost on disk is
  byte-identical to `wordpress/deploy/nginx-wordpress.conf` in the repository
  (`ede64e6b…`), and was not edited.
- **No service was restarted or reloaded.** `gemreserve-next.service` was not
  touched; it has been up since 2026-09-03 20:21:26 UTC.
- **The public renderer was not switched.** WordPress serves the site, as it did
  before. The repository's approved plan (`CMS_TARGET_ARCHITECTURE.md` §1,
  `CMS_DEPLOYMENT_READINESS.md` §4 step 9) makes the Next.js cutover a
  separately authorised step, and it was not authorised here.
- No test content was published. No user account was created on production.
- No production plugin was activated, deactivated, upgraded or downgraded.
- `wp-config.php`, `wp-salts.php`, `/etc/gemreserve/wordpress.env`, uploads and
  the 512 theme assets were not modified.

---

## 11. Post-deployment verification on production

### Routes — all 88

| Check | Result |
|---|---|
| Byte comparison vs the immediate pre-deployment baseline | **88 identical / 0 differ / 0 missing** |
| Byte comparison vs the first baseline, taken 45 min earlier | **88 identical / 0 differ / 0 missing** |
| HTTP status | **88 × 200** |
| Final URL after redirects | unchanged on every route; **0 redirects** |

The comparison normalises exactly three values, each named in the tool and each
genuinely time-varying: `gr_nonce`, `gr_t` and `?ver=`. The asset cache-buster
is derived from `filemtime()` of the theme's CSS and JS, none of which was
deployed — and all **512** theme asset checksums are unchanged, so nothing hid
behind that normalisation.

### SEO surface — all 88

Title, meta description, canonical, `og:title`, `og:description`, `og:url`,
robots, Twitter card, and the counts of `<title>` / canonical / description /
`<h1>` / `<img>` / `<section>` per route: **identical on every one of the 88
routes.** Exactly one `<title>`, one canonical and one meta description per page
— no duplicate-tag contention.

| Surface | Result |
|---|---|
| `/robots.txt` | **byte-identical** |
| `/sitemap.xml` | **identical** — 0 `<loc>` changed, **0 `<lastmod>` changed** |
| `/sitemap_index.xml`, `/wp-sitemap.xml` | identical |

That second row is DEFECT-1 measured on production after the fix: without it,
53 of 87 `lastmod` values would have moved.

### Database

| Table | Before | After | Δ |
|---|---:|---:|---:|
| `gr_posts` (published `page`+`gemstone`) | 88 | 88 | **0** |
| `gr_posts` (revisions) | 87 | 145 | +58 |
| `gr_postmeta` (`_gr_body_html`) | 58 | 58 | **0** |
| `gr_postmeta` (`_gr_vcms_*`) | 0 | 174 | +174 |
| `gr_options` | 240 | 241 | +1 |
| `gr_users` | 2 | 2 | **0** |
| `gr_comments` | 0 | 0 | **0** |
| `gr_terms`, `gr_term_relationships`, `gr_usermeta` | — | — | **0** |

The delta matches what staging predicted, exactly.

| Integrity check | Result |
|---|---|
| All 88 rows: id, slug, parent, status, `post_date_gmt`, `post_modified_gmt` | **identical** |
| Duplicate slugs | 0 |
| Pages that would render both a block body and a legacy body | 0 |
| Duplicate `_gr_vcms` meta rows | 0 |
| `pagesMigrated` vs `pagesWithLegacyBody` | **58 = 58** |
| The 30 newer pages | untouched |
| `wp gemreserve verify` | **58/58 match snapshot** |

### Admin, editor and API

| Check | Result |
|---|---|
| `/wp-login.php` | 200, real form (`user_login`, `user_pass`, `wp-submit`) |
| `/wp-admin/` unauthenticated | 200 → correct redirect to login with `reauth=1` |
| CSP on `/wp-admin` | carries `'unsafe-eval'` — the editor can run |
| CSP on public pages | does **not** carry it |
| `/wp-json/gemreserve/v1/health` | 200, schema `1.0.0`, 6 blocks, 58/58 |
| Block editor enabled for `page` / `gemstone` | **yes / NO — this is where DEFECT-2 was found.** See §8 and §15 |
| Registered blocks | 6 |
| Registered page-design patterns | 7 |
| `/governance/` block tree | 4 top-level sections, 8 wrappers, 4 repeatables, 14 content leaves |
| Roles registered | Marketing Editor, Marketing Publisher, Compliance Reviewer |
| Marketing role separation | as tabulated in §9 — no `manage_options`, no `unfiltered_html`, no plugin or theme rights |

### Logs

`nginx` error log carries no new entries attributable to the deployment. The two
present are an external scanner denied on `/readme.html` and this session's own
OPcache probe denied by the vhost's `location ~ ^/gr-[a-z-]+\.php$` rule — the
security rule working. `php8.4-fpm` journal: no entries. No PHP warning or fatal
appeared during or after the deployment.

### Services

| Service | State | Touched? |
|---|---|---|
| `nginx.service` | active, since 2026-07-21 | **no** |
| `php8.4-fpm.service` | active, since 2026-08-27 | **no** |
| `mysql.service` | active | **no** |
| `gemreserve-next.service` | active, since 2026-09-03 20:21:26 | **no** |
| `clp-nginx.service`, `varnish.service` | active | **no** |

`gemreserve-next.service` remains healthy on `127.0.0.1:3000` and off the public
path.

---

## 12. Renderer parity, and why it cannot affect this deployment

`CMS_VISUAL_REGRESSION_REPORT.md` §2 records 268/268 sections identical across
the two renderers, with three routes diverging:

| Gap | Cause | Classification |
|---|---|---|
| `/` | The theme renders the home page from `front-page.php`; Next.js renders the hand-written `app/page.tsx`. They have always differed (`aria-label="Why GemReserve?"` vs `"GemReserve trust pillars"`). | **Pre-existing**, unrelated to blocks or this migration |
| `/how-it-works/`, `/participant-portal/` | `gemreserve-empty-alt-fix` is an `ob_start()` plugin that rewrites the whole HTTP response. JSON-escaped quotes in the REST payload do not match its regex, so the API consumer receives `alt=""`. | **A property of the headless path**, not of the migration |

**Neither can affect the deployed path, and this was established from the
configuration rather than argued:**

- the loaded nginx config contains **0** `proxy_pass` directives and **0**
  references to `:3000`;
- WordPress defines none of `GEMRESERVE_RENDERER_URL`,
  `GEMRESERVE_REVALIDATE_URL` or `GEMRESERVE_REVALIDATE_SECRET`;
- no production plugin or theme file references the renderer.

The Next.js renderer is not on the request path and is never invoked by
WordPress. Both gaps must be closed **before any headless cutover**, and the
`ob_start()` one generalises: **output-buffering plugins do not reach API
consumers.** That cutover is not part of this deployment.

### Visual regression — reported honestly, not claimed

The pixel comparison from the previous engagement is **not presented as a
pass**. A control run capturing twice in the *same* database state reproduced
differences of the same magnitude, with several files reporting identical
percentages in both comparisons. At that tolerance the comparison cannot
discriminate; scroll-reveal animation and lazy-loaded images dominate it.

The authoritative evidence is the byte comparison across all 88 routes, which is
strictly stronger: with identical HTML, identical CSS and 512 verified-identical
asset checksums, there is nothing left for a pixel to differ about.

---

## 13. Rollback readiness

The verified backup and the rollback script were in place before activation and
remain ready. Three levels, fastest first:

```bash
# Level 1 — seconds, no database change. The theme asks the plugin whether a
# page is block-based, so with the plugin gone every page renders from
# _gr_body_html, which the migration never deletes.
wp plugin deactivate gemreserve-visual-cms

# Level 2 — restore the 58 bodies from their snapshots.
wp gemreserve rollback --apply --allow-production

# Level 3 — restore the six files and remove the plugin directory.
#   Originals live OUTSIDE the web root, at
#   <backup>/pre-deploy-originals/, and each was verified byte-identical
#   to git main after being moved there. See §16 for why they are not
#   kept beside their targets.
```

All three are wrapped by `rollback-prod.sh <STAMP> [1|2|3]`, and all three were
exercised on staging: level 1 and level 2 both returned 88/88 byte-identical
routes with SEO, sitemap and `post_modified` unchanged.

The plugin's own previous version is kept on the host at
`wp-content/plugins/.gr-orig-gemreserve-visual-cms-20260904T021133Z`. It is
dot-prefixed, so the vhost's `location ~ /\. { deny all; }` refuses it — 
verified returning 403, unlike the six files in §16.

Level 4, restoring the database, was proven by the recovery drill in §6 — 3 s.

**A Git-based rollback would be wrong here** and was not used: sixteen of the
eighteen active plugins are outside version control, and `git checkout` plus
`deploy.sh` would delete them — including `gemreserve-leadership-profiles`,
which carries the mandated director identity and a stylesheet the responsive
layout depends on. The file-scoped method above cannot do that.

---

## 14. Remaining blockers and outstanding items

### BLOCKER-A — marketing roles cannot edit the 18 gemstones (new, reported not worked around)

`gemstone` is registered with `capability_type => 'post'`, so reaching it needs
`edit_others_posts` and `edit_published_posts`. Those are shared with
`gr_document` — the **compliance-controlled** type reviewed by the Compliance
Reviewer role — and with `gr_news`, `gr_faq` and `post`.

Granting them to a marketing role to reach gemstones would also hand it the
controlled documents. That is a separation-of-duties breach, so it was **not
done**. An administrator can edit gemstones today; marketing cannot.

*Fix, for a separately reviewed change:* give `gemstone` its own capability set
(`capability_type => ['gemstone','gemstones']`) in `gemreserve-core` and grant
those to the marketing roles. That is a change to `gemreserve-core`'s content
model and is outside this deployment's approved scope.

### BLOCKER-B — client acceptance has not been recorded

The eleven acceptance tests are automated and passing, but **no member of the
marketing team has performed them and signed off.** That signature is what
Phase 2 needs and is not something this work can supply for itself.

*Needs:* a marketing user working through `CMS_ACCEPTANCE_TESTS.md`, and an
account — none exists on production yet; only `gr_admin` (administrator) and
`chatgpt` (editor). Creating marketing accounts is the client's call.

### BLOCKER-C — the deployed branch is not pushed — **CLOSED**

Closed on 2026-09-04. The branch is pushed to `origin` at `24ad10c`, in sync
with local, as the repository owner. `origin/main` is untouched at `f3a46ad`
and no merge was performed. See §17.

### DRIFT-2 — production credentials readable by the deploy account (pre-existing)

`/home/hamza/.gemreserve-wp-db.env` holds production database credentials and
URLs, mode 600 owned by `hamza`. It is the root cause of Incident 1 and the
documentation describing it as "staging only … cannot reach production" is
false. Not changed here — rotating or removing production credentials is outside
this deployment — but it should be resolved.

### DRIFT-1 — seventeen of eighteen active plugins are outside version control (pre-existing)

Only `gemreserve-core` and now `gemreserve-visual-cms` are in the repository.
`wp-config.php` was relaxed on 2026-09-01 (`DISALLOW_FILE_MODS` true → false)
so the client could upload a plugin package; that relaxation is still in place
and explains how the others arrived. `/root/gemreserve-gr-admin-original-role.txt`
records the change and its rollback. Restoring it is a client decision, recorded
here because nobody can currently say what production runs from a commit hash.

### Outstanding, not blockers

| Item | Note |
|---|---|
| `DISALLOW_FILE_MODS` still `false` | Restore to `true` once the client confirms plugin installation is finished. Rollback steps are in the file above. |
| `wp-cron` | Still fires on visitor traffic; scheduled publishing will be late on a low-traffic site. Not changed — altering production cron needs approval. |
| 2FA for Marketing Publisher | Written but off, and marketing roles are not in the required list. That role can change what the public sees; enabling it is recommended. |
| Leadership registry | Still hardcoded PHP in an uncommitted plugin (IDENT-1). Unchanged: identity content is not rewritten without the controlling documents, which were not located. |
| The two renderer parity gaps | Must be closed before any headless cutover. |

---

## 15. The second deployment — closing DEFECT-2

DEFECT-2 was found by the post-deployment editor verification in §11, after the
migration had run. The public site was byte-identical and healthy throughout, and
no marketing account existed on production to be exposed to it, so the correct
response was to close it rather than tear down a deployment whose public surface
was verified perfect. It was reproduced on staging, fixed, re-verified there,
then deployed by the same reversible method.

| | |
|---|---|
| Commit | `b86401e` |
| Artefacts | `wp-content/plugins/gemreserve-visual-cms/` only — 5 files changed |
| Theme and `gemreserve-core` | **not touched** (verified identical before and after) |
| Method | atomic directory swap: two `rename()` calls, so the plugin is wholly old or wholly new — never a mixed set of files against a stale OPcache entry |
| Swap window | **0.0059 s** |
| Previous version | kept at `.gr-orig-gemreserve-visual-cms-20260904T021133Z` |

Verified immediately after:

| Check | Result |
|---|---|
| Block editor for `page` / `gemstone` | **block editor / block editor** — defect closed |
| `gr_document` / `gr_faq` | classic — unchanged, as intended |
| Plugin | active, 6 blocks registered |
| 88 routes | **88 identical / 0 differ** |
| SEO surface | **identical** |
| `robots.txt`, all three sitemap URLs | **identical**; 0 `lastmod` changed |
| HTTP status and final URL, 88 routes | unchanged |
| 88 database rows | identical to pre-deployment |
| `gemreserve verify` | 58/58 |
| 512 theme assets | unchanged |

---

## 16. An incident this session caused, and closed

### The kept originals were web-readable for 74 minutes

**What happened.** `deploy-prod.sh` kept each replaced file beside its target as
`<file>.gr-orig-20260904T002751Z`, so that rollback would be a rename rather than
an unpack. That was a mistake, and the vhost is the reason why:

```nginx
location ~* /wp-content/(themes|plugins|mu-plugins)/.+\.php$ { deny all; }
```

The rule matches paths **ending** in `.php`.
`page.php.gr-orig-20260904T002751Z` does not end in `.php`, so it matched
nothing that denies, fell through to `try_files`, and nginx served it as a
static file.

**Measured, not estimated.** Six files were reachable and returned HTTP 200 with
their PHP source as plain text:

| Path | Bytes |
|---|---|
| `themes/gemreserve/page.php.gr-orig-…` | 1,283 |
| `themes/gemreserve/single-gemstone.php.gr-orig-…` | 3,934 |
| `themes/gemreserve/front-page.php.gr-orig-…` | 906 |
| `themes/gemreserve/functions.php.gr-orig-…` | 9,311 |
| `plugins/gemreserve-core/includes/admin-menu.php.gr-orig-…` | 7,976 |
| `plugins/gemreserve-core/includes/settings.php.gr-orig-…` | 8,705 |

This is theme and plugin **source disclosure**. It is the pre-remediation
version of code that is in this repository, so nothing secret was in it — no
credential, salt, key or token appears in any of the six, which was checked
rather than assumed. It should still never have been reachable.

The plugin's own kept copy, `.gr-orig-gemreserve-visual-cms-20260904T021133Z`,
was **not** affected: it is dot-prefixed, and `location ~ /\. { deny all; }`
matches it. That is what the other six should have been.

**Exposure window.** Created 01:11:04 UTC, removed 02:25:23 UTC — **74 minutes
16 seconds**. That is longer than it should have been, and the reason is that
the filesystem-write audit which found it runs at the end of the verification
sweep rather than inside the deployment step.

**Who reached them.** The nginx access log carries exactly nine requests for any
of the six paths, and all nine are this session's own `curl/8.5.0` probes: three
at 02:25:06 that found the problem (HTTP 200) and six at 02:25:24 that confirmed
the fix (HTTP 404). **No third party requested any of them.** The only other
traffic in the window was a bot probing for `.env`, `Dockerfile` and
`serviceAccountKey.json`, all refused by the vhost.

**Remediation.** The six were moved out of the web root entirely, to
`<backup>/pre-deploy-originals/`, mode 700. All six now return **404**. Each was
verified byte-identical to `git main` after the move, so the rollback path is
unchanged in capability and `rollback-prod.sh` level 3 now restores from there.
The comment in that script names the trap so the next person does not re-lay it.

**Root cause.** A deploy step placed new files inside the web root and reasoned
about the vhost's protection from memory instead of testing it. The check that
found it was the post-deployment filesystem-write audit — which is the check
that exists for this — but it should have been part of the deployment step
rather than a sweep afterwards.

No other file was written anywhere under `/var/www/GemReserve/wordpress` during
the deployment: an audit of everything modified since 01:10 UTC returns exactly
the six theme and `gemreserve-core` files, plus the plugin directory. Uploads:
zero files modified.

---

## 17. Git and release records

| Commit | Subject |
|---|---|
| `a4d3fcb` | Stop the template's own indentation leaking into the page *(previous session)* |
| `d019a9c` | Refuse to migrate a production site without being told to *(previous session)* |
| `9c42b22` | Record the blocked deployment and the two incidents *(previous session)* |
| `c86a28d` | Stop the migration from telling crawlers the whole site changed |
| `b86401e` | Give the migrated gemstones the editor the migration assumes they have |

**Branch:** `phase-2-headless-visual-cms-remediation`
**Deployed commit:** `b86401e25d5783b9d5061e663fdcb5c5adefcd01`

The working tree carries only the two pre-existing untracked directories
`contracts/` and `services/` (Phase 3–6), which were not modified. No Phase 3–6
branch, contract, service, wallet, RPC, token or financial component was
touched. No branch was force-pushed, rebased or deleted. No merge into `main`
was performed — that was not authorised.

**The branch is pushed.** On 2026-09-04 it was pushed to
`git@github.com:lonadonia/GemReserve.git` as the repository owner (`hamza`,
using that account's existing credentials — nothing was copied to root):

    origin/phase-2-headless-visual-cms-remediation  24ad10c
    local  HEAD                                     24ad10c   (in sync)
    origin/main                                     f3a46ad   (untouched)

20 commits ahead of `main`. **No merge into `main` was performed** — that was
not authorised. GitHub offers a pull request at
`https://github.com/lonadonia/GemReserve/pull/new/phase-2-headless-visual-cms-remediation`
when the client wants one.

An earlier attempt in the same session was refused by the tooling's permission
policy and the report said so; the refusal was later lifted and the push
completed. The record is corrected here rather than left contradicting itself.

### Provenance — what is on production, checked against the commit

Every deployed artefact was compared against `git archive b86401e` after the
deployment, not assumed from the package that produced it:

| Artefact | Result |
|---|---|
| `themes/gemreserve/page.php` | byte-identical to `b86401e` |
| `themes/gemreserve/single-gemstone.php` | byte-identical to `b86401e` |
| `themes/gemreserve/front-page.php` | byte-identical to `b86401e` |
| `themes/gemreserve/functions.php` | byte-identical to `b86401e` |
| `plugins/gemreserve-core/includes/admin-menu.php` | byte-identical to `b86401e` |
| `plugins/gemreserve-core/includes/settings.php` | byte-identical to `b86401e` |
| `plugins/gemreserve-visual-cms/` (30 files) | byte-identical to `b86401e` |

So the question "what is production running?" now has an answer that is a commit
hash — for these artefacts. It still does not for the sixteen plugins outside
version control; see DRIFT-1 in §14.

### Deployment package

Built by `wordpress/deploy/build-cms-package.sh`, which refuses a dirty tree and
assembles with `git archive`, so the deployed artefacts are reproducible from
the commit hash alone.

    branch    phase-2-headless-visual-cms-remediation
    commit    b86401e25d5783b9d5061e663fdcb5c5adefcd01
    files     102

---

## 18. Evidence index

Backup and rollback material, outside the repository and not committed:

    /var/www/GemReserve/backups/cms-deploy-20260904T002751Z/

| Artefact | SHA-256 (first 16) |
|---|---|
| `dump.err` | `0c1cd76197e2dcb8…` |
| `etc-gemreserve-wordpress.env.bak` | `62c8f54c848fa64c…` |
| `git-state.txt` | `5a1c5fdc981e0b8e…` |
| `nginx-nginx.conf.bak` | `64f2c5aa6264a77f…` |
| `nginx-www.gemreserve.io.conf.bak` | `ede64e6bfbc58f4f…` |
| `permissions-manifest.txt` | `8519531c32ae042b…` |
| `php-fpm-8.4-pool-default.conf.bak` | `97637aeca72b4580…` |
| `plugins-all-20260904T002751Z.tar.gz` | `b92c5896b79b6dc3…` |
| `pre-deploy-originals/plugins/gemreserve-core/includes/admin-menu.php` | `a42f5f07e8d3cf49…` |
| `pre-deploy-originals/plugins/gemreserve-core/includes/settings.php` | `9cf6693b5cc3c283…` |
| `pre-deploy-originals/themes/gemreserve/front-page.php` | `656232484b05c4ac…` |
| `pre-deploy-originals/themes/gemreserve/functions.php` | `c2e46d7fd81319ec…` |
| `pre-deploy-originals/themes/gemreserve/page.php` | `1e1acd601ce59aa1…` |
| `pre-deploy-originals/themes/gemreserve/single-gemstone.php` | `66ea8bb0958ebcf0…` |
| `prod-db-20260904T002751Z.sql` | `53d3e7e78c370240…` |
| `service-state.txt` | `762475e36b2790ed…` |
| `tar-wp-content.err` | `e3b0c44298fc1c14…` |
| `theme-gemreserve-20260904T002751Z.tar.gz` | `a538958e879b0881…` |
| `uploads-20260904T002751Z.tar.gz` | `4e663870df952690…` |
| `wp-config.php.bak` | `de154c09071bc88b…` |
| `wp-content-20260904T002751Z.tar.gz` | `9f1b749c753c4d69…` |
| `wp-salts.php.bak` | `461f23122bd323bc…` |

The backup directory also holds `pre-deploy-originals/` — the six theme and
`gemreserve-core` files as they were before the deployment, each verified
byte-identical to `git main`. That is the level-3 rollback source; see §16 for
why it is there rather than beside the live files.

Route captures, SEO snapshots, migration reports and staging runs are under this
session's scratchpad:

| Path | Contents |
|---|---|
| `prod/baseline-A`, `prod/baseline-B` | 88-route captures before any change, 45 min apart |
| `prod/d1-files`, `d2-active`, `d4-migrated`, `e1-fixed` | 88-route captures after each deployment step |
| `prod/seo-baseline.tsv` … `seo-e1.tsv` | SEO snapshots at each stage |
| `prod/status-baseline.tsv`, `status-after.tsv`, `status-e1.tsv` | HTTP status and final URL for all 88 |
| `prod/migration-dry-run.csv`, `migration-apply.txt` | the production migration reports |
| `prod/rows-*.tsv` | row counts and the 88-row detail, before and after |
| `prod/theme-assets-*.sha256` | 512 asset checksums at three points |
| `staging/h0`, `h1`, `h2` | staging captures across activation and migration |
| `staging/unit-suite*.txt` | unit suite output |
| `qa/cms/results/acceptance.json` | acceptance suite results |

No secret, password, salt, API key or cookie appears in this report, in the
repository, or in any committed file.

---

## 19. Marketing acceptance suite

Run through the real WordPress admin in a real browser, as the restricted
marketing roles (`gr_marketing_editor`, `gr_marketing_publisher`) — never as an
administrator — against the isolated staging clone. The suite refuses to start
against anything that is not `127.0.0.1` or `localhost`, because it creates,
edits and deletes content.

**12 passed, 0 failed (5.6 min).**

| ID | Requirement | Result |
|---|---|---|
| AT-01 | Edit the content of an existing page | Pass (24.9 s) |
| AT-02 | Replace text and images | Pass (23.5 s) |
| AT-03 | Add and remove a page section | Pass (18.5 s) |
| AT-04 | Reorder sections | Pass (19.1 s) |
| AT-05 | Add and duplicate a card | Pass (25.9 s) |
| AT-06 | Modify navigation and footer | Pass (15.4 s) |
| AT-07 | Update page SEO | Pass (33.7 s) |
| AT-08 | Preview desktop and mobile output | Pass (21.6 s) |
| AT-09 | Save a draft and publish it | Pass (51.4 s) |
| AT-10 | Create a new page from the approved design | Pass (53.5 s) |
| AT-11 | Restore a previous version | Pass (32.2 s) |
| **AT-G1** | **A migrated gemstone opens in the block editor and edits reach the public page** | **Pass (15.2 s)** — new |

AT-G1 is new and is the regression test for DEFECT-2. It asserts that the editor
canvas exists at all — with the classic editor there is no canvas, so the test
fails outright rather than passing on a page that merely looks empty — and that
an edit made through it reaches the public gemstone page.

**One honest note on flakiness.** An earlier twelve-test run reported AT-11 as
failed with *"Tearing down 'context' exceeded the test timeout of 120000ms"* —
a browser-context teardown at the end of a 7.3-minute run, with no assertion
failure and an empty error-details block. AT-11 was then re-run alone and passed
in 32.4 s, and passed again in the clean twelve-test run above. It is reported
here as harness flakiness under load rather than quietly dropped.

The QA personas (`qa_admin`, `qa_editor`, `qa_publisher`) exist **only on the
isolated staging database** and were never created on production — production
still holds exactly two users, `gr_admin` and `chatgpt`, unchanged.

**This is automated verification, not client acceptance.** It demonstrates the
software can do these things; it does not demonstrate that a marketing user
finds them usable, which is the question §30 asks and which BLOCKER-B covers.

---

## 20. Monitoring after deployment

Production was re-verified in full, on a schedule, after the last change — not
sampled. Each pass repeats the whole check set: the 88-route byte comparison
against the pre-deployment baseline, the SEO snapshot, `robots.txt`, all three
sitemap URLs, the 88-row database detail, content counts, `gemreserve verify`,
the editor gating, the health endpoint, login and admin reachability, service
state, the Next.js rollback service, and the 512 theme asset checksums.

| | Pass 1 | Pass 2 | Pass 3 | Pass 4 |
|---|---|---|---|---|
| Time (UTC) | 02:15:45 | 02:20:02 | 02:31:29 | 03:07:25 |
| 88 routes vs baseline | identical | identical | identical | identical |
| SEO surface | identical | identical | identical | identical |
| `sitemap.xml` | identical | identical | identical | identical |
| `robots.txt` | identical | identical | identical | identical |
| 88 database rows | identical | identical | identical | identical |
| migrated / legacy / newer | 58 / 58 / 30 | 58 / 58 / 30 | 58 / 58 / 30 | 58 / 58 / 30 |
| users / comments | 2 / 0 | 2 / 0 | 2 / 0 | 2 / 0 |
| `gemreserve verify` | 58/58 | 58/58 | 58/58 | 58/58 |
| Block editor, page / gemstone | block / block | block / block | block / block | block / block |
| Health endpoint | 58/58, schema 1.0.0 | 58/58, schema 1.0.0 | 58/58, schema 1.0.0 | 58/58, schema 1.0.0 |
| `wp-login.php` / `wp-admin` | 200 / 200 | 200 / 200 | 200 / 200 | 200 / 200 |
| nginx, php8.4-fpm, mysql, gemreserve-next | all active | all active | all active | all active |
| Next.js on `127.0.0.1:3000` | 200 | 200 | 200 | 200 |
| 512 theme assets | unchanged | unchanged | unchanged | unchanged |

Pass 4 ran 36 minutes after the last change to production and 52 minutes after
the migration, and is identical to the first three in every row.

No route returned anything but 200 in any pass. No new PHP, nginx or WordPress
error appeared. The only entries in the nginx error log during the window are
external scanner traffic — a bot probing for `.env`, `Dockerfile`,
`serviceAccountKey.json` and similar — correctly refused by the vhost's own deny
rules, plus one request for `/readme.html`. `journalctl -u php8.4-fpm.service`
has no entries, and `wp-content/debug.log` is 0 bytes.

---

## 21. Notion status recommendation

```
Phase 2 — In Progress — CMS DEPLOYED, MARKETING ACCEPTANCE PENDING
```

**Phase 2 must not be marked Completed.** The technical deployment is done and
verified, but §30's precondition — a marketing user working through the eleven
acceptance scripts and recording the result — has not happened, and BLOCKER-A
means one of those users cannot yet reach the 18 gemstone pages at all.

Phase 3–6 statuses are unmodified.

---

## 22. Assessment

The claims inherited from the previous session were not taken on trust. They
were reproduced against a staging copy rebuilt from a **fresh** production
backup with all seventeen production plugins active — the re-verification
`CMS_DEPLOYMENT_READINESS.md` BLOCKER-3 called "a precondition of deployment,
not a formality".

That found two defects that would otherwise have shipped. One would have told
every crawler that 53 of 87 pages changed on a day when their bytes did not. The
other would have left a third of the migrated site one save away from having a
57 KB body rewritten to 31 KB. Neither was visible in an environment missing the
plugins that production actually runs, which is the whole argument for rebuilding
staging from the current backup rather than reusing a working one.

The second defect was found **after** the migration had run, by the
post-deployment editor check rather than before it. That is later than it should
have been found: the eleven acceptance tests all drive `page` routes, so a
gemstone was never opened in a browser until this session opened one. The gap is
now covered by AT-G1 and by four unit assertions that tie the migration's
candidate query and the editor filter to a single constant.

What is not fixed is stated plainly rather than smoothed over: the marketing
roles still cannot edit the 18 gemstones, because the only capabilities that
would let them also unlock the compliance-controlled documents. Granting them
would have made the acceptance criteria read as met while quietly breaking a
separation of duties. That trade was not made.

Against that, this session introduced a source-disclosure of its own (§16) by
placing rollback copies inside the web root and reasoning about the vhost's
protection from memory rather than testing it. The measured impact was small —
six pre-remediation source files, no credential in any of them, no third-party
request in 74 minutes — and it is fixed. But it is the same shape as the
previous session's Incident 1: a convenience in a deploy tool that assumed
something about its environment instead of checking. The lesson that generalises
is that a deployment step which writes a new path into a document root has to
prove that path is unreachable, in the same breath, before it moves on.

---

## 23. Statement on production state

At the time of writing, production serves all 88 public routes at HTTP 200,
byte-identical to the baseline captured before any change, with an identical SEO
surface, an identical `robots.txt`, an identical sitemap — including every
`<lastmod>` — and identical ids, slugs, parents, statuses, publish dates and
modification dates across all 88 rows.

58 page and gemstone bodies are now editable Gutenberg blocks. The legacy bodies
are retained on every row, so rollback remains a metadata flip. Nothing was lost,
duplicated or altered: no user, comment, term or published page was added or
removed, and the 30 newer pages authored by another party are untouched.

The only files under the WordPress root that differ from their pre-deployment
state are the seven deployed artefacts, each byte-identical to commit `b86401e`.
The six rollback copies that were briefly reachable over HTTP (§16) have been
moved out of the document root and return 404.

WordPress remains the public renderer. No nginx, DNS, TLS, PHP, Node.js or
operating-system configuration was changed, and no service was restarted or
reloaded. `gemreserve-next.service` has been running continuously since
2026-09-03 20:21:26 UTC, which predates this session.

---

## 24. Decision

**CMS DEPLOYED SUCCESSFULLY — MARKETING ACCEPTANCE PENDING**
