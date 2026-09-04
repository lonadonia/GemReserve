# Client Acceptance Checklist

For the GemReserve marketing team. Eleven actions, matching the client's
requested list. Everything here has passed automated testing through a real
browser as a restricted marketing role — **that is not the same as you finding
it usable**, which is what this checklist is for.

Work through it, tick each box, and note anything that felt awkward even where
it technically worked. Friction is a finding.

---

## Before you start

### 1. Where to do this

**Use the acceptance environment, not the live site**, until you are happy.

The acceptance environment is a full copy of production — same 88 pages, same
19 plugins, same design — running on this server at `http://127.0.0.1:8901`,
against its own database on its own MySQL instance. It **cannot reach
production data or services**: different database name, different database
host and port, different filesystem path, different site URL. A script asserts
all four before anything runs there.

Because it is bound to localhost, reach it over an SSH tunnel:

```bash
ssh -L 8901:127.0.0.1:8901 <you>@<this-host>
# then open http://127.0.0.1:8901/wp-admin/ in your browser
```

Sign-in details for the acceptance environment are held with the operations
contact — they are staging-only credentials and are not written down here.

### 2. You need a marketing account

**One does not exist yet on production.** The roles are installed and proven,
but assigning one to a real person is your decision, not ours. When you are
ready, an administrator runs **one** command:

```bash
cd /var/www/GemReserve/wordpress
sudo -u www-data wp user create marketing.name name@gemreserve.io \
     --role=gr_marketing_publisher
```

Use `--role=gr_marketing_editor` for someone who should draft but not publish.

**Do not do this acceptance test as an administrator.** An administrator can do
everything, so it proves nothing about the role you will actually use.

### Which role?

| | Marketing Editor | Marketing Publisher |
|---|---|---|
| Edit any page or gemstone | yes | yes |
| Put changes live | no — goes to review | yes |
| Navigation, footer, corporate identity | no | yes |
| Restore an earlier version | no | yes |

One thing to know: **when an Editor saves a live page it goes to Pending and
comes off the public site** until a Publisher approves it. That is the review
step working, not a fault — but it surprises people, so it is said here first.

---

## The eleven actions

### ☐ 1. Edit text, links, buttons, icons, images, galleries, videos and cards

Open **Pages → Governance → Edit**. Click a heading on the page and type over
it. Click a paragraph and change a sentence. Select a card and change its link
and button label. Press **Update**, then open `/governance/` and confirm.

*Expect:* everything you clicked was editable in place. You never saw HTML.

### ☐ 2. Create, remove, duplicate, hide and reorder sections

On the same page open **Document Overview** (the list icon, top left) to see
the page as a list of sections. Use the ⋮ menu on a section to **Duplicate**,
then **Delete**. Drag a section to a new position. Use the ⋮ menu → **Hide**
on one. **Update** and check the public page each time.

*Expect:* the public page follows. A hidden section is absent from the page, not
faded.

### ☐ 3. Create, remove, duplicate and reorder cards

Select a card group. In the right-hand panel use **Add a card**, the duplicate
icon, and the remove icon; drag to reorder. **Update** and check.

### ☐ 4. Build a new page using approved GemReserve patterns

**Pages → Add Page**. Give it a title. Click **+** → **Patterns** → **GemReserve
page designs** and insert one. Replace the placeholder text. **Publish**.

*Expect:* seven approved designs offered; the new page carries the GemReserve
design, not a blank canvas.

### ☐ 5. Edit everything without touching raw HTML, JSON or source code

Throughout the above — did you at any point have to open a code view, edit
HTML, or paste JSON? **If yes, write down exactly where.** That is a defect.

The twelve Learn articles and the gemstone-topic pages (`/burmese-ruby/`,
`/gemstone-valuation/` and similar) are an exception worth knowing about: they
were written outside this system as plain HTML, so they open in a **Classic
block** — a normal visual editor with a toolbar. You edit the words normally.
They have no designed sections or cards to reorder. Tell us if you want them
converted; it is reversible and we did not do it unasked.

