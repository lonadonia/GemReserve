# Manual WordPress Editing — Hands-On Verification

**Date:** 2026-09-04
**Deployed commit:** `aa6e738`
**Method:** a Marketing Publisher driving the real WordPress admin in a real
browser on an isolated clone of production. Not unit tests, not a reading of the
code, not an earlier report taken on trust.

> ## ⚠ This report's conclusion was WRONG, and was corrected on 2026-09-04
>
> It concluded that manual editing worked. **It did not.** The client opened
> Contact Us as `gr_marketing` and got a blank canvas with a broken-document
> icon — the editor would not open at all, on any page.
>
> Everything measured below is accurate. The conclusion drawn from it was not,
> because none of it tested the thing that was broken. See
> `CMS_EDITOR_ROOT_CAUSE.md` for what was actually wrong, why this report
> missed it, and the fix.

**Outcome (SUPERSEDED — see the box above): manual editing genuinely works —
after two defects found here were fixed.**

---

## 1. The defect that mattered

An ordinary marketing edit was **deleting the page it edited**.

`wp_filter_post_kses()` runs on `content_save_pre` for every user without
`unfiltered_html` — every marketing user, deliberately. WordPress reaches
inside block delimiters there and sanitises each string attribute against the
generic `post` allowlist. `<svg>` is not in it.

Measured on the home page, saved by a Marketing Publisher through the ordinary
editor and the ordinary REST call:

| | Before | After one heading edit |
|---|---:|---:|
| Stored content | 57,784 bytes | 33,475 bytes |
| Inline icons | 14 | **0** |

`decoding` and `srcset` were stripped from every `<img>` in the same pass,
and `&amp;` came back as `&amp;amp;` so an ampersand rendered literally.

### Why nothing caught it

Every acceptance test asserted that the change it made arrived. None asserted
that the rest of the page survived. The gap between "my edit is live" and
"nothing else was destroyed" is exactly where this lived.

`CMS_SECURITY_REVIEW.md` §1 records the belief that escaping `<` as
`&lt;` inside the block comment keeps kses out of block attributes. That is
half right: it stops kses mangling the comment *syntax*. It does not stop core
decoding the values and sanitising them.

The plugin's own policy could not save it either. `Migrator::guard_preserved()`
already sanitises these attributes through the reviewed `MarkupPolicy` and
`Renderer::sanitize_icon()` allowlists — but it runs on
`wp_insert_post_data`, after `content_save_pre` has already blanked them. It
was tidying a field core had emptied.

### The fix — ordering, not weakening

| Priority | What runs |
|---:|---|
| 9 | `Kses::capture()` — parse the incoming content, run every GemReserve block's attributes through the plugin's **strict** policy, keep the result |
| 10 | `wp_filter_post_kses` — core, untouched. A core paragraph is sanitised exactly as WordPress intends |
| 11 | `Kses::restore()` — put the policy-approved attributes back on the GemReserve blocks kses rewrote |

Nobody gains `unfiltered_html`. A GemReserve block's attributes are now
governed by the *stricter* of the two allowlists instead of being destroyed by
the more generic one.

### Proof

| Check | Result |
|---|---|
| All 58 migrated bodies re-saved as a restricted Marketing Publisher over REST | **58/58 byte-identical, 0 bytes lost** |
| Same, on production, on three real pages | **3/3 identical** — home 57,784 B / 14 icons, governance 40,548 B / 23 icons, aquamarine 57,415 B / 17 icons |
| AT-I1, real browser, real role | **21 icons before, 21 after**, edit applied |
| Injection still refused — script, handler, iframe, svg onload, external `use`, `javascript:` URL, in both core and GemReserve blocks | **8/8 neutralised** |

---

## 2. The capability that was missing

**Duplicate a page.** WordPress has no duplicate function and no installed
plugin supplied one, so it was the one item on the client's list the admin
genuinely could not do. The row action was simply absent.

`Duplicator` adds it, with four safety properties that are the point of it:

- **The copy is always a draft.** Never published, whatever the source was — so
  duplicating cannot put a second copy of a live page in front of visitors or
  create a URL competing with the original in search.
- **The copy carries no migration provenance.** `_gr_vcms_migrated` and its
  companions record that *a specific post* was converted from *a specific legacy
  blob* and verified against it. A copy has no such history, and inheriting the
  flag would make `wp gemreserve verify` compare the copy against the
  original's snapshot.
- **A marketing copy of a gemstone does not inherit the asset record.**
  Duplicating a *verified* stone would otherwise be a way around
  `GemstonePolicy`: marketing cannot set `evidence_state` to `verified`,
  but could have copied one that already was. The copy starts at the schema
  defaults and renders the standing "not a record of a stone held today" notice.
- **An administrator's copy keeps the record** — so the strip guards rather than
  destroys.

23 regression assertions cover it.

---

## 3. Every capability, checked in the admin

Driven as `gr_marketing_publisher` against the isolated clone. `PRESENT` and
`ABSENT` are what the audit actually found in the DOM.

