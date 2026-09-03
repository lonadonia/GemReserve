# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: acceptance.spec.ts >> AT-05 — a marketing user can add and duplicate a card
- Location: qa/cms/acceptance.spec.ts:354:5

# Error details

```
TimeoutError: locator.click: Timeout 20000ms exceeded.
Call log:
  - waiting for locator('iframe[name="editor-canvas"]').contentFrame().locator('.gr-repeatable').first()
    - locator resolved to <div tabindex="0" role="document" draggable="true" data-title="Card list" aria-label="Block: Card list" data-type="gemreserve/repeatable" id="block-cf3a5206-9118-4ea8-a426-480164ab4723" data-block="cf3a5206-9118-4ea8-a426-480164ab4723" class="block-editor-block-list__block wp-block gr-repeatable wp-block-gemreserve-repeatable">…</div>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <h1 class="edit-post-welcome-guide__heading">Welcome to the editor</h1> from <div class="components-modal__screen-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    9 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <img alt="" width="312" height="240" src="https://s.w.org/images/block-editor/welcome-canvas.gif"/> from <div class="components-modal__screen-overlay">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=f4e1]:
  - generic [ref=f4e2]:
    - text:       
    - generic [ref=f4e3]:
      - group [ref=f4e4]:
        - menuitem [ref=f4e5] [cursor=pointer]:
          - generic [ref=f4e7]: About WordPress
      - group [ref=f4e8]:
        - menuitem [ref=f4e9] [cursor=pointer]: GemReserve.io
      - group [ref=f4e10]:
        - menuitem [ref=f4e11] [cursor=pointer]:
          - generic [ref=f4e13]:
            - text: Ctrl+K
            - generic [ref=f4e14]: Open command palette
      - group [ref=f4e15]:
        - menuitem [ref=f4e16] [cursor=pointer]:
          - generic [ref=f4e18]: "0"
          - generic [ref=f4e19]: 0 Comments in moderation
      - group [ref=f4e20]:
        - menuitem [ref=f4e21] [cursor=pointer]:
          - generic [ref=f4e23]: New
      - group [ref=f4e24]:
        - menuitem [ref=f4e25] [cursor=pointer]: View Page
      - group [ref=f4e26]:
        - menuitem [ref=f4e27]: Preview links expire after 15 minutes
      - menu [ref=f4e28]:
        - group [ref=f4e29]:
          - menuitem [ref=f4e30] [cursor=pointer]: Howdy, qa_publisher
    - heading [level=1] [ref=f4e31]: Edit Page
    - generic [ref=f4e33]:
      - generic [ref=f4e34]:
        - region [ref=f4e35]:
          - generic [ref=f4e36]:
            - link [ref=f4e40] [cursor=pointer]:
              - /url: edit.php?post_type=page
            - toolbar [ref=f4e44]:
              - generic [ref=f4e45]:
                - button [ref=f4e46] [cursor=pointer]
                - button [disabled] [ref=f4e49]
                - button [disabled] [ref=f4e52]
                - button [ref=f4e55] [cursor=pointer]
            - button [ref=f4e60] [cursor=pointer]:
              - heading [level=1] [ref=f4e62]:
                - generic [ref=f4e63]: Governance
                - generic [ref=f4e64]: · Page
            - generic [ref=f4e65]:
              - link [ref=f4e66] [cursor=pointer]:
                - /url: http://127.0.0.1:8899/governance/
              - button [ref=f4e70] [cursor=pointer]
              - button [expanded] [pressed] [ref=f4e74] [cursor=pointer]
              - button [ref=f4e77] [cursor=pointer]: Save
              - button [ref=f4e79] [cursor=pointer]
        - generic [ref=f4e82]:
          - region [ref=f4e83]:
            - iframe [ref=f4e89]:
              - generic [ref=f5e1]:
                - textbox "Add title" [ref=f5e3]
                - generic [ref=f5e4]:
                  - 'document "Block: Page section" [ref=f5e5]':
                    - generic: OUR GOVERNANCE PRINCIPLES
                    - generic [ref=f5e6]:
                      - 'document "Block: Content" [ref=f5e7]':
                        - heading [level=2] [ref=f5e12]:
                          - text: ◆
                          - textbox "Heading" [ref=f5e13]
                          - text: ◆
                      - 'document "Block: Layout group" [ref=f5e15]':
                        - 'document "Block: Layout group" [ref=f5e17]':
                          - list [ref=f5e18]:
                            - 'document "Block: Content" [ref=f5e19]':
                              - listitem [ref=f5e21]:
                                - img "A gold balance scale in equilibrium"
                                - heading [level=3] [ref=f5e22]:
                                  - textbox "Subheading" [ref=f5e23]
                                - paragraph [ref=f5e24]:
                                  - textbox "Paragraph" [ref=f5e25]
                            - 'document "Block: Content" [ref=f5e26]':
                              - listitem [ref=f5e28]:
                                - img "A gold eye with a gemstone iris"
                                - heading [level=3] [ref=f5e29]:
                                  - textbox "Subheading" [ref=f5e30]
                                - paragraph [ref=f5e31]:
                                  - textbox "Paragraph" [ref=f5e32]
                            - 'document "Block: Content" [ref=f5e33]':
                              - listitem [ref=f5e35]:
                                - img "A gold shield bearing a check mark"
                                - heading [level=3] [ref=f5e36]:
                                  - textbox "Subheading" [ref=f5e37]
                                - paragraph [ref=f5e38]:
                                  - textbox "Paragraph" [ref=f5e39]
                            - 'document "Block: Content" [ref=f5e40]':
                              - listitem [ref=f5e42]:
                                - img "Three gold figures of equal height"
                                - heading [level=3] [ref=f5e43]:
                                  - textbox "Subheading" [ref=f5e44]
                                - paragraph [ref=f5e45]:
                                  - textbox "Paragraph" [ref=f5e46]
                            - 'document "Block: Content" [ref=f5e47]':
                              - listitem [ref=f5e49]:
                                - img "A closed gold padlock"
                                - heading [level=3] [ref=f5e50]:
                                  - textbox "Subheading" [ref=f5e51]
                                - paragraph [ref=f5e52]:
                                  - textbox "Paragraph" [ref=f5e53]
                            - 'document "Block: Content" [ref=f5e54]':
                              - listitem [ref=f5e56]:
                                - img "A gold oak tree in full leaf"
                                - heading [level=3] [ref=f5e57]:
                                  - textbox "Subheading" [ref=f5e58]
                                - paragraph [ref=f5e59]:
                                  - textbox "Paragraph" [ref=f5e60]
                  - 'document "Block: Page section" [ref=f5e61]':
                    - generic: GOVERNANCE STRUCTURE
                    - generic [ref=f5e62]:
                      - 'document "Block: Layout group" [ref=f5e63]':
                        - generic [ref=f5e64]:
                          - 'document "Block: Content" [ref=f5e65]':
                            - heading [level=2] [ref=f5e67]:
                              - textbox "Heading" [ref=f5e68]
                          - 'document "Block: Layout group" [ref=f5e69]':
                            - generic [ref=f5e70]:
                              - 'document "Block: Content" [ref=f5e71]':
                                - generic [ref=f5e72]: BOARDOF DIRECTORSEXECUTIVE MANAGEMENTADVISORY COUNCILSIndustry • Technology • ComplianceCOMMUNITY & STAKEHOLDERSInvestors • Partners • Users
                              - 'document "Block: Card list" [ref=f5e73]':
                                - list [ref=f5e74]:
                                  - listitem [ref=f5e76]:
                                    - generic [ref=f5e77]:
                                      - heading [level=3] [ref=f5e78]:
                                        - textbox "Subheading" [ref=f5e79]
                                      - paragraph [ref=f5e80]:
                                        - textbox "Paragraph" [ref=f5e81]
                                  - listitem [ref=f5e83]:
                                    - generic [ref=f5e84]:
                                      - heading [level=3] [ref=f5e85]:
                                        - textbox "Subheading" [ref=f5e86]
                                      - paragraph [ref=f5e87]:
                                        - textbox "Paragraph" [ref=f5e88]
                                  - listitem [ref=f5e90]:
                                    - generic [ref=f5e91]:
                                      - heading [level=3] [ref=f5e92]:
                                        - textbox "Subheading" [ref=f5e93]
                                      - paragraph [ref=f5e94]:
                                        - textbox "Paragraph" [ref=f5e95]
                                  - listitem [ref=f5e97]:
                                    - generic [ref=f5e98]:
                                      - heading [level=3] [ref=f5e99]:
                                        - textbox "Subheading" [ref=f5e100]
                                      - paragraph [ref=f5e101]:
                                        - textbox "Paragraph" [ref=f5e102]
                                  - listitem [ref=f5e104]:
                                    - generic [ref=f5e105]:
                                      - heading [level=3] [ref=f5e106]:
                                        - textbox "Subheading" [ref=f5e107]
                                      - paragraph [ref=f5e108]:
                                        - textbox "Paragraph" [ref=f5e109]
                                  - listitem [ref=f5e111]:
                                    - generic [ref=f5e112]:
                                      - heading [level=3] [ref=f5e113]:
                                        - textbox "Subheading" [ref=f5e114]
                                      - paragraph [ref=f5e115]:
                                        - textbox "Paragraph" [ref=f5e116]
                      - 'document "Block: Layout group" [ref=f5e117]':
                        - generic [ref=f5e118]:
                          - 'document "Block: Content" [ref=f5e119]':
                            - heading [level=2] [ref=f5e121]:
                              - textbox "Heading" [ref=f5e122]
                          - 'document "Block: Card list" [ref=f5e123]':
                            - list [ref=f5e124]:
                              - listitem [ref=f5e126]:
                                - textbox [ref=f5e128]
                                - generic [ref=f5e129]:
                                  - heading [level=3] [ref=f5e130]:
                                    - textbox "Subheading" [ref=f5e131]
                                  - paragraph [ref=f5e132]:
                                    - textbox "Paragraph" [ref=f5e133]
                              - listitem [ref=f5e135]:
                                - textbox [ref=f5e137]
                                - generic [ref=f5e138]:
                                  - heading [level=3] [ref=f5e139]:
                                    - textbox "Subheading" [ref=f5e140]
                                  - paragraph [ref=f5e141]:
                                    - textbox "Paragraph" [ref=f5e142]
                              - listitem [ref=f5e144]:
                                - textbox [ref=f5e146]
                                - generic [ref=f5e147]:
                                  - heading [level=3] [ref=f5e148]:
                                    - textbox "Subheading" [ref=f5e149]
                                  - paragraph [ref=f5e150]:
                                    - textbox "Paragraph" [ref=f5e151]
                              - listitem [ref=f5e153]:
                                - textbox [ref=f5e155]
                                - generic [ref=f5e156]:
                                  - heading [level=3] [ref=f5e157]:
                                    - textbox "Subheading" [ref=f5e158]
                                  - paragraph [ref=f5e159]:
                                    - textbox "Paragraph" [ref=f5e160]
                              - listitem [ref=f5e162]:
                                - textbox [ref=f5e164]
                                - generic [ref=f5e165]:
                                  - heading [level=3] [ref=f5e166]:
                                    - textbox "Subheading" [ref=f5e167]
                                  - paragraph [ref=f5e168]:
                                    - textbox "Paragraph" [ref=f5e169]
                  - 'document "Block: Page section" [ref=f5e170]':
                    - generic: TRANSPARENCY &amp; ACCOUNTABILITY
                    - generic [ref=f5e171]:
                      - 'document "Block: Content" [ref=f5e172]':
                        - heading [level=2] [ref=f5e177]:
                          - text: ◆
                          - textbox "Heading" [ref=f5e178]
                          - text: ◆
                      - 'document "Block: Layout group" [ref=f5e180]':
                        - 'document "Block: Card list" [ref=f5e182]':
                          - list [ref=f5e183]:
                            - listitem [ref=f5e185]:
                              - heading [level=3] [ref=f5e186]:
                                - textbox "Subheading" [ref=f5e187]
                              - paragraph [ref=f5e188]:
                                - textbox "Paragraph" [ref=f5e189]
                            - listitem [ref=f5e191]:
                              - heading [level=3] [ref=f5e192]:
                                - textbox "Subheading" [ref=f5e193]
                              - paragraph [ref=f5e194]:
                                - textbox "Paragraph" [ref=f5e195]
                            - listitem [ref=f5e197]:
                              - heading [level=3] [ref=f5e198]:
                                - textbox "Subheading" [ref=f5e199]
                              - paragraph [ref=f5e200]:
                                - textbox "Paragraph" [ref=f5e201]
                            - listitem [ref=f5e203]:
                              - heading [level=3] [ref=f5e204]:
                                - textbox "Subheading" [ref=f5e205]
                              - paragraph [ref=f5e206]:
                                - textbox "Paragraph" [ref=f5e207]
                            - listitem [ref=f5e209]:
                              - heading [level=3] [ref=f5e210]:
                                - textbox "Subheading" [ref=f5e211]
                              - paragraph [ref=f5e212]:
                                - textbox "Paragraph" [ref=f5e213]
                  - 'document "Block: Page section" [ref=f5e214]':
                    - generic: OUR COMMITMENT
                    - generic [ref=f5e215]:
                      - 'document "Block: Content"':
                        - generic:
                          - generic:
                            - generic:
                              - img "The Lithuanian flag before Trakai Island Castle at sunset"
                      - 'document "Block: Layout group" [ref=f5e216]':
                        - generic [ref=f5e217]:
                          - 'document "Block: Content" [ref=f5e218]':
                            - heading [level=2] [ref=f5e220]:
                              - textbox "Heading" [ref=f5e221]
                          - 'document "Block: Content" [ref=f5e222]':
                            - paragraph [ref=f5e224]:
                              - textbox "Paragraph" [ref=f5e225]
                      - 'document "Block: Layout group" [ref=f5e226]':
                        - 'document "Block: Card list" [ref=f5e228]':
                          - list [ref=f5e229]:
                            - listitem [ref=f5e231]:
                              - textbox "Label" [ref=f5e233]
                            - listitem [ref=f5e235]:
                              - textbox "Label" [ref=f5e237]
                            - listitem [ref=f5e239]:
                              - textbox "Label" [ref=f5e241]
                            - listitem [ref=f5e243]:
                              - textbox "Label" [ref=f5e245]
            - region [ref=f4e90]:
              - generic [ref=f4e91]:
                - button [ref=f4e92] [cursor=pointer]: Meta Boxes
                - separator [ref=f4e95]
                - generic [ref=f4e96]: Use up and down arrow keys to resize the meta box pane.
          - region [ref=f4e97]:
            - generic [ref=f4e99]:
              - generic [ref=f4e100]:
                - tablist [ref=f4e101]:
                  - tab [selected] [ref=f4e102] [cursor=pointer]:
                    - generic [ref=f4e103]: Page
                  - tab [ref=f4e104] [cursor=pointer]:
                    - generic [ref=f4e105]: Block
                - button [ref=f4e106] [cursor=pointer]
              - tabpanel [ref=f4e110]:
                - generic [ref=f4e112]:
                  - generic [ref=f4e114]:
                    - heading [level=2] [ref=f4e118]:
                      - generic [ref=f4e119]: Governance
                    - button [ref=f4e120] [cursor=pointer]
                  - button [ref=f4e125] [cursor=pointer]: Set featured image
                  - generic [ref=f4e126]: Last edited a second ago.
                  - generic [ref=f4e128]:
                    - generic [ref=f4e129]:
                      - generic [ref=f4e130]:
                        - generic [ref=f4e131]: Status
                        - button [ref=f4e134] [cursor=pointer]: Published
                      - generic [ref=f4e137]:
                        - generic [ref=f4e138]: Publish
                        - button [ref=f4e141] [cursor=pointer]: August 29 5:56 pm
                      - generic [ref=f4e142]:
                        - generic [ref=f4e143]: Slug
                        - button [ref=f4e146] [cursor=pointer]: governance
                      - generic [ref=f4e147]:
                        - generic [ref=f4e148]: Author
                        - button [ref=f4e151] [cursor=pointer]: (No author)
                      - generic [ref=f4e152]:
                        - generic [ref=f4e153]: Discussion
                        - button [ref=f4e156] [cursor=pointer]: Closed
                      - generic [ref=f4e157]:
                        - generic [ref=f4e158]: Revisions
                        - link [ref=f4e160] [cursor=pointer]:
                          - /url: revision.php?revision=412
                          - text: "7"
                      - generic [ref=f4e161]:
                        - generic [ref=f4e162]: Parent
                        - button [ref=f4e165] [cursor=pointer]: About Us
                    - button [ref=f4e166] [cursor=pointer]: Move to trash
          - button [disabled] [ref=f4e168]: Open save panel
      - region [ref=f4e169]:
        - list [ref=f4e170]:
          - listitem [ref=f4e171]:
            - generic [ref=f4e172]: Page
  - dialog "Welcome to the editor" [active] [ref=f4e176]:
    - document [ref=f4e177]:
      - button "Close" [ref=f4e179] [cursor=pointer]
      - generic [ref=f4e183]:
        - generic [ref=f4e184]:
          - list "Guide controls" [ref=f4e186]:
            - listitem [ref=f4e187]:
              - button "Page 1 of 4" [ref=f4e188] [cursor=pointer]
            - listitem [ref=f4e191]:
              - button "Page 2 of 4" [ref=f4e192] [cursor=pointer]
            - listitem [ref=f4e195]:
              - button "Page 3 of 4" [ref=f4e196] [cursor=pointer]
            - listitem [ref=f4e199]:
              - button "Page 4 of 4" [ref=f4e200] [cursor=pointer]
          - heading "Welcome to the editor" [level=1] [ref=f4e203]
          - paragraph [ref=f4e204]: In the WordPress editor, each paragraph, image, or video is presented as a distinct “block” of content.
        - button "Next" [ref=f4e206] [cursor=pointer]
```

