# CMS Security Review

**Scope:** the `gemreserve-visual-cms` plugin, the changes to `gemreserve-core` and the `gemreserve` theme, the versioned API, the preview and revalidation paths, and the Next.js block renderer.

**Method:** every finding below was reproduced against a running isolated instance before being fixed, and the fix was verified by re-running the same probe. Nothing here is asserted from reading the code alone.

---

## 1. The finding that mattered

### SEC-1 — Stored XSS through block attributes (Critical, fixed)

**WordPress does not sanitise block attributes, and the reason it cannot is the same reason they are dangerous.**

Block attributes are serialised into an HTML comment with `<` and `>` escaped as `<` / `>`, specifically so that `wp_filter_post_kses` leaves the comment intact — without that escaping, kses mangles every block on the page. The escaping that protects legitimate attributes is the same escaping that carries a payload straight past the filter.

Reproduced as a Marketing Editor — a role with `edit_pages` and no `unfiltered_html`:

```php
// Saved through the ordinary editor path, by a user with no special rights.
['name' => 'gemreserve/content', 'attrs' => [
    'template' => '<img src="x" onerror="alert(1)">', 'slots' => [],
]]
```

The `onerror` handler **reached the rendered page**.

**Fix.** Every markup-bearing block attribute — `template`, `itemTemplate`, `open`, `close` — is filtered on save through a closed allowlist (`MarkupPolicy`) for any user without `unfiltered_html`. Icon slot values are sanitised on both save and render. `preserved` block HTML is not filtered but *restored* from what is already stored, so it cannot be introduced or altered at all.

**Verified non-destructive.** A policy that silently rewrote the approved design would be worse than no policy, because the damage would be invisible. All **2,591 markup attributes** across the 40 pages pass through the filter byte-unchanged. Getting there found two real defects in the policy itself:

- `aria-*` is not a `wp_kses` wildcard (only `data-*` is), so an `aria-*` entry was silently ignored and **675 attributes** were being stripped — the site would have lost its accessible labelling with no error anywhere.
- `wp_kses_bad_protocol` read the slot placeholder `{{gr:c1}}` in a `src` as a URL with a `gr:` scheme and truncated it, breaking **265 image templates**. Placeholders are now masked during filtering, and the syntax itself changed to `{{gr_key}}`.

---

## 2. Injection testing

Ten payloads, saved through the ordinary editor path as a Marketing Editor, then **parsed** — not pattern-matched — to see what survived. Pattern-matching produced a false positive on an escaped quote inside an `alt` attribute, which is exactly the kind of result that gets waved through; parsing the output and asking the DOM whether an `onerror` attribute exists is unambiguous.

| # | Payload | Result |
|---|---|---|
| 1 | `<script>` in a `template` | Removed |
| 2 | `<img src=x onerror=…>` in a `template` | Handler removed |
| 3 | `<iframe>` in a `template` | Removed |
| 4 | `javascript:` in a URL slot | Rendered as an empty `href` |
| 5 | `<svg onload>` + `<script>` in an icon slot | Both removed |
| 6 | `onclick` on a stored `<section>` tag | Removed |
| 7 | `<script>` in a `gap` block | Discarded — a gap renders whitespace or nothing |
| 8 | `</p><script>` in a text slot | Escaped as text |
| 9 | `" onerror="` in an attribute slot | Escaped; the DOM shows `src` and `alt` only |
| 10 | `<script>` in a `preserved` block | Restored to the stored value |

**All ten neutralised.** Legitimate content saved through the same path in the same run is returned byte-identical, which is the control that proves the filter is not simply destroying everything.

Regression coverage: `tests/run-tests.php`, group *Stored XSS through block attributes*.

---

## 3. SVG and the icon slot

Icons are the one slot whose value is markup, so they get their own closed allowlist rather than a blocklist.

| Excluded | Why |
|---|---|
| `<script>`, `<foreignObject>` | Script execution |
| `<use>`, `<image>` | External references — SSRF and exfiltration from inside the page |
| every `on*` | Event handlers |
| `style` | Can carry `url()` fetches |
| `url(https://…)` in paint attributes | Same; only a local `#fragment` is allowed |

Verified: four payloads removed, a local `url(#gradient)` preserved, and non-SVG input refused outright.

### SEC-2 — SVG upload (Low, fixed)

