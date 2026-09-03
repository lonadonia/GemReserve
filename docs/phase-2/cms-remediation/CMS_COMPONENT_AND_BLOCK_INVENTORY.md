# CMS Component and Block Inventory

Measured, not estimated. Regenerate with `wordpress/plugins/gemreserve-visual-cms/tools/inventory.php`; the underlying data is `evidence/page-block-inventory.json`.

---

## 1. What the site is made of

Surveyed across all 58 public routes before any change:

| Measure | Value |
|---|---:|
| Public routes | 58 (40 pages + 18 gemstones) |
| `<section>` elements | 187 (176 top-level, 11 nested) |
| `<li>` elements | 1,135 |
| **Distinct `<li>` internal structures** | **30+** |
| Candidate repeatable lists | 220 |
| Total migrated body HTML | ~964 KB |

The third row is the one that shaped every decision that follows. This is not a site assembled from a component kit; it is a bespoke design in which sections differ in ways a designer chose. `svg>h3>p` appears 159 times, `svg>div>h3>p` 162, `span>svg>span>h3>p` 27, `div>img>span>div>h3>span>p` 10, and so on down a long tail.

### Why that ruled out a conventional block library

The brief's §8 lists likely block families — hero, statistics, feature cards, timeline, comparison table. Building those would have meant mapping thirty-plus structures onto six, and the differences that got flattened away are precisely the ones the design was paid for. It would have satisfied §8 while violating "preserve the approved GemReserve design".

The alternative — one locked HTML block per section — preserves the design perfectly and leaves the marketing team exactly as stuck as they were, which is the complaint this project exists to answer.

The approach taken is in `CMS_TARGET_ARCHITECTURE.md` §2.

---

## 2. The block set

Six types. All server-rendered; `post_content` holds attributes only.

| Block | Count | What a marketing user does with it |
|---|---:|---|
| `gemreserve/section` | 176 | Move, duplicate, delete, hide, rename |
| `gemreserve/content` | 910 | Edit text, links, images and icons in place |
| `gemreserve/wrapper` | 444 | Nothing — it is layout, and exists so the editor can reach inside it |
| `gemreserve/repeatable` | 147 | Add, duplicate, remove and reorder cards |
| `gemreserve/gap` | 1 | Nothing — preserved whitespace |
| `gemreserve/preserved` | **0** | Nothing — admin-only escape hatch, unused |
| **Total (40 pages)** | **1,678** | |

### `gap` went from 222 to 1

Inter-section whitespace was originally its own block. That put a "Spacing" row between every pair of sections in the List View and — worse — made **Move down** swap a section with the whitespace beside it, so pressing it once did nothing visible. Whitespace now rides on the preceding section's closing tag. Byte identity is unaffected; it moved from one attribute to another.

### `preserved` is unused, and that is the headline

It is the fallback for markup the decomposer cannot represent safely. Across 1,678 blocks it was needed **zero times**: every fragment of the approved design round-trips exactly.

---

## 3. Editable surface

| Measure | Value |
|---|---:|
| **Editable content slots — 40 pages** | **4,956** |
| Repeatable collections — 40 pages | 147 |
| Routes where decompose → render is byte-identical | **58 / 58** |

### Slots by kind

| Kind | Source | Editor control |
|---|---|---|
| `text` | text nodes | Click the words on the page |
| `attr` | `alt`, `title`, `aria-label`, `placeholder`, `value` | Sidebar field |
| `url` | `href`, `src` | Media Library picker, or a link field |
| `icon` | a whole inline `<svg>` | Icon picker |

### The icon decision, measured

Of 220 candidate repeatable lists, **111 had items that were structurally identical except for their icon**. Treating icons as design would have made those un-repeatable — "add another card" would have failed on half the site.

| Icons as… | Repeatable collections |
|---|---:|
| design (part of the template) | 36 |
| a slot kind of their own | **147** |

A 4× improvement in the operation the client asked for by name, at the cost of one markup-valued slot — contained by a closed-allowlist sanitiser on both save and render.

---

## 4. Per-page shape

Selected rows; the full table is in `evidence/page-block-inventory.json`.

| Route | Blocks | Sections | Editable fields | Card groups |
|---|---:|---:|---:|---:|
| `/` | 48 | 5 | 131 | 1 |
| `/gemstone-programs/` | 64 | 5 | 325 | 4 |
| `/participant-portal/` | 69 | 6 | 161 | 5 |
| `/technology/` | 47 | 4 | 141 | 5 |
| `/eligibility-kyc/` | 57 | 4 | 101 | 4 |
| `/governance/` | 33 | 4 | 87 | 4 |
| `/faq/` | 23 | 2 | 89 | 1 |
| `/about/` | 37 | 4 | 76 | 1 |

The lightest page carries 73 editable fields; the heaviest 325.

---

## 5. Gemstone routes

The 18 gemstone records carry a migrated body exactly as the 40 pages do. An earlier version of the migration listed only `post_type = page`, which would have migrated 40 of the 58 routes and left a third of the site un-editable — while every report read "40/40 migrated".

Counting *routes* rather than post types is what caught it. Both post types are migrated, and `single-gemstone.php` carries the same block-rendering branch as `page.php`.

---

## 6. Page families and patterns

Seven families, each harvested from a real published page rather than hand-written. A pattern cannot drift from the design because it *is* the design.

| Pattern | Source page |
|---|---|
| General content page | `/platform-infrastructure/` |
| Landing page | `/enterprise/` |
| Legal / disclosure page | `/risk-disclosure/` |
| Document or resource page | `/documents/` |
| How-it-works / process page | `/how-it-works/` |
| FAQ page | `/faq/` |
| Governance / team page | `/governance/` |

Text is replaced with prompts (*"Your heading here"*); images and icons are kept, because a template whose pictures are all missing looks broken. Card groups are trimmed to two items — a template should show the shape, not arrive with eight cards of someone else's copy to delete.

Five of these silently produced nothing at first: `get_page_by_path()` resolves a *path*, and five of the sources are child pages. The inserter offered two designs instead of seven, with no error anywhere.

---

## 7. What is not a block

| | Why |
|---|---|
| Hero | Already fully editable through `gemreserve-core`'s structured fields. Re-implementing it would have migrated working functionality for no gain. It is mirrored into the API so a consumer receives the whole page. |
| Navigation, footer, identity | WordPress menus and the settings screen. Managed, not blocked. |
| Gemstone specification panel | Structured fields on the `gemstone` post type; rendered by the template. |
| The governance pyramid and lifecycle ring | SVG diagrams with labels at fixed coordinates. They are drawings, not icons and not content — see §8. |

---

## 8. Known limitations

**Two diagrams are not editable.** The governance pyramid and the lifecycle ring are SVGs whose labels are positioned at fixed coordinates; retyping one would break the drawing. They render exactly as before and require a developer to change. Deliberate, not an oversight.

**`wrapper` blocks appear in the block list.** A marketing user selecting a section may see "Layout group" nested inside it. They carry nothing editable and are locked. Making them invisible to the block tree is possible but would remove the path by which their children are reached.

**A section heading is a single line.** Pressing Enter in a text slot commits the edit rather than starting a paragraph, because a slot's value is a plain string. Multi-paragraph prose belongs in a new section.
