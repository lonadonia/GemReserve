# CMS Content Schema

**Schema version: `1.0.0`** — published on every API response as `schemaVersion`.

---

## 1. The two shapes

Content exists in two forms, and keeping them distinct is what lets the editor be flexible and the consumer be simple.

| | **Stored** (`post_content`) | **Published** (API) |
|---|---|---|
| Audience | The block editor, and the PHP renderer | Any consumer of `/wp-json/gemreserve/v1/` |
| Slots | Placeholders (`{{gr_c1}}`) plus values | Already substituted and escaped |
| Whitespace | Preserved exactly, as `gap` blocks | Dropped |
| Design markup | Raw start/end tags | Element name plus an inert attribute map |
| Hidden sections | Present, flagged `hidden` | **Absent** |

A consumer never has to reimplement the slot engine, the escaping rules or the icon sanitiser: the published form is resolved. It also carries the typed values alongside, so a consumer that prefers to render natively can.

---

## 2. Block types

Six, all server-rendered. `post_content` holds attributes and nothing else — no saved markup — so a design correction ships as a plugin deploy rather than a re-save of every page, and there is no "this block contains unexpected content" recovery wall for an editor to hit.

### `gemreserve/section`

One `<section>`. Top level, so the editor's own move / duplicate / delete controls are section operations.

| Attribute | Type | Meaning |
|---|---|---|
| `open` | string | The stored start tag, verbatim. |
| `close` | string | The stored end tag. |
| `label` | string | Human name for the editor's list view. Never rendered. |
| `variant` | string | The element's class list. |
| `anchor` | string | The element's `id`, if any. |
| `hidden` | boolean | When true the section renders **nothing** — not `display:none`. |

`open`/`close` are stored rather than rebuilt from `variant`. Rebuilding would mean re-deciding attribute order and quoting, and the one thing this migration cannot afford is a renderer that produces *equivalent* markup instead of *the same* markup.

### `gemreserve/wrapper`

A structural or animation container (`div.motion-reveal` and friends). Same attributes as `section` minus `label` and `anchor`. Locked in the editor: it carries design, and descending through it is what exposes the editable things inside.

### `gemreserve/repeatable`

A list whose children repeat — the cards, pillars and numbered steps.

| Attribute | Type | Meaning |
|---|---|---|
| `open` / `close` | string | The list element's tags. |
| `itemTemplate` | string | One item's markup, with placeholders. |
| `itemSlots` | array\<Slot\> | The slot descriptors for one item. |
| `items` | array\<map\> | One value map per card, keyed by slot key. |
| `separators` | array\<string\> | The whitespace that sat between the original items. |
| `trailing` | string | Whitespace before the closing tag. |
| `variant`, `hidden` | | As above. |

`separators` exists so output keeps its original formatting. A card added in the editor has no recorded separator and reuses the last one, which is what makes a new card indent like its neighbours instead of collapsing the list onto one line.

An emptied collection renders nothing: removing every card removes the grid, rather than leaving an empty bordered panel.

### `gemreserve/content`

A leaf of design markup with its content lifted into slots.

| Attribute | Type |
|---|---|
| `template` | string — markup with `{{gr_key}}` placeholders |
| `slots` | array\<Slot\> |
| `hidden` | boolean |

### `gemreserve/gap`

Whitespace between blocks, preserved so the migration reproduces original formatting exactly. **Whitespace only** — the renderer discards anything else, which makes it the one block that cannot emit a tag under any circumstances.

### `gemreserve/preserved`

The escape hatch for markup that failed the byte-identity check. Renders as stored, so creating or editing one requires `unfiltered_html`; no marketing role has it. **Currently used zero times across all 58 routes.**

---

## 3. The Slot

The unit of editable content.

```jsonc
{
  "key":   "c7",           // unique within its block
  "kind":  "text",         // text | attr | url | icon
  "label": "Heading",      // human name, derived from the element
  "value": "Our principles",
  "path":  "/div/h2#text"  // provenance, for editor grouping
}
```

### Kinds, and how each is escaped on render

| Kind | Source | Escaping | Why |
|---|---|---|---|
| `text` | A text node | `&`, `<`, `>`, U+00A0 | The HTML5 serialisation rule for text. |
| `attr` | `alt`, `title`, `aria-label`, `placeholder`, `value` | `&`, `"`, U+00A0 | The rule for a double-quoted attribute. |
| `url` | `href`, `src` | Scheme-checked, then attribute-escaped | See below. |
| `icon` | A whole inline `<svg>` | Closed element/attribute allowlist | See below. |

**On the escaper.** These are the HTML5 serialisation rules rather than `esc_html`/`esc_attr`. That is not a weakening — it escapes exactly what makes a value inert in its own context — but it matters for fidelity: `esc_attr` turns `'` into `&#039;`, so every apostrophe in the approved copy would come back re-encoded and the byte-identity check would fail on formatting rather than on meaning.

**On URLs.** `javascript:`, `data:`, `vbscript:` and `file:` are rejected, including forms that hide the scheme behind control characters (`java\nscript:`). Relative and root-relative URLs — most of this site's internal linking — carry no scheme and pass. The value is *not* pre-escaped by the scheme check; escaping happens once, afterwards, so `&` in a query string does not become `&amp;amp;`.

