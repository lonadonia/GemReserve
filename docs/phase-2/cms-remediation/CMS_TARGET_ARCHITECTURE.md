# CMS Target Architecture

This document records what is being built and, more importantly, why the obvious alternatives were rejected. Every decision here is traceable to a measurement in `CMS_CURRENT_STATE_AUDIT.md`.

---

## 1. The constraint that decides everything

The brief describes a headless target:

```
WordPress Gutenberg Editor → Versioned CMS API → Next.js Block Renderer → Public Website
```

and qualifies it in §11: implement the Next.js renderer *"if Next.js remains the public presentation layer."*

**It does not.** The audit established that `https://www.gemreserve.io` is served by WordPress's own theme through PHP-FPM on `127.0.0.1:3200`. The two Next.js services on `:3000` and `:3100` are a rollback target.

Building a Next.js block renderer as *the* public renderer would therefore not be implementing the brief — it would be a second, unrequested migration: moving the live site off WordPress rendering and back onto Next.js, changing the production topology, and putting all 58 routes through a fresh cutover. That is a larger and riskier change than the editing problem the client actually raised, and §4 forbids replacing the production public site.

### What is built instead

```
                      ┌──────────────────────────────────────┐
                      │  WordPress (gemreserve-visual-cms)   │
                      │  Gutenberg block editor              │
                      └──────────────┬───────────────────────┘
                                     │ post_content: block markup
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
            ▼                        ▼                        ▼
  ┌──────────────────┐   ┌───────────────────────┐  ┌──────────────────┐
  │ PHP block        │   │ /wp-json/gemreserve/  │  │ Signed preview   │
  │ render_callback  │   │ v1/  (versioned,      │  │ + revalidation   │
  │                  │   │ normalised, typed)    │  │ webhook          │
  │ → LIVE public    │   │ → Next.js renderer    │  │                  │
  │   site (today)   │   │   (parity-tested)     │  │                  │
  └──────────────────┘   └───────────────────────┘  └──────────────────┘
```

**One content model, two renderers.** The blocks are server-rendered by PHP for the live site, and the same block tree is published through a versioned API in a normalised form that the Next.js renderer consumes. The Next.js renderer is built and tested to parity, so the headless path in the brief exists and works — it is simply not switched on in production, because switching production renderers is a deployment decision under §29, not something to do silently inside a CMS remediation.

This satisfies the brief's target flow without performing an unauthorised production migration. If the client wants Next.js back as the public layer, the renderer is ready and the cutover is a deployment step with a documented rollback.

---

## 2. Why the block library is not what it looks like

The brief's §8 lists likely block families — hero, statistics, feature cards, timeline, comparison table, and so on — and says to discover the real patterns before finalising the catalogue. That discovery produced an uncomfortable result.

Measured across all 40 migrated bodies:

| Measure | Value |
|---|---:|
| `<section>` elements | 187 |
| `<li>` elements | 1,135 |
| **Distinct `<li>` internal structures** | **30+** |

The long tail is real: `svg>h3>p` (159 items), `svg>div>h3>p` (162), `span>svg>span>h3>p` (27), `div>img>span>div>h3>span>p` (10), and twenty-odd more. This is not a site assembled from a component kit. It is a bespoke design where sections differ in ways a designer chose deliberately.

Two approaches suggest themselves, and both fail:

**Approach A — map everything onto ~16 semantic blocks.** This is what conventional Gutenberg work looks like and what the brief's §8 list implies. Applied here it would silently redesign the site: thirty structures do not survive being flattened into six, and the differences that get flattened away are exactly the ones the design was paid for. It would also violate §31's "preserve the approved GemReserve design" while appearing to comply with §8.

**Approach B — one locked HTML block per section.** Fidelity is perfect. The marketing team is exactly as stuck as they are today, which is the complaint this project exists to answer.

### The approach taken: design template + typed content slots

The insight is that "design" and "content" are separable *within* a section, and only the content needs to be editable.

- **Design** — tags, classes, SVG path data, attribute order, whitespace — is preserved verbatim as a template string.
- **Content** — heading text, paragraph copy, link destinations, button labels, image sources, alt text, icons — is lifted out into typed, individually-editable **slots**.

Rendering substitutes slots back into the template. The property that makes this trustworthy:

> A section extracted and re-rendered with unchanged values produces **the original bytes** — not "visually identical", the same string.

That is asserted mechanically for every fragment, and anything that fails it is not migrated; it falls back to preserved markup and is counted. Fidelity is a checked invariant, not a claim.

### Measured outcome across all 40 pages

| Measure | Value |
|---|---:|
| Routes where decompose → render is byte-identical | **58 / 58** |
| Total blocks produced | 2,480 |
| Top-level sections on the 40 pages | 176 |
| **Individually editable content slots** | **7,227** |
| **Repeatable collections (add / duplicate / reorder items)** | **235** |
| Preserved fallbacks (admin-only) | **0** |

Evidence: `evidence/page-block-inventory.json`, regenerated by `tools/inventory.php`.

### The icon decision, and what it bought

Of 220 candidate repeatable lists, 111 had items that were structurally identical **except for their SVG icon**. Treating an icon as design would have made those 111 lists un-repeatable — "add another card" would have failed on half the site.

Icons are therefore a slot kind of their own (`KIND_ICON`), the only one whose value is markup. That raised repeatable collections from 36 to 147, a 4× improvement in the operations the client asked for by name. The cost is contained by sanitising every icon on render against a closed element and attribute allowlist, so a hand-edited or API-injected icon cannot carry script, event handlers or external references (`CMS_SECURITY_REVIEW.md` §3).

