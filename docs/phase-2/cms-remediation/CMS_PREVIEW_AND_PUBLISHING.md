# CMS Preview and Publishing

---

## 1. Preview

### The problem a preview link actually is

A preview link has to be shareable with someone who is not logged in — sending one to a colleague for review is the whole point — which makes it a **bearer credential**. Everything in the design follows from taking that seriously rather than treating "preview" as a display mode.

```
Editor clicks Preview
  → WordPress mints a signed token bound to this page and this revision
  → Editor's browser goes to  /api/preview?token=…
  → Next.js exchanges the token SERVER-SIDE for content
  → Next.js sets draft mode and redirects to /cms/<route>
  → The page renders with a preview banner
```

The browser never carries a WordPress credential. The token authenticates a request **to the renderer's server**, which then talks to WordPress; it is spent on first use and is not stored.

### The five properties, and what each prevents

| Property | Mechanism | Without it |
|---|---|---|
| Bound to one page | `id` inside the signed payload | "Preview one draft" becomes "read every draft on the site" |
| Bound to one revision | `rev` = the page's modified time | A link shared last week silently starts showing this week's unreviewed edits |
| Short-lived | `exp`, 15 minutes | A link in a chat log is a standing grant |
| Single-use | `jti` reserved as a transient, consumed on exchange | A captured link can be replayed until it expires |
| Forgery-resistant | `hash_equals` on an HMAC-SHA256 | A byte-at-a-time comparison is a signature oracle |

The token is an HMAC over base64url claims, not an encrypted blob: nothing in the claims is secret, and the requirement is that anyone can verify and nobody can forge.

The signing secret is generated on first use and stored with `autoload=false`. It is deliberately **not** derived from `AUTH_KEY` — rotating it should invalidate outstanding preview links without logging every user out of WordPress.

### Failure responses

| Case | Status | Body |
|---|---|---|
| Invalid, expired, replayed, forged, page gone | `403` | One message for all of them |
| Page edited since the token was minted | `409` | "Ask for a new link" |

The single 403 message is deliberate. Distinguishing "expired" from "forged" from "already used" would tell someone probing the endpoint which part of their guess was right, and tells a legitimate editor nothing they need. The 409 is separate because it is not a security failure and the editor's next action differs.

### Not indexed, not cached

Every preview response carries:

```
Cache-Control: private, no-store, max-age=0
X-Robots-Tag: noindex, nofollow, noarchive
```

on both the WordPress endpoint and the Next.js route. The `/cms/` mirror is `robots: noindex, follow: false` in its metadata regardless, and its canonical points at the live WordPress URL — a second copy of every page under a different path is exactly the duplicate content that costs a site its rankings.

### The banner

Fixed, high-contrast, and explicit: **"Preview — not live"**, the content status, the route, and the expiry time. Someone who screenshots a preview and sends it on should not be able to pass it off as the published page by accident.

The exit control is a real navigation to `/api/exit-preview`, not a client-side toggle: draft mode is a server cookie and only the server can clear it. Exiting also clears the route cookie, so a later draft-mode session cannot inherit an authorisation it was not granted.

### Device preview

Two things, and the distinction is worth stating because one of them is honest and the other is not:

- **Gutenberg's own Desktop / Tablet / Mobile previews** are in the editor and work. They resize the canvas.
- **The banner does not offer a device emulator.** An emulator inside a page lies: it renders at a CSS width the browser never actually uses, so media queries and viewport units disagree with a real device. The banner says to resize the window, which is what a real device does.

Responsive behaviour is verified for real at 1440, 1024, 768 and 390 px in the acceptance suite (AT-08) and the visual regression run, not asserted from an emulator.

### Preview without the Next.js renderer

`GEMRESERVE_RENDERER_URL` is unset by default. When it is unset, WordPress's Preview button keeps its normal behaviour and previews through the WordPress theme — **which is the live renderer today, and therefore the honest preview.** The signed-token path activates when the constant is set, which is the same moment the Next.js renderer becomes the public layer.

---

## 2. Publishing and cache revalidation

### What happens on publish

```
Editor presses Publish/Update
  → WordPress saves (revision created)
  → transition_post_status fires
  → A signed webhook names the affected routes
  → Next.js verifies and invalidates exactly those routes
```

### The payload

