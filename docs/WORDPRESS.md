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

## The database is MySQL

WordPress runs on Percona 8.4 (`gemreserve-wp`), on a dedicated account scoped
to that one schema — `GRANT ALL ON \`gemreserve-wp\`.*`, and nothing wider. It
is not the system root account and it is not shared with any other site.

Credentials are never in the repository and never in `wp-config.php`. They live
in one file outside the web root, mode 600, and `wp-config.php` parses it at
runtime — parses, not sources, so a backtick or a `$(` inside a password cannot
execute anything. A real environment variable wins over the file, so a systemd
unit or a container can supply them with no file on disk at all. If a value is
missing the request dies with a flat 500 and no detail, because a
half-configured install is how a site silently reaches for the wrong database.

### It was built on SQLite, and that is worth knowing

The whole migration was built against the WordPress Performance Team's
`sqlite-database-integration` drop-in, because MySQL on this host is managed by
CloudPanel and creating a database needed credentials this account did not have.
Waiting would have blocked everything; SQLite unblocked all of it, and the rule
that made that safe was that **nothing above the database layer was allowed to
know**. The theme, the plugin, the post types, the fields and the content are
ordinary WordPress.

That rule paid: the move to MySQL was a dump, an import and a config change.
No template, no query and no field changed.

### How the cutover was verified

Row counts alone would not have caught a silently truncated `post_content` or a
mangled multibyte character, so verification was a **census** — the same script
run against both engines, comparing table counts, per-type/per-status post
counts, users and their roles, every GemReserve field's population, taxonomy
term counts, menu locations, the settings, the role list, and MD5 content
checksums over posts, postmeta and options.

The two outputs were byte-identical: 264 posts, 2,150 postmeta rows, 187
options, 17 terms, 186 term relationships, and matching content digests.

The checksums are computed in PHP rather than SQL on purpose. SQLite has
neither `MD5()` nor an `ORDER BY` inside `GROUP_CONCAT`, so doing it in SQL
returns an empty string on one engine and a real digest on the other — which
looks exactly like a match failure and is really a dialect difference.

One thing the import got wrong and had to be corrected: the dump hard-coded
`utf8mb4_unicode_ci`, while WordPress on this server reports
`utf8mb4_unicode_520_ci`. Uniform tables would not have shown a symptom, but
the first plugin to create a table would have created it at 520_ci and then
joined it against columns at unicode_ci. All twelve tables were converted. The
`ALTER` needs a relaxed `sql_mode`: WordPress's schema carries `0000-00-00`
date defaults that MySQL 8 accepts at `CREATE` and re-validates on `ALTER`.

### SQLite is gone from the running site

The drop-in, the plugin and the database file were all removed from the web
tree after verification, and kept — mode 600, outside the web root — under
`~/gemreserve-db/sqlite-retired/`, alongside the pre-cutover backups in
`~/gemreserve-db/backups/`. Two older SQLite backups found under
`/var/www/GemReserve/backups/` were moved out too: they held password hashes,
and a backup directory one nginx misconfiguration away from the web root is not
a place for them.

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

1. **No production vhost or TLS.** `deploy/nginx-wordpress.conf` is written and
   carries seven `CONFIRM` markers — SSL certificate paths, the php-fpm socket,
   and the redirect direction — that must be checked against the real host
   before it is enabled. Needs an operator with root.
2. **No staging hostname.** `wp-stage.gemreserve.io` needs DNS and a certificate.
   Staging currently answers on `127.0.0.1:3200` through PHP's built-in server
   and `deploy/router.php`, which is a development server and must never face
   the internet.
3. **No SMTP.** WordPress will use `mail()`, which most hosts drop silently.
   Form notifications and password resets will not arrive until a real
   transport is configured. No credentials were invented for this.
4. **Section bodies are migrated markup, not structured fields.** Hero, SEO,
   gemstone, document, news, FAQ and corporate content are all proper fields.
   The page bodies are the approved design's own HTML, stored in
   `_gr_body_html` and rendered against the ported stylesheet. That reproduces
   the design exactly and an administrator can edit it, but an editor cannot
   restructure a section from the admin yet. The section renderer
   (`inc-sections.php`) is built for that work; it is a follow-on task, page
   family by page family.
5. **Documents, News and FAQ hold no records.** The post types, fields,
   taxonomies, templates and workflow all exist and are verified end to end.
   Nothing was seeded, deliberately: inventing a document register or a news
   archive is exactly what the factual-safety rules forbid. The News page shows
   its designed "awaiting first publication" state until something real is
   published, and fills in from the top as announcements arrive.
6. **MFA is enrolled by nobody yet.** `two-factor` is active and the admin is
   flagged, but enforcement (`GR_REQUIRE_MFA`) should only be switched on after
   at least one administrator has actually enrolled — otherwise the switch locks
   out the only account that can undo it.

### The two claims that were removed