Two SVGs on the site carry `<text>` labels — the governance pyramid and the lifecycle ring. Those are diagrams drawn at fixed coordinates, not icons; they are deliberately excluded from icon slots and stay in the design template, because offering a 420-unit diagram in an icon picker beside 24-unit icons would be nonsense, and retyping a label positioned at `x="210"` would break the drawing.

---

## 3. The block set

Five block types, all server-rendered. None stores saved markup in `post_content` beyond its attributes, so a design correction ships as a plugin deploy rather than a re-save of forty pages — and there is no "this block contains unexpected content" wall for an editor to hit.

| Block | Role | Editor affordance |
|---|---|---|
| `gemreserve/section` | One `<section>`. Top level. | Move, duplicate, delete, hide, rename. The editor's own list view becomes the section list. |
| `gemreserve/wrapper` | A structural/animation wrapper. | Locked. Exists so the editor can reach what is inside it. |
| `gemreserve/repeatable` | A list whose items repeat. | Add, duplicate, remove, reorder items. |
| `gemreserve/content` | A leaf of markup with slots. | One labelled field per slot: text, link, image, icon. |
| `gemreserve/gap` | Whitespace and decorative markup. | Hidden from the inserter; exists only to reproduce original formatting exactly. |

A sixth, `gemreserve/preserved`, is the escape hatch for markup that fails the byte-identity check. It requires `unfiltered_html` to create or edit, so a marketing user can never produce one. **It is currently used zero times.**

### Why not a `hero` block

The hero is already fully editable through `gemreserve-core`'s structured fields (`_gr_hero_*`), which the client's own list of working capabilities confirms. Re-implementing it as a block would migrate working functionality for no gain and would risk the one part of the page that is not currently broken. The hero stays where it is; the visual CMS adds a read-only mirror of it into the block editor so the editor shows the whole page, not just the part it owns.

---

## 4. Ownership boundary: a new plugin, not `gemreserve-core`

`gemreserve-core` owns the *content model* — post types, taxonomies, structured fields, corporate settings, forms, roles. Its header states the reason it is a plugin at all: the model must survive a theme change.

The visual CMS is a different concern: it owns the *editing surface and the block rendering pipeline*. Putting it inside `gemreserve-core` would mean a bug in block rendering could take down the gemstone register and the document workflow, and it would make the two independently un-deployable.

**Decision: a new plugin, `gemreserve-visual-cms`,** which depends on `gemreserve-core` but is separately activatable and separately rollback-able. `gemreserve-core` is modified in exactly one place — the filter that disables Gutenberg for pages — and that change is small, reversible and documented.

---

## 5. What must not move into WordPress

Restated because it constrains the API design (§20 of the brief). WordPress manages public editorial content and public presentation configuration. It is never the authoritative store for user balances, token supply, mint/burn, chain transactions, wallet data, multisig operations, KYC/KYB evidence, sanctions decisions, payments, ledger entries, Proof-of-Reserves calculations, redemption decisions or compliance cases.

The CMS API exposes published editorial content only. It has no read path into the Fastify/PostgreSQL backend and no chain access. Where a public page needs to *describe* reserves or redemption, it describes them as editorial copy; live figures come from the backend through its own APIs at render time, not from WordPress.

This is why the block model has no "live data" block kind. A block that pulled a balance would make WordPress a cache of operational truth, which §20 forbids.

---

## 6. API shape

Namespace `gemreserve/v1`, versioned by a `schemaVersion` on every response so a future block change is a migration rather than a break.

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /page` | public | Published page by route, normalised blocks + SEO. |
| `GET /pages` | public | Route index for static generation. |
| `GET /globals` | public | Navigation, footer, identity, announcement. |
| `GET /preview` | signed token | Draft / pending / scheduled / revision content. |
| `POST /revalidate-test` | HMAC | Webhook signature verification without side effects. |

Public endpoints serve published, public content only. Draft, private and scheduled content is reachable only through the signed preview path, which binds to one page and one revision and expires. Details and the exact response schema are in `CMS_API_SPECIFICATION.md`.

**WPGraphQL is not introduced.** The project has no existing dependency on it, the REST architecture already in place is adequate for a content model this shape, and §12 is explicit that popularity is not a justification.

---

## 7. Global content and the leadership registry

WordPress already manages the announcement, footer, identity, navigation and SEO defaults through `gemreserve-core`'s settings screen and menus. Those stay.

One addition is proposed and **not applied**: the leadership registry (IDENT-1 in the audit) is currently hardcoded PHP inside an uncommitted plugin, which means a mandated identity element is both un-editable by marketing and absent from version control. Moving it into structured content would fix both. It is left for client decision because §13 forbids rewriting legal or identity content without controlling-document authority, and those documents could not be located.

---

## 8. Rejected alternatives, recorded

| Option | Why not |
|---|---|
| Elementor or another page builder | §4 forbids it without documented justification and approval. It would also replace the approved design's markup with the builder's, which is the failure mode this architecture exists to avoid. |
| ACF Pro for the field layer | A commercial licence the project has not been shown to hold. `gemreserve-core` already made this call and it is not revisited. |
| WPGraphQL | §12. No existing dependency, no demonstrated need. |
| Flatten sections into ~16 semantic blocks | Silently redesigns the site. See §2, Approach A. |
| One locked HTML block per section | Preserves the design and solves nothing. See §2, Approach B. |
| Move the live renderer to Next.js now | Unrequested production migration; §4 and §29. The renderer is built and tested, and cutover is left as an authorised deployment decision. |
