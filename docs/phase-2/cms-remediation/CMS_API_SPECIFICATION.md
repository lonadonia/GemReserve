# CMS API Specification

**Namespace:** `/wp-json/gemreserve/v1/`
**Schema version:** `1.0.0` (see `CMS_CONTENT_SCHEMA.md`)

---

## 1. The rule that shapes every endpoint

**The public endpoints serve published, public content and nothing else.**

Not "published content plus a `status` field the client should ignore" — draft, pending, scheduled, private and password-protected content is absent from public responses entirely, and reaching it requires the signed preview path.

That is stricter than WordPress's own `wp/v2` with `context=edit`, deliberately. This API is designed to be consumed by a static site generator that caches what it fetches. An endpoint that can be talked into returning a draft is an endpoint that can get a draft cached on a CDN.

### Why REST and not GraphQL

§12 asks that WPGraphQL not be introduced on popularity alone. It has not been. The project has no existing dependency on it, the content model is one page shape with six node types, and the REST architecture already in the codebase serves it without adding a plugin, a schema layer and a query-complexity attack surface to a marketing site.

---

## 2. Endpoints

### `GET /pages`

The route index, for static generation.

```jsonc
{
  "schemaVersion": "1.0.0",
  "count": 58,
  "routes": [
    { "id": 4, "route": "/", "type": "page", "updatedAt": "2026-09-02T21:04:11+00:00" }
  ]
}
```

Non-public content never appears here. Verified by test: `REST — published content only / the route index omits non-public pages`.

---

### `GET /page`

One published page.

| Parameter | Type | Notes |
|---|---|---|
| `route` | string | `/governance/`. Normalised: leading and trailing slash added, duplicate slashes collapsed. |
| `id` | integer | Alternative to `route`. |

Returns the normalised page object (`CMS_CONTENT_SCHEMA.md` §4).

**404** for anything not publicly readable, which is checked as five separate conditions rather than one: post type must be `page` or `gemstone` and public; status must be `publish`; no post password; not a revision or autosave.

**A route naming a host is refused**, not reduced to its path. `https://evil.example/about/` returns 404 rather than this site's `/about/`. Reducing it was safe — the lookup is a slug query and could only ever have returned our own page — but a consumer that asked for another origin and got a 200 has been told something false about what it fetched.

**Cache:** `public, max-age=60, stale-while-revalidate=600`. `public` is safe here precisely because the endpoint cannot return non-public content.

---

### `GET /globals`

Site-wide editorial content: announcement, corporate identity, contact addresses, footer copy, every registered navigation menu as a tree, and SEO defaults.

Read from `gemreserve-core`'s settings and WordPress's own menus, so this publishes what the site already uses rather than a second copy that can disagree with it.

---

### `GET /health`

Liveness and contract information, so a deployment smoke test has something to assert against that is not a content page.

```jsonc
{
  "schemaVersion": "1.0.0",
  "pluginVersion": "1.0.0",
  "pagesWithLegacyBody": 58,
  "pagesMigrated": 58,
  "blocks": ["gemreserve/section", "gemreserve/repeatable", "…"]
}
```

---

### `POST /preview-token` — authenticated

Mints a signed preview token. Requires `gr_preview_drafts` (or `edit_posts`) **and** `edit_post` on the specific page.

```jsonc
{ "token": "<payload>.<signature>", "expires": 1788390000, "url": "https://…/api/preview?token=…" }
```

`Cache-Control: no-store`.

---

### `GET /preview` — token-authorised

Exchanges a token for draft content. Authorisation is the token, checked inside the callback, because the caller is a server fetching on behalf of an anonymous browser and has no WordPress session.

| Status | Meaning |
|---|---|
| `200` | Content, plus `preview: { isPreview, expiresAt, status }` and the `status` field. |
| `403` | Invalid, expired, replayed, forged, or the page is gone. |
| `409` | The page has been edited since the token was minted. |

**One message for every 403.** Distinguishing "expired" from "forged" from "already used" would tell someone probing the endpoint which part of their guess was right, and tells a legitimate editor nothing they need — they need "ask for a new link", which is what they get. The 409 is separate because it is not a security failure and the editor's action is different.

Headers: `Cache-Control: private, no-store, max-age=0`, `X-Robots-Tag: noindex, nofollow, noarchive`.

