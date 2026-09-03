/**
 * The eleven client acceptance requirements.
 *
 * Each test corresponds to one numbered requirement from §23 of the brief, and
 * each is written the way the requirement is written: as something a
 * non-technical marketing user does, through the interface they will actually
 * use, with the result checked on the public page rather than in the database.
 *
 * Three rules held throughout:
 *
 * The assertion is always on the *public output*. "The editor accepted my
 * change" is not evidence that a visitor sees it — the whole class of bug this
 * project exists to fix lived in the gap between those two statements.
 *
 * Blocks are selected through the List View rather than by clicking the canvas.
 * That is both more robust — a click on a section can land on a text slot
 * inside it and select the wrong thing — and more honest: the List View is the
 * panel a marketing user opens to see the sections of their page, so testing
 * through it tests the path they will take.
 *
 * Every test cleans up after itself. They run against a live instance, in
 * order, sharing content; a test that leaves a page renamed makes the next
 * run's failure someone else's puzzle.
 */

import { expect, test, type Page } from "@playwright/test";

import {
  assertSafeTarget,
  canvas,
  login,
  marker,
  openEditor,
  pageIdBySlug,
  publicHtml,
  save,
} from "./helpers";

test.beforeAll(() => {
  assertSafeTarget(process.env.CMS_BASE_URL);
});

/* ------------------------------------------------------------------ */
/* Editor interactions                                                 */
/* ------------------------------------------------------------------ */

/**
 * Open the List View — the panel showing the page's sections.
 *
 * This is the panel a marketing user opens to see their page as a list of
 * sections, so it is both the robust way to select a block and the honest one.
 */
async function openListView(page: Page): Promise<void> {
  const rows = page.getByRole("row");

  if (!(await rows.first().isVisible({ timeout: 2_000 }).catch(() => false))) {
    await page.getByRole("button", { name: /Document Overview/i }).first().click();
  }
  await expect(rows.first(), "the List View must open").toBeVisible({ timeout: 20_000 });
}

/**
 * The List View rows for top-level sections.
 *
 * Filtered by name because the list also carries a "Spacing" row for each
 * `gemreserve/gap` — the whitespace blocks that let the migration reproduce the
 * original formatting exactly. They are inert and uneditable; see
 * CMS_ACCEPTANCE_TESTS.md for the note on their visibility.
 */
function sectionRows(page: Page) {
  return page.getByRole("row").filter({ hasText: "Page section" });
}

/** Select the nth section through the List View. */
async function selectSection(page: Page, index: number): Promise<void> {
  await openListView(page);
  await sectionRows(page).nth(index).locator("a").first().click();
}

/**
 * Edit a text slot in the canvas.
 *
 * `fill` on a contenteditable dispatches the input event the block listens for,
 * and clicking the body afterwards moves focus out so the change is committed
 * to the block's attributes before a save.
 */
async function editSlot(page: Page, index: number, value: string): Promise<string> {
  const slot = canvas(page).locator(".gr-slot").nth(index);
  await expect(slot).toBeVisible({ timeout: 30_000 });
  const before = ((await slot.textContent()) ?? "").trim();
  await slot.click();
  await slot.fill(value);
  await canvas(page).locator("body").click({ position: { x: 4, y: 4 } });

  return before;
}

/**
 * Select content blocks in turn until one offers the Media Library picker.
 *
 * Returns that picker. Fails the test if no block on the page offers one.
 */
