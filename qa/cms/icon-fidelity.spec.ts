/**
 * Does an ordinary marketing edit survive the icons?
 *
 * `wp_filter_post_kses` runs on `content_save_pre` for every user without
 * `unfiltered_html`, and `wp_kses( $content, 'post' )` demonstrably strips the
 * SVG out of GemReserve block attributes — a page went from 57,784 to 33,475
 * bytes in a direct test. If the editor's own save path reaches that filter,
 * then a marketing user changing one word silently deletes every icon on the
 * page, which would make the whole system unusable.
 *
 * This answers it the only way that counts: a real browser, the real editor,
 * the real role, then read the public page back.
 */
import { expect, test } from "@playwright/test";
import { assertSafeTarget, canvas, login, marker, openEditor, publicHtml } from "./helpers";

test.beforeAll(() => assertSafeTarget(process.env.CMS_BASE_URL));

test("AT-I1 — a marketing edit does not strip the page's icons", async ({ page }) => {
  test.setTimeout(180_000);
  const id = 4;               // the home page: 14 inline SVG icons in block attributes
  const route = "/";

  const before = await publicHtml(page, route);
  const svgBefore = (before.match(/<svg/g) || []).length;
  expect(svgBefore, "the page must have icons to lose").toBeGreaterThan(5);

  await login(page, "publisher");
  await openEditor(page, id);

  // The smallest possible edit: change one heading.
  // Not `.sr-only` — the home page's first heading is a screen-reader-only
  // label, clipped to a pixel, so it resolves but cannot be clicked.
  const target = canvas(page)
    .locator(".gr-section h2:not(.sr-only), .gr-section h3:not(.sr-only)")
    .first();
  await expect(target).toBeVisible({ timeout: 60_000 });
  const original = (await target.textContent())?.trim() ?? "";
  const phrase = marker("icon");

  const saved = page.waitForResponse(
    (r) =>
      /\/wp-json\/wp\/v2\/[a-z0-9_-]+\/\d+/.test(r.url()) &&
      ["POST", "PUT", "PATCH"].includes(r.request().method()) &&
      r.status() < 400,
    { timeout: 60_000 },
  );
  await target.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type(phrase);
  await page.getByRole("button", { name: /^(Save|Update|Publish)$/ }).first().click();
  const confirm = page.locator(".editor-post-publish-panel").getByRole("button", { name: /^(Save|Publish)$/ });
  if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) await confirm.click();
  await saved;
  await page.waitForTimeout(1_500);

  const after = await publicHtml(page, route);
  const svgAfter = (after.match(/<svg/g) || []).length;

  // eslint-disable-next-line no-console
  console.log(`ICONS\tbefore=${svgBefore}\tafter=${svgAfter}\tedit=${after.includes(phrase) ? "applied" : "MISSING"}`);

  expect(after, "the edit must reach the public page").toContain(phrase);
  expect(svgAfter, "an ordinary edit must not delete the page's icons").toBe(svgBefore);

  // Put the wording back.
  await openEditor(page, id);
  const again = canvas(page)
    .locator(".gr-section h2:not(.sr-only), .gr-section h3:not(.sr-only)")
    .first();
  const saved2 = page.waitForResponse(
    (r) =>
      /\/wp-json\/wp\/v2\/[a-z0-9_-]+\/\d+/.test(r.url()) &&
      ["POST", "PUT", "PATCH"].includes(r.request().method()) &&
      r.status() < 400,
    { timeout: 60_000 },
  );
  await again.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type(original);
  await page.getByRole("button", { name: /^(Save|Update|Publish)$/ }).first().click();
  await saved2;
});