`/assets` and `/gemstone-programs` stated **"1,850+ Verified Assets In Vaults"**
and **"$186M+ Total Asset Value"** in the present tense and without
qualification. Nothing on the site or in the record substantiates either
number, and an unbacked claim about holdings is the one kind of statement the
factual-safety rules rule out absolutely.

Both were removed — from the WordPress content, and from the Next.js source
they were migrated from, so a future release of either carries the fix. They
were **not** replaced with smaller or hedged figures: inventing a
defensible-looking number is the same error with better manners. On `/assets`
the metric strip was resized from four columns to two so the remaining pair
still reads as a deliberate panel rather than a half-empty one.

`/discount-methodology` still contains "Total Asset Value $500,000". That one
stays: it sits inside a block headed *"EXAMPLE: HOW THE 20% DISCOUNT WORKS"*
and is a worked illustration, not a statement about holdings.

**Still flagged, not changed.** Four more quantitative claims remain, and the
Next.js source already marks every one of them `requiresClientVerification`:

| Claim | Where |
|---|---|
| 25+ Gemstone Types Available | `/assets`, `/gemstone-programs` |
| 18 Countries Served | `/assets`, `/gemstone-programs` |
| 10+ Gemstone Programs | `/gemstone-programs` |
| 100% Backed by Real Assets | `/gemstone-programs` |

"18 Countries Served" is the one worth looking at hardest — it is an
operational claim about customers, which is the same category as the two that
were removed. They were left because the instruction named two claims, and
deleting more of the approved design than was asked is not a decision a
migration gets to make. They are the owner's to substantiate or withdraw.

## Production release

Nothing below has been executed. Production still serves Next.js, untouched,
and that is deliberate: this work is production *ready*, not production
*switched*.

### Before the switch

1. ~~Provision MySQL and migrate.~~ **Done.** Staging runs on Percona; the
   census matched byte for byte and SQLite has been retired. Production will
   need its own database and its own dump — take a fresh one at cutover rather
   than reusing the staging import, which will be stale by then.

2. **Create the production credentials file.** As root:

   ```bash
   install -d -o root -g root -m 755 /etc/gemreserve
   umask 077
   cat > /etc/gemreserve/wordpress.env <<'EOF'
   DB_NAME=…
   DB_USER=…
   DB_PASSWORD=…
   DB_HOST=127.0.0.1
   WP_HOME=https://www.gemreserve.io
   WP_SITEURL=https://www.gemreserve.io
   EOF
   chown root:www-data /etc/gemreserve/wordpress.env
   chmod 640 /etc/gemreserve/wordpress.env
   ```

   `root:www-data 0640` is the whole design: php-fpm reads it through the
   group, root owns it, and no other account on the host can open it. It is
   outside every web root and it is not in Git.

   The two URLs live here for the same reason the credentials do: they are the
   one thing that differs between this host and any other, and nothing about
   them belongs in application source. `WP_SITEURL` resolves independently of
   `WP_HOME` and falls back to it only when absent; the local
   `http://127.0.0.1:3200` fallback applies only when neither is configured
   anywhere. A real environment variable overrides the file for any single key.

   `wp-config.php` looks there first and never contains a password. It falls
   back to `~hamza/.gemreserve-wp-db.env` for staging only — production
   php-fpm runs as www-data and cannot read that file, which is deliberate: a
   missing production file fails the request rather than quietly serving the
   site from a staging database. If nothing resolves, the request dies with a
   flat **HTTP 500** and no detail.

3. Generate fresh salts on the production host with `deploy/make-salts.php`.
   Never copy staging's. Same for the database password.

4. **Apply the ownership model** — `sudo deploy/gr-permissions.sh`, or by hand:

   | Path | Owner | Mode |
   |---|---|---|
   | WordPress code | `hamza:www-data` | dirs 755, files 644 |
   | `wp-config.php` | `root:www-data` | 640 |
   | `wp-salts.php` | `root:www-data` | 640 |
   | `wp-content/uploads` | `www-data:www-data` | dirs 755, files 644 |
   | `/etc/gemreserve/wordpress.env` | `root:www-data` | 640 |

   **Do not `chown -R www-data:www-data` the tree.** php-fpm runs as www-data;
   if www-data owns the code, any bug that reaches a file write can rewrite
   WordPress core, the theme or the plugin, and the change survives every
   restart because it *is* the source now. The runtime user reads the code and
   writes only `uploads/` — which is also the one directory the vhost refuses
   to execute `.php` from. The two halves only work together.

   The script verifies the property rather than assuming it: it fails if
   www-data can write `index.php`, if it cannot read `wp-config.php`, or if it
   cannot write `uploads/`.

   One consequence to know before you hit it: `wp-config.php` at `root:www-data
   640` is unreadable by the deploy user, so `wp` run as `hamza` will fail with
   a database error. On production run wp-cli as the web user —
   `sudo -u www-data wp --path=/var/www/GemReserve/wordpress …` — which also
   keeps anything it creates owned correctly.