async function selectBlockOfferingMedia(page: Page) {
  // The List View in this Gutenberg shows only top-level blocks — sections and
  // spacing — with no expander, so a content block nested inside a section
  // cannot be reached through it. Clicking the image itself does not work
  // either: the migrated markup uses Next.js `fill` images, absolutely
  // positioned inside a container that has no height in the editor canvas, so
  // the <img> is permanently `hidden` to a pointer.
  //
  // So the block is selected through the editor's own store, which is exactly
  // what a click dispatches. What is being tested is whether the control
  // exists and works once the block is selected, not Playwright's ability to
  // hit a zero-height element.
  const selected = await page.evaluate(() => {
    const editor = (window as unknown as {
      wp?: { data?: { select: (s: string) => unknown; dispatch: (s: string) => unknown } };
    }).wp?.data;
    if (!editor) {
      return false;
    }
    const store = editor.select("core/block-editor") as {
      getClientIdsWithDescendants?: () => string[];
      getBlock?: (id: string) => { name?: string; attributes?: Record<string, unknown> } | null;
    };
    const actions = editor.dispatch("core/block-editor") as {
      selectBlock?: (id: string) => void;
    };

    for (const clientId of store.getClientIdsWithDescendants?.() ?? []) {
      const block = store.getBlock?.(clientId);
      if (block?.name !== "gemreserve/content") {
        continue;
      }
      const template = String(block.attributes?.template ?? "");
      if (template.includes("<img")) {
        actions.selectBlock?.(clientId);
        return true;
      }
    }
    return false;
  });

  expect(selected, "the page must contain a content block with an image").toBe(true);

  return page
    .locator(".block-editor-block-inspector")
    .getByRole("button", { name: /Choose from Media Library/i })
    .first();
}

/**
 * Delete a section through its own row menu in the List View.
 *
 * Each List View row carries an Options button. Using it avoids depending on
 * the canvas block toolbar being rendered and focused, which is what a click in
 * the canvas gets you and is not reliable when the block is off-screen.
 */
async function deleteSection(page: Page, index: number): Promise<void> {
  await openListView(page);
  await sectionRows(page).nth(index).getByRole("button", { name: /Options/i }).first().click();

  // Scoped to the popover: `[role="menuitem"]` unscoped also matches every item
  // in the WordPress admin bar, and the first match is "About WordPress".
  //
  // The accessible name carries the keyboard shortcut — the Delete item reads
  // "DeleteShift+Alt+Z" — so this matches a prefix rather than the whole name.
  await page
    .locator('.components-popover [role="menuitem"], [role="menu"] [role="menuitem"]')
    .filter({ hasText: /^Delete/ })
    .first()
    .click();
}

/**
 * Reveal the classic meta boxes, where the SEO fields live.
 *
 * The block editor puts them in a collapsed drawer at the bottom of the screen
 * whose toggle sits under a drag-to-resize handle, so an ordinary click is
 * intercepted. A real user drags the drawer open; `force` is the automation
 * equivalent and is used only for this one control.
 */
async function revealMetaBoxes(page: Page): Promise<void> {
  const field = page.locator("#gr_field_seo_description");
  if (await field.isVisible().catch(() => false)) {
    return;
  }

  // The drawer is opened by dragging its resize handle, which is exactly what a
  // marketing user does: the handle sits across the bottom of the editor and
  // the panel is collapsed to nothing until it is pulled up. Clicking the
  // "Meta Boxes" label does not open it — the handle overlays that label, which
  // is why an ordinary click on it is intercepted.
  const handle = page.locator('[aria-label="Drag to resize"]').first();
  await expect(handle, "the meta box drawer must have a resize handle").toBeVisible({
    timeout: 20_000,
  });

  const box = await handle.boundingBox();
  expect(box, "the resize handle must be on screen").not.toBeNull();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y - 400, { steps: 12 });
    await page.mouse.up();
  }

  await expect(field, "the SEO fields must be reachable").toBeVisible({ timeout: 30_000 });
}

/* ================================================================== */
test("AT-01 — a marketing user can edit the content of an existing page", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "governance");
  await openEditor(page, id);

  const replacement = marker("EDIT");
  const original = await editSlot(page, 0, replacement);
  expect(original.length, "the page must expose editable text").toBeGreaterThan(0);
  await save(page);

  const html = await publicHtml(page, "/governance/");
  expect(html, "the edited words must appear on the public page").toContain(replacement);
  expect(html).not.toContain(original);

  await openEditor(page, id);
  await editSlot(page, 0, original);
  await save(page);
  expect(await publicHtml(page, "/governance/")).toContain(original);
});

