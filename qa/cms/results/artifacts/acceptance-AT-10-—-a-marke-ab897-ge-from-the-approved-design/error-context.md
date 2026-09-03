# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: acceptance.spec.ts >> AT-10 — a marketing user can create a new page from the approved design
- Location: qa/cms/acceptance.spec.ts:572:5

# Error details

```
Error: the GemReserve pattern category must exist

expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /GemReserve page designs/i }).first()
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - the GemReserve pattern category must exist with timeout 30000ms
  - waiting for getByRole('button', { name: /GemReserve page designs/i }).first()

```

```yaml
- navigation "Toolbar":
  - menu:
    - group:
      - menuitem "About WordPress"
    - group:
      - menuitem "GemReserve.io"
    - group:
      - menuitem "Ctrl+K Open command palette"
    - group:
      - menuitem "0 Comments in moderation"
    - group:
      - menuitem "New"
    - group:
      - menuitem "Preview links expire after 15 minutes"
  - menu:
    - group:
      - menuitem "Howdy, qa_publisher"
- main:
  - heading "Add Page" [level=1]
  - region "Editor top bar":
    - link "View Pages":
      - /url: edit.php?post_type=page
    - toolbar "Document tools":
      - button "Block Inserter" [expanded] [pressed]
      - button "Undo"
      - button "Redo" [disabled]
      - button "Document Overview"
    - button "QA-NEWPAGE-MTLSVXN2 · Page":
      - heading "QA-NEWPAGE-MTLSVXN2 · Page" [level=1]
    - button "Save draft"
    - button "View"
    - button "Settings" [expanded] [pressed]
    - button "Publish"
    - button "Options"
  - region "Block Library":
    - button "Close Block Inserter"
    - tablist:
      - tab "Blocks"
      - tab "Patterns" [selected]
      - tab "Media"
    - tabpanel "Patterns":
      - text: Search
      - searchbox "Search"
      - tablist:
        - tab "All"
        - tab "GemReserve page designs"
        - tab "Text"
      - button "Explore all patterns"
  - region "Editor content":
    - iframe
    - region "Meta Boxes":
      - button "Meta Boxes"
      - separator "Drag to resize"
      - text: Use up and down arrow keys to resize the meta box pane.
  - region "Editor settings":
    - tablist:
      - tab "Page" [selected]
      - tab "Block"
    - button "Close Settings"
    - tabpanel "Page":
      - heading "QA-NEWPAGE-MTLSVXN2" [level=2]
      - button "Actions"
      - button "Set featured image"
      - text: Last edited a second ago. Status
      - 'button "Change status: Draft"': Draft
      - text: Publish
      - 'button "Change date: Immediately"': Immediately
      - text: Slug
      - 'button "Change link: qa-newpage-mtlsvxn2"': qa-newpage-mtlsvxn2
      - text: Author
      - 'button "Change author: (No author)"': (No author)
      - text: Discussion
      - button "Change discussion options": Closed
      - text: Parent
      - 'button "Change parent: None"': None
  - region "Editor publish":
    - button "Open publish panel"
  - region "Editor footer":
    - list "Block breadcrumb":
      - listitem: Page
- paragraph: Notifications
- text: 3 category buttons displayed.
```

# Test source

