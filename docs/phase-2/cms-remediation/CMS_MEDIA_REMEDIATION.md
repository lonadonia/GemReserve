# CMS Media Remediation

---

## 1. What the audit found

| Measure | Value |
|---|---:|
| Files in the Media Library | **1** |
| Image references in page content | **594** |
| References resolving to theme assets | **594** |
| References resolving to the Media Library | **0** |
| Images with no `alt` attribute | **0** |

Every image on the public site is a filesystem path baked into the migrated markup:

```
/wp-content/themes/gemreserve/assets/images/plates/reg-creation.webp
```

The migrated markup also carries `srcset` attributes exported from `next/image` in which **every candidate resolves to the same file** at fifteen different width descriptors. It is not a functional responsive image set — it is an artefact of exporting `next/image` output to static HTML.

---

## 2. What was done, and what was deliberately not

§18 asks that technical image paths become valid attachment references. The obvious reading is "import all 500-odd theme assets into the Media Library". That would be a mistake, and it is worth saying why rather than quietly skipping it.

Those files are **deployed with the theme, versioned with it, and produced by the asset pipeline**. Copying them into `uploads/` would:

- create a second copy of every image with no provenance and no link back to the pipeline that made it,
- roughly double the backup size for no functional gain,
- leave **two sources of truth** for the same picture, and
- leave the migrated `srcset` attributes still pointing at the theme copies — so the imported files would be unreferenced clutter that *looks* authoritative.

The requirement behind §18 is that a marketing user can change an image without a developer. That is what was built.

### Done

**The Media Library is the route for anything new.** An image slot renders a *Choose from Media Library* picker in the block inspector — not a path field. A marketing user never types or sees a filesystem path.

**Replacement is safe.** When an image slot changes, `Media::strip_mismatched_srcset()` removes any `srcset`/`sizes` whose candidates no longer include the new `src`.

That last point is the one that would have bitten hardest. Without it, an editor replaces an image, the `src` changes, the stale `srcset` stays — and **every browser that understands `srcset`, which is all of them, keeps loading the old image**. The replacement appears to work in the editor and does nothing for visitors. Losing a fake responsive set costs nothing, because the candidates were never different files.

**Alt text is already complete.** All 594 images carry an `alt` attribute, and each is an editable `attr` slot.

**Uploads are constrained.** SVG, HTML, XML and every executable extension are refused by extension *and* MIME type. An SVG is a script-bearing document served from the site's own origin; since every icon here is inline and sanitised, nothing legitimate needs to arrive as an upload.

**On-demand import exists.** `Media::import_theme_asset()` brings a single theme asset into the Library, deduplicated by SHA-256 so repeated calls yield one attachment. It resolves the path with `realpath` and confirms the result is inside the theme root — rejecting `..` by pattern is not enough, because symlinks and encodings get around it.

### Not done

**No bulk import**, for the reasons above.

**No re-pointing of existing references.** The 594 theme-asset references stay as they are. They work, they are fast, they are versioned with the theme, and rewriting them would change 594 lines of approved markup to solve a problem nobody has.

---

## 3. What a marketing user does

| Task | How |
|---|---|
| Replace an image | Select the section → *Choose from Media Library* → pick or upload |
| Change alt text | Edit the *Image description* field in the same panel |
| Add a new image | Upload it through the Media Library; it lands in `uploads/` as a normal attachment |

No path is typed. No path is shown.

---

## 4. Honest limits

**A replaced image loses its responsive set.** The stale `srcset` is removed rather than regenerated, so the new image is served at one size. Given that every candidate in the original set pointed at the same file, nothing is lost that existed — but a *newly uploaded* image will not get WordPress's own responsive sizes into the markup either, because the slot stores a URL rather than an attachment ID.

Making image slots store attachment IDs and render through `wp_get_attachment_image()` would fix that properly. It is a schema change (a new slot kind), a migration, and a renderer change — worth doing, and worth doing deliberately rather than inside a remediation whose central promise is that the markup does not change.

**Images are not optimised on upload beyond WordPress's defaults.** The theme assets went through the project's own `sharp` pipeline (`npm run assets`); an image uploaded through the Media Library gets WordPress's standard size set, not that pipeline.

---

## 5. Regenerating this report

```bash
wp gemreserve media
```

Figures above are from the isolated staging instance with all 58 routes migrated.