```jsonc
{
  "schemaVersion": "1.0.0",
  "eventId": "post:41:publish",
  "issuedAt": 1788387600,
  "routes": ["/governance/", "/about/"]
}
```

Headers: `X-GemReserve-Signature: sha256=<hex>`, `X-GemReserve-Timestamp`, `X-GemReserve-Event`.

Signature is `HMAC-SHA256(timestamp + "." + body, secret)`. **The timestamp is inside the signed material**, not merely sent beside it — signing only the body would let an interceptor replay a captured request forever by reusing its headers.

### Scope: routes, not "everything"

§16 asks that publishing one page not rebuild the platform. It does not. The affected routes are:

- the page itself
- its parent, because a child appears in the parent's navigation and listings
- `/news/` for a news item; `/assets/` and `/gemstone-programs/` for a gemstone
- `["*"]` **only** when global content changed — a menu, the footer, corporate identity — because every page embeds those

### Defence in depth on the receiving side

| Control | Reason |
|---|---|
| HMAC over timestamp + body | Replay with reused headers |
| Timing-safe comparison | Signature forgery oracle |
| 300-second window | Bounds the replay window |
| Event id remembered in-process | Deduplicates a retry |
| Routes must be site-relative | A route naming a host is ignored |
| Missing secret ⇒ **503, not accept** | An unconfigured secret must never mean "accept everything" |

The event-id memory is per-instance and in-process. That is the honest scope: across instances the worst case is a route revalidated twice, costing one extra render. A shared store for that would be infrastructure bought to prevent a non-problem — revalidation is idempotent.

Eight signature cases are covered by `POST /revalidate-test`; results in `CMS_SECURITY_REVIEW.md` §5.

### Failure is visible and non-fatal

A webhook that cannot be delivered is:

1. logged with its reason (never its body — logging request bodies as a habit is how secrets eventually get logged),
2. recorded in an option and surfaced as an admin notice in plain language: *"Your content is saved and correct. The public site may show the previous version for a few minutes."*,
3. retried **once**, after 60 seconds.

It never blocks the publish. The editor's job is done and the content is correct in WordPress; the renderer picks it up on its own TTL regardless. One retry rather than an escalating chain: a webhook that fails twice costs a slightly stale page for a few minutes, and an unbounded retry queue would be a bigger operational liability than the problem it solves.

### Configuration

Both values are **constants**, set in `wp-config.php` or the environment — never options.

```php
define('GEMRESERVE_RENDERER_URL',      'https://renderer.example');
define('GEMRESERVE_REVALIDATE_URL',    'https://renderer.example/api/revalidate');
define('GEMRESERVE_REVALIDATE_SECRET', '<32+ random bytes, hex>');
```

An option would be editable by anyone who reaches a settings screen, and a webhook target is a request this server makes — pointing it elsewhere turns the CMS into an SSRF gadget.

Renderer side: `GEMRESERVE_CMS_URL`, `GEMRESERVE_REVALIDATE_SECRET`. The CMS URL is deliberately **not** `NEXT_PUBLIC_`-prefixed; it stays on the server.

Verify the shared secret end to end before anything depends on it:

```bash
BODY='{"routes":["/"],"eventId":"probe"}'
TS=$(date +%s)
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -r | cut -d' ' -f1)
curl -sS -X POST "$SITE/wp-json/gemreserve/v1/revalidate-test" \
  -H "Content-Type: application/json" \
  -H "X-GemReserve-Timestamp: $TS" \
  -H "X-GemReserve-Signature: sha256=$SIG" \
  --data "$BODY"
# {"valid":true,"reason":"ok"}
```

---

## 3. Scheduled content

WordPress publishes scheduled posts via `wp-cron`, which fires on visitor traffic by default. On a low-traffic marketing site a post scheduled for 09:00 can appear at 09:40, when someone happens to visit.

The reliable arrangement is a real cron entry with WordPress's own pseudo-cron disabled:

```php
define('DISABLE_WP_CRON', true);
```

```cron
*/5 * * * * cd /var/www/GemReserve/wordpress && wp cron event run --due-now --quiet
```

**This has not been applied.** §4 forbids altering production cron without approval. It is documented here as a requirement for scheduled publishing to be dependable, and listed in `CMS_DEPLOYMENT_READINESS.md` as an outstanding item.

Scheduled content is correctly withheld until its date in the meantime: a `future` post is one of the five states the public API refuses, verified by test.