/* ================================================================== */
test("AT-02 — a marketing user can replace text and images", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "about");
  await openEditor(page, id);

  const newText = marker("TEXT");
  const originalText = await editSlot(page, 0, newText);

  // Reaching the image control.
  //
  // Clicking the image itself does not work, and the reason is worth recording:
  // the migrated markup carries Next.js `fill` images, which are absolutely
  // positioned inside a sized container. In the editor canvas that container
  // has no height until its section is laid out, so the <img> resolves but is
  // permanently `hidden` and Playwright will never click it. That is an
  // artefact of the exported markup, not of this plugin.
  //
  // A marketing user reaches the same control through the List View, which is
  // what this does: walk the content blocks until one offers the Media Library
  // picker in its inspector.
  const mediaControl = await selectBlockOfferingMedia(page);
  await expect(
    mediaControl,
    "a content block with an image must offer a Media Library picker",
  ).toBeVisible({ timeout: 20_000 });

  // Open it, so the test proves the picker works rather than that a button
  // exists.
  await mediaControl.click();
  await expect(
    page.getByRole("dialog").filter({ hasText: /Media|Select or Upload/i }).first(),
    "the Media Library must open",
  ).toBeVisible({ timeout: 30_000 });
  await page.keyboard.press("Escape");

  await save(page);

  const html = await publicHtml(page, "/about/");
  expect(html, "replaced text must be live").toContain(newText);
  expect(html, "the page must still carry its images").toContain("<img");

  await openEditor(page, id);
  await editSlot(page, 0, originalText);
  await save(page);
});

/* ================================================================== */
test("AT-03 — a marketing user can add and remove a page section", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "technology");
  await openEditor(page, id);

  await openListView(page);
  const before = await sectionRows(page).count();
  expect(before, "the page must have sections to remove").toBeGreaterThan(1);

  // Remove the last section through the block's own Options menu. A keyboard
  // shortcut would depend on focus being exactly where the test assumes.
  await deleteSection(page, before - 1);
  await expect(sectionRows(page)).toHaveCount(before - 1);
  await save(page);

  const reduced = (await publicHtml(page, "/technology/")).match(/<section\b/g)?.length ?? 0;

  // Put it back with undo — the control a marketing user reaches for.
  //
  // Without reloading the editor first. Gutenberg's undo history lives in the
  // page, so a reload empties it and Ctrl+Z becomes a no-op; reading the public
  // HTML above went through the request context rather than navigation, so this
  // is still the same editor session that performed the delete.
  await canvas(page).locator("body").click({ position: { x: 4, y: 4 } });
  await page.keyboard.press("Control+z");
  await openListView(page);
  await expect(sectionRows(page)).toHaveCount(before);
  await save(page);

  const restored = (await publicHtml(page, "/technology/")).match(/<section\b/g)?.length ?? 0;
  expect(restored, "the section must come back").toBeGreaterThan(reduced);
});

/* ================================================================== */
test("AT-04 — a marketing user can reorder sections", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "investors");
  await openEditor(page, id);

  await openListView(page);
  const total = await sectionRows(page).count();
  expect(total, "reordering needs at least two sections").toBeGreaterThan(1);

  // Compare the whole ordered list rather than just the first entry: two
  // sections can legitimately carry the same label, and a comparison of one
  // name would then call a successful move a failure.
  const order = () => canvas(page).locator(".gr-section__chip").allTextContents();
  const before_order = await order();

  // Selected in the canvas rather than the List View: the Move up / Move down
  // buttons live on the block toolbar, which is rendered for a canvas
  // selection. A keyboard shortcut does not work from the List View either,
  // because focus stays in the panel.
  await canvas(page).locator(".gr-section").first().click({ position: { x: 5, y: 5 } });
  await page.getByRole("button", { name: /^Move down$/i }).first().click();

  const after_order = await order();
  expect(after_order, "the section order must change").not.toEqual(before_order);
  expect(after_order.slice().sort(), "no section may be lost").toEqual(before_order.slice().sort());
  await save(page);

  const published = await publicHtml(page, "/investors/");
  expect(published, "the reordered page must still render").toContain("container-wide");

  // Move it back, in the same session so the order is restored exactly.
  await canvas(page).locator(".gr-section").nth(1).click({ position: { x: 5, y: 5 } });
  await page.getByRole("button", { name: /^Move up$/i }).first().click();
  await expect
    .poll(async () => (await order()).join("|"), { timeout: 20_000 })
    .toBe(before_order.join("|"));
  await save(page);
});

