# CMS Marketing Permission Matrix

What the marketing roles may change, what they may not, and where each
restriction is enforced. Generated from the live roles and from
`GemstonePolicy::matrix()` rather than transcribed, because a permission list
maintained by hand is wrong the first time the code changes.

**Deployed:** 2026-09-04, commit `86fa52f`.

---

## 1. The problem this closes

`gemstone` was registered with `capability_type => 'post'`. Editing one
therefore required `edit_others_posts` and `edit_published_posts` — the same
capabilities that govern `gr_document`, the compliance-controlled register.
Granting them so marketing could reach the 18 gemstone pages would also have
handed over the controlled documents, so the previous deployment left marketing
unable to edit gemstones at all.

The fix is a **smaller** grant, not a bigger one: `gemstone` and `gr_document`
each get their own capability set, so they can be granted independently; then
the gemstone's own fields are split.

Closing it closed a second hole in passing. While the two types shared
capabilities, a Marketing Publisher holding `publish_posts` could **create and
publish a controlled document**. It could not edit an existing one, which is
presumably why nobody noticed. Separating the type ends that.

---

## 2. Role capability matrix

| Capability | Mkt Editor | Mkt Publisher | Compliance | Editor | Admin |
|---|:--:|:--:|:--:|:--:|:--:|
| `edit_gemstones` | yes | yes | yes | yes | yes |
| `edit_others_gemstones` | yes | yes | yes | yes | yes |
| `edit_published_gemstones` | yes | yes | yes | yes | yes |
| `publish_gemstones` | **–** | yes | yes | yes | yes |
| `delete_gemstones` | **–** | **–** | yes | yes | yes |
| `edit_gr_documents` | **–** | **–** | yes | **–** | yes |
| `publish_gr_documents` | **–** | **–** | yes | **–** | yes |
| **`gr_manage_gemstone_record`** | **–** | **–** | yes | **–** | yes |
| `edit_pages` / `edit_published_pages` | yes | yes | – | yes | yes |
| `publish_pages` | **–** | yes | – | yes | yes |
| `gr_manage_globals` (nav, footer, identity) | **–** | yes | – | – | yes |
| `gr_preview_drafts` | yes | yes | – | – | yes |
| `manage_options` | **–** | **–** | **–** | **–** | yes |
| `install_plugins` / `activate_plugins` | **–** | **–** | **–** | **–** | yes |
| `edit_plugins` / `edit_themes` | **–** | **–** | **–** | **–** | yes* |
| `unfiltered_html` | **–** | **–** | **–** | yes | yes |
| `edit_users` | **–** | **–** | **–** | **–** | yes |

\* `DISALLOW_FILE_EDIT` is set in `wp-config.php`, so no role — administrator
included — can edit PHP through the dashboard.

Deleting a gemstone is withheld from both marketing roles: removing one removes
an asset page, and nothing on the client's list asks for it.

---

## 3. Gemstone field matrix

Marketing owns the page. It does not own the claim the page makes about a real
asset.

### Editable by marketing — 16 fields

| Field | What it is |
|---|---|
| `_gr_hero_eyebrow` | Breadcrumb parent label |
| `_gr_hero_title_lines` | Hero headline |
| `_gr_hero_tagline` | Hero tagline |
| `_gr_hero_description` | Hero body copy |
| `_gr_hero_image_desktop` | Hero image, desktop |
| `_gr_hero_image_mobile` | Hero image, mobile |
| `_gr_tagline` | Page tagline |
| `_gr_accent` | Accent colour |
| `_gr_hero_image` | Hero image (media) |
| `_gr_cutout_image` | Cut-out image (media) |
| `_gr_cta_label` | Call-to-action label |
| `_gr_cta_href` | Call-to-action destination |
| `_gr_seo_title` | SEO title |
| `_gr_seo_description` | Meta description |
| `_gr_canonical_url` | Canonical URL |
| `_gr_noindex` | Exclude from search engines |

Plus the page body itself, as GemReserve blocks: sections, cards, text, links,
icons, images and galleries.

### Protected — 25 fields, requiring `gr_manage_gemstone_record`

| Group | Fields |
|---|---|
| **Asset identity** | `_gr_display_name`, `_gr_canonical_name`, `_gr_species`, `_gr_variety`, `_gr_inventory_form` |
| **Specification** | `_gr_origin`, `_gr_weight`, `_gr_weight_unit`, `_gr_colour`, `_gr_clarity`, `_gr_hardness`, `_gr_quality`, `_gr_treatment` |
| **Compliance / custody / evidence** | `_gr_evidence_state`, `_gr_custody_state`, `_gr_lab_report_issuer`, `_gr_lab_report_number` |
| **Migration internals & raw markup** | `_gr_body_html`, `_gr_section_json`, `_gr_hero_extra_html`, `_gr_hero_class`, `_gr_page_class`, `_gr_vcms_legacy_body`, `_gr_vcms_migrated`, `_gr_vcms_source_sha256` |

