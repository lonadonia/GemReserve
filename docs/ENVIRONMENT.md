# Environment variables

Every variable is read in exactly one place — `lib/config.ts`. No component reads `process.env` directly. `.env.example` is the template.

**All variables are optional.** With none set, the site builds and runs as the public pre-launch preview.

---

## The `NEXT_PUBLIC_` rule

| Prefix          | Where it lives                                           | Use for                      |
| --------------- | -------------------------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_*` | **Compiled into the browser bundle. Publicly readable.** | Flags, public origins        |
| everything else | Server process only                                      | Secrets, API keys, endpoints |

Putting a secret behind `NEXT_PUBLIC_` publishes it to every visitor. There is no way to un-publish it afterwards — the key must be rotated.

`NEXT_PUBLIC_*` values are baked in **at build time**. Changing one requires a rebuild, not a restart.

---

## Reference

### `NEXT_PUBLIC_SITE_URL`

Canonical public origin. Drives canonical links, Open Graph URLs, `metadataBase` and the sitemap.

- Default `https://gemreserve.io`
- No trailing slash; include the scheme
- Production: `https://gemreserve.io` · Staging: the staging host · Local: omit

Wrong value → canonical tags and sitemap entries point at the wrong host, which search engines treat as duplicate content.

---

### `NEXT_PUBLIC_ALLOW_INDEXING`

Only `"false"` has an effect; anything else allows indexing.

When `false`, `robots.txt` becomes `Disallow: /` and the sitemap reference is withheld.

**Set to `false` on every non-production deployment.** A crawlable staging host competes with production for the same content and can expose pages before they are announced.

---

### `NEXT_PUBLIC_ENABLE_FORM_SUBMISSION`

Only `"true"` enables. Default off.

Off → forms perform no network call and show the demonstration state.
On → forms POST to `/api/forms`.

Requires `FORM_DELIVERY_ENDPOINT` **and** `FORM_DELIVERY_API_KEY`. With the flag on but no destination configured the API returns 503 and the forms fall back to the honest preview state — a visitor is never shown success over a discarded message.

---

### `FORM_DELIVERY_ENDPOINT` · server-only

HTTPS endpoint receiving submissions (CRM, mail relay, form provider).

Receives `POST` with `{ kind, fields, consentVersion, receivedAt }`. `kind` is `waitlist` | `contact` | `early-access`.

---

### `FORM_DELIVERY_API_KEY` · server-only · **secret**

Sent as `Authorization: Bearer <key>`.

Store in `.env.local` with `chmod 600`, or in the systemd `EnvironmentFile`. Never commit it; never log it. Rotate if exposed.

---

### Future ecosystem gates

All default **off**. Nothing reads them yet — they exist so each capability has one greppable switch and a reviewer can confirm at a glance that none is live.

| Variable                                | Gates                                  |
| --------------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_ENABLE_WALLET_CONNECT`     | Wallet connection UI                   |
| `NEXT_PUBLIC_ENABLE_TOKEN_SALE`         | Token acquisition, payment, settlement |
| `NEXT_PUBLIC_ENABLE_PROOF_OF_RESERVES`  | Live attestation feed                  |
| `NEXT_PUBLIC_ENABLE_REDEMPTION`         | Physical redemption requests           |
| `NEXT_PUBLIC_ENABLE_PARTICIPANT_PORTAL` | Authentication and KYC                 |

> Do not enable any of these without the legal and infrastructure sign-off recorded in `PRODUCTION_READINESS_AUDIT.md` §7. Each represents a regulated capability, not merely a UI toggle.

---

## Typical configurations

**Local development** — no `.env.local` needed.

**Staging**

```bash
NEXT_PUBLIC_SITE_URL=https://staging.gemreserve.io
NEXT_PUBLIC_ALLOW_INDEXING=false
```

**Production, pre-launch (current target)**

```bash
NEXT_PUBLIC_SITE_URL=https://gemreserve.io
```

**Production with live forms**

```bash
NEXT_PUBLIC_SITE_URL=https://gemreserve.io
NEXT_PUBLIC_ENABLE_FORM_SUBMISSION=true
FORM_DELIVERY_ENDPOINT=https://provider.example.com/v1/forms
FORM_DELIVERY_API_KEY=<secret>
```

---

## Adding a variable

1. Add it to `lib/config.ts` with a safe default — flags default **off**.
2. Document it in `.env.example` and here.
3. Never read `process.env` from a component.
4. If it is a secret, confirm it has no `NEXT_PUBLIC_` prefix.
