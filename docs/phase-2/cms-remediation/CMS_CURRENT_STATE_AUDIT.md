# CMS Current State Audit

**Date of inspection:** 2026-09-02
**Inspected by:** Phase 2 CMS remediation
**Method:** read-only inspection of the live host, the production database and the Git repository. No production write was performed at any point during this audit.

---

## 1. What is actually serving the public site

The brief allowed that production might be WordPress, Next.js or a hybrid, and said not to assume. It was determined by request, not by inference:

```
$ curl -sSI https://www.gemreserve.io/
HTTP/2 200
link: <https://www.gemreserve.io/wp-json/>; rel="https://api.w.org/"
link: <https://www.gemreserve.io/wp-json/wp/v2/pages/4>; rel="alternate"
```

**WordPress is the live public renderer.** The `wp-json` alternate link naming page ID 4 is emitted by WordPress's own template head, not by a proxy.

The topology behind the edge:

| Port | Process | Role |
|---|---|---|
| `127.0.0.1:3200` | `php` (PHP-FPM pool) | **Live.** WordPress, theme-rendered. |
| `127.0.0.1:3000` | `next-server` | Rollback Next.js, release `2026-08-29-164814`, held by `gemreserve-next.service`. |
| `127.0.0.1:3100` | `next-server` | Second Next.js instance, same content. |

Both Next.js services return HTTP 200 and serve the same design. They are a live rollback target, not the public path.

Nginx is CloudPanel-managed (`clp-nginx.service`); `/etc/nginx/sites-enabled/` is empty and `/etc/nginx` is not readable by the deploy account, so the vhost could not be read directly. The expected path in the brief, `/etc/nginx/sites-enabled/www.gemreserve.io.conf`, **does not exist**. This is recorded as an unverified area rather than guessed at.

### Consequence for the architecture

The brief's §11 says to build the Next.js block renderer *"if Next.js remains the public presentation layer"*. It does not. That conditional is what shapes the delivered architecture — see `CMS_TARGET_ARCHITECTURE.md`.

---

## 2. Versions and installed code

| Component | Version |
|---|---|
| WordPress | 7.1 |
| PHP (FPM and CLI) | 8.4.24 |
| MySQL | 8.4.11-11 (Percona Server) |
| WP-CLI | 2.12.0 |
| Theme | `gemreserve` 1.0.0 (only theme installed) |

Active plugins:

| Plugin | Version | In Git? |
|---|---|---|
| `gemreserve-core` | 1.0.0 | Yes |
| `two-factor` | 0.16.0 | No (third-party) |
| `circumflex-booking` | 1.3.5 | **No — see §7** |
| `gemreserve-leadership-profiles` | 1.1.5 | **No — see §7** |

---

## 3. The actual defect

The client's complaint is that migrated page bodies are not editable. The cause is specific and was confirmed against the database rather than inferred from the notice text.

**Every one of the 40 published pages has an empty `post_content`:**

```sql
SELECT ID, post_name, LENGTH(post_content) AS len FROM gr_posts
 WHERE post_type='page' AND post_status='publish';
-- len = 0 for all 40 rows
```

The page body lives instead in a single post-meta blob:

| Meta key | Rows | Mean length | Max length |
|---|---:|---:|---:|
| `_gr_body_html` | 40 | 22,193 | 53,254 |
| `_gr_hero_extra_html` | 14 | 2,689 | 13,620 |

That is ~964 KB of raw, hand-designed HTML held in `postmeta` and printed unescaped by the theme (`themes/gemreserve/page.php`):

```php
$body = gr_field('body_html');
if ($body) {
    echo gemreserve_prepare_body_html($body);
}
```

Two further findings compound it:

1. **The block editor is switched off for pages.** `gemreserve-core/includes/admin-menu.php` filters `use_block_editor_for_post_type` to `false` for `page`, `gemstone`, `gr_document` and `gr_faq`. Gutenberg is not merely unhelpful on these pages; it is disabled.

2. **The structured section renderer is dead code.** `themes/gemreserve/inc-sections.php` implements five section types (`pillars`, `steps`, `panel`, `cta`, `richtext`) driven by a `_gr_section_json` field. But the field as populated by the migration contains provenance, not sections:

   ```json
   {"migrated_from":"/","source_sections":[{"cls":"hero","heading":"","height":577}, …]}
   ```

   `gemreserve_render_sections()` iterates this looking for `['type']` keys, finds none, and renders nothing. Every visible section on every page comes from `_gr_body_html`.

The admin notice the client quoted is therefore accurate about the situation and is not itself the problem:

> "…the body is managed by the migration and is not editable here."

---

## 4. Content inventory

