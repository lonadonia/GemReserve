# The Block Editor Would Not Open — Root Cause and Fix

**Reported by the client:** the Gutenberg canvas is blank on Contact Us, with a
broken-document icon and no sections. Only the SEO meta boxes are visible.

**They were right, and my previous report was wrong.** It concluded manual
editing worked. The editor did not open at all — on any page, for the marketing
account.

**Date:** 2026-09-04 · **Fix commit:** `b7d06f1`

---

## 1. What was actually wrong

Two independent causes. Each was established by elimination against production,
not by reading code.

### Cause 1 — the Content-Security-Policy blocked the editor canvas (fatal)

WordPress 6.3+ does not render the block editor into the admin page. It builds a
separate document at runtime, hands it to an `<iframe>` as a `blob:` URL, and
renders the canvas inside that frame — which is what gives the editor the site's
own styling.

The `/wp-admin` policy had **no `frame-src`**. CSP falls back to
`default-src` when a directive is absent, and `default-src` was `'self'`,
which does not cover `blob:`. So the browser refused the frame:

```
Refused to frame 'blob:https://www.gemreserve.io/...'
TypeError: Cannot destructure property 'documentElement' of 'D' as it is null.
```

That `null` is the iframe's document. The editor script asks the canvas for its
document, gets nothing, and dies — which is the broken-document icon and the
"This content is blocked" message the client saw.

**The page's content was never the problem.** Contact Us held 27 valid
GemReserve blocks throughout. The frame they render into never loaded.

Proven by elimination against production, as `gr_marketing`:

| Condition | Sections in canvas | Canvas text | Page errors |
|---|---:|---:|---:|
| CSP as deployed | **0** | 65 chars | **9** |
| Same site, CSP header stripped at the browser | **2** | 1,865 chars | **0** |
| CSP restored with `frame-src`/`child-src`/`blob:` added | **2** | 1,865 chars | **0** |

### Cause 2 — REST hardening returned 401 for the editor's own identity

`gemreserve_restrict_rest_users()` in `gemreserve-core/includes/hardening.php`
matched the whole `/wp/v2/users` prefix and required `list_users`.

Gutenberg calls `/wp/v2/users/me` on every boot to learn who is editing. No
marketing role holds `list_users` — correctly, it is a user-administration
capability — so the editor received **401 Unauthorized asking who its own user
was**.

An administrator holds `list_users`. So the editor worked for administrators
and only for administrators, which is exactly the shape that hides a defect from
anyone testing with an admin account.

Not fatal on its own — the canvas still crashed from Cause 1 with this fixed —
but it is a real defect and would have caused visible failures in the author and
revision UI.

---

## 2. Why my earlier tests missed it

This matters more than the fix, because the tests were the reason I reported
success.

**The staging server sent no CSP header at all.** The isolated environment ran
PHP's built-in server on loopback with no nginx in front, so the `/wp-admin`
policy — the thing that was broken — simply did not exist there. I was testing a
different application from the one the client uses. Staging now reproduces
production's exact policy.

**Every browser test asserted its own change arrived; none asserted the editor
opened.** AT-01 through AT-11, AT-G1, AT-P1–P3, AT-I1 — all sixteen — worked by
making an edit and checking the public page. On production every one of them
would have failed at the first click, but on CSP-less staging they passed, and
their passing was read as "the editor works".

**Chromium exempts same-origin `blob:` iframes from CSP in some paths.** Even
after adding production's policy to staging, the canvas rendered. Only the real
site, behind the real headers, reproduced it. Some defects have no substitute
for the actual environment.

**`editor-all-routes.spec.ts` is the test that should have existed from the
start.** It opens every published route in the real editor as the real marketing
account and fails on a blank canvas, a crashed block, an invalid block, or any
uncaught page error. A completely blank editor cannot pass it.

---

## 3. The fix

### The vhost — `/wp-admin` and `/wp-login.php` only

| Directive | Added | Why |
|---|---|---|
| `frame-src 'self' blob: data:` | new | the canvas iframe itself |
| `child-src 'self' blob:` | new | older-browser fallback for the same |
| `default-src` | `+ blob:` | the canvas document's own subresource fetches |
| `script-src` | `+ blob:` | the editor injects its bundles into that document |
| `style-src` | `+ blob:` | and its stylesheets |
| `connect-src` | `+ blob:` | reading the blob back |
| `img-src` | `+ https://secure.gravatar.com` | the admin-bar avatar, blocked and logging a violation on every admin page |

**The public policy is byte-identical** — verified before and after. It keeps
`frame-ancestors 'none'`, gains no `blob:`, and is unchanged in every
directive. Every relaxation above applies to the two admin paths only.

`blob:` is same-origin by construction: only script already running on this
origin can mint a blob URL. This admits nothing an attacker could reach from
outside. `object-src 'none'`, `base-uri 'self'` and `form-action 'self'`
are untouched, and no external script origin was added.

### The REST filter

Anonymous enumeration — what the filter exists to prevent — stays closed:

| Request | Before | After |
|---|---|---|
| `GET /wp/v2/users` anonymous | 401 | **401** |
| `GET /wp/v2/users/1` anonymous | 401 | **401** |
| `GET /wp/v2/users/me` anonymous | 401 | **401** |
| `GET /wp/v2/users/me` as `gr_marketing` | **401 (bug)** | 200 |
| `GET /wp/v2/users` as `gr_marketing` | 401 | handed to core, which applies `list_users` where it is genuinely required |