### ☐ 6. Select and replace media through the Media Library

Select a section with an image. In the right-hand panel click **Choose from
Media Library**, pick a different image, **Update**, and check the public page.

### ☐ 7. Edit Navigation, Header, Footer, legal links and permitted global content

*(Marketing Publisher only.)* **Appearance → Menus** — change a navigation label.
**GemReserve → Site Settings** — change the footer description. **Update** and
check the foot of any page.

### ☐ 8. Edit existing SEO fields

Open any page. Drag the **Meta Boxes** bar at the bottom of the editor upward to
reveal the field groups. Change **SEO title** and **Meta description**.
**Update**, then view the page source and find `<title>` and
`<meta name="description">`.

Gemstone pages have the same SEO fields — this is new; previously they could
only be changed in the database.

*Note:* nothing from the withdrawn On-Page SEO Strategy has been implemented.
These are the fields you already had.

### ☐ 9. Preview Desktop, Tablet and Mobile

In the editor click **View** (top right) and confirm **Desktop**, **Tablet** and
**Mobile** are offered. Then open the public page and narrow your browser window
to roughly 390px.

*Expect:* the page reflows at every width with no sideways scrolling. The preview
menu deliberately does not emulate a device — resizing the window is the honest
test.

### ☐ 10. Save drafts, schedule, publish, unpublish and restore revisions

Make a change and **Save draft**. Confirm the public page is unchanged. Publish
it. Use **Switch to draft** to unpublish, then publish again. Then open
**Revisions** in the right-hand panel, step back one, and **Restore This
Revision**.

*(Scheduling: set a future date in the Publish panel. Note that scheduled posts
fire on visitor traffic on this site, so a scheduled publish on a quiet site can
be late — see "Outstanding items" in the deployment report.)*

### ☐ 11. Do all of the above without Administrator access

Confirm you are signed in as **Marketing Editor** or **Marketing Publisher**
(**Users → Your Profile** shows your role). You should have no Plugins menu, no
Themes, no Users, no Settings.

---

## What you should **not** be able to do

These are deliberate. Please confirm each, and tell us if any of them *is*
possible — that would be a serious finding.

### ☐ 12. Gemstone asset data is not editable

Open **Gemstones → Aquamarine → Edit**. You can edit the page: hero, copy,
sections, cards, images, CTA, SEO.

You should **not** see field groups for **Identity**, **Specification** or
**Status**. Species, origin, weight, clarity, evidence state, custody state and
the laboratory report number must not be present anywhere on the screen.

*Why:* those describe a real asset and are the reason the page is safe to
publish. They belong to Compliance.

### ☐ 13. Controlled documents are not reachable

You should not be able to create, edit or publish anything under the controlled
document register.

### ☐ 14. No infrastructure access

No Plugins, Themes, Users, Tools → Export/Import, or Settings menus.

---

## Recording the result

For each box: **Pass**, **Fail**, or **Pass with friction** — and a sentence in
your own words. "It worked but I couldn't find the SEO fields for ten minutes"
is exactly the kind of thing worth writing down.

Return the completed checklist to the operations contact. Phase 2 stays **In
Progress** until this is signed by a real person; automated tests do not close
it.

| Action | Result | Notes |
|---|---|---|
| 1. Edit text, links, buttons, icons, images, cards | | |
| 2. Create / remove / duplicate / hide / reorder sections | | |
| 3. Create / remove / duplicate / reorder cards | | |
| 4. Build a page from an approved pattern | | |
| 5. No raw HTML, JSON or source code | | |
| 6. Media Library | | |
| 7. Navigation, footer, legal links | | |
| 8. SEO fields | | |
| 9. Desktop / Tablet / Mobile preview | | |
| 10. Draft, schedule, publish, unpublish, restore | | |
| 11. No Administrator access needed | | |
| 12. Gemstone asset data NOT editable | | |
| 13. Controlled documents NOT reachable | | |
| 14. No infrastructure access | | |

**Name:** ______________________  **Role:** ______________________
**Date:** ______________________  **Signature:** ______________________
