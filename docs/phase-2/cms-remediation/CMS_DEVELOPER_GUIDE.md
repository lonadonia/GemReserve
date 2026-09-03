# CMS Developer Guide

How the visual CMS works, and what you need to know before changing it.

---

## 1. The one idea

Everything follows from separating **design** from **content** *within* a section.

Design — tags, classes, SVG path data, attribute order, whitespace — is preserved verbatim as a template string. Content — headings, copy, links, buttons, images, icons — is lifted into typed **slots**. Rendering substitutes slots back into the template.

The property that makes it trustworthy, and the one to protect above all else:

> A section extracted and re-rendered with unchanged values produces **the original bytes**. Not "visually identical" — the same string.

That is asserted for every fragment during migration, and any fragment that fails it is not migrated. If you change anything in `class-slot-template.php`, `class-decomposer.php` or `class-renderer.php`, run the check before and after:

```bash
wp gemreserve migrate            # dry run; every row must read identical=yes
```

`CMS_TARGET_ARCHITECTURE.md` §2 explains why the two obvious alternatives — flattening onto semantic blocks, or one locked HTML block per section — are both wrong here.

---

## 2. Layout

```
wordpress/plugins/gemreserve-visual-cms/
  gemreserve-visual-cms.php     bootstrap; re-enables Gutenberg for pages
  includes/
    class-html.php              HTML5 parse/serialise; the byte-identity floor
    class-slot-template.php     lifting content out, putting it back
    class-markup-policy.php     what markup a block attribute may carry
    class-renderer.php          server-side render for every block
    class-decomposer.php        how a page is cut into blocks
    class-blocks.php            registration and serialisation
    class-editor.php            editor assets, allowlist, editor styles
    class-roles.php             the two marketing roles
    class-normaliser.php        block tree → the published API shape
    class-rest.php              /wp-json/gemreserve/v1/
    class-preview.php           signed preview tokens
    class-revalidation.php      publish → webhook
    class-media.php             uploads, srcset hygiene, asset import
    class-patterns.php          page designs, harvested from real pages
    class-migrator.php          the migration, its guards and its rollback
    class-audit.php             editorial audit trail
    class-cli.php               wp gemreserve …
  blocks/*/block.json           six block definitions
  assets/editor.js|css          the editor, no build step
  tools/                        inventory, route comparison
  tests/run-tests.php           132 assertions

lib/cms/          typed client and runtime validators (Next.js)
components/cms/   block renderer, preview banner
app/api/          preview, exit-preview, revalidate
app/cms/          the CMS-driven route
qa/cms/           acceptance, parity and visual suites
```

---

## 3. Running the checks

```bash
# WordPress — against an isolated instance only; it refuses a non-local home_url.
wp eval-file wordpress/plugins/gemreserve-visual-cms/tests/run-tests.php

# Renderer parity: WordPress output vs the Next.js renderer, all 58 routes.
node qa/cms/renderer-parity.mjs http://127.0.0.1:8899 http://127.0.0.1:3400 routes.txt

# Client acceptance, in a real browser.
CMS_BASE_URL=http://127.0.0.1:8899 QA_CHANNEL=chromium \
  node ./node_modules/@playwright/test/cli.js test --config=qa/cms/playwright.config.ts

# Visual regression.
node qa/cms/visual-regression.mjs capture http://127.0.0.1:8899 routes.txt ./before
node qa/cms/visual-regression.mjs compare ./before ./after

# The project's own gates.
npm run typecheck && npm run lint && npm run build
```

Standing up the isolated instance is in `CMS_MIGRATION_RUNBOOK.md`.

---

## 4. Traps

Each of these cost real debugging time. They are listed because none is discoverable by reading the API docs.

### `wp_update_post` unslashes

It expects slashed input. Block attributes are serialised with `<` escaped as the JSON sequence `<`, so an unslashed write eats the backslashes and every template lands in the database as the literal text `u003cp…`. Always `wp_slash()`.

### `the_content` rewrites your markup

`wp_filter_content_tags` prepends `auto,` to the `sizes` attribute of every lazy image, and `wpautop` inserts paragraphs. The legacy body was echoed raw, so routing block bodies through `the_content` changed 30 of 58 routes. Use `gemreserve_render_block_body()`, which is `do_blocks()` plus the theme's own form activation.

