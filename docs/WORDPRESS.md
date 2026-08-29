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

Honest list. None of it blocks review; all of it blocks a production switch.

1. **Section bodies are migrated markup, not structured fields.** Hero, SEO,
   gemstone, document, news, FAQ and corporate content are all proper fields.
   The page bodies are the approved design's own HTML, stored in `_gr_body_html`
   and rendered against the ported stylesheet. That reproduces the design
   exactly and is editable by an administrator, but an editor cannot restructure
   a section from the admin yet. The section renderer (`inc-sections.php`) is
   built and ready for that work; it is a follow-on task, page family by page
   family.
2. **Forms are front-end only.** Validation and the honest "nothing was sent"
   state work. The server-side handler — nonce, sanitisation, rate limiting,
   consent recording — is not written. Forms must not be enabled until it is.
3. **No production vhost.** No nginx config, no TLS, no staging hostname. Needs
   an operator with root.
4. **MySQL not provisioned.** See above.
5. **Documents, News and FAQ are empty.** The post types, fields and workflow
   exist; no records were seeded, deliberately — seeding fake news or a fake
   document register is exactly what the factual-safety rules forbid.
6. **MFA not installed.**
7. **Client/admin QA not done.**