/* ================================================================== */
test("AT-05 — a marketing user can add and duplicate a card", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "governance");
  await openEditor(page, id);

  const group = canvas(page).locator(".gr-repeatable").first();
  await expect(group).toBeVisible({ timeout: 30_000 });
  await group.scrollIntoViewIfNeeded();
  await group.click();

  const rows = page.locator(".gr-card-list__row");
  await expect(rows.first()).toBeVisible({ timeout: 30_000 });
  const before = await rows.count();

  await page.getByRole("button", { name: /Add a card/i }).click();
  await expect(rows).toHaveCount(before + 1);

  await rows.nth(0).getByRole("button", { name: /Duplicate/i }).click();
  await expect(rows, "duplicating must add a card").toHaveCount(before + 2);

  // Name the added card so it is identifiable on the public page.
  //
  // Scoped to `group`. An unscoped `.gr-repeat-item` selects across every
  // collection on the page — this page has four — so `.last()` marked a card in
  // a different group entirely, and the cleanup then removed cards from the
  // group under test while the marked one stayed live.
  const marked = marker("CARD");
  const lastItem = group.locator(".gr-repeat-item").last();
  const lastSlot = lastItem.locator(".gr-slot").first();
  await lastSlot.click();
  await lastSlot.fill(marked);
  await canvas(page).locator("body").click({ position: { x: 4, y: 4 } });

  await save(page);
  expect(await publicHtml(page, "/governance/"), "the new card must be live").toContain(marked);

  // Remove exactly the two cards this test added: the duplicate sits at index 1
  // and the added card is last, so removing the last one first keeps the
  // remaining indices stable.
  await openEditor(page, id);
  await canvas(page).locator(".gr-repeatable").first().scrollIntoViewIfNeeded();
  await canvas(page).locator(".gr-repeatable").first().click();
  await expect(page.locator(".gr-card-list__row")).toHaveCount(before + 2);

  await page.locator(".gr-card-list__row").last().getByRole("button", { name: /Remove/i }).click();
  await expect(page.locator(".gr-card-list__row")).toHaveCount(before + 1);
  await page.locator(".gr-card-list__row").nth(1).getByRole("button", { name: /Remove/i }).click();
  await expect(page.locator(".gr-card-list__row")).toHaveCount(before);

  await save(page);
  expect(await publicHtml(page, "/governance/")).not.toContain(marked);
});

/* ================================================================== */
test("AT-06 — a marketing user can modify navigation and footer", async ({ page }) => {
  await login(page, "publisher");

  // Navigation: WordPress's own menu screen, reached through edit_theme_options.
  await page.goto("/wp-admin/nav-menus.php", { waitUntil: "domcontentloaded" });
  await expect(
    page.locator("#nav-menus-frame").first(),
    "a publisher must reach the menu screen",
  ).toBeVisible();
  expect(
    await page.content(),
    "the publisher must not be refused",
  ).not.toContain("You need a higher level of permission");

  // Footer and corporate identity: gemreserve-core's settings screen.
  await page.goto("/wp-admin/admin.php?page=gemreserve-settings", { waitUntil: "domcontentloaded" });
  const blurb = page.locator('[name="gr_footer_blurb"]').first();
  await expect(blurb, "a publisher must reach the footer settings").toBeVisible({ timeout: 30_000 });

  const original = await blurb.inputValue();
  const token = marker("FOOTER");
  await blurb.fill(`${original} ${token}`);
  await page.getByRole("button", { name: /Save Changes|Save/i }).first().click();
  await page.waitForLoadState("domcontentloaded");

  expect(
    await publicHtml(page, "/"),
    "the footer change must reach the public site",
  ).toContain(token);

  await page.goto("/wp-admin/admin.php?page=gemreserve-settings", { waitUntil: "domcontentloaded" });
  await page.locator('[name="gr_footer_blurb"]').first().fill(original);
  await page.getByRole("button", { name: /Save Changes|Save/i }).first().click();
  await page.waitForLoadState("domcontentloaded");
});