| Post type | Status | Count |
|---|---|---:|
| `page` | publish | 40 |
| `gemstone` | publish | 18 |
| `nav_menu_item` | publish | 152 |
| `revision` | inherit | 37 |
| `gr_news` | auto-draft | 3 |
| `gr_waitlist` | private | 1 |

**40 pages + 18 gemstones = 58 public routes**, matching the 58 `page.tsx` routes in the Next.js tree exactly. All 58 were confirmed to return HTTP 200 (see `evidence/route-baseline.md`).

Page hierarchy is four levels deep in places (`/resources/whitepaper`, `/early-participation/eligibility-kyc`) and is carried by `post_parent`, with flat public URLs produced by `gemreserve-core/includes/flat-permalinks.php`.

### Structural survey of the page bodies

Measured across all 40 bodies:

| Measure | Value |
|---|---:|
| `<section>` elements | 187 (176 top-level, 11 nested) |
| `<li>` elements | 1,135 |
| Distinct `<li>` internal structures | 30+ |
| Candidate repeatable lists | 220 |

The long tail of item structures is the central design constraint on this remediation and is discussed in `CMS_TARGET_ARCHITECTURE.md` §2.

---

## 5. Media

**The Media Library contains one file.** Every image on the public site is referenced by a filesystem path baked into the migrated HTML, pointing at theme assets:

```
/wp-content/themes/gemreserve/assets/images/plates/reg-creation.webp
```

The migrated markup also carries Next.js-generated `srcset` attributes in which **every candidate resolves to the same file** at fifteen different width descriptors — an artefact of exporting `next/image` output to static HTML. It is not a functional responsive image set.

This is the §18 remediation target and is addressed in `CMS_MEDIA_REMEDIATION.md`.

---

## 6. REST API

Existing namespaces: `oembed/1.0`, `two-factor/1.0`, `circumflex-booking/v1`, `wp/v2`, `wp-site-health/v1`, `wp-block-editor/v1`, `wp-abilities/v1`.

**There is no `gemreserve/v1` namespace.** The custom post types (`gr_document`, `gr_faq`, `gr_news`) are exposed through the stock `wp/v2` controllers. No versioned content API exists, and no preview or revalidation endpoint exists.

---

## 7. Production drift (findings)

### DRIFT-1 — Two plugins installed outside version control (Medium)

`circumflex-booking` (1.3.5, 283 files, third-party) and `gemreserve-leadership-profiles` (1.1.5, in-house) are present and active on production, owned by `www-data`, dated 2026-09-01 — after the last commit on `main`. Neither is in the repository.

`circumflex-booking` has created **15 tables** in the production database (`gr_cfxb_*`). `gemreserve-leadership-profiles` enqueues a stylesheet described as repairing "the responsive public site shell" on *every* public route, which means an uncommitted hotfix is currently load-bearing for the site's responsive behaviour.

This matters for two reasons: a redeploy from Git does not reproduce production, and a rollback to a Git commit would silently remove a stylesheet the live layout depends on.

Note that `wp-config.php` sets `DISALLOW_FILE_MODS = true`, which should prevent dashboard-driven installs. The `www-data` ownership and timestamps are consistent with installation through the filesystem by a process running as the web user. **How these arrived was not determined and is outside this task's scope, but it should be established before the next production deployment.**

### DRIFT-2 — Production database credentials readable by the deploy account (Medium)

`wp-config.example.php` documents a credentials search order in which `/home/hamza/.gemreserve-wp-db.env` is described as:

> "staging only, mode 600, owned by the deploy user … Production php-fpm runs as www-data and cannot read it, which is the point: if the production file is missing, the site fails rather than quietly falling through to a staging database."

The file exists, is mode 600 and owned by `hamza` as described. **Its contents are production**: `DB_NAME=gemreserve-wp`, `WP_HOME=https://www.gemreserve.io`. The documented safety property — that this path cannot reach production data — does not hold. Any process running as `hamza` has full read/write access to the live database.

No credential value is reproduced in this document or anywhere in the repository.

### DRIFT-3 — `wp-config.php` unreadable by the deploy account (informational)

`wp-config.php` is `root:www-data 0640`. WP-CLI therefore cannot bootstrap production as `hamza`, and `/etc/gemreserve/` is not listable. This is correct hardening and is recorded only because it shapes what could be verified: all WP-CLI work in this task ran against the isolated staging instance described in `CMS_MIGRATION_RUNBOOK.md`.

---

## 8. Corporate identity check (§13)

The controlling identity was checked against all 40 page bodies, the theme, the plugin and the site options.

| Required value | Where it lives | Result |
|---|---|---|
| UAB GemVault Capital | `gr_options.gr_company_legal_name` | Pass |
| Company code 307501935 | `gr_options.gr_company_code` | Pass |
| Girulių g. 20, Vilnius, LT-12123 | `gr_options.gr_company_address_1` / `_2` | Pass |
| `https://www.gemreserve.io` | `WP_HOME` / `WP_SITEURL` | Pass |
| Ramon Ernesto Lora Arias, President/Director | **Hardcoded in an uncommitted plugin** | **Pass, but see IDENT-1** |

