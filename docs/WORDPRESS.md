# WordPress migration

The GemReserve.io public site, rebuilt as WordPress with full `/wp-admin`
editing, reproducing the approved Next.js design.

**Status: staging, complete enough to review and not yet approved for
production.** The Next.js site is untouched and still live. Read
[Not done yet](#not-done-yet) before planning a switch.

---

## Where things are

| | |
| --- | --- |
| WordPress root | `/var/www/GemReserve/wordpress` |
| Staging URL | `http://127.0.0.1:3200` (loopback only) |
| Admin | `http://127.0.0.1:3200/wp-admin/` |
| Credentials | `/home/hamza/.gemreserve-wp-admin.txt`, mode 600 — never committed |
| Theme | `wp-content/themes/gemreserve` |
| Plugin | `wp-content/plugins/gemreserve-core` |
| Backup | `/var/www/GemReserve/backups/wp-*` |
| Next.js source | `/var/www/GemReserve/GemReserve` (unchanged) |

Start staging:

```bash
php -S 127.0.0.1:3200 -t /var/www/GemReserve/wordpress \
  /var/www/GemReserve/wordpress/router.php
```

---

## The database is SQLite, and why

WordPress runs on SQLite through the WordPress Performance Team's official
`sqlite-database-integration` drop-in.

This was not a preference. MySQL on this host is Percona 8.4 managed by
CloudPanel, and creating a database needs either the MySQL root credentials or
`clpctl site:add`. The `hamza` account has neither: `sudo` requires a password,
and the one NOPASSWD entry — `clpctlWrapper` — exposes only `db:export`,
`db:import`, `system:permissions:reset` and `varnish-cache:purge`. Waiting for
credentials would have blocked the entire migration; SQLite unblocked all of it.

**Everything above the database layer is storage agnostic.** The theme, the
plugin, the post types, the fields and the content are ordinary WordPress. The
production move is a configuration change and an import, not a rebuild:

```bash
# 1. Create the database and user through CloudPanel (needs an operator).
# 2. Point wp-config.php at it and delete wp-content/db.php.
# 3. Re-run the migration against the new database:
cd /var/www/GemReserve/wordpress
wp eval-file gr-import.php          <extracted.json> --path=.
wp eval-file gr-import-classes.php  <classmap.tsv>   --path=.
wp eval-file gr-import-sections.php <sections.json>  --path=.
wp eval-file gr-import-nav.php      <nav.json>       --path=.
```

The migration is idempotent and keyed on slug, so re-running it against a fresh
MySQL database reproduces the site exactly.

---

## Architecture

**The plugin owns data. The theme owns presentation.** The content model has to
survive a theme change: a client who rebuilds the theme must not lose the
gemstone records, the document register or the corporate identity with it.

### Post types

| Type | Slug | Why |
| --- | --- | --- |
| Page | `page` | The 58-page architecture is hierarchical content, which WordPress already models |
| `gemstone` | `/{slug}` | 18 structured records with their own fields and lifecycle |
| `gr_document` | `documents/item` | A controlled register with an approval workflow |
| `gr_news` | `news` | A real newsroom |
| `gr_faq` | — | Ordered, categorised, rendered into the accordion |

Deliberately few. A post type was added only where records have their own fields
*and* their own editorial lifecycle.

### Fields — no ACF

Structured fields are core `register_post_meta` plus hand-written meta boxes.
ACF Pro is a commercial licence this project has not been shown to hold, and the
free tier does not cover the field types this content needs. **There is no
recurring licence cost anywhere in this build.**

### The two states that matter

**Evidence state** on a gemstone — `illustrative`, `owner_supplied`,
`evidence_pending`, `verified`. Anything below Verified renders a standing
sample notice on the public page. It is a closed vocabulary: an unknown value
is dropped on save, so an editor cannot make an illustrative record read as held
inventory by typing the wrong word.

**Document status** — `draft`, `signature_ready`, `signed`, `published`,
`superseded`, `withdrawn`, `restricted`. A download link appears only when the
status is Published **and** a file is attached. File size and SHA-256 are
computed from the actual file, never typed, so a figure cannot describe a
missing document.

Only a Compliance Reviewer or Administrator can move a document to Signed or
Published. The check runs on save and restores the previous value — it is a
capability, not hidden UI.

---

## URLs

**All 58 public URLs are preserved. No redirect is needed.** Both the bare path
and the trailing-slash form resolve, verified against both servers.

The site uses flat URLs (`/independent-verification`, not
`/technology/independent-verification`) while keeping the parent/child hierarchy
for the admin list and the breadcrumb trail. `includes/flat-permalinks.php` does
both halves: it emits the bare slug as the permalink and resolves it back on the
raw request path. Removing either half breaks every child page.

The full map is in `docs/wordpress-url-map.txt`.

---

## The one convention to learn

In **Appearance → Menus**, give a menu item the CSS class `is-upcoming` to
render it as the greyed "Coming soon" marker the original used, instead of a
link to nowhere. Everything else is ordinary WordPress.

---

## Editing: how to do each job

| Task | Where |
| --- | --- |
| Homepage copy | GemReserve → Pages → Home → Hero fields |
| Any page's hero | Edit the page → the **Hero** box |
| Gemstone image | GemReserve → Gemstones → the stone → **Presentation** → Hero image |
| Gemstone facts | The same record → **Specification** |
| FAQ | GemReserve → FAQs. Order with the Order field; group with FAQ categories |
| News | GemReserve → News → Add New. Publish on the day it is issued |
| Documents | GemReserve → Documents. Attach a file *and* set status Published, or no link appears |
| Footer / company details | GemReserve → Site Settings |
| Contact addresses | GemReserve → Site Settings → Contact addresses |
| Navigation | GemReserve → Menus |
| SEO title/description | Edit the page → the **SEO** box |
| Preview before publishing | The Preview button, as usual |

The corporate identity lives in Site Settings and nowhere else. Changing it
there changes the footer, the legal line and every surface that names it.

---

## Company identity

**UAB GemVault Capital · Company Code 307501935 · Girulių g. 20 ·
Vilnius, LT-12123 · Lithuania**

The code is `307501935` with **no `LT` prefix**, per the master instructions.
The Next.js build carried `LT307501935`; that is corrected here. Do not prefix
it again without the owner's instruction.

Do not restore: Swiss company, Zurich or Zug headquarters, former addresses, or
any obsolete Swiss legal reference.

---

## Factual safety

Every correction made in the Next.js build is preserved, because the migration
reads the **rendered** site rather than the old source — the corrections live in
the copy, so they came across with it.

Do not reintroduce: unsupported partners, laboratories, vault operators or
insurers; reserve values; investor counts; verified-asset totals; team sizes;
operational custody; exchange liquidity; live token supply; investment returns;
guaranteed redemption; or regulatory authorisation.

A laboratory may be named as the **issuer of a report**. No laboratory, auditor,
insurer, custodian or law firm is a partner of GemReserve, and none may be
described as one.

---

## Security

Applied in `includes/hardening.php`, so it travels with the deployment:

- XML-RPC off; pingbacks off
- Author enumeration blocked (`?author=1` and the REST users endpoint)
- Login errors do not distinguish unknown user from wrong password
- Login throttling: 5 failures per IP buys a 15-minute lockout
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- SVG uploads refused
- `DISALLOW_FILE_EDIT` — no PHP editing from the dashboard
- Version strings and discovery endpoints removed
- `wp-config.php` and `wp-salts.php` are mode 600; salts are generated on the
  server and git-ignored

### One finding worth reading

PHP's built-in server ignores `.htaccess`. Before `router.php` was hardened,
`/wp-content/database/.ht.sqlite` served the **entire database over HTTP**,
password hashes included — 2.2 MB, verified reachable. The router now refuses
it, along with `wp-config.php`, `wp-salts.php`, `debug.log` and every dotfile.

**nginx has the same gap by default.** The production vhost must carry the
equivalent or the same file will be downloadable:

```nginx
location ~* /wp-content/database/ { deny all; return 403; }
location ~* \.(sqlite|sql|log|bak|swp|ini)$ { deny all; return 403; }
location ~ /\.            { deny all; return 403; }
location = /wp-config.php  { deny all; return 403; }
location = /wp-salts.php   { deny all; return 403; }
location ~* /wp-content/uploads/.*\.(php|phtml|phar)$ { deny all; return 403; }
location = /readme.html    { deny all; return 403; }
```

MFA is not installed. Enable it after handover.

---

## Performance

One stylesheet, two small scripts, **no jQuery on the front end**, no page
builder, and two plugins total — the SQLite driver and `gemreserve-core`. No SEO
plugin: the theme emits titles, descriptions, canonicals and Open Graph in about
thirty lines, and installing Yoast to reproduce that would add a dependency, a
settings surface and a recurring upsell for nothing.

---

## Not done yet

Honest list, current as of the production-readiness pass. Everything here is
either an operator action or a follow-on task; nothing is unfinished work
hiding behind a green test.

1. **MySQL is not provisioned; the site runs on SQLite.** The migration script
   (`migrations/sqlite-to-mysql.php`) is written and idempotent, and everything
   above the storage layer is engine-agnostic — but the database itself cannot
   be created without a root or CloudPanel account this session does not have.
   This is the single largest item and the one thing a production switch is
   genuinely blocked on. Do not run the site on SQLite in production.
2. **No production vhost or TLS.** `deploy/nginx-wordpress.conf` is written and
   carries seven `CONFIRM` markers — SSL certificate paths, the php-fpm socket,
   and the redirect direction — that must be checked against the real host
   before it is enabled. Needs an operator with root.
3. **No staging hostname.** `wp-stage.gemreserve.io` needs DNS and a certificate.
   Staging currently answers on `127.0.0.1:3200` through PHP's built-in server
   and `deploy/router.php`, which is a development server and must never face
   the internet.
4. **No SMTP.** WordPress will use `mail()`, which most hosts drop silently.
   Form notifications and password resets will not arrive until a real
   transport is configured. No credentials were invented for this.
5. **Section bodies are migrated markup, not structured fields.** Hero, SEO,
   gemstone, document, news, FAQ and corporate content are all proper fields.
   The page bodies are the approved design's own HTML, stored in
   `_gr_body_html` and rendered against the ported stylesheet. That reproduces
   the design exactly and an administrator can edit it, but an editor cannot
   restructure a section from the admin yet. The section renderer
   (`inc-sections.php`) is built for that work; it is a follow-on task, page
   family by page family.
6. **Documents, News and FAQ hold no records.** The post types, fields,
   taxonomies, templates and workflow all exist and are verified end to end.
   Nothing was seeded, deliberately: inventing a document register or a news
   archive is exactly what the factual-safety rules forbid. The News page shows
   its designed "awaiting first publication" state until something real is
   published, and fills in from the top as announcements arrive.
7. **MFA is enrolled by nobody yet.** `two-factor` is active and the admin is
   flagged, but enforcement (`GR_REQUIRE_MFA`) should only be switched on after
   at least one administrator has actually enrolled — otherwise the switch locks
   out the only account that can undo it.

### One thing to decide before launch, which is not a migration defect

`/assets` states **"1,850+ Verified Assets In Vaults"** and **"$186M+ Total
Asset Value"** in the present tense, and its catalogue lists individual stones
with per-token prices and named certificates. `/investors` carries figures too,
but those are explicitly labelled *projected*, *target* and *by 2027*, which is
a different kind of claim.

These are not something the migration introduced — the same text is in the
approved Next.js build and on live production right now, and the WordPress
implementation reproduces it faithfully because that is what a migration does.
It is flagged here because it is the one place where the site makes an
unhedged, present-tense claim about holdings, and the factual-safety rules that
governed every other page rule that kind of claim out. Changing approved
production copy is the owner's call, not the migration's.

## Production release

Nothing below has been executed. Production still serves Next.js, untouched,
and that is deliberate: this work is production *ready*, not production
*switched*.

### Before the switch

1. Provision MySQL and run `migrations/sqlite-to-mysql.php`. Verify the row
   counts it prints against the SQLite source before pointing anything at it.
2. Generate fresh salts on the production host with `deploy/make-salts.php`.
   Never copy staging's.
3. Write `wp-config.php` from `config/wp-config.example.php`, supplying every
   credential through the environment. Mode 600, owned by the web user.
4. Resolve the seven `CONFIRM` markers in `deploy/nginx-wordpress.conf` against
   the real host, then install it.
5. Confirm the deny rules are live. The single highest-value check: request
   `/wp-content/database/.ht.sqlite` and confirm it is refused. It was
   downloadable on staging before `router.php` was hardened, and nginx has the
   same gap by default.
6. Take a full backup — database dump and file tree — and verify the dump
   restores into a scratch database. An unverified backup is not a backup.
7. Enrol at least one administrator in MFA, then set `GR_REQUIRE_MFA`.

### The switch

8. Put the vhost in place and reload nginx. Keep the Next.js systemd service
   running and its release directory intact — it is the rollback.

### Smoke tests, in this order

9. All 58 URLs return 200. The list is in `docs/wordpress-url-map.txt`; the
   sitemap should contain exactly those 58 and nothing else.
10. `/sitemap.xml` and `/robots.txt` return 200 with the right content types,
    and `robots.txt` advertises the production sitemap, not staging's.
11. A page that does not exist returns 404, not a soft 200.
12. `?author=1` does not redirect to a username; `/wp-json/wp/v2/users` is
    refused; `/wp-config.php`, `/wp-salts.php` and the database directory are
    all 403.
13. Log in to `/wp-admin`, edit a page, and confirm the change appears on the
    front end.
14. Submit the contact form. Confirm it stores, and confirm the submission is
    **not** readable over REST.
15. Check the four widths — 1440, 1024, 768, 390 — against the Next.js
    reference on at least the home page, `/assets`, and one gemstone page.

### Rollback

16. Point the vhost back at the Next.js upstream and reload. The service and
    its release directory were never stopped, so this is a config change and a
    reload — seconds, not a restore. Restoring the database is only needed if
    the WordPress site accepted writes worth keeping, which for a rollback
    inside the smoke-test window it will not have.