```ts
  495 |     await page.setViewportSize({ width, height });
  496 |     await page.goto("/about/", { waitUntil: "domcontentloaded" });
  497 |     const overflow = await page.evaluate(
  498 |       () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  499 |     );
  500 |     expect(overflow, `no horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  501 |   }
  502 | });
  503 | 
  504 | /* ================================================================== */
  505 | test("AT-09 — a marketing user can save a draft and publish it", async ({ page }) => {
  506 |   // Requirement 9 is "save a draft and publish it", and the cleanest faithful
  507 |   // reading is a page that starts unpublished: save it, confirm the public site
  508 |   // does not show it, then publish and confirm it does. Doing it on a brand new
  509 |   // page also keeps the test self-contained — an earlier version drove an
  510 |   // existing published page through Pending, which is real behaviour but leaves
  511 |   // a live page unpublished if the run is interrupted.
  512 |   //
  513 |   // The editor-cannot-publish half of the role split is proven separately and
  514 |   // more directly: by the capability matrix in tests/run-tests.php, and by
  515 |   // AT-06, which is performed as the publisher precisely because an editor
  516 |   // cannot reach the settings it changes.
  517 |   await login(page, "publisher");
  518 |   await page.goto("/wp-admin/post-new.php?post_type=page", { waitUntil: "domcontentloaded" });
  519 |   await page.waitForTimeout(8_000);
  520 |   await page.keyboard.press("Escape");
  521 | 
  522 |   const title = marker("DRAFT");
  523 |   const titleField = canvas(page).getByRole("textbox", { name: /Add title/i });
  524 |   await expect(titleField).toBeVisible({ timeout: 30_000 });
  525 |   await titleField.click();
  526 |   await titleField.fill(title);
  527 | 
  528 |   const body = marker("BODY");
  529 |   await page.keyboard.press("Enter");
  530 |   await page.keyboard.type(body);
  531 | 
  532 |   // Save as a draft.
  533 |   const saveDraft = page.getByRole("button", { name: /^Save draft$/i }).first();
  534 |   await expect(saveDraft, "a draft must be savable").toBeVisible({ timeout: 20_000 });
  535 |   await Promise.all([
  536 |     page.waitForResponse(
  537 |       (r) => /\/wp-json\/wp\/v2\/pages/.test(r.url()) && r.request().method() === "POST" && r.status() < 400,
  538 |       { timeout: 60_000 },
  539 |     ),
  540 |     saveDraft.click(),
  541 |   ]);
  542 | 
  543 |   const slug = title.toLowerCase();
  544 |   const draftResponse = await page.request.get(`/${slug}/`);
  545 |   expect(
  546 |     draftResponse.status(),
  547 |     "an unpublished draft must not be on the public site",
  548 |   ).not.toBe(200);
  549 | 
  550 |   // Publish it.
  551 |   await page.getByRole("button", { name: /^Publish$/ }).first().click();
  552 |   const confirm = page.locator(".editor-post-publish-panel").getByRole("button", { name: /^Publish$/ });
  553 |   if (await confirm.isVisible({ timeout: 5_000 }).catch(() => false)) {
  554 |     await confirm.click();
  555 |   }
  556 |   await page.waitForTimeout(4_000);
  557 | 
  558 |   const published = await page.request.get(`/${slug}/`);
  559 |   expect(published.status(), "the published page must be live").toBe(200);
  560 |   expect(await published.text(), "and must carry the typed content").toContain(body);
  561 | 
  562 |   // Clean up.
  563 |   const newId = await pageIdBySlug(page, slug);
  564 |   await page
  565 |     .goto(`/wp-admin/post.php?post=${newId}&action=trash&_wpnonce=${await trashNonce(page, newId)}`, {
  566 |       waitUntil: "domcontentloaded",
  567 |     })
  568 |     .catch(() => undefined);
  569 | });
  570 | 
  571 | /* ================================================================== */
  572 | test("AT-10 — a marketing user can create a new page from the approved design", async ({ page }) => {
  573 |   await login(page, "publisher");
  574 |   await page.goto("/wp-admin/post-new.php?post_type=page", { waitUntil: "domcontentloaded" });
  575 |   await page.waitForTimeout(8_000);
  576 |   await page.keyboard.press("Escape");
  577 | 
  578 |   const title = marker("NEWPAGE");
  579 |   const titleField = canvas(page).getByRole("textbox", { name: /Add title/i });
  580 |   await expect(titleField).toBeVisible({ timeout: 30_000 });
  581 |   await titleField.click();
  582 |   await titleField.fill(title);
  583 | 
  584 |   // Insert an approved pattern — how a new page gets the design without a
  585 |   // developer.
  586 |   await page.getByRole("button", { name: /Block Inserter/i }).first().click();
  587 |   const patternsTab = page.getByRole("tab", { name: /Patterns/i });
  588 |   await expect(patternsTab, "approved patterns must be offered").toBeVisible({ timeout: 30_000 });
  589 |   await patternsTab.click();
  590 | 
  591 |   const category = page.getByRole("button", { name: /GemReserve page designs/i }).first();
  592 |   await expect(
  593 |     category,
  594 |     "the GemReserve pattern category must exist",
> 595 |   ).toBeVisible({ timeout: 30_000 });
      |     ^ Error: the GemReserve pattern category must exist
  596 |   await category.click();
  597 | 
  598 |   const pattern = page.locator(".block-editor-block-patterns-list__item").first();
  599 |   await expect(pattern).toBeVisible({ timeout: 30_000 });
  600 |   await pattern.click();
  601 | 
  602 |   await expect(canvas(page).locator(".gr-section").first()).toBeVisible({ timeout: 30_000 });
  603 |   await save(page);
  604 | 
  605 |   const slug = title.toLowerCase();
  606 |   const html = await publicHtml(page, `/${slug}/`);
  607 |   expect(html, "the new page must carry the approved design's markup").toContain("container-wide");
  608 |   expect(html, "and its own sections").toContain("<section");
  609 | 
  610 |   // Clean up through the admin, so no REST nonce is needed.
  611 |   const newId = await pageIdBySlug(page, slug);
  612 |   await page.goto(`/wp-admin/post.php?post=${newId}&action=trash&_wpnonce=${await trashNonce(page, newId)}`, {
  613 |     waitUntil: "domcontentloaded",
  614 |   }).catch(() => undefined);
  615 | });
  616 | 
  617 | /** WordPress's per-post trash nonce, read from the pages list. */
  618 | async function trashNonce(page: Page, postId: number): Promise<string> {
  619 |   await page.goto("/wp-admin/edit.php?post_type=page", { waitUntil: "domcontentloaded" });
  620 |   const href = await page
  621 |     .locator(`a[href*="post=${postId}"][href*="action=trash"]`)
  622 |     .first()
  623 |     .getAttribute("href")
  624 |     .catch(() => null);
  625 | 
  626 |   return href?.match(/_wpnonce=([^&]+)/)?.[1] ?? "";
  627 | }
  628 | 
  629 | /* ================================================================== */
  630 | test("AT-11 — a marketing user can restore a previous version", async ({ page }) => {
  631 |   await login(page, "publisher");
  632 |   const id = await pageIdBySlug(page, "documents");
  633 |   await openEditor(page, id);
  634 | 
  635 |   const changed = marker("REV");
  636 |   const original = await editSlot(page, 0, changed);
  637 |   await save(page);
  638 |   expect(await publicHtml(page, "/documents/")).toContain(changed);
  639 | 
  640 |   // The revisions link is in the editor's own sidebar, which is where a
  641 |   // marketing user finds it. Reading it from the DOM also avoids the REST
  642 |   // nonce that a plain API call would need.
  643 |   await openEditor(page, id);
  644 |   const revisionsLink = page.locator('a[href*="revision.php"]').first();
  645 |   await expect(
  646 |     revisionsLink,
  647 |     "the editor must offer a link to revisions",
  648 |   ).toBeVisible({ timeout: 30_000 });
  649 |   await revisionsLink.click();
  650 |   await page.waitForLoadState("domcontentloaded");
  651 | 
  652 |   // Step back one revision, then restore.
  653 |   const previous = page.getByRole("button", { name: /Previous/i }).first();
  654 |   if (await previous.isVisible().catch(() => false)) {
  655 |     await previous.click();
  656 |     await page.waitForTimeout(1_500);
  657 |   }
  658 | 
  659 |   const restore = page
  660 |     .getByRole("button", { name: /Restore This Revision|Restore This Autosave/i })
  661 |     .first();
  662 |   await expect(restore, "the revisions screen must offer a restore").toBeVisible({ timeout: 30_000 });
  663 |   await restore.click();
  664 |   await page.waitForLoadState("domcontentloaded");
  665 | 
  666 |   const html = await publicHtml(page, "/documents/");
  667 |   expect(html, "the previous wording must be back").toContain(original);
  668 |   expect(html, "the changed wording must be gone").not.toContain(changed);
  669 | });
  670 | 
```