WordPress does not permit SVG uploads by default, but plugins routinely enable it, and an SVG is a script-bearing document served from the site's own origin. `Media::reject_dangerous_uploads` refuses `svg`, `svgz`, `html`, `xhtml`, `xml`, `php`, `phtml`, `phar`, `js` and `mjs` by extension **and** by MIME type. There is no trade-off to weigh: every icon in this design is inline and sanitised, so nothing legitimate needs to arrive as an upload.

---

## 4. Authorisation

### The public API cannot return non-public content

Five states were created and requested by id and by route:

| State | By route | By id | Content leaked | In the index |
|---|---|---|---|---|
| draft | 404 | 404 | no | no |
| pending | 404 | 404 | no | no |
| private | 404 | 404 | no | no |
| scheduled (`future`) | 404 | 404 | no | no |
| password-protected | 404 | 404 | no | no |

The gate is five separate conditions, not one: post type public, status `publish`, no post password, not a revision, not an autosave.

### SEC-3 — Route parameter accepted a foreign origin (Low, fixed)

`?route=https://evil.example/about/` was reduced to its path and returned **this site's** `/about/` with a 200. Not exploitable — the lookup is a slug query with no outbound request — but a consumer that asked for another origin and got a 200 has been told something false about what it fetched. Such routes are now refused.

Also refused: `//evil.example/about/`, `javascript://evil/about/`, `/../../etc/passwd`.

### SEC-4 — Global settings were administrator-only (Medium, fixed)

Not an escalation but its mirror image, and a real defect: the Site Settings screen — footer, corporate identity, contact addresses, announcement — was gated on `manage_options`, so the Marketing Publisher role could not edit the footer at all, which is one of the eleven things the client asked for.

Found by the acceptance test for "modify navigation and footer". Fixing it took three coordinated changes, and the middle one is the interesting failure mode: after the menu capability was relaxed, the screen **rendered with no fields**, because the render function carried its own hardcoded `manage_options` guard. A guard that disagrees with the thing it guards produces what looks like a broken page rather than a refusal.

- menu registration → `gr_manage_globals`
- render function guard → the same capability
- `option_page_capability_gemreserve_settings` filter → the same capability, because `options.php` resolves its own and would otherwise refuse the POST after rendering the form

### SEC-5 — Technical fields exposed to marketing users (Low, fixed)

`gemreserve-core` rendered `_gr_section_json` as a raw JSON textarea on every page, which §7 forbids explicitly. It is also dead — the field holds migration provenance, not renderable sections — so an editor could corrupt it with a stray keystroke, get no feedback, and change nothing on the site. It is now hidden from anyone without `manage_options` and kept for administrators, who need it as the record of where each page came from.

---

## 5. Preview tokens

A preview link is shareable with someone who is not logged in, which makes it a bearer credential. Nine properties tested:

| Case | Result |
|---|---|
| Valid token, first use | 200, draft content returned |
| Same token replayed | 403 — nonce consumed |
| Token re-pointed at another page | 403 — the id is inside the signature |
| Expiry pushed into the past | 403 |
| Garbage / empty / malformed | 403 |
| Page edited after the token was minted | 409 |
| Token for page A leaking page B | No |

Every 403 carries the same message. Distinguishing "expired" from "forged" from "already used" would tell someone probing the endpoint which part of their guess was right, and tells a legitimate editor nothing they need.

The signing secret is generated on first use, stored with `autoload=false`, and deliberately **not** derived from `AUTH_KEY` — rotating it should invalidate outstanding preview links without logging every user out of WordPress.

---

## 6. Webhook forgery and replay

Eight cases against `POST /revalidate-test`:

| Case | Result |
|---|---|
| Valid signature | 200 `valid: true` |
| Tampered body | 401 signature mismatch |
| Wrong secret | 401 signature mismatch |
| Replayed with an old timestamp | 401 outside the 300s window |
| Timestamp swapped, signature kept | 401 signature mismatch |
| Missing signature / timestamp header | 401, named precisely |
| Empty signature | 401 |

The timestamp is **inside** the signed material, not merely sent beside it — signing only the body would let an interceptor replay a captured request forever by reusing its headers. Comparison is `hash_equals`; a byte-at-a-time compare on a signature is a forgery oracle.

Unlike the preview endpoint, this one names its failure reason precisely. That is safe and useful here: it has no side effects and reveals nothing an operator configuring the webhook does not already know.