# Test source

```ts
  295 |   const reduced = (await publicHtml(page, "/technology/")).match(/<section\b/g)?.length ?? 0;
  296 | 
  297 |   // Put it back with undo — the control a marketing user reaches for.
  298 |   //
  299 |   // Without reloading the editor first. Gutenberg's undo history lives in the
  300 |   // page, so a reload empties it and Ctrl+Z becomes a no-op; reading the public
  301 |   // HTML above went through the request context rather than navigation, so this
  302 |   // is still the same editor session that performed the delete.
  303 |   await canvas(page).locator("body").click({ position: { x: 4, y: 4 } });
  304 |   await page.keyboard.press("Control+z");
  305 |   await openListView(page);
  306 |   await expect(sectionRows(page)).toHaveCount(before);
  307 |   await save(page);
  308 | 
  309 |   const restored = (await publicHtml(page, "/technology/")).match(/<section\b/g)?.length ?? 0;
  310 |   expect(restored, "the section must come back").toBeGreaterThan(reduced);
  311 | });
  312 | 
  313 | /* ================================================================== */
  314 | test("AT-04 — a marketing user can reorder sections", async ({ page }) => {
  315 |   await login(page, "publisher");
  316 |   const id = await pageIdBySlug(page, "investors");
  317 |   await openEditor(page, id);
  318 | 
  319 |   await openListView(page);
  320 |   const total = await sectionRows(page).count();
  321 |   expect(total, "reordering needs at least two sections").toBeGreaterThan(1);
  322 | 
  323 |   // Compare the whole ordered list rather than just the first entry: two
  324 |   // sections can legitimately carry the same label, and a comparison of one
  325 |   // name would then call a successful move a failure.
  326 |   const order = () => canvas(page).locator(".gr-section__chip").allTextContents();
  327 |   const before_order = await order();
  328 | 
  329 |   // Selected in the canvas rather than the List View: the Move up / Move down
  330 |   // buttons live on the block toolbar, which is rendered for a canvas
  331 |   // selection. A keyboard shortcut does not work from the List View either,
  332 |   // because focus stays in the panel.
  333 |   await canvas(page).locator(".gr-section").first().click({ position: { x: 5, y: 5 } });
  334 |   await page.getByRole("button", { name: /^Move down$/i }).first().click();
  335 | 
  336 |   const after_order = await order();
  337 |   expect(after_order, "the section order must change").not.toEqual(before_order);
  338 |   expect(after_order.slice().sort(), "no section may be lost").toEqual(before_order.slice().sort());
  339 |   await save(page);
  340 | 
  341 |   const published = await publicHtml(page, "/investors/");
  342 |   expect(published, "the reordered page must still render").toContain("container-wide");
  343 | 
  344 |   // Move it back, in the same session so the order is restored exactly.
  345 |   await canvas(page).locator(".gr-section").nth(1).click({ position: { x: 5, y: 5 } });
  346 |   await page.getByRole("button", { name: /^Move up$/i }).first().click();
  347 |   await expect
  348 |     .poll(async () => (await order()).join("|"), { timeout: 20_000 })
  349 |     .toBe(before_order.join("|"));
  350 |   await save(page);
  351 | });
  352 | 
  353 | /* ================================================================== */
  354 | test("AT-05 — a marketing user can add and duplicate a card", async ({ page }) => {
  355 |   await login(page, "publisher");
  356 |   const id = await pageIdBySlug(page, "governance");
  357 |   await openEditor(page, id);
  358 | 
  359 |   const group = canvas(page).locator(".gr-repeatable").first();
  360 |   await expect(group).toBeVisible({ timeout: 30_000 });
  361 |   await group.scrollIntoViewIfNeeded();
  362 |   await group.click();
  363 | 
  364 |   const rows = page.locator(".gr-card-list__row");
  365 |   await expect(rows.first()).toBeVisible({ timeout: 30_000 });
  366 |   const before = await rows.count();
  367 | 
  368 |   await page.getByRole("button", { name: /Add a card/i }).click();
  369 |   await expect(rows).toHaveCount(before + 1);
  370 | 
  371 |   await rows.nth(0).getByRole("button", { name: /Duplicate/i }).click();
  372 |   await expect(rows, "duplicating must add a card").toHaveCount(before + 2);
  373 | 
  374 |   // Name the added card so it is identifiable on the public page.
  375 |   //
  376 |   // Scoped to `group`. An unscoped `.gr-repeat-item` selects across every
  377 |   // collection on the page — this page has four — so `.last()` marked a card in
  378 |   // a different group entirely, and the cleanup then removed cards from the
  379 |   // group under test while the marked one stayed live.
  380 |   const marked = marker("CARD");
  381 |   const lastItem = group.locator(".gr-repeat-item").last();
  382 |   const lastSlot = lastItem.locator(".gr-slot").first();
  383 |   await lastSlot.click();
  384 |   await lastSlot.fill(marked);
  385 |   await canvas(page).locator("body").click({ position: { x: 4, y: 4 } });
  386 | 
  387 |   await save(page);
  388 |   expect(await publicHtml(page, "/governance/"), "the new card must be live").toContain(marked);
  389 | 
  390 |   // Remove exactly the two cards this test added: the duplicate sits at index 1
  391 |   // and the added card is last, so removing the last one first keeps the
  392 |   // remaining indices stable.
  393 |   await openEditor(page, id);
  394 |   await canvas(page).locator(".gr-repeatable").first().scrollIntoViewIfNeeded();
> 395 |   await canvas(page).locator(".gr-repeatable").first().click();
      |                                                        ^ TimeoutError: locator.click: Timeout 20000ms exceeded.
  396 |   await expect(page.locator(".gr-card-list__row")).toHaveCount(before + 2);
  397 | 
  398 |   await page.locator(".gr-card-list__row").last().getByRole("button", { name: /Remove/i }).click();
  399 |   await expect(page.locator(".gr-card-list__row")).toHaveCount(before + 1);
  400 |   await page.locator(".gr-card-list__row").nth(1).getByRole("button", { name: /Remove/i }).click();
  401 |   await expect(page.locator(".gr-card-list__row")).toHaveCount(before);
  402 | 
  403 |   await save(page);
  404 |   expect(await publicHtml(page, "/governance/")).not.toContain(marked);
  405 | });
  406 | 
  407 | /* ================================================================== */
  408 | test("AT-06 — a marketing user can modify navigation and footer", async ({ page }) => {
  409 |   await login(page, "publisher");
  410 | 
  411 |   // Navigation: WordPress's own menu screen, reached through edit_theme_options.
  412 |   await page.goto("/wp-admin/nav-menus.php", { waitUntil: "domcontentloaded" });
  413 |   await expect(
  414 |     page.locator("#nav-menus-frame").first(),
  415 |     "a publisher must reach the menu screen",
  416 |   ).toBeVisible();
  417 |   expect(
  418 |     await page.content(),
  419 |     "the publisher must not be refused",
  420 |   ).not.toContain("You need a higher level of permission");
  421 | 
  422 |   // Footer and corporate identity: gemreserve-core's settings screen.
  423 |   await page.goto("/wp-admin/admin.php?page=gemreserve-settings", { waitUntil: "domcontentloaded" });
  424 |   const blurb = page.locator('[name="gr_footer_blurb"]').first();
  425 |   await expect(blurb, "a publisher must reach the footer settings").toBeVisible({ timeout: 30_000 });
  426 | 
  427 |   const original = await blurb.inputValue();
  428 |   const token = marker("FOOTER");
  429 |   await blurb.fill(`${original} ${token}`);
  430 |   await page.getByRole("button", { name: /Save Changes|Save/i }).first().click();
  431 |   await page.waitForLoadState("domcontentloaded");
  432 | 
  433 |   expect(
  434 |     await publicHtml(page, "/"),
  435 |     "the footer change must reach the public site",
  436 |   ).toContain(token);
  437 | 
  438 |   await page.goto("/wp-admin/admin.php?page=gemreserve-settings", { waitUntil: "domcontentloaded" });
  439 |   await page.locator('[name="gr_footer_blurb"]').first().fill(original);
  440 |   await page.getByRole("button", { name: /Save Changes|Save/i }).first().click();
  441 |   await page.waitForLoadState("domcontentloaded");
  442 | });
  443 | 
  444 | /* ================================================================== */
  445 | test("AT-07 — a marketing user can update page SEO", async ({ page }) => {
  446 |   await login(page, "publisher");
  447 |   const id = await pageIdBySlug(page, "faq");
  448 |   await openEditor(page, id);
  449 |   await revealMetaBoxes(page);
  450 | 
  451 |   const description = page.locator("#gr_field_seo_description");
  452 |   const original = await description.inputValue();
  453 |   const updated = `${marker("SEO")} — questions and answers about GemReserve.io.`;
  454 |   await description.fill(updated);
  455 |   await save(page);
  456 | 
  457 |   const html = await publicHtml(page, "/faq/");
  458 |   expect(html, "the meta description must change on the public page").toContain(updated);
  459 | 
  460 |   await openEditor(page, id);
  461 |   await revealMetaBoxes(page);
  462 |   await page.locator("#gr_field_seo_description").fill(original);
  463 |   await save(page);
  464 | });
  465 | 
  466 | /* ================================================================== */
  467 | test("AT-08 — a marketing user can preview desktop and mobile output", async ({ page }) => {
  468 |   await login(page, "publisher");
  469 |   const id = await pageIdBySlug(page, "about");
  470 |   await openEditor(page, id);
  471 | 
  472 |   // Gutenberg's device previews. Scoped to the editor header so the selector
  473 |   // cannot match the admin bar's own "View" link.
  474 |   const header = page.locator(".editor-header, .edit-post-header").first();
  475 |   await header.getByRole("button", { name: /^View$/ }).first().click();
  476 | 
  477 |   for (const device of ["Desktop", "Tablet", "Mobile"]) {
  478 |     // The accessible name carries its own description — "DesktopPreview
  479 |     // desktop" — so this matches a prefix rather than the whole name.
  480 |     await expect(
  481 |       page.getByRole("menuitemradio", { name: new RegExp(`^${device}`, "i") }),
  482 |       `${device} preview must be offered`,
  483 |     ).toBeVisible({ timeout: 20_000 });
  484 |   }
  485 |   await page.getByRole("menuitemradio", { name: /^Mobile/i }).click();
  486 |   await page.keyboard.press("Escape");
  487 | 
  488 |   // And the published page must genuinely be responsive at real sizes.
  489 |   for (const [width, height] of [
  490 |     [1440, 900],
  491 |     [1024, 768],
  492 |     [768, 1024],
  493 |     [390, 844],
  494 |   ] as const) {
  495 |     await page.setViewportSize({ width, height });
```