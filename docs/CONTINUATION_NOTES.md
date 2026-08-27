# Continuation notes

How to keep building GemReserve.io from this production baseline without disturbing the deployed public site.

---

## What this baseline is

A **public pre-launch information website**: 46 statically prerendered pages, no backend beyond one dormant form endpoint, no blockchain, no authentication. Every future capability is declared as an off-by-default flag in `lib/config.ts` and read by nothing.

The visual design is **approved and frozen**. It was not changed by the production-readiness work and should not be changed without a specific instruction.

---

## Where things live

```
app/                    Routes. One directory per URL.
  api/forms/route.ts    The only dynamic route. Everything else is static.
  layout.tsx            Root metadata, fonts, <html>.
  not-found.tsx         404. error.tsx  Route error boundary.
  globals.css           All styling. ~16k lines, hand-authored.
components/
  layout/               Header, footer, breadcrumbs, logo.
  sections/             Composed page sections (GemstonePage is the big one).
  ui/                   Reusable primitives, forms, motion.
  icons/LineIcon.tsx    Single icon set. Exhaustively typed union.
content/                Typed content modules. No JSX — data only.
lib/
  config.ts             Every env read. Every feature flag.
  forms.ts              Form validation + transport, shared with the API route.
scripts/
  process-assets.mjs    Sharp pipeline: masters -> WebP/AVIF derivatives.
assets/masters/         Source artwork. Never delete; derivatives regenerate from here.
qa/tests/               Playwright, 536 tests.
reference/              Client boards and supplied assets. Gitignored from the build.
```

**The content/presentation split is the load-bearing convention.** `content/` holds typed data transcribed from client boards; `app/` and `components/` render it. Keep new work on that line — it is what makes the copy auditable against the boards.

---

## Rules that keep the site safe

1. **Never read `process.env` outside `lib/config.ts`.** One file to audit.
2. **Flags default off.** A missing variable must always mean _less_ capability, never more.
3. **No secret behind `NEXT_PUBLIC_`.** That prefix publishes to every visitor.
4. **Never show success over a discarded action.** The forms model this: unconfigured → the visitor is told plainly that nothing was sent.
5. **Keep pages static.** Adding `cookies()`, `headers()` or `no-store` to a page opts it into dynamic rendering and removes the static-hosting option. Put per-request work in a route handler.
6. **Do not fabricate figures.** Several pages carry deliberate omissions where a client board asserted more than the project can support — see the header comments in `content/licensing-white-label.ts` and `content/future-infrastructure.ts`. Those comments are the reasoning; read before editing.

---

## Adding a page

1. `content/<name>.ts` — typed data, with a header comment naming its source board.
2. `app/<route>/page.tsx` — render it. Copy the closest existing page for the section rhythm.
3. Styles at the end of `globals.css`, in a commented block.
4. Add the route to `app/sitemap.ts` and, if it belongs in navigation, `content/navigation.ts`.
5. Add it to the `routes` array in `qa/tests/phase-one.spec.ts` — that alone gives it overflow, console-error and failed-request coverage at six widths.

---

## Enabling the future ecosystem

Each capability has a flag in `lib/config.ts`. The intended sequence:

### 1. Lead forms (nearest term)

Everything is built. Set `NEXT_PUBLIC_ENABLE_FORM_SUBMISSION=true` plus the two `FORM_DELIVERY_*` variables and rebuild.

Before enabling: choose a provider, add bot protection (the integration point is the API route — validate the token before the delivery call), confirm a retention policy, and bump `CONSENT_VERSION` in `lib/forms.ts` if the visible consent wording changed.

### 2. Participant portal — authentication and KYC

`/redemption-portal` is currently a **visual preview with no controls**. Keep it that way until auth exists.

Recommended shape: real sessions in `app/(portal)/` as a route group with its own layout, sessions in httpOnly cookies (never `localStorage`), KYC through a provider's hosted flow so identity documents never touch this server. The portal becomes dynamic — that is expected and is why deployment model A is recommended in `DEPLOYMENT.md`.

### 3. Proof of Reserves

Needs a real attestation source. The page must distinguish _attested_, _pending_ and _stale_ — never render a figure without its as-of timestamp and provenance. If the feed is unavailable, show that plainly rather than the last known value.

### 4. Token acquisition

The largest legal surface. `/token-acquisition` currently describes a process and carries a standing notice that it is not open. Do not remove that notice until the flow is genuinely live.

Requires: restricted-jurisdiction enforcement at the point of action (the list is already transcribed in `content/restricted-jurisdictions.ts`), completed KYC, a real payment integration, and audited contracts. Wallet connection belongs behind `NEXT_PUBLIC_ENABLE_WALLET_CONNECT` and should be its own reviewable change.

**Do not let any of these grow into the static marketing pages.** Keep transactional surfaces in their own route group with their own layout.

---

## Working with assets

Derivatives in `public/images/` are **generated**. Never hand-edit them.

```bash
npm run assets                 # rebuild everything
node scripts/process-assets.mjs overview-hero   # rebuild one hero
```

`assets/masters/` is the source of truth — keep it in the repository. Two duplicate master exports were removed in `deeba7d`; check for an existing master before adding one.

---

## Before any deploy

```bash
npm run typecheck && npm run lint && npm run format:check && npm run build && npm run qa
```

Playwright needs the production build running. The suite takes ~35 minutes; it catches horizontal overflow, console errors and failed requests on every route at six widths, so let it finish.

Two audit findings recur and are **benign** — absolutely-positioned nav dropdowns and the footer brand block reporting a scrollWidth delta at 1440. They are not defects.

---

## What not to do

- Do not redesign. The visual direction is approved.
- Do not introduce a CSS framework alongside `globals.css`.
- Do not add a state library — nothing here needs one.
- Do not add analytics without a decision on what visitor data it carries; the CSP currently forbids third-party script and that is a feature.
- Do not weaken TypeScript or add blanket `any` to make something pass.
- Do not delete `reference/` — it is how copy stays auditable against the client boards.