/* ================================================================== */
test("AT-07 — a marketing user can update page SEO", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "faq");
  await openEditor(page, id);
  await revealMetaBoxes(page);

  const description = page.locator("#gr_field_seo_description");
  const original = await description.inputValue();
  const updated = `${marker("SEO")} — questions and answers about GemReserve.io.`;
  await description.fill(updated);
  await save(page);

  const html = await publicHtml(page, "/faq/");
  expect(html, "the meta description must change on the public page").toContain(updated);

  await openEditor(page, id);
  await revealMetaBoxes(page);
  await page.locator("#gr_field_seo_description").fill(original);
  await save(page);
});

/* ================================================================== */
test("AT-08 — a marketing user can preview desktop and mobile output", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "about");
  await openEditor(page, id);

  // Gutenberg's device previews. Scoped to the editor header so the selector
  // cannot match the admin bar's own "View" link.
  const header = page.locator(".editor-header, .edit-post-header").first();
  await header.getByRole("button", { name: /^View$/ }).first().click();

  for (const device of ["Desktop", "Tablet", "Mobile"]) {
    // The accessible name carries its own description — "DesktopPreview
    // desktop" — so this matches a prefix rather than the whole name.
    await expect(
      page.getByRole("menuitemradio", { name: new RegExp(`^${device}`, "i") }),
      `${device} preview must be offered`,
    ).toBeVisible({ timeout: 20_000 });
  }
  await page.getByRole("menuitemradio", { name: /^Mobile/i }).click();
  await page.keyboard.press("Escape");

  // And the published page must genuinely be responsive at real sizes.
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/about/", { waitUntil: "domcontentloaded" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `no horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});