`_gr_evidence_state` is the load-bearing one: anything below *Verified* makes the
public page render a standing "not a record of a stone held today" notice. It is
the reason several pages are safe to publish, and it is not marketing's to change.

### Default deny

Everything in the `_gr_` namespace is protected **unless it appears on the
allowlist**. A field added next year — by this project or anyone else — is denied
to marketing until somebody deliberately opens it.

Keys outside `_gr_` are untouched: `_edit_lock`, `_thumbnail_id`,
`_wp_page_template` and the rest are how WordPress runs an edit session, and
blocking them would break editing without protecting anything.

---

## 4. Where each restriction is enforced

Hiding a field is not a control, so the UI layer is the last of five and the
only cosmetic one.

| # | Layer | Covers |
|--:|---|---|
| 1 | `update_post_metadata` / `add_post_metadata` / `delete_post_metadata` filters | The choke point every writer passes through: REST, the meta-box POST, XML-RPC, another plugin, a crafted payload. A new write path cannot appear that bypasses the policy. |
| 2 | `auth_callback` on the registered meta | The REST meta route answers 403 rather than silently discarding. Replaces `gemreserve-core`'s `current_user_can('edit_posts')`, which a marketing role satisfies. |
| 3 | `save_post` priority 1 | Strips protected keys out of `$_POST` before `gemreserve_save_fields()` reads them — that handler gates only on `edit_post`. |
| 4 | `is_protected_meta` | Keeps them out of the Custom Fields box. |
| 5 | Meta boxes removed | Nobody is offered a control that will refuse them. Groups are derived from the schema, so a new group of protected fields hides automatically. |

Requests with no logged-in user — WP-CLI, cron, the migration — are trusted,
because reaching them already requires shell access on the host.

---

## 5. Test evidence

**28 unit assertions** in `tests/run-tests.php`, group *Gemstone — marketing may
edit the page, not the asset record*. Each write path is exercised separately as
a restricted user, and then repeated as an administrator, because a policy that
blocks everybody proves nothing.

| Assertion | Result |
|---|---|
| Publisher can open, edit and publish a gemstone | pass |
| Publisher can write all 16 marketing fields | pass |
| Administrator can write all 25 protected fields | pass |
| `update_post_meta` refused for every protected field | pass |
| `delete_post_meta` refused for every protected field | pass |
| `add_post_meta` refused | pass |
| Every protected field has a denying `auth_callback` | pass |
| Meta-box POST loses protected keys, keeps marketing keys | pass |
| Crafted REST payload with a protected field → 403 | pass |
| REST payload with only marketing fields → accepted | pass |
| An unknown `_gr_` field defaults to protected and cannot be written | pass |
| A core editorial key is not swept up by default deny | pass |
| Publisher cannot edit or publish controlled documents | pass |
| Marketing Editor cannot publish, cannot touch the record | pass |
| Compliance keeps the record capability and document access | pass |

**Browser tests**, as `gr_marketing_publisher` — never as an administrator:

| ID | Test | Result |
|---|---|---|
| AT-G1 | A migrated gemstone opens in the block editor and edits reach the public page | pass |
| AT-P1 | The asset record is not offered to a marketing user — no Identity/Specification/Status box, no protected input in the DOM | pass |
| AT-P2 | A marketing user edits gemstone SEO and it reaches the page head | pass |
| AT-P3 | A newer raw-HTML page is editable visually, without touching source | pass |

---

## 6. Account assignment — done

**`gr_marketing`, role `gr_marketing_publisher`**, created on production
2026-09-04. Verified to hold every capability the role needs and none it must
not: `manage_options`, `install_plugins`, `activate_plugins`, `edit_plugins`,
`edit_themes`, `unfiltered_html`, `edit_users`, `gr_manage_gemstone_record`,
`edit_gr_documents`, `publish_gr_documents`, `delete_gemstones`, `export`,
`import` and `update_core` are all blocked.

The credentials are not recorded here. Whoever takes the account should claim it
through a password reset.

### Why `gr_admin` was not reassigned

| Account | Role | Evidence |
|---|---|---|
| `gr_admin` | administrator | 139 posts, 30 menu items, 94 sessions — the site's primary administrator |
| `chatgpt` | administrator | registered 2026-09-01, personal address, escalated from Editor outside this engagement, 53 live sessions |
| `gr_marketing` | `gr_marketing_publisher` | created this session |

`gr_admin` is one of only **two** administrator accounts. Demoting it would have
left `chatgpt` as the site's *sole* administrator — an account escalated
undocumented, against a personal address. That is a worse outcome than the
problem it solves, so a dedicated account was created instead.

### `chatgpt` — reported, not changed

If it is a marketing user it should be `gr_marketing_publisher`; if it is an
integration it should hold the narrowest role that integration needs. Demoting
an account with 53 live sessions is the client's decision:

```bash
cd /var/www/GemReserve/wordpress
sudo -u www-data wp user set-role chatgpt gr_marketing_publisher
```
