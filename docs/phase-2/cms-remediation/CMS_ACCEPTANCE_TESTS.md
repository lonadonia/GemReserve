# Client Acceptance Tests

The eleven requirements from §23, each as an automated test and as a manual script a marketing user can follow.

**Automated coverage:** `qa/cms/acceptance.spec.ts`, driven by Playwright against Chromium, performed as the real marketing roles through the real WordPress admin.

**The rule every test follows:** the assertion is on the **public page**, not on the editor. "The editor accepted my change" and "a visitor sees it" are different claims, and the gap between them is exactly where this project's original defect lived.

**Sign-off status:** automated tests pass; **no marketing user has performed the manual script and signed off.** That signature is BLOCKER-1 in `CMS_DEPLOYMENT_READINESS.md` and is not something this work can supply for itself.

---

## How to run them

```bash
CMS_BASE_URL=http://127.0.0.1:8899 QA_CHANNEL=chromium \
  node ./node_modules/@playwright/test/cli.js test --config=qa/cms/playwright.config.ts
```

The suite **refuses to start** against anything that is not `127.0.0.1` or `localhost`. It creates, edits, publishes and deletes content, and pointing it at production would be an outage.

Each test cleans up after itself and the state is reset from the verified backup before a formal run, because these tests mutate content by design.

---

## AT-01 — Edit the complete content of an existing page

**Precondition** Signed in as Marketing Publisher; `/governance/` is published.

**Steps** Open the page in the editor. Click the first heading on the canvas. Type new words. Click elsewhere. Press **Update**. Open `/governance/` in a new tab.

**Expected** The new words are on the public page; the old words are gone.

**Automated** Edits the first text slot, saves, fetches the public HTML, asserts the new text is present and the old is absent, then restores the original and re-asserts.

---

## AT-02 — Replace text and images

**Precondition** Signed in as Marketing Publisher; `/about/` is published and contains images.

**Steps** Edit a heading as in AT-01. Then select a section containing an image and, in the right-hand panel, click **Choose from Media Library**. Confirm the library opens and offers images. Press **Update**.

**Expected** The changed text is live; the page still shows its images.

**Automated** Edits text and asserts it on the public page; selects a content block that owns an image, asserts the Media Library picker is offered, opens it, and asserts the library dialog appears.

**Known limitation** The automated test selects the image-bearing block through the editor's own data store rather than by clicking the image. The migrated markup uses Next.js `fill` images — absolutely positioned inside a container with no height in the editor canvas — so the `<img>` is present but has no clickable box. That is an artefact of the exported markup, not of the CMS. **A human clicking the section, rather than the image itself, reaches the same control.**

---

## AT-03 — Add and remove a page section

**Precondition** Signed in as Marketing Publisher; `/technology/` has more than one section.

**Steps** Open the section list (*Document Overview*). Note how many sections there are. On the last one, use Options (⋮) → **Delete**. Press **Update** and check the public page. Then press **Ctrl+Z** / **Cmd+Z** and **Update** again.

**Expected** The section disappears from the public page, and comes back after undo.

**Automated** Counts sections, deletes the last through its List View row menu, asserts the count and the public section count both drop, undoes **without reloading** — Gutenberg's undo history lives in the page — and asserts both recover.

---

## AT-04 — Reorder sections

**Precondition** Signed in as Marketing Publisher; `/investors/` has at least two sections.

**Steps** Click the first section on the canvas. Use **Move down** in the toolbar above it. Press **Update**. Then move it back.

**Expected** The order changes on the public page and is restored.

**Automated** Captures the ordered list of section names, moves the first down, asserts the order changed and that the same sections are still present, saves, moves it back, and asserts the original order.

**Note** This test found a real defect. Whitespace between sections used to be a block of its own, so **Move down** swapped a section with the whitespace beside it and nothing appeared to happen. Whitespace now rides on the preceding section's closing tag.

---

## AT-05 — Add and duplicate a card

**Precondition** Signed in as Marketing Publisher; `/governance/` has a card group.

**Steps** Click a card group. In the right-hand panel, click **Add a card**, then the duplicate icon on the first card. Type a distinctive phrase into the new card. Press **Update** and check the public page. Then remove the two cards you added.

**Expected** Both new cards appear; the typed phrase is on the public page; removing them restores the original count.

**Automated** Asserts the count rises by one on add and one on duplicate, writes a unique marker into the new card **scoped to that group**, asserts it on the public page, removes exactly the two added cards, and asserts the marker is gone.

**Note** An unscoped selector originally wrote the marker into a different card group on the same page — the page has four — and the cleanup then removed two innocent cards from the group under test.

---

## AT-06 — Modify navigation and footer

**Precondition** Signed in as **Marketing Publisher** (not an administrator).

**Steps** Go to *Appearance → Menus* and confirm you can reach it. Then *GemReserve → Site Settings*, change the footer description, and save. Check the footer on the public home page.

**Expected** Both screens are reachable, and the footer change appears site-wide.