Prohibited legacy content scanned for: Swiss company claims, Zurich or Zug addresses, `+41` telephone numbers, `CHE-` Swiss UID numbers, Bahnhofstrasse, "Built in Switzerland".

**No prohibited legacy content was found.** Full scan output: `evidence/legacy-content-scan.txt`.

One apparent hit warranted checking and is recorded so the scan output is not misread. A case-insensitive search for `CHE-` — the Swiss UID prefix — matched one file. The match is inside an image filename:

```
/wp-content/themes/gemreserve/assets/images/gems/ruby-trapiche-rough.webp
                                                        ^^^^^
```

A case-sensitive search for `CHE-` returns nothing anywhere. There is no Swiss company identifier on the site.

### IDENT-1 — The mandated director identity is not under version control (Medium)

"Ramon Ernesto Lora Arias, President/Director" is a required identity element. It appears on the public site in exactly one place: the leadership cards rendered by `gemreserve-leadership-profiles`, the uncommitted plugin from DRIFT-1, where the name, role and portrait filename are **hardcoded in PHP**:

```php
<h3>Ramon Ernesto Lora Arias</h3>
<p class="gr-leadership-card__role">President &amp; Chairman of the Board</p>
```

Three consequences:

1. A Git-based rollback to any commit on `main` removes a mandated identity element from the public site, because the plugin that carries it is not in any commit.
2. The marketing team cannot change a leadership name, role or portrait without a developer editing PHP — which is the exact class of problem this remediation exists to fix.
3. The value is not in the database, so it is absent from the corporate-identity settings screen where every other identity field lives.

**No content was rewritten.** Per §13 of the brief, legal and identity content is not edited without controlling-document authority, and the controlling documents could not be located (§9). This is recorded for client review, and `CMS_TARGET_ARCHITECTURE.md` §7 describes the leadership registry as editable content so the fix is available when authorised.

---

## 9. Documents sought and not found

The brief asked that specific controlling documents be read. A filesystem-wide search was run for each. The following **could not be located and their contents are not assumed anywhere in this work**:

| Document | Status |
|---|---|
| Final Master Developer Instructions v1.5 | **Not found** |
| White Paper (any version) | **Not found** as a document. `/whitepaper` exists as a page; `content/whitepaper.ts` is page copy, not the paper. |
| WordPress improvement request | **Not found** |
| Phase 1 report | **Not found** (`docs/phase-1-implementation-plan.md` exists; it is a plan, not a report) |
| Phase 2 report | **Not found** — no `docs/phase-2/` existed before this task |
| Migration report | Partially: `wordpress/gr-import-report.json` (112 bytes) and the `wordpress/migrations/` scripts |
| CMS test report | **Not found** |
| Route acceptance matrix | **Not found** |
| Backup/rollback documentation | Found: `docs/DEPLOYMENT.md`, `wordpress/deploy/gr-backup.sh` |

Documents that were found and read: `docs/WORDPRESS.md`, `docs/DEPLOYMENT.md`, `docs/ENVIRONMENT.md`, `docs/PRODUCTION_READINESS_AUDIT.md`, `GemReserve_Website_Design_and_Implementation_Spec.md`.

---

## 10. Repository state at the start of this work

```
repository       /var/www/GemReserve/GemReserve
remote           git@github.com:lonadonia/GemReserve.git
branch at start  phase-6-compliance-foundation (6c1815c)
working tree     clean (tracked files)
```

Branches present: `main`, `phase-3-architecture`, `phase-4-wallet-treasury-multisig`, `phase-5-backend-foundation`, `phase-5-blockchain-sync`, `phase-5-final-verification`, `phase-6-compliance-foundation`. No tags, no stashes, one worktree.

**Base selected for this remediation: `main` at `f3a46ad`** — "Serve WordPress on the port the load balancer actually uses". This is the latest verified website/CMS baseline and is the commit production was deployed from. Phase 3–6 branches carry separate platform work and were neither merged nor modified.

`origin/main` is at the same commit as local `main`; there is no divergence between the base and production.

**Pre-existing uncommitted work:** the directories `contracts/` and `services/` are present in the working tree, untracked relative to `main` (they belong to the Phase 3–6 branches). They were left untouched. Nothing was reset, cleaned, stashed or overwritten.

---

## 11. Verified against, not assumed

Every claim above was reproduced during this audit. Where a prior document's conclusion could not be reproduced — the "staging only" property of the credentials file in §7 — the reproduction result is recorded in preference to the document.