### `wp_filter_post_kses` re-filters inside comments

Block attributes live in an HTML comment, and kses recursively filters comment contents. Inside that recursion `gr:` reads as a URL scheme, so `href="{{gr:c1}}"` became `href="c1}}"`. The placeholder syntax is `{{gr_key}}` for this reason. **Do not change it back.**

### `wp_kses` has no `aria-*` wildcard

`data-*` is supported; `aria-*` is not. An `aria-*` entry is silently ignored and every ARIA attribute is stripped — 675 of them, with no error. List them explicitly.

### `wp_kses` lowercases SVG names

`viewBox` becomes `viewbox`. Browsers correct it, so it renders fine and breaks byte identity. `MarkupPolicy::restore_svg_case()` puts it back.

### `register_setting`'s capability is not what gates saving

`options.php` resolves its own via `option_page_capability_{group}`. Without that filter a user can render the form and be refused after pressing Save.

### `get_page_by_path` needs a full path

On a hierarchical post type it will not find a child by its bare slug. Five of the seven page patterns silently produced nothing because of this.

### Meta boxes save separately

Gutenberg posts them to `post.php?meta-box-loader=1` after the REST save. A test that waits only for REST reads the page before the SEO fields have been written.

---

## 5. Common changes

### Adding a slot kind

1. Add the constant to `Slot`.
2. Lift it in `SlotEngine::walk()`.
3. Escape it in `SlotEngine::render()` — **per context**; text and attribute escaping are not interchangeable.
4. Render a control for it in `editor.js` (`SlotFields`).
5. Publish it in `Normaliser::fields()` and accept it in `lib/cms/schema.ts`.
6. Bump `SCHEMA_VERSION` — minor for additive.
7. Run the byte-identity check.

### Adding a block

1. `blocks/<name>/block.json`, `apiVersion: 3`.
2. A render callback on `Renderer`.
3. Register it in `Blocks::BLOCKS`.
4. An `edit` component in `editor.js` — **a named, capitalised function**, referenced from `registerBlockType`, or the React lint rules cannot see it is a component.
5. Handle it in `Normaliser::blocks()` and in `components/cms/BlockRenderer.tsx` — the renderer's `switch` is exhaustive, so an unhandled type is a compile error rather than silently missing content.
6. Bump `SCHEMA_VERSION`.

### Changing the markup policy

`MarkupPolicy::allowed()` is a closed allowlist. After any change:

```bash
wp eval-file wordpress/plugins/gemreserve-visual-cms/tests/run-tests.php   # group: Markup policy
```

The suite asserts that all 2,591 markup attributes across the 40 migrated pages pass
through unchanged. **A policy that rewrites the approved design is worse than no policy**, because the damage is invisible.

---

## 6. Where the trust boundaries are

| Surface | Who can write | Control |
|---|---|---|
| Slot values | anyone with `edit_pages` | Escaped per kind on render |
| `template`, `open`, `close` | anyone with `edit_pages` | `MarkupPolicy` on save |
| Icon slots | anyone with `edit_pages` | Closed SVG allowlist, save and render |
| `preserved` html | `unfiltered_html` only | Restored from stored on save |
| Section tags | anyone with `edit_pages` | Re-parsed and `wp_kses`-validated on render |
| Webhook target | server operator | Constants, never options |

The one to keep in mind: **WordPress does not sanitise block attributes.** Its own escaping is what carries them past kses. See `CMS_SECURITY_REVIEW.md` §1.

---

## 7. Turning the Next.js renderer on

It is built, routed at `/cms/`, and verified at 268/268 sections identical to WordPress across all 58 routes. It is not the public renderer, because switching production renderers is a deployment decision, not a side effect of a CMS remediation.

To cut over:

1. Set `GEMRESERVE_CMS_URL` on the renderer.
2. Move `app/cms/[[...route]]/` to `app/[[...route]]/`.
3. Remove `robots: { index: false }` from its metadata and use `page.seo.noindex`.
4. Delete the hardcoded `content/*.ts` routes they replace.
5. Point the vhost at the Next.js service.
6. Re-run the parity suite, then the route comparison against production.

Steps 1–4 are reversible in Git. Step 5 is the one that needs authorisation and a rollback plan.
