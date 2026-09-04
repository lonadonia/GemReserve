/**
 * A migrated gemstone must be editable in Gutenberg, not handed to the classic
 * editor.
 *
 * The eleven acceptance tests all target `page` routes, so they could not have
 * caught this: the plugin re-enabled the block editor for `page` alone while the
 * migration also converts the 18 gemstone records. Those pages came out of the
 * migration holding block markup and were still routed to TinyMCE, whose save
 * path runs content through wp_kses_post() and wpautop().
 *
 * This asserts the two things that distinguish a fixed install from a broken
 * one: the block canvas exists at all, and an edit made through it reaches the
 * public page.
 */
import { expect, test } from "@playwright/test";
import { assertSafeTarget, canvas, login, marker, openEditor, publicHtml } from "./helpers";


/**
 * Save an already-published gemstone.
 *
 * The suite's own `save()` cannot be reused as-is: it waits on
 * /wp/v2/pages|posts, and a gemstone saves to its own REST route. Waiting on
 * the wrong route is how a test reads the public page before the write lands.
 * The button name list matches `save()` because Gutenberg labels the control
 * "Save" on a published post with pending changes, not "Update".
 */
async function update(page: import("@playwright/test").Page): Promise<void> {
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
  await page.waitForTimeout(1_500);
}

test.beforeAll(() => {
  assertSafeTarget(process.env.CMS_BASE_URL);
});

test("AT-G1 — a migrated gemstone opens in the block editor and edits reach the public page", async ({ page }) => {
  const id = 11; // /aquamarine/
  await login(page, "admin");

  // openEditor waits for a .gr-section inside the canvas iframe. With the
  // classic editor there is no canvas at all, so this fails outright rather
  // than passing on a page that merely looks empty.
  await openEditor(page, id);

  const sections = canvas(page).locator(".gr-section");
  const sectionCount = await sections.count();
  expect(sectionCount, "the gemstone must render as GemReserve sections").toBeGreaterThan(0);

  // Prove it is Gutenberg, not TinyMCE showing raw markup.
  await expect(page.locator("#wp-content-editor-container"), "the classic editor must not be present").toHaveCount(0);
  await expect(page.locator(".block-editor-writing-flow, .edit-post-visual-editor").first()).toBeVisible();

  // The first top-level section heading. Headings inside repeatable card
  // groups are reached by selecting the card in the List View, not by clicking
  // the canvas, so they are not the right target for this test — what is being
  // proved here is that the gemstone opens in Gutenberg at all and that an edit
  // made in it reaches the public page.
  const target = canvas(page).locator(".gr-section h2, .gr-section h3").first();
  await expect(target).toBeVisible();
  const original = (await target.textContent())?.trim() ?? "";
  expect(original.length, "there must be a heading to edit").toBeGreaterThan(0);

  const phrase = marker("gemstone");
  await target.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type(phrase);
  await update(page);

  const html = await publicHtml(page, "/aquamarine/");
  expect(html, "the edit must appear on the public gemstone page").toContain(phrase);

  // No in-test restore. Retyping over a heading the design splits across two
  // slots collapses them into one — correct behaviour, but it makes a poor
  // assertion. The harness resets this instance from the verified backup, and
  // `wp gemreserve rollback --apply` restores the page from its snapshot.
});
