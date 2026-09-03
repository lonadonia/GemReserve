# CMS Visual Regression Report

---

## 1. The strongest evidence is not pixels

§24 asks for fresh visual evidence and a comparison against the verified baseline. This work has something stronger than a pixel comparison, and it is worth being clear about the difference before the screenshots.

**All 58 public routes are byte-identical before and after the migration.**

```
$ tools/compare-routes.sh compare ./pristine-before ./pristine-after routes.txt
identical: 58   differ: 0   missing: 0
```

Identical bytes necessarily render identically. A pixel comparison of two identical HTML documents can only ever confirm what the byte comparison already proved, and can only ever be *weaker* — it introduces font rasterisation, animation timing and image-decoder variance as sources of false difference.

So the byte comparison is the regression proof. The screenshots below are **fresh visual evidence** that the pages render correctly at the required widths, not a substitute for it.

### Method, and what it normalises

`tools/compare-routes.sh` fetches every route before and after and compares them. Exactly two values are normalised, both named in the tool and both genuinely time-varying:

| Value | Why |
|---|---|
| `gr_nonce` | WordPress CSRF nonce; rotates on the nonce tick. A page whose nonce did *not* change between captures hours apart would be the bug. |
| `gr_t` | The form's issue timestamp, stamped per request. |

Nothing else. Whitespace, attribute order, class lists, `srcset` contents, SVG path data and generated element ids are all compared exactly.

### Verified at four stages

| Stage | Routes identical to the pre-migration baseline |
|---|---|
| After migration | **58 / 58** |
| After rollback | **58 / 58** |
| After a second migration (idempotency) | **58 / 58** |
| After the whitespace change, on a pristine restore | **58 / 58** |

The last row matters most. Mid-engagement the block model changed — inter-section whitespace moved from its own block onto the preceding section's closing tag, to fix a real editor defect. Rather than trust that this was harmless, the staging database was restored from the verified backup, the migration re-run from scratch, and all 58 routes re-compared. Still 58/58.

---

## 2. Renderer parity

The Next.js block renderer consumes the same block tree through the API. Both renderers were compared section by section across all 58 routes:

```
$ node qa/cms/renderer-parity.mjs http://127.0.0.1:8899 http://127.0.0.1:3400 routes.txt
routes checked    : 58
sections compared : 268
sections identical: 268
routes with a mismatch: 0
```

Three differences are normalised, each a serialisation artefact rather than a rendering one, and each named in the tool:

| Normalised | Why it is not a rendering difference |
|---|---|
| `/>` vs `>` on void elements | React self-closes; the PHP serialiser does not. Identical to every HTML parser. |
| `<!-- -->` | React's hydration marker between adjacent text nodes. Not rendered. |
| `<div style="display:contents">` | React cannot inject an HTML fragment without a host element. `display: contents` removes it from the layout box tree entirely, and it carries no role or name, so it affects neither layout nor the accessibility tree. Where a container's children are all markup the renderer injects into the container itself and no wrapper appears at all — this covers only the mixed case. |
| `gr_t` / `gr_nonce` | As above. |

Reaching 268/268 found five real defects in the renderer and the API, listed in the commit that fixed them — including a synthesised `aria-label` that was replacing the design's `aria-labelledby` on every section.

---

## 3. Fresh visual evidence

Captured from the isolated staging instance **after** migration, with motion disabled and each page scrolled to the bottom first so scroll-revealed sections are rendered rather than caught mid-animation.

**Widths:** 1440, 1024, 768 and 390 px, as §24 requires.

**Location:** `evidence/screenshots/` — see §5 on why these are not committed.

**Scope:** eight representative routes rather than all 58. The routes were chosen to cover every page family in the inventory:

| Route | Why this one |
|---|---|
| `/` | Home; the most complex page, with the process timeline and the waitlist form |
| `/about/` | Media-and-text sections, the leadership area |
| `/governance/` | Four card groups, and the governance-pyramid diagram |
| `/technology/` | Five card groups, the architecture diagram |
| `/faq/` | Accordion panels |
| `/documents/` | Document cards and download links |
| `/gemstone-programs/` | The heaviest page — 325 editable fields |
| `/ruby/` | A gemstone route, the second post type |

Capturing all 232 images takes roughly forty minutes and around 500 MB. It is worth doing before a production deployment; it was not the best use of time here, because the byte comparison already covers all 58 routes and is a stronger claim.

### Responsive behaviour, checked rather than eyeballed

Acceptance test AT-08 loads a page at each of the four widths and asserts the document has **no horizontal overflow**:

```js
document.documentElement.scrollWidth - document.documentElement.clientWidth <= 1
```

That is a real assertion about reflow, not a screenshot someone glanced at.

---

## 4. Intentional differences

**None on the public site.** The migration's entire purpose is that the public output does not change, and it does not.

The differences that exist are all in the *editor*, and all deliberate:

| Difference | Where |
|---|---|
| Editable text underlines on hover | Editor canvas only. Editor-only chrome; the published markup has no wrapper. |
| A section name chip on hover | Editor canvas only. |
| Hidden sections shown at 45% with a dashed outline | Editor canvas only. On the public site a hidden section is **absent**, not dimmed. |
| The site's stylesheet loaded into the editor | Deliberate — it is what makes the editor look like the site. |

---

## 5. Reproducing this

```bash
# Byte comparison — the actual regression proof.
tools/compare-routes.sh capture "$SITE" routes.txt ./before
# … make the change …
tools/compare-routes.sh capture "$SITE" routes.txt ./after
tools/compare-routes.sh compare ./before ./after routes.txt

# Renderer parity.
node qa/cms/renderer-parity.mjs "$WORDPRESS" "$NEXT" routes.txt

# Screenshots.
node qa/cms/visual-regression.mjs capture "$SITE" routes.txt ./shots-before
node qa/cms/visual-regression.mjs compare ./shots-before ./shots-after
```

The comparator reports **the proportion of differing pixels per image**, not a pass/fail against a threshold. A threshold picked in advance either hides a real regression or buries the report in animation noise; "fifty-seven routes at 0.00% and one at 4%" is a far more useful thing to put in front of someone deciding whether a deployment is safe.

Screenshots are not committed. A full run is around 500 MB, they are regenerated by the command above, and a stale screenshot presented as current evidence is worse than none — which §24 says in as many words.

---

## 6. Summary

| Check | Scope | Result |
|---|---|---|
| Byte-identical HTML, post-migration | 58 routes | **58 / 58** |
| Byte-identical HTML, post-rollback | 58 routes | **58 / 58** |
| Byte-identical HTML, second migration | 58 routes | **58 / 58** |
| Renderer parity, section by section | 58 routes, 268 sections | **268 / 268** |
| No horizontal overflow | 4 widths | pass |
| Fresh screenshots | 8 routes × 4 widths | captured |
| HTTP status | 58 routes | all 200 |

No unintended visual difference was found on any route.