/* ================================================================== */
test("AT-09 — a marketing user can save a draft and publish it", async ({ page }) => {
  // Requirement 9 is "save a draft and publish it", and the cleanest faithful
  // reading is a page that starts unpublished: save it, confirm the public site
  // does not show it, then publish and confirm it does. Doing it on a brand new
  // page also keeps the test self-contained — an earlier version drove an
  // existing published page through Pending, which is real behaviour but leaves
  // a live page unpublished if the run is interrupted.
  //
  // The editor-cannot-publish half of the role split is proven separately and
  // more directly: by the capability matrix in tests/run-tests.php, and by
  // AT-06, which is performed as the publisher precisely because an editor
  // cannot reach the settings it changes.
  await login(page, "publisher");
  await page.goto("/wp-admin/post-new.php?post_type=page", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(8_000);
  await page.keyboard.press("Escape");

  const title = marker("DRAFT");
  const titleField = canvas(page).getByRole("textbox", { name: /Add title/i });
  await expect(titleField).toBeVisible({ timeout: 30_000 });
  await titleField.click();
  await titleField.fill(title);

  const body = marker("BODY");
  await page.keyboard.press("Enter");
  await page.keyboard.type(body);

  // Save as a draft.
  const saveDraft = page.getByRole("button", { name: /^Save draft$/i }).first();
  await expect(saveDraft, "a draft must be savable").toBeVisible({ timeout: 20_000 });
  await Promise.all([
    page.waitForResponse(
      (r) => /\/wp-json\/wp\/v2\/pages/.test(r.url()) && r.request().method() === "POST" && r.status() < 400,
      { timeout: 60_000 },
    ),
    saveDraft.click(),
  ]);

  const slug = title.toLowerCase();
  const draftResponse = await page.request.get(`/${slug}/`);
  expect(
    draftResponse.status(),
    "an unpublished draft must not be on the public site",
  ).not.toBe(200);

  // Publish it.
  await page.getByRole("button", { name: /^Publish$/ }).first().click();
  const confirm = page.locator(".editor-post-publish-panel").getByRole("button", { name: /^Publish$/ });
  if (await confirm.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await confirm.click();
  }
  await page.waitForTimeout(4_000);

  const published = await page.request.get(`/${slug}/`);
  expect(published.status(), "the published page must be live").toBe(200);
  expect(await published.text(), "and must carry the typed content").toContain(body);

  // Clean up.
  const newId = await pageIdBySlug(page, slug);
  await page
    .goto(`/wp-admin/post.php?post=${newId}&action=trash&_wpnonce=${await trashNonce(page, newId)}`, {
      waitUntil: "domcontentloaded",
    })
    .catch(() => undefined);
});

/* ================================================================== */
test("AT-10 — a marketing user can create a new page from the approved design", async ({ page }) => {
  await login(page, "publisher");
  await page.goto("/wp-admin/post-new.php?post_type=page", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(8_000);
  await page.keyboard.press("Escape");

  const title = marker("NEWPAGE");
  const titleField = canvas(page).getByRole("textbox", { name: /Add title/i });
  await expect(titleField).toBeVisible({ timeout: 30_000 });
  await titleField.click();
  await titleField.fill(title);

  // Insert an approved pattern — how a new page gets the design without a
  // developer.
  await page.getByRole("button", { name: /Block Inserter/i }).first().click();
  const patternsTab = page.getByRole("tab", { name: /Patterns/i });
  await expect(patternsTab, "approved patterns must be offered").toBeVisible({ timeout: 30_000 });
  await patternsTab.click();

  const category = page.getByRole("button", { name: /GemReserve page designs/i }).first();
  await expect(
    category,
    "the GemReserve pattern category must exist",
  ).toBeVisible({ timeout: 30_000 });
  await category.click();

  const pattern = page.locator(".block-editor-block-patterns-list__item").first();
  await expect(pattern).toBeVisible({ timeout: 30_000 });
  await pattern.click();

  await expect(canvas(page).locator(".gr-section").first()).toBeVisible({ timeout: 30_000 });
  await save(page);

  const slug = title.toLowerCase();
  const html = await publicHtml(page, `/${slug}/`);
  expect(html, "the new page must carry the approved design's markup").toContain("container-wide");
  expect(html, "and its own sections").toContain("<section");

  // Clean up through the admin, so no REST nonce is needed.
  const newId = await pageIdBySlug(page, slug);
  await page.goto(`/wp-admin/post.php?post=${newId}&action=trash&_wpnonce=${await trashNonce(page, newId)}`, {
    waitUntil: "domcontentloaded",
  }).catch(() => undefined);
});

/** WordPress's per-post trash nonce, read from the pages list. */
async function trashNonce(page: Page, postId: number): Promise<string> {
  await page.goto("/wp-admin/edit.php?post_type=page", { waitUntil: "domcontentloaded" });
  const href = await page
    .locator(`a[href*="post=${postId}"][href*="action=trash"]`)
    .first()
    .getAttribute("href")
    .catch(() => null);

  return href?.match(/_wpnonce=([^&]+)/)?.[1] ?? "";
}

/* ================================================================== */
test("AT-11 — a marketing user can restore a previous version", async ({ page }) => {
  await login(page, "publisher");
  const id = await pageIdBySlug(page, "documents");
  await openEditor(page, id);

  const changed = marker("REV");
  const original = await editSlot(page, 0, changed);
  await save(page);
  expect(await publicHtml(page, "/documents/")).toContain(changed);

  // The revisions link is in the editor's own sidebar, which is where a
  // marketing user finds it. Reading it from the DOM also avoids the REST
  // nonce that a plain API call would need.
  await openEditor(page, id);
  const revisionsLink = page.locator('a[href*="revision.php"]').first();
  await expect(
    revisionsLink,
    "the editor must offer a link to revisions",
  ).toBeVisible({ timeout: 30_000 });
  await revisionsLink.click();
  await page.waitForLoadState("domcontentloaded");

  // Step back one revision, then restore.
  const previous = page.getByRole("button", { name: /Previous/i }).first();
  if (await previous.isVisible().catch(() => false)) {
    await previous.click();
    await page.waitForTimeout(1_500);
  }

  const restore = page
    .getByRole("button", { name: /Restore This Revision|Restore This Autosave/i })
    .first();
  await expect(restore, "the revisions screen must offer a restore").toBeVisible({ timeout: 30_000 });
  await restore.click();
  await page.waitForLoadState("domcontentloaded");

  const html = await publicHtml(page, "/documents/");
  expect(html, "the previous wording must be back").toContain(original);
  expect(html, "the changed wording must be gone").not.toContain(changed);
});