**SSRF.** The webhook URL and secret come from constants, never options. An option would be editable by anyone reaching a settings screen, and a webhook target is a request this server makes.

On the receiving side, a missing secret returns **503, not accept** — an unconfigured secret must never mean "accept everything" — and only site-relative routes are revalidated.

---

## 7. Path traversal

`Media::import_theme_asset` takes a caller-supplied path and reads a file. It resolves the path with `realpath` and then confirms the result is still inside the theme directory, rather than rejecting `..` by pattern — symlinks and encodings get around a pattern check. `../../../etc/passwd` returns 0. It also refuses anything that is not an image by MIME type.

---

## 8. Caching

| Surface | Header | Reason |
|---|---|---|
| Public API | `public, max-age=60, stale-while-revalidate=600` | `public` is safe *because* the endpoint cannot return non-public content |
| Preview (both ends) | `private, no-store, max-age=0` | A cached preview is a draft served to whoever asks next |
| Preview | `X-Robots-Tag: noindex, nofollow, noarchive` | |
| `/cms/` mirror | `robots: noindex`, canonical → the live WordPress URL | A second copy of every page under a different path is the duplicate content that costs a site its rankings |

---

## 9. The renderer's own gate

The Next.js renderer re-checks CMS-supplied markup before injecting it, and that gate earns its place rather than duplicating WordPress's: **the two systems deploy separately**. A regression in the CMS should degrade a section here, not execute in a visitor's browser.

It is a blocklist, which is the wrong tool for sanitising untrusted input and the right one for detecting that upstream sanitising has failed. A section carrying `<script>`, an `<iframe>`, an inline handler or a script-bearing URL is dropped, logged to the server, and the rest of the page renders.

The `tag` and `attributes` a node carries are also input: the tag is narrowed to a closed set of container elements, and attributes to inert names (`class`, `id`, `style`, `role`, `tabindex`, `hidden`, `lang`, `dir`, `aria-*`, `data-*`). No URL-bearing or executable attribute can be spread onto an element.

---

## 10. Logging and secrets

- No credential, token or secret is written to the repository. `wp-config.example.php` is a template; the runtime values live outside the web root.
- Webhook failures log the *reason*, never the request body. Logging bodies as a habit is how secrets eventually get logged.
- The editorial audit trail records user id and display name, and deliberately **no IP addresses** — personal data under GDPR, and an editorial trail does not need them.
- A `git log -p` scan of this branch found no added secret material.

---

## 11. Findings summary

| ID | Severity | Status |
|---|---|---|
| SEC-1 Stored XSS via block attributes | **Critical** | Fixed, regression-tested |
| SEC-4 Global settings unreachable by the accountable role | Medium | Fixed |
| SEC-2 SVG and executable uploads | Low | Fixed |
| SEC-3 Route parameter accepted a foreign origin | Low | Fixed |
| SEC-5 Raw JSON field exposed to marketing users | Low | Fixed |

No Critical or High finding is outstanding.

---

## 12. Pre-existing findings, recorded not fixed

These are outside this remediation's scope and are **not** introduced by it. They are recorded because they were found while establishing the baseline and someone should decide about them.

| ID | Severity | Finding |
|---|---|---|
| DRIFT-1 | Medium | Two plugins active on production and absent from version control, one of which (`gemreserve-leadership-profiles`) is load-bearing for responsive layout on every route, and one of which (`circumflex-booking`) has created 15 tables in the production database. A Git-based rollback would silently remove both. How they arrived was not established. |
| DRIFT-2 | Medium | `wp-config.example.php` documents `/home/hamza/.gemreserve-wp-db.env` as "staging only … cannot reach production". The file holds **production** credentials and URLs, readable by the deploy account. The documented safety property does not hold. |
| IDENT-1 | Medium | The mandated director identity exists only inside the uncommitted plugin above, hardcoded in PHP. It cannot be edited by marketing and would vanish on a Git rollback. |
| CRON-1 | Low | `wp-cron` fires on visitor traffic, so scheduled publishing is unreliable on a low-traffic site. Not changed: §4 forbids altering production cron without approval. |

None was modified. §13 forbids rewriting identity content without the controlling documents, and those could not be located (`CMS_CURRENT_STATE_AUDIT.md` §9).