**On icons.** The only slot whose value is markup, and it exists for a measured reason: of 220 repeatable lists on this site, **111 have items that are structurally identical except for their icon**. Treating an icon as design would have made those lists un-repeatable and broken "add another card" on half the site. Treating it as a slot took repeatable collections from 36 to 147.

The cost is contained by sanitising on both save and render against a closed list. Excluded by name: `<script>`, `<foreignObject>`, `<use>`, `<image>`, every `on*` handler, `style`, and any `url()` reference that is not a local `#fragment`.

An SVG containing `<text>` is a *diagram*, not an icon — the governance pyramid and the lifecycle ring are the two on this site — and stays in the design template. Their labels are drawn at fixed coordinates, so retyping one would break the drawing.

---

## 4. The published (API) shape

```jsonc
{
  "schemaVersion": "1.0.0",
  "id": 41,
  "slug": "governance",
  "route": "/governance/",
  "title": "Governance",
  "excerpt": "",
  "parent": 40,
  "menuOrder": 0,
  "updatedAt": "2026-09-02T21:04:11+00:00",
  "publishedAt": "2026-08-29T16:56:00+00:00",
  "migrated": true,

  "hero": {
    "eyebrow": "Company",
    "titleLines": ["Governance"],
    "tagline": "...",
    "description": "...",
    "imageDesktop": "/images/heroes/governance",
    "imageMobile": "/images/heroes/governance-mobile",
    "variant": "governance-hero"
  },

  "seo": {
    "title": "...", "description": "...",
    "canonical": "https://www.gemreserve.io/governance/",
    "noindex": false, "nofollow": false,
    "openGraph": { "title": "...", "description": "...", "image": "", "type": "website" },
    "twitter":   { "card": "summary_large_image", "title": "...", "description": "..." },
    "structuredData": { "type": "WebPage", "name": "...", "url": "..." },
    "inSitemap": true
  },

  "featuredMedia": null,
  "blocks": [ /* nodes, below */ ]
}
```

`status` and `revisionOf` appear **only** on the authenticated preview response. The public endpoint does not carry them, because it cannot return anything whose status is in question.

### Node types

```jsonc
{ "type": "section",
  "label": "Our governance principles",
  "tag": "section",
  "variant": ["governance-principles", "container-wide"],
  "anchor": "",
  "attributes": { "class": "...", "aria-labelledby": "governance-principles-title" },
  "children": [ /* nodes */ ] }

{ "type": "group",      "tag": "div", "variant": [...], "attributes": {...}, "children": [...] }

{ "type": "collection", "tag": "ul",  "variant": [...], "attributes": {...},
  "items": [ { "html": "<li>…</li>", "fields": [ /* Slot without `path` */ ] } ] }

{ "type": "content",    "html": "<div>…</div>", "fields": [ ... ] }

{ "type": "preserved",  "html": "…" }

{ "type": "core",       "name": "core/paragraph", "html": "<p>…</p>" }
```

**`attributes` is a closed, inert map** — `class`, `id`, `style`, `role`, `tabindex`, `hidden`, `lang`, `dir`, and any `aria-*` or `data-*`. No URL-bearing or executable attribute can appear in it, so a consumer may spread it onto an element directly.

It is published rather than reconstructed for a reason found the hard way: an earlier renderer synthesised `aria-label` from the section's editor label and dropped the design's `aria-labelledby`, silently changing the accessible name of every section on the site.

---

## 5. Versioning

`schemaVersion` is `MAJOR.MINOR.PATCH`.

- **Major** — a consumer must be updated. Removing a node type, changing an attribute's meaning, changing escaping.
- **Minor** — additive. A new optional field, a new node type a consumer may ignore.
- **Patch** — no shape change.

The Next.js renderer refuses a **major** mismatch outright and tolerates minor drift (`lib/cms/schema.ts`, `isCompatibleSchema`). Refusing to render a site because WordPress gained an optional field would be a self-inflicted outage; rendering content the build does not understand would be a silent one.

---

## 6. Validation

Every response is validated at the consumer before it reaches a component, by hand-written narrowing validators in `lib/cms/schema.ts`.

They are **narrowing, not coercing**: a node that does not match is dropped and logged, never patched into shape. A renderer that quietly repairs bad input is a renderer that hides a broken migration.

No schema library is used. This is one response shape with six node kinds; adding zod or valibot to validate it would put a runtime dependency and its supply chain into a marketing website to save about eighty lines.

---

## 7. Measured shape of the real content

Across all 58 public routes, after migration:

| Measure | Value |
|---|---:|
| Blocks | 1,854 |
| Top-level sections | 176 |
| Editable content slots | 4,956 |
| Repeatable collections | 147 |
| `preserved` fallbacks | **0** |
| Pages where stored blocks re-render byte-identically | **58 / 58** |

Regenerate with `wordpress/plugins/gemreserve-visual-cms/tools/inventory.php`; the current figures are in `evidence/page-block-inventory.json`.