#### Token design

An HMAC-SHA256 over base64url claims — not an encrypted blob, because nothing in the claims is secret and the requirement is that anyone can verify and nobody can forge.

```jsonc
{ "v": 1, "id": 41, "rev": "1788387600", "exp": 1788388500, "jti": "<16 random bytes>" }
```

| Property | Mechanism | What it prevents |
|---|---|---|
| Bound to one page | `id` is inside the signed payload | "Preview one draft" becoming "read every draft" |
| Bound to one revision | `rev` is the modified time | A link shared last week silently showing this week's unreviewed edits |
| Short-lived | `exp`, 15 minutes | A link in a chat log becoming a standing grant |
| Single-use | `jti` reserved as a transient, consumed on first exchange | Replay of a captured link |
| Forgery-resistant | `hash_equals` on the signature | A byte-at-a-time compare is an oracle |

The signing secret is generated on first use and stored with autoload off. It is deliberately **not** derived from `AUTH_KEY`: rotating it should invalidate outstanding preview links without logging every user out of WordPress.

All eight properties are covered by tests in `tests/run-tests.php` under *Preview tokens*.

---

### `POST /revalidate-test`

Verifies a webhook signature and does nothing else. Exists so a deployment can prove the shared secret matches on both sides before anything depends on it.

Unlike `/preview`, this endpoint's failure reasons are specific (`signature mismatch`, `timestamp outside the 300s window`, `X-GemReserve-Signature header missing`). That is safe and useful: it has no side effects and reveals nothing an operator configuring the webhook does not already know.

---

## 3. The outbound webhook

WordPress → renderer, on publish. Not part of this namespace; documented here because it is the other half of the contract.

```
POST <GEMRESERVE_REVALIDATE_URL>
Content-Type: application/json
X-GemReserve-Signature: sha256=<hex>
X-GemReserve-Timestamp: <unix seconds>
X-GemReserve-Event: post:41:publish

{ "schemaVersion":"1.0.0", "eventId":"post:41:publish", "issuedAt":1788387600, "routes":["/governance/","/about/"] }
```

Signature is `HMAC-SHA256(timestamp + "." + body, secret)`. **The timestamp is inside the signed material, not merely sent alongside it** — signing only the body would let an interceptor replay a captured request forever by reusing its headers.

`routes` names what changed: the page, its parent, and the relevant index for news and gemstones. `["*"]` means global content changed and everything is stale. Publishing one page does not rebuild 58 routes.

**Endpoint and secret come from constants, never the database.** An option would be editable by anyone reaching a settings screen, and a webhook target is a request this server makes — pointing it elsewhere turns the CMS into an SSRF gadget.

**Failure is visible and non-fatal.** A delivery that fails is logged, surfaced as an admin notice, and retried once. It never blocks the publish: the editor's job is done and the content is correct in WordPress; the renderer picks it up on its own TTL. One retry rather than an escalating chain — a webhook that fails twice costs a slightly stale page for a few minutes, and an unbounded retry queue would be a bigger operational liability than the problem it solves.

---

## 4. Consumer obligations

A consumer of this API must:

1. **Check `schemaVersion`.** Refuse a major mismatch; tolerate minor drift.
2. **Validate before rendering.** Drop nodes that do not match and report them; never patch them into shape.
3. **Never cache a preview response.**
4. **Treat `type: "preserved"` and `type: "core"` html as design**, subject to the same allowlist as everything else.
5. **Distinguish 404 from unreachable.** A missing page is a 404; an outage must not turn the whole site into 404s. `lib/cms/client.ts` raises `CmsUnavailableError` separately from returning `null` for exactly this reason.

---

## 5. What this API will never expose

Restated from §20 of the brief, because it constrains the design rather than merely describing it.

No user balances, token supply, mint/burn, chain transactions, wallet data, multisig operations, KYC/KYB evidence, sanctions decisions, payment records, ledger entries, Proof-of-Reserves calculations, redemption decisions or compliance cases.

The CMS has no read path into the Fastify/PostgreSQL backend and no chain access. Where a public page describes reserves or redemption, it describes them as editorial copy; live figures come from the backend's own APIs at render time.

This is why the block model has **no "live data" block kind**. A block that pulled a balance would make WordPress a cache of operational truth.
