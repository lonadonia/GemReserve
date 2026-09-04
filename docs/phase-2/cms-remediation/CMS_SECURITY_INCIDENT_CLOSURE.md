# Security Incident Closure — web-readable deployment backups

**Incident:** theme and plugin PHP source served as plain text.
**Opened:** 2026-09-04 01:11:04 UTC.
**Source files removed from the document root:** 2026-09-04 02:25:23 UTC.
**Closed:** 2026-09-04, this document.
**Severity:** low — source disclosure, no secret, no third-party access.
**Caused by:** the CMS deployment performed in this engagement.

---

## 1. What happened

The deployment script kept each replaced file beside its target as
`<file>.gr-orig-<stamp>`, so that a rollback would be a rename rather than an
unpack. The production vhost refuses theme and plugin PHP with:

```nginx
location ~* /wp-content/(themes|plugins|mu-plugins)/.+\.php$ { deny all; }
```

That rule matches paths **ending** in `.php`.
`page.php.gr-orig-20260904T002751Z` does not end in `.php`, so it matched no
deny rule, fell through to `try_files`, and nginx served it as a static file.

Six files were reachable and returned HTTP 200 with their source as plain text:

| File | Bytes | SHA-256 (first 16) |
|---|---:|---|
| `themes/gemreserve/page.php` | 1,283 | `1e1acd601ce59aa1` |
| `themes/gemreserve/single-gemstone.php` | 3,934 | `66ea8bb0958ebcf0` |
| `themes/gemreserve/front-page.php` | 906 | `656232484b05c4ac` |
| `themes/gemreserve/functions.php` | 9,311 | `c2e46d7fd81319ec` |
| `plugins/gemreserve-core/includes/admin-menu.php` | 7,976 | `a42f5f07e8d3cf49` |
| `plugins/gemreserve-core/includes/settings.php` | 8,705 | `9cf6693b5cc3c283` |

The plugin's own kept copy was **not** affected: it was dot-prefixed, and
`location ~ /\. { deny all; }` matched it. That is what the other six should
have been.

## 2. Exposure window

**01:11:04 → 02:25:23 UTC — 74 minutes 16 seconds.**

Longer than it should have been. The filesystem-write audit that found it runs
at the end of the post-deployment verification sweep, not inside the deployment
step that created the files.

## 3. Did the files contain any secret?

**No.** The six files are preserved outside the web root, so this is checkable
rather than asserted. A case-insensitive scan for `password`, `passwd`,
`secret`, `salt`, `token`, `api_key`, `AUTH_KEY`, `DB_NAME`/`DB_USER`/
`DB_PASSWORD`/`DB_HOST`, `BEGIN … PRIVATE KEY`, AWS access-key and OpenAI
key patterns returns **0 matches in each of the six files**. A search for
high-entropy literal assignments (24+ characters) returns nothing.

They are the pre-remediation versions of code that is in this repository.
Configuration in this project lives in `wp-config.php`, `wp-salts.php` and
`/etc/gemreserve/wordpress.env`, none of which was involved.

**No credential rotation is required**, and none was performed.

## 4. Did anyone else fetch them?

**No.** All eight nginx access logs — the current one plus seven rotated days —
were searched for any request to a `.gr-orig` path. There are exactly **nine**,
and all nine are this engagement's own `curl/8.5.0` probes:

| Time (UTC) | Requests | Status | Agent |
|---|--:|---|---|
| 02:25:06 | 3 | 200 | `curl/8.5.0` — the probe that found the problem |
| 02:25:24 | 6 | 404 | `curl/8.5.0` — the probe that confirmed the fix |

**Non-`curl` requests for those paths: 0.** No search engine, scanner or visitor
fetched any of the six. The only other traffic in the window was a bot probing
for `.env`, `Dockerfile` and `serviceAccountKey.json`, all refused by the vhost.

Client addresses are deliberately not reproduced here.

## 5. Remediation

**Immediate (2026-09-04 02:25:23).** The six files were moved out of the
document root to `<backup>/pre-deploy-originals/`, mode 700. Each was verified
byte-identical to `git main` after the move, so rollback capability was
unchanged.

**Completed in this session.**

1. **The last artefact is gone.** The dot-prefixed plugin backup directory
   `.gr-orig-gemreserve-visual-cms-20260904T021133Z` was protected by the
   dotfile rule and returned 403, but it was still a backup inside the document
   root. It was moved to the backup directory. **The document root now contains
   zero backup, temporary, patch, swap, archive or source-copy artefacts.**

2. **Deployment writes backups outside the root, by construction.** The
   deployment performed today copied the previous versions to
   `<backup>/pre-deploy-originals-<stamp>/` *before* staging anything, and
   removed its in-root staging directory in the same step. No `*.gr-orig-*`
   file was created under the document root at any point.

3. **An automated check that fails the build.**
   `wordpress/deploy/assert-no-webroot-backups.sh` scans a document root for
   backup-shaped names and exits non-zero if it finds any — including the shape
   that defeated the vhost, `*.php.<anything>`. Verified both ways: it passes on
   production and fails on a planted artefact.

4. **The same assertion runs with every test pass.** Unit suite group
   *Deployment hygiene — nothing backup-shaped in the document root* walks
   `ABSPATH` and fails if anything matches. It earned its place immediately: on
   first run it caught the artefact still present on the staging clone.

### Why not just extend the vhost

Suffix lists lose. `~`, `.save`, `.tmp`, `.copy` and `.php.<anything>` were all
uncovered by the existing rule, and the next one will be something nobody
listed. Changing nginx would also be a production configuration change outside
this fix's scope. The invariant that actually holds is that a backup never goes
inside the document root, and that is what is now asserted — in the deployment
step, in a standalone script, and in the test suite.

## 6. Verification

Representative forbidden URLs, checked against production after remediation:

| URL | Status |
|---|---|
| `/wp-content/themes/gemreserve/page.php.gr-orig-20260904T002751Z` | **404** |
| `/wp-content/themes/gemreserve/functions.php.gr-orig-20260904T002751Z` | **404** |
| `/wp-content/plugins/gemreserve-core/includes/settings.php.gr-orig-20260904T002751Z` | **404** |
| `/wp-content/plugins/.gr-orig-gemreserve-visual-cms-.../gemreserve-visual-cms.php` | **403** |
| `/wp-content/themes/gemreserve/functions.php.bak` | **403** |
| `/wp-content/themes/gemreserve/page.php~` | **404** |
| `/wp-content/plugins/gemreserve-visual-cms/includes/class-roles.php.orig` | **403** |
| `/wp-config.php.bak` | **403** |
| `/backup.sql` | **403** |
| `/wp-content/backup.tar.gz` | **403** |

```
$ wordpress/deploy/assert-no-webroot-backups.sh /var/www/GemReserve/wordpress
OK: no backup or source-copy artefacts under /var/www/GemReserve/wordpress
```

## 7. Root cause

A deployment step wrote new paths into a document root and reasoned about the
web server's protection from memory instead of testing it.

The generalisable lesson is not about suffixes. It is that **a deployment step
which creates a new path inside a document root has to prove that path is
unreachable, in the same breath, before it moves on** — which is what the
assertion in §5.3 now does.

## 8. Status

**CLOSED.** No secret exposed, no third-party access, no credential rotation
required, root cause fixed in three places, and a regression test that fails if
it recurs.