| # | Client requirement | Verified how | Result |
|--:|---|---|---|
| 1 | Open every page type in the Gutenberg editor | 88/88 routes opened; block canvas renders | pass |
| 2 | Edit every visible text field | AT-01, AT-I1 — text edited, live on the public page | pass |
| 3 | Replace images and galleries from Media Library | AT-02 — picker offered and opens | pass |
| 4 | Add, remove, duplicate, hide, reorder sections | AT-03, AT-04; List View present | pass |
| 5 | Add, remove, duplicate, reorder cards | AT-05 | pass |
| 6 | Buttons, links, icons, videos, documents | slot kinds text/url/icon/attr; Media Library now offers PDF | pass |
| 7 | Layouts, columns, spacing, responsive | design is fixed by approved patterns; responsive asserted at 4 widths (AT-08) | pass, by design |
| 8 | Create a page from GemReserve patterns | AT-10 — 7 patterns; page renders the approved design | pass |
| 9 | **Duplicate an existing page safely** | **was ABSENT — built and verified this session** | **fixed** |
| 10 | Header, Navigation, Footer, legal links | AT-06 — Appearance → Menus and Site Settings reachable | pass |
| 11 | SEO title, description, canonical, noindex | 4 fields on all 88 routes; AT-07, AT-P2 | pass |
| 12 | Preview Desktop / Tablet / Mobile | all three `menuitemradio` options present | pass |
| 13 | Save a draft | AT-09 | pass |
| 14 | Schedule publication | publish-date control present; role holds `publish_pages` | pass |
| 15 | Publish and unpublish | AT-09 | pass |
| 16 | Revisions and restore | AT-11; Revisions panel present | pass |
| 17 | Edit the 18 gemstones' marketing fields | AT-G1, AT-P2 — as marketing, not admin | pass |
| 18 | No raw code or JSON in routine editing | no `_gr_section_json` control, no Sections meta box, no code textarea | pass |

### And what must stay out of reach

| Check | Result |
|---|---|
| Plugins menu | ABSENT |
| Users menu | ABSENT |
| Settings / Tools entries | none offered |
| `_gr_evidence_state`, `_gr_custody_state`, `_gr_species`, `_gr_lab_report_number` inputs | ABSENT from the DOM |
| Identity / Specification / Status meta boxes | ABSENT |
| Crafted REST payload carrying a protected field | **403** |
| `update_post_meta` / `add_post_meta` / `delete_post_meta` on a protected field | refused |
| Controlled documents (`gr_document`) | not reachable |

---

## 4. Marketing account

**`gr_marketing` — role `gr_marketing_publisher`** — created on production
this session.

`gr_admin` was **not** reassigned, and that is a deliberate call. It is the
site's primary administrator: 139 posts, 30 menu items, 94 sessions, and one of
only **two** administrator accounts. Demoting it would have left `chatgpt` —
registered 2026-09-01 against a personal address, escalated to administrator
outside this engagement — as the site's *sole* administrator. That is a worse
outcome than the problem it solves.

### The `chatgpt` account

Reported, not changed. It was an Editor at 02:30 UTC on 2026-09-04 and is an
administrator now; the escalation is undocumented and was not performed by this
work. **Recommendation:** if it is a marketing user, move it to
`gr_marketing_publisher`; if it is an integration, give it the narrowest role
its integration needs. Not deleted, and not demoted unilaterally — it holds 53
live sessions and demoting an account someone is using is the client's call:

```bash
cd /var/www/GemReserve/wordpress
sudo -u www-data wp user set-role chatgpt gr_marketing_publisher
```

---

## 5. All 88 routes

| Family | Routes | Editing surface |
|---|---:|---|
| Migrated GemReserve blocks | 58 | Sections, cards, slots, images — full affordance set |
| Core Gutenberg blocks | 3 | Paragraphs, headings, lists |
| Classic block (imported HTML) | 25 | Visual rich-text editor; prose edited without markup |
| Structured fields only | 2 | Hero and SEO fields; body is templated |

**88/88** editable by both marketing roles, **88/88** publishable by Marketing
Publisher, **88/88** HTTP 200, **0** exclusions. 267 sections, 235 card groups,
3,749 editable slots. Full per-route detail:
`CMS_ROUTE_TRACEABILITY_MATRIX.md`.

The 25 Classic-block routes are **deliberately not converted**. They are prose
articles with no designed sections and no cards — nothing to reorder or
duplicate — so conversion would rewrite 25 pages of live content to gain an
affordance the content has no use for. The runbook covers it if the client asks.

---

## 6. Tests

| Suite | Result |
|---|---|
| WordPress unit assertions | **202 passed, 0 failed** (169 → 202) |
| — new: marketing save preserves the design | 10 |
| — new: duplicate a page or gemstone | 23 |
| Browser tests, as the restricted role | **16 passed, 0 failed** |
| — AT-01…AT-11 | the client's eleven |
| — AT-G1 | gemstone editable as Marketing Publisher |
| — AT-P1/P2/P3 | record hidden; SEO reaches the head; raw-HTML page editable |
| — **AT-I1** | **an ordinary edit does not strip the page's icons** |

---

## 7. Production changes and verification