**Automated** Asserts the menu screen renders without a permission refusal; changes the footer blurb; asserts the new text on the public home page; restores it.

**Note** This test found the most consequential defect in the engagement. Site Settings was gated on `manage_options` — administrator-only — so the role accountable for the footer could not edit it at all. See `CMS_SECURITY_REVIEW.md` SEC-4.

---

## AT-07 — Update page SEO

**Precondition** Signed in as Marketing Publisher; `/faq/` is published.

**Steps** Open `/faq/` in the editor. Drag the **Meta Boxes** bar at the bottom upward to open it. Change the **Meta description**. Press **Update**. View the page source and find `<meta name="description">`.

**Expected** The new description is in the page's HTML.

**Automated** Opens the drawer by dragging its resize handle, changes the field, saves, asserts the description in the public HTML, and restores it.

**Note** The save waits for the meta-box POST as well as the REST save. Gutenberg persists classic meta boxes in a **separate** request, and a check that waits only for REST reads the page before the SEO fields have been written.

---

## AT-08 — Preview desktop and mobile output

**Precondition** Signed in as Marketing Publisher.

**Steps** Open a page in the editor. Click **View** at the top right and confirm Desktop, Tablet and Mobile are offered; choose Mobile. Then open the public page and narrow your browser window to roughly 390px.

**Expected** All three options exist, and the page reflows at every width with no horizontal scrolling.

**Automated** Asserts all three preview options; then loads the public page at 1440, 1024, 768 and 390px and asserts no horizontal overflow at any of them.

**Note** The preview banner deliberately offers no device emulator. An emulator inside a page renders at a CSS width the browser never actually uses, so media queries and viewport units disagree with a real device. The banner tells the user to resize the window, which is what a device does.

---

## AT-09 — Save a draft and publish it

**Precondition** Two accounts: Marketing **Editor** and Marketing **Publisher**. `/resources/` is published.

**Steps** As the Editor, change a heading and save. Check the public page — **it should be unchanged**. Sign in as the Publisher, make the same change and press **Update**. Check again.

**Expected** The Editor's save does not reach the public site. The Publisher's does.

**Automated** Performs both halves, asserts the Publisher's change is live, restores the original, and asserts the page ends published.

**Note** An Editor saving a published page moves it to *Pending*, which is the role split working as designed — and it takes the page off the public site until a Publisher acts. Marketing should know this: **an Editor's save on a live page unpublishes it pending review.**

---

## AT-10 — Create a new page from the approved design

**Precondition** Signed in as Marketing Publisher.

**Steps** *Pages → Add Page*. Type a title. Click **+** → **Patterns** → **GemReserve page designs**. Insert one. Replace the placeholder text. Publish. View the page.

**Expected** The new page carries the approved design, not a blank canvas.

**Automated** Inserts a pattern, publishes, asserts the design's section markup on the public page, and deletes the page.

**Note** Five of the seven patterns silently produced nothing at first, because `get_page_by_path()` resolves a path and five source pages are children. The inserter offered two designs instead of seven, with no error anywhere.

---

## AT-11 — Restore a previous version

**Precondition** Signed in as Marketing Publisher; `/documents/` is published.

**Steps** Change a heading and **Update**. Confirm the change is live. Open **Revisions** in the right-hand panel, step back one revision, and click **Restore This Revision**. Check the public page.

**Expected** The previous wording is back and the change is gone. No developer involved.

**Automated** Makes a change, asserts it live, follows the revisions link from the editor, restores, and asserts the original wording is back and the change is gone.

**Note** The revision id is read from the editor's own link rather than the REST API, which needs a nonce for cookie authentication.

---

## Results

Run against the isolated staging instance, reset from the verified backup, with all 58 routes migrated.

| Test | Requirement | Automated | Result |
|---|---|---|---|
| AT-01 | Edit page content | yes | *see run output* |
| AT-02 | Replace text and images | yes | |
| AT-03 | Add and remove a section | yes | |
| AT-04 | Reorder sections | yes | |
| AT-05 | Add or duplicate a card | yes | |
| AT-06 | Modify navigation and footer | yes | |
| AT-07 | Update page SEO | yes | |
| AT-08 | Preview desktop and mobile | yes | |
| AT-09 | Save a draft and publish it | yes | |
| AT-10 | Create a page from the design | yes | |
| AT-11 | Restore a previous version | yes | |

The machine-readable result is written to `qa/cms/results/acceptance.json` by each run; the summarised result for this engagement is in `evidence/acceptance-results.md`.

**Evidence.** Playwright retains a screenshot and a full trace for any failing test under `qa/cms/results/artifacts/`. Those are not committed — they are hundreds of megabytes per run and are regenerated by re-running the suite.

---

## What acceptance still requires

Automated tests demonstrate the software can do these things. They do not demonstrate that a marketing user finds them usable, which is a different question and the one §30 asks.

Before Phase 2 can be marked accepted:

1. A marketing user works through the manual scripts above on staging.
2. They record pass/fail and any friction in their own words.
3. That record is attached here.

Until then this document reports **automated verification**, not client acceptance.
