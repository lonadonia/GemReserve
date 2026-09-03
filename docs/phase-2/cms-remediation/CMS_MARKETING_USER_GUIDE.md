# Editing the GemReserve website

A guide for the marketing team. No technical knowledge is assumed, and nothing in it requires a developer.

---

## What changed, in one paragraph

Every page on gemreserve.io is now made of **sections** you can see and edit. Before, the page body was locked and you could only change the hero and the SEO fields. Now you can click the words on a page and retype them, swap images, add and remove cards, move sections around, hide a section, preview your work, and publish it — all from the WordPress editor, and all without changing the design.

**The design is protected on purpose.** You can change what a section *says* and *shows*. You cannot accidentally change its colours, spacing or layout, because those are not exposed as editable fields. That is deliberate: it means you can work quickly without worrying about breaking the site's appearance.

---

## Signing in and finding a page

1. Go to `https://www.gemreserve.io/wp-admin/`.
2. Sign in.
3. In the left menu, choose **Pages**, then click the page you want.

---

## Editing words

Click the words. Type. That is the whole operation.

Editable text underlines faintly when you hover over it. Click, edit, and click somewhere else when you are done.

**A blank space where text should be** shows a dotted outline with a label like *Heading* or *Paragraph*. Click it and type.

**Pressing Enter finishes the edit** rather than starting a new line. Section headings and card titles are single lines by design; if you need a new paragraph, that is a new section — ask a developer, or use a page pattern.

---

## Changing an image

1. Click the section containing the image.
2. In the **right-hand panel**, find the image field.
3. Click **Choose from Media Library**.
4. Pick an image, or upload one.

Only images and video can be uploaded. If you are told a file type is not allowed, that is the site protecting itself — send the file to a developer rather than trying to rename it.

**Always fill in the image description (alt text).** It is what a blind visitor hears and what search engines read. Describe what is in the picture, in a sentence.

---

## Working with cards

The rows of cards, pillars and numbered steps are **card groups**. Click one and the right-hand panel lists every card in it.

| To | Do this |
|---|---|
| Add a card | Click **Add a card**. It copies the last one, keeping the icon and image, and clears the words for you to fill in. |
| Duplicate a card | Click the duplicate icon on that card's row. |
| Remove a card | Click the bin icon on that card's row. |
| Reorder cards | Use the up and down arrows on each row. |
| Edit a card | Click its words on the page, as usual. |

**Removing every card removes the whole group** from the page. If you want the group back, undo (Ctrl+Z or Cmd+Z).

---

## Working with sections

Open the **section list** with the *Document Overview* button at the top left (the icon with horizontal lines). It shows every section of the page by name.

| To | Do this |
|---|---|
| Find a section | Click its name in the list; the page scrolls to it. |
| Move a section | Select it, then use **Move up** / **Move down** in the toolbar above it. |
| Duplicate a section | Options (⋮) → **Duplicate**. |
| Delete a section | Options (⋮) → **Delete**. |
| Hide a section | Select it, then the **eye** button in the toolbar. |
| Rename a section | Right-hand panel → *Name in the section list*. Only you see this. |

**Hiding is not deleting.** A hidden section stays in the editor for you to bring back, and is completely absent from the public page — visitors and search engines cannot see it. Use it for a section that is not ready yet.

---

## Undo

**Ctrl+Z** (Windows) or **Cmd+Z** (Mac) undoes your last change. It works for everything: text, cards, deleted sections, moved sections.

It only works **before you leave the page**. Once you close the editor, use *Revisions* instead — see below.

---

## Previewing

Use **View** at the top right:

- **Desktop / Tablet / Mobile** change the editor's preview width.
- **Preview in new tab** opens the page as a visitor would see it.

**To check mobile properly, make your browser window narrow.** The device buttons are a good guide, but only a real narrow window tells you the truth about how a phone renders the page.

A preview link is private and expires after **15 minutes**. If you send one to a colleague and they say it has expired, generate a fresh one — that short life is deliberate, so an old link cannot be used to see unpublished work.

---

## Saving and publishing

What you see depends on your role.

**Marketing Editor** — you save and your work goes for review. It does not appear on the public site until a Publisher approves it. This is the safety net, not a limitation.

**Marketing Publisher** — you press **Update** and the change is live within a minute or two.

**Scheduling.** In the right-hand panel, click the date next to *Publish* and choose a future date and time.

---

## Going back to an earlier version

1. Open the page in the editor.
2. In the right-hand panel, click **Revisions**.
3. Drag the slider back to compare versions — changes are highlighted.
4. Click **Restore This Revision**.

WordPress keeps the last **10** revisions of every page. You do not need a developer for this.

---

## Creating a new page

1. **Pages → Add Page**.
2. Type the title.
3. Click the **+** (Block Inserter) at the top left.
4. Choose the **Patterns** tab, then **GemReserve page designs**.
5. Pick the design closest to what you need.
6. Replace the placeholder text with your own.

The patterns are taken from real pages on the site, so a new page starts with the approved design rather than a blank canvas.

**Before publishing a new page**, fill in the SEO fields (below). A page with no meta description is a page Google will describe badly.

---

## SEO

Scroll to the bottom of the editor and drag the **Meta Boxes** bar upward to open it.

| Field | What it does |
|---|---|
| SEO title | The blue headline in Google. Aim for under 60 characters. |
| Meta description | The grey text under it. Aim for 150–160 characters. |
| Canonical URL | Leave blank unless a developer tells you otherwise. |
| Exclude from search engines | Tick only to keep a page out of Google entirely. |

---

## The footer, navigation and company details

**Marketing Publishers only.**

- **Navigation** — *Appearance → Menus*.
- **Footer text, contact addresses, the announcement bar, company details** — *GemReserve → Site Settings*.

**A change here appears on every page of the site.** The footer and the announcement strip are on all 58 pages, so read twice before saving.

---

## Things that need a developer

Ask for help with:

- a new *kind* of section that does not exist anywhere on the site
- changing colours, fonts, spacing or layout
- a new icon that is not already in the icon picker
- anything that says "Fixed design element" or "Preserved design markup"
- adding a new field to a page

Everything else on this page is yours.

---

## If something looks wrong

**Do not try to fix it by deleting things.**

1. Press **Ctrl+Z** / **Cmd+Z** if you have not left the page.
2. Otherwise use **Revisions** to restore the last good version.
3. If the public page looks wrong and you cannot see why, tell a developer immediately and say which page and roughly when.

You cannot break the site permanently. Every page keeps its history, and there is always a way back.

---

## Two notices you may see

> **This page has not been converted yet.** Its sections are still stored in the old format…

The page has not been through the content conversion. The editor will look empty and **the live page is unaffected**. Ask an administrator to run the conversion for that page. Nothing you do in the editor will change the live page until then.

> **The website cache was not refreshed after a recent change.**

Your content is saved and correct. The public site may show the previous version for a few minutes. If it persists beyond ten minutes, tell a developer.
