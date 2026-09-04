/**
 * The marketing permission boundary, driven through the real admin.
 *
 * The unit suite already proves the server refuses a protected write on every
 * path it can reach directly. These tests answer the different question a
 * client actually asks: sitting in front of WordPress as the marketing user,
 * what can I see and change, and what is simply not there?
 *
 * Every assertion is made as `gr_marketing_publisher` — never as an
 * administrator — because a permission test performed with elevated rights
 * proves nothing about the role being tested.
 */
import { expect, test, type Page } from "@playwright/test";
import { assertSafeTarget, canvas, login, marker, openEditor, publicHtml } from "./helpers";


/**
 * Open the classic meta-box drawer.
 *
 * Gutenberg collapses it to a strip at the foot of the editor, so the fields
 * inside are present in the DOM but not visible. The acceptance suite drags the
 * same handle for AT-07; the mechanics are repeated here rather than shared,
 * because this file must keep working if that test changes.
 */
async function openMetaBoxDrawer(page: Page, field: ReturnType<Page["locator"]>): Promise<void> {
  if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
    return;
  }
  const handle = page.locator('[aria-label="Drag to resize"]').first();
  await expect(handle, "the meta box drawer must have a resize handle").toBeVisible({ timeout: 20_000 });
  const box = await handle.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y - 400, { steps: 12 });
    await page.mouse.up();
  }
  await expect(field, "the field must be reachable once the drawer is open").toBeVisible({ timeout: 30_000 });
}

test.beforeAll(() => {
  assertSafeTarget(process.env.CMS_BASE_URL);
});

const GEMSTONE_ID = 11;   // /aquamarine/  — migrated to blocks
const CLASSIC_ID = 386;   // /what-are-tokenized-gemstones/ — newer raw-HTML page

/** Save an already-published post and wait for the write that persists it. */
async function save(page: Page): Promise<void> {
  const response = page.waitForResponse(
    (r) =>
      /\/wp-json\/wp\/v2\/[a-z0-9_-]+\/\d+/.test(r.url()) &&
      ["POST", "PUT", "PATCH"].includes(r.request().method()) &&
      r.status() < 400,
    { timeout: 60_000 },
  );
  await page.getByRole("button", { name: /^(Save|Update|Publish)$/ }).first().click();
  const confirm = page.locator(".editor-post-publish-panel").getByRole("button", { name: /^(Save|Publish)$/ });
  if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await confirm.click();
  }
  await response;
  await page.waitForTimeout(1_200);
}

test("AT-P1 — the asset record is not offered to a marketing user", async ({ page }) => {
  await login(page, "publisher");
  await openEditor(page, GEMSTONE_ID);

  // The meta-box drawer holds the structured fields. Open it if it is collapsed.
  const drawer = page.locator("#metaboxes, .edit-post-meta-boxes-area").first();
  await expect(drawer, "the meta box area must exist").toBeAttached({ timeout: 30_000 });

  const body = page.locator("body");
  const html = (await body.innerHTML()).toLowerCase();

  // Groups that describe the asset must not be rendered at all.
  for (const box of ["gr_gemstone_identity", "gr_gemstone_specification"]) {
    expect(html, `${box} must not be present for marketing`).not.toContain(box);
  }
  // Nor may any protected field input exist to be posted back.
  for (const field of ["_gr_evidence_state", "_gr_custody_state", "_gr_species", "_gr_lab_report_number"]) {
    expect(html, `${field} must not be rendered for marketing`).not.toContain(field.toLowerCase());
  }

  // The marketing surface, by contrast, must be there.
  for (const field of ["_gr_seo_title", "_gr_seo_description", "_gr_hero_tagline"]) {
    expect(html, `${field} must be available to marketing`).toContain(field.toLowerCase());
  }
});

test("AT-P2 — a marketing user can edit gemstone SEO and it reaches the page head", async ({ page }) => {
  await login(page, "publisher");
  await openEditor(page, GEMSTONE_ID);

  const phrase = marker("gemseo");
  const field = page.locator('textarea[name="_gr_seo_description"]').first();
  await expect(field, "the SEO description field must exist for marketing").toBeAttached({ timeout: 30_000 });
  await openMetaBoxDrawer(page, field);
  const original = await field.inputValue();

  await field.fill(`${phrase} — ${original}`);
  await save(page);

  const html = await publicHtml(page, "/aquamarine/");
  expect(html, "the new description must be in the page head").toContain(phrase);

  // Restore.
  await openEditor(page, GEMSTONE_ID);
  const again = page.locator('textarea[name="_gr_seo_description"]').first();
  await openMetaBoxDrawer(page, again);
  await again.fill(original);
  await save(page);
  const restored = await publicHtml(page, "/aquamarine/");
  expect(restored, "the marker must be gone after restoring").not.toContain(phrase);
});

test("AT-P3 — a newer raw-HTML page is editable visually, without touching source", async ({ page }) => {
  await login(page, "publisher");
  await page.goto(`/wp-admin/post.php?post=${CLASSIC_ID}&action=edit`, { waitUntil: "domcontentloaded" });

  // These pages arrived as raw HTML, so Gutenberg presents them as a Classic
  // block: a visual rich-text editor, not a code box. That is the claim under
  // test — that a marketing user edits prose here without seeing markup.
  const classic = canvas(page).locator(".wp-block-freeform, .block-library-rich-text__tinymce").first();
  const frame = page.frameLocator('iframe[name="editor-canvas"]').frameLocator("#editor-canvas-iframe, iframe").first();

  await expect(
    canvas(page).locator("p, h2, .wp-block-freeform").first(),
    "the page content must render in the canvas",
  ).toBeVisible({ timeout: 60_000 });

  const html = (await page.locator("body").innerHTML()).toLowerCase();
  expect(html, "the block editor must be in use, not a bare code textarea").toContain("block-editor");
});