5. Install `deploy/nginx-wordpress.conf` as
   `/etc/nginx/sites-enabled/www.gemreserve.io.conf`. It carries no unresolved
   markers. Note that it deliberately does **not**
   `include /etc/nginx/global_settings;` — that file and the Next.js app both
   set security headers today, which is why the live response carries
   `X-Frame-Options`, `X-Content-Type-Options` and `Referrer-Policy` twice,
   with two different `Referrer-Policy` values. The vhost defines the full set
   once instead.

6. **Relativise stored links** if this is a fresh import —
   `wp eval-file wordpress/migrations/gr-relativise-urls.php --path=…`.

   The importer wrote absolute URLs into the navigation and into some migrated
   markup, built from `home_url()` at a time when that was the staging server.
   205 rows carried `http://127.0.0.1:3200`, and because they are stored
   strings rather than generated ones, setting `WP_HOME` does not touch them:
   the canonical tag, `og:url` and every admin URL come out correct while every
   link in the navigation still points at localhost. They become root-relative,
   which works on any host and is what the rest of the markup already uses.

   Check it with the page, not the constant:

   ```bash
   curl -s https://www.gemreserve.io/ | grep -c '127\.0\.0\.1'   # 0
   ```

7. Confirm the deny rules are live. The single highest-value check: request
   `/wp-content/database/.ht.sqlite` and confirm it is refused. It was
   downloadable on staging before `router.php` was hardened, and nginx has the
   same gap by default.

8. Take a full backup — `deploy/gr-backup.sh` — and verify the dump restores.
   An unverified backup is not a backup.

9. Enrol at least one administrator in MFA, then set `GR_REQUIRE_MFA`.

### The switch

9. `nginx -t`, then `systemctl reload nginx`. Keep the Next.js systemd service
   running and its release directory intact — it is the rollback, and it costs
   nothing to leave running on 127.0.0.1:3000.

### Smoke tests, in this order

Renumbered from 10; step 9 is the reload above.

10. **ACME first, before anything else.** A blanket `location ~ /\.` would
    have matched `/.well-known/` and quietly broken certificate renewal — the
    kind of failure nobody notices for sixty days. The vhost carries an
    explicit `location ^~ /.well-known/acme-challenge/` on both :80 and :443,
    pointed at the existing CloudPanel document root where the ACME client
    writes. Verify it is not refused:

    ```bash
    curl -sI https://www.gemreserve.io/.well-known/acme-challenge/probe | head -1
    curl -sI http://www.gemreserve.io/.well-known/acme-challenge/probe  | head -1
    ```

    **404 is the pass** — the request reached the handler and the file simply
    does not exist. A 403 means the dotfile rule swallowed it; a 301 on :80
    means the redirect did. Then confirm every other dotfile is still refused:
    `/.git/config`, `/.env` and `/.well-known/security.txt` must all be 403.

11. `www1.gemreserve.io` redirects to the canonical host **over plain HTTP
    only**. The origin certificate covers `www.gemreserve.io` and
    `gemreserve.io` and not `www1` — read back from the origin on
    127.0.0.1:443, not assumed — so there is deliberately no `:443` server
    block for it. Adding one would present a certificate that does not name the
    host, which is a browser warning on a host that has none today. If `www1`
    is later added to the certificate, give it its own 443 block redirecting
    the same way.

12. All 58 URLs return 200. The list is in `docs/wordpress-url-map.txt`; the
   sitemap should contain exactly those 58 and nothing else.
13. `/sitemap.xml` and `/robots.txt` return 200 with the right content types,
    and `robots.txt` advertises the production sitemap, not staging's.
14. A page that does not exist returns 404, not a soft 200.
15. `?author=1` does not redirect to a username; `/wp-json/wp/v2/users` is
    refused; `/wp-config.php`, `/wp-salts.php` and the database directory are
    all 403.
16. Log in to `/wp-admin`, edit a page, and confirm the change appears on the
    front end.
17. Submit the contact form. Confirm it stores, and confirm the submission is
    **not** readable over REST.
18. Check the four widths — 1440, 1024, 768, 390 — against the Next.js
    reference on at least the home page, `/assets`, and one gemstone page.

19. Headers are present **once**, on HTML and on a static asset both:

    ```bash
    curl -sI https://www.gemreserve.io/ | grep -ci '^x-frame-options'   # 1
    curl -sI https://www.gemreserve.io/wp-content/themes/gemreserve/assets/css/gemreserve.css \
      | grep -ciE '^(content-security-policy|x-content-type-options)'   # 2
    ```

    The asset check is not redundant. `add_header` does not merge across
    levels: a location that defines any `add_header` of its own drops every one
    inherited from the server block. The caching locations therefore repeat the
    security headers, and without that repeat every image and stylesheet would
    be served with no `nosniff` and no CSP.

### Rollback

20. Point the vhost back at the Next.js upstream and reload. The service and
    its release directory were never stopped, so this is a config change and a
    reload — seconds, not a restore. Restoring the database is only needed if
    the WordPress site accepted writes worth keeping, which for a rollback
    inside the smoke-test window it will not have.