`/users/me` reveals nothing the caller does not already know — it is their own
account, over their own authenticated session.

---

## 4. Production result

The real production editor, as `gr_marketing`, before and after:

| Page | Blocks | Sections before | Sections after | Page errors before → after |
|---|---:|---:|---:|---|
| Contact Us | 27 | **0** | **2** | 9 → **0** |
| Home | 44 | **0** | **5** | — → **0** |
| Governance | 30 | **0** | **4** | — → **0** |
| Aquamarine (gemstone) | 56 | **0** | **6** | — → **0** |

Screenshot evidence in `evidence/editor-screenshots/`. The Contact Us capture
shows the real page — "GET IN TOUCH", EMAIL, SECURE INQUIRIES, MEDIA INQUIRIES
with their icons — rendered in the styled canvas as *GemReserve Marketing*.

### Remaining console messages, and why they are not defects

| Message | Assessment |
|---|---|
| `static.cloudflareinsights.com/beacon.min.js` blocked | Cloudflare injects its own analytics beacon; `script-src 'self'` refuses it. Third-party, cosmetic, and **deliberately not** allowed — permitting an external script origin in the admin to silence a log line would be a poor trade. |
| `s.w.org/images/block-editor/welcome-canvas.gif` blocked | The illustration inside WordPress's welcome guide. Same reasoning. |
| `GET /wp/v2/settings` → 403 | Core requires `manage_options`. A marketing user correctly does not have it; the editor handles the 403 and carries on. **This is the permission model working.** |

None of these prevents the editor from opening: page errors are zero and the
canvas renders.

---

## 4a. All 88 routes, verified in the real editor

`qa/cms/editor-all-routes.spec.ts` logs in through the real WordPress login form
as `gr_marketing` and opens every published route's editor on production.

```
ALLROUTES  checked=88  failures=0
```

**88 OK, 0 failures.** A route passes only if the canvas loaded, every stored
block is valid, no block crashed, no "This content is blocked" appeared, no
uncaught page error was raised, and — where the page has stored blocks — the
canvas shows content. Per-route figures: `evidence/all-88-editor-results.md`.

The two gemstones with no stored body (`/sapphire/`, `/diamond/`) are the only
rows with `blocks=0`; they render from structured fields and their hero and SEO
fields are editable. Everything else shows its blocks.

Device previews: Desktop, Tablet and Mobile all offered in the editor menu and
all render — `evidence/editor-screenshots/07`–`09`.

## 4b. The fix, visible in the access log

The transition is in the production log to the second:

```
23:07  401  GET /wp-json/wp/v2/users/me
23:08  401  GET /wp-json/wp/v2/users/me
23:09  200  GET /wp-json/wp/v2/users/me     <- fix applied
23:09  200  GET /wp-json/wp/v2/users
```

Anonymous requests to `/wp/v2/users`, `/wp/v2/users/1` and `/wp/v2/users/me` are
still refused — verified after the change.

## 4c. Second verification pass

| Check | Pass 1 (23:26) | Pass 2 (23:49) |
|---|---|---|
| 88 editor routes | 88 OK / 0 fail | — |
| 88 public routes at the origin | identical | **identical** |
| SEO metadata, all 88 | identical | **identical** |
| `robots.txt`, `sitemap.xml` | identical | **identical** |
| routes / migrated / legacy | 88 / 58 / 58 | 88 / 58 / 58 |
| `gemreserve verify` | 58/58 | 58/58 |
| `post_modified` drift | 0 | **0** |
| Document-root hygiene | OK | OK |
| Services | all active | all active |

Logs after the change: **zero** 5xx on the public site, zero nginx errors
excluding deny-rule and login rate-limit hits, no `php8.4-fpm` journal entries,
`debug.log` 0 bytes. `nginx` has been active since 2026-07-21 — a reload does
not restart the service.

The 116 `403 /wp-json/wp/v2/settings` responses are core requiring
`manage_options` for a setting a marketing user does not administer. The editor
handles the 403 and carries on; it is the permission model working.

---

## 5. Production safety

| | |
|---|---|
| Backup | `/var/www/GemReserve/backups/cms-uiverify-20260904T182938Z` |
| Previous `hardening.php` | `/var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/pre-harden-20260904T230925Z/hardening.php` |
| Previous vhost | `/var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/nginx-vhost-pre-csp-20260904T230925Z.conf.bak` |
| Restore proven | 6 s database, 1 s files, tree byte-identical to production |
| Public routes after the change | **88/88 identical** at the origin |
| Public security headers | unchanged — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Services | `nginx reload` only — a config change requires it, and reload is zero-downtime. Nothing was restarted. |

### Rollback

```bash
# The CSP — restore the vhost, syntax-test, reload.
install -m 644 -o root -g root \
  /var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/nginx-vhost-pre-csp-20260904T230925Z.conf.bak \
  /etc/nginx/sites-enabled/www.gemreserve.io.conf
nginx -t && systemctl reload nginx

# The REST filter.
install -m 644 -o hamza -g www-data \
  /var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/pre-harden-20260904T230925Z/hardening.php \
  /var/www/GemReserve/wordpress/wp-content/plugins/gemreserve-core/includes/hardening.php
```

Rolling back returns the editor to its broken state; it is recorded because a
change without an undo is not a safe change.