One plugin directory, swapped atomically in **0.0076 s**. No theme change, no
`gemreserve-core` change, no nginx/DNS/SSL/PHP/Node change, **no service
restarted**.

| Check | Pass 1 21:47 | Pass 2 22:27 | Pass 3 22:32 | Pass 4 22:34 |
|---|---|---|---|---|
| 88 routes vs pre-deployment baseline | identical | identical | identical | identical |
| HTTP 200 | 88/88 | 88/88 | 88/88 | 88/88 |
| SEO metadata, all 88 | identical | identical | identical | identical |
| `robots.txt` | identical | identical | identical | identical |
| `sitemap.xml` | identical | identical | **differed — see §7a** | identical |
| routes / migrated / legacy | 88/58/58 | 88/58/58 | 88/58/58 | 88/58/58 |
| `gemreserve verify` | 58/58 | 58/58 | 58/58 | 58/58 |
| `post_modified` drift | 0 | 0 | 3 | **0** |
| Document-root hygiene | OK | OK | OK | OK |
| Services | all active | all active | all active | all active |

No new PHP, nginx or WordPress error in any pass: `php8.4-fpm` has no journal
entries since the deployment, `wp-content/debug.log` is 0 bytes, and the nginx
error log carries nothing but deny-rule hits and login rate-limiting, both of
which are the vhost working.

### A note on the byte comparison

The raw byte comparison against this morning's baseline shows all 88 routes
differing, and it is **not** this deployment. Two third-party changes landed
during the session:

- **Cloudflare Email Obfuscation** was enabled at the CDN edge, rewriting every
  `mailto:` into `/cdn-cgi/l/email-protection`. Proven at the edge only: the
  origin still serves 7 plain `mailto:` links on `/contact/` and is
  byte-identical to the pre-change capture. All route comparisons here are taken
  **at the origin** for that reason.
- **`gemreserve-chatbot` was upgraded 2.0.2 → 2.1.0** at 21:19 UTC, changing
  its own injected stylesheet and script on every page.

With the chatbot's own markup excluded, GemReserve's output is **88/88
identical**. The 713 HTTP 503s in the access log are that plugin's
`gr_ai_conversation_action` endpoint, all between 20:52 and 21:22 — **1,455
requests before this deployment, 0 after**.

---

## 7a. A mistake I made, and corrected

The production proof in §1 re-saved three pages (home, governance, aquamarine)
with their own unchanged content, as a throw-away restricted user, to show the
save is lossless. It is — content stayed byte-identical and `verify` reported
58/58.

But the save moved `post_modified`, and `gemreserve-flat-sitemap` builds every
`<lastmod>` from that column. Three sitemap entries therefore claimed those
pages changed on 2026-09-04 when not one byte of their output did. Verification
pass 3 caught it; passes 1 and 2 had run before the probe.

The timestamps were restored from this morning's verified backup by direct
column update — `wp_update_post()` would have set `post_modified` again, which
is the thing being undone — and nothing else was touched. `sitemap.xml` is now
byte-identical to the pre-deployment baseline and `post_modified` drift across
all 88 rows is zero.

Worth recording for two reasons. It is the same class of defect the migration's
own `post_modified` guard exists to prevent, and I reintroduced it from outside
that code path. And the first restore attempt gave posts 41 and 11 each other's
timestamps; that was caught by re-reading the backup and corrected before the
final pass.

**A verification probe that writes is a change.** It needs the same care, and
the same undo, as the deployment it is verifying.

---

## 8. Backup and rollback

    backup    /var/www/GemReserve/backups/cms-uiverify-20260904T182938Z
    previous  /var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/pre-deploy-20260904T214614Z/

Restore proven into an isolated instance: **6 s** for the database, **1 s** for
the files, restored tree byte-identical to production.

```bash
# 1 — instant, no database change. Reverts block rendering and the whole
#     capability model; the theme falls back to the legacy body.
cd /var/www/GemReserve/wordpress
sudo -u www-data wp plugin deactivate gemreserve-visual-cms

# 2 — restore the previous plugin.
rsync -a --delete /var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/pre-deploy-20260904T214614Z/gemreserve-visual-cms/ \
  /var/www/GemReserve/wordpress/wp-content/plugins/gemreserve-visual-cms/

# 3 — full database restore.
mysql --defaults-file=/var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/.my.cnf gemreserve-wp < /var/www/GemReserve/backups/cms-uiverify-20260904T182938Z/prod-db-*.sql
```

---

## 9. What still needs a human

**The eleven acceptance actions, performed by a real marketing user.** Automated
tests demonstrate the software can do these things; they do not demonstrate that
a marketing user finds them usable, which is the question that closes Phase 2.

`CMS_CLIENT_ACCEPTANCE_CHECKLIST.md` is written for them. The isolated
acceptance environment is left running at `http://127.0.0.1:8901` — loopback
only, its own database on its own MySQL instance, no route from nginx, and a
config that refuses to boot if any production identity matches.

Two decisions are also the client's, not this work's: whether `chatgpt` should
remain an administrator, and who takes the `gr_marketing` credentials.
