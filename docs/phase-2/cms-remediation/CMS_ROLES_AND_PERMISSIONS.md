# CMS Roles and Permissions

---

## 1. Two roles, because the client described two jobs

WordPress's stock roles do not fit marketing work on a fixed set of pages. **Editor** can publish, which removes the review step the client asked for. **Author** can only touch its own posts, which makes collaboration impossible.

| Role | Does | Cannot |
|---|---|---|
| **Marketing Editor** | Writes and revises any page, including published ones. Uploads media. Saves drafts, submits for review, previews. | Publish. |
| **Marketing Publisher** | Everything above, plus publish, schedule, restore revisions, and manage navigation, footer and corporate identity. | Touch code, plugins, users or infrastructure. |
| **Compliance Reviewer** | Pre-existing (`gemreserve-core`). Approves controlled documents. | Unchanged by this work. |
| **Administrator** | Plugins, themes, configuration, users, migration. | — |

### Why Marketing Editor can edit *published* pages

Without `edit_published_pages` the role is useless: every page on this site is published, so an editor could not touch anything. What keeps an unreviewed change off the public site is the *absence* of `publish_pages`, which routes the work through pending review — not a restriction on which pages may be opened.

---

## 2. Capability matrix

Generated from the live role definitions with `wp gemreserve roles`, not transcribed by hand. Documentation that restates a permission list goes stale the first time the list changes.

| Capability | Marketing Editor | Marketing Publisher | Compliance Reviewer | Administrator |
|---|:--:|:--:|:--:|:--:|
| `read` | yes | yes | yes | yes |
| `upload_files` | yes | yes | yes | yes |
| `edit_pages` | yes | yes | – | yes |
| `edit_others_pages` | yes | yes | – | yes |
| `edit_published_pages` | yes | yes | – | yes |
| **`publish_pages`** | **–** | **yes** | – | yes |
| `delete_published_pages` | – | yes | – | yes |
| `edit_theme_options` | – | yes | – | yes |
| `gr_preview_drafts` | yes | yes | – | yes |
| `gr_manage_globals` | – | yes | – | yes |
| `gr_review_documents` | – | – | yes | yes |
| `manage_options` | – | – | – | yes |
| `install_plugins` | – | – | – | yes |
| `activate_plugins` | – | – | – | yes |
| `edit_plugins` | – | – | – | – * |
| `edit_themes` | – | – | – | – * |
| **`unfiltered_html`** | **–** | **–** | – | yes |
| `edit_users` | – | – | – | yes |

\* `DISALLOW_FILE_EDIT` and `DISALLOW_FILE_MODS` are set in `wp-config.php`, so no role can edit PHP through the dashboard — including an administrator. This deployment is file-managed and the admin must never be a route for putting executable code on the server.

Asserted by 14 tests in `tests/run-tests.php` under *Roles and capabilities*.

### `edit_theme_options` is not what it sounds like

It is what WordPress uses to gate **menu editing**, which the Publisher needs because "update the navigation" was on the client's list. It does **not** permit editing theme files — that is `edit_themes`, which is not granted and is disabled outright by `DISALLOW_FILE_EDIT`.

The name is misleading, and it is stated here so nobody removes the capability believing they are closing a hole, and breaks navigation editing instead.

---

## 3. `unfiltered_html`, and why marketing must not have it

This is the load-bearing restriction in the whole permission model.

A `gemreserve/preserved` block renders its stored HTML verbatim, and a `gemreserve/content` block renders its `template` attribute. Being able to write either is equivalent to being able to run JavaScript on gemreserve.io. So neither marketing role has `unfiltered_html`, and two controls enforce that rather than assume it:

1. **Preserved blocks are restored, not filtered.** On save, any `preserved` block whose HTML differs from what is already stored has the stored value put back. A marketing user cannot create one or change one.

2. **Markup attributes are filtered against a closed allowlist.** `template`, `itemTemplate`, `open` and `close` all pass through `MarkupPolicy` on save for any user without `unfiltered_html`.

The second control exists because of a gap that is easy to reason past, and was confirmed rather than assumed:

> WordPress's `wp_filter_post_kses` sanitises post content for users without `unfiltered_html`. It does **not** protect block attributes: those are serialised inside an HTML comment with `<` escaped as `<`, specifically so kses leaves the comment intact. The escaping that keeps legitimate attributes safe is the same escaping that carries a payload past the filter. An `<img src=x onerror=alert(1)>` placed in a `template` attribute by a Marketing Editor **reached the rendered page**.

The policy is verified not to damage the approved design: all **2,591 markup attributes** across the 58 routes pass through it unchanged, so an ordinary edit is untouched and only injected markup is altered.

Ten injection attempts — script elements, event handlers, `javascript:` URLs, SVG payloads, attribute breakout, gap tampering, preserved-block tampering — are all neutralised, verified by parsing the output rather than pattern-matching it. See `CMS_SECURITY_REVIEW.md` §2.

---

## 4. What a marketing user never needs

Per §19, none of the following is required to do the job:

- install plugins
- edit PHP or any theme file
- reach database tools
- manage infrastructure or environment variables
- view secrets
- hold `unfiltered_html`

The eleven acceptance tests are all performed by `gr_marketing_publisher` or `gr_marketing_editor`, never by an administrator. That is the evidence for this section: the operations the client asked for were completed without any of the capabilities above.

---

## 5. Editorial audit trail

`Audit` records status transitions, migrations, rollbacks and revision restores: timestamp, action, post id and slug, user id and display name, and a short detail.

**What is deliberately not recorded:**

- **The content itself.** WordPress revisions are a better record of content than a log line, and copying page bodies into an option would duplicate the data, bloat `wp_options` and put draft copy somewhere with no access control of its own.
- **IP addresses.** They are personal data under GDPR, this is a Lithuanian company, and an editorial audit trail does not need them.

The log is capped at 500 entries with `autoload=false`.

---

## 6. Setting the roles up

```bash
# Roles are registered on plugin activation; this is the idempotent re-run.
wp eval 'GemReserve\VisualCms\Roles::register();'
wp gemreserve roles                      # print the matrix

wp user create jane jane@example.com --role=gr_marketing_editor
wp user set-role existing_user gr_marketing_publisher
```

**Two-factor.** `gemreserve-core` treats 2FA as a nag rather than a wall — a user in a required role is warned on every admin page until it enrols, and hard enforcement is written but switched off. Marketing roles are not currently in `gemreserve_mfa_required_roles()`. Whether publishing rights should require 2FA is a client decision; the switch exists and the recommendation is that **Marketing Publisher should require it**, because that role can change what the public sees.
