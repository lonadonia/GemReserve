# CMS Remediation — Final Report

**Phase 2 client-acceptance remediation · GemReserve.io**
**Branch:** `phase-2-headless-visual-cms-remediation` · **Base:** `main` @ `f3a46ad`

---

## 1. Executive decision

**CMS REMEDIATION TECHNICALLY READY — CLIENT/DEPLOYMENT APPROVAL BLOCKED**

The engineering is complete and verified. All 58 public routes are byte-identical before and after migration, the migration is idempotent and reversible, one Critical and four lower security findings are fixed and regression-tested, and both renderers agree section by section.

What is missing is not engineering:

- **no marketing user has performed the eleven acceptance tests and signed off** (§30 requires recorded client acceptance);
- **production deployment is prohibited** under §29 without separate authorisation;
- three pre-existing conditions of the production environment must be resolved before *any* deployment (§25 below).

---

## 2. The actual live architecture

The brief allowed that production might be WordPress, Next.js or hybrid, and said not to assume. Settled by request, not inference:

```
$ curl -sSI https://www.gemreserve.io/
link: <https://www.gemreserve.io/wp-json/wp/v2/pages/4>; rel="alternate"
```

**WordPress is the live public renderer**, served by PHP-FPM on `127.0.0.1:3200` behind CloudPanel-managed nginx. The two Next.js services on `:3000` and `:3100` are a rollback target, not the public path.

That conditional shaped the whole architecture. §11 asks for a Next.js block renderer *"if Next.js remains the public presentation layer"* — it does not, so building it as *the* renderer would have been an unrequested production migration rather than compliance. It is built, routed at `/cms/`, and verified to parity; the cutover is left as an authorised deployment decision.

### The defect, precisely

All 40 published pages had **`post_content` of length 0**. Every page body lived in a single `_gr_body_html` post-meta blob averaging 22 KB, printed unescaped by the theme. `gemreserve-core` disabled the block editor for pages outright. The theme's structured section renderer was dead code — the field it reads holds migration provenance, not sections.

---

## 3. Paths

| | |
|---|---|
| Repository | `/var/www/GemReserve/GemReserve` |
| WordPress | `/var/www/GemReserve/wordpress` |
| Theme | `wp-content/themes/gemreserve` |
| Plugins | `gemreserve-core`, **`gemreserve-visual-cms`** (new) |
| Staging | Isolated MySQL `:13306` + PHP `:8899`, restored from a verified production dump |

---

## 4. Branch and base commit

| | |
|---|---|
| Branch | `phase-2-headless-visual-cms-remediation` |
| Base | `main` @ `f3a46ad` — "Serve WordPress on the port the load balancer actually uses" |
| Production commit | the same; no divergence between base and production |
| Pre-existing uncommitted work | `contracts/` and `services/` (Phase 3–6), left untouched |

Phase 3–6 branches were neither merged nor modified. Nothing was pushed.

---

## 5. Commits

| Commit | Subject |
|---|---|
| `216ad2a` | Audit the live CMS, and prove a design-preserving decomposition is possible |
| `b559856` | Make the page bodies editable in Gutenberg without moving a single byte |
| `823c54d` | Render the same blocks in Next.js, and make the two renderers agree exactly |
| `8ab38d9` | Drive the eleven client requirements through a real browser, and fix what broke |
| `0c49835` | Keep Playwright run output out of the repository |
| `bc68219` | Write the documentation, and reconcile the figures against what actually ran |
| `4b44e1d` | Package the remediation from committed source only |
| `ac683a2` | Complete the acceptance suite, and record what the byte comparison already proved |

---

## 6. Files created and modified

**New plugin** `wordpress/plugins/gemreserve-visual-cms/` — 17 PHP classes, 6 `block.json`, editor JS/CSS, 3 tools, 1 test suite.

**Modified:**

| File | Change |
|---|---|
| `themes/gemreserve/page.php`, `front-page.php`, `single-gemstone.php` | Render blocks when migrated, legacy body when not |
| `themes/gemreserve/functions.php` | `gemreserve_body_is_blocks()`, `gemreserve_render_block_body()` |
| `plugins/gemreserve-core/includes/admin-menu.php` | Settings menu capability |
| `plugins/gemreserve-core/includes/settings.php` | Settings render guard, `option_page_capability` filter |

**New renderer:** `lib/cms/`, `components/cms/`, `app/api/{preview,exit-preview,revalidate}/`, `app/cms/[[...route]]/`.

**New QA:** `qa/cms/` — acceptance suite, helpers, config, parity and visual tools.

**New docs:** `docs/phase-2/cms-remediation/` — 17 documents plus evidence.

---

## 7. WordPress plugin and theme changes

`gemreserve-visual-cms` owns the editing surface and the rendering pipeline. `gemreserve-core` keeps the content model. A fault in block rendering cannot take down the gemstone register, and either can be rolled back without the other.

The theme change is a branch: migrated pages render from blocks, un-migrated pages render from the legacy blob exactly as before. **Deactivating the plugin is therefore a complete rollback of rendering with no database change** — `gemreserve_body_is_blocks()` checks for the plugin's class.

---

## 8. Next.js renderer changes

Typed client with runtime validators, an allowlisted block renderer, a preview banner, signed preview exchange, an HMAC revalidation webhook and a CMS-driven route at `/cms/`.

Validators are **narrowing, not coercing**: a node that does not match is dropped and logged, never patched into shape. Hand-written rather than pulled from a schema library — one response shape with six node kinds does not justify a runtime dependency and its supply chain in a marketing site.

---

## 9. Blocks implemented

| Block | Count (58 routes) | Editor affordance |
|---|---:|---|
| `gemreserve/section` | 176 (pages) | Move, duplicate, delete, hide, rename |
| `gemreserve/content` | — | Edit text, links, images, icons in place |
| `gemreserve/wrapper` | — | Locked; exists so the editor can reach inside |
| `gemreserve/repeatable` | 235 | Add, duplicate, remove, reorder cards |
| `gemreserve/gap` | 1 | Preserved whitespace |
| `gemreserve/preserved` | **0** | Admin-only escape hatch — **never needed** |

Site totals: **2,480 blocks, 7,227 editable fields, 235 card groups, 0 preserved fallbacks.**

Six blocks rather than the sixteen §8 suggests, because the site is not built from a component kit: 1,135 list items across **30+ distinct internal structures**. Flattening those onto semantic blocks would have silently redesigned the site. See `CMS_TARGET_ARCHITECTURE.md` §2.

---

## 10. Templates and patterns

Seven page families, each **harvested from a real published page** rather than hand-written, so a pattern cannot drift from the design — it *is* the design. General content, landing, legal, resource, process, FAQ, governance.

---

## 11. Routes migrated

**58 of 58** — 40 pages and 18 gemstones — every one verified byte-identical. Full matrix: `evidence/route-migration-matrix.md`.

---

## 12. Routes not migrated

**None.** Every public route carried a migrated body and every one reproduced exactly.

Worth recording: an earlier version of the migration listed only `post_type = page`, which would have migrated 40 of 58 and left a third of the site un-editable — while every report read "40/40 migrated". Counting routes rather than post types is what caught it.

---

## 13. API endpoints

`/wp-json/gemreserve/v1/` — schema `1.0.0`.

| Endpoint | Auth |
|---|---|
| `GET /pages` | public |
| `GET /page` | public |
| `GET /globals` | public |
| `GET /health` | public |
| `POST /preview-token` | capability |
| `GET /preview` | signed token |
| `POST /revalidate-test` | HMAC |

Public endpoints serve published public content and nothing else — verified against draft, pending, private, scheduled and password-protected content, by id and by route, with the index checked too.

WPGraphQL was not introduced: no existing dependency, no demonstrated need (§12).

---

## 14. Preview and publishing

**Preview** is a signed token bound to one page and one revision, expiring in 15 minutes, single-use, verified with `hash_equals`. Nine properties tested including replay, re-pointing, expiry and staleness. One opaque message for every failure.

**Publishing** sends an HMAC-signed webhook naming the affected routes — the page, its parent, and relevant indexes; `["*"]` only when global content changed. The timestamp is inside the signed material, so a captured request cannot be replayed with reused headers. Delivery failure is logged, surfaced in the admin in plain language, retried once, and **never blocks the publish**.

---

## 15. SEO result

Preserved exactly. Titles, descriptions, canonicals, `noindex`, Open Graph, Twitter and structured-data inputs are unchanged and editable through the meta boxes — verified end to end by AT-07.

The `/cms/` mirror is `noindex` with its canonical pointing at the live WordPress URL, so it cannot compete in search.

---

## 16. Role and capability matrix

| Capability | Mktg Editor | Mktg Publisher | Administrator |
|---|:--:|:--:|:--:|
| `edit_pages`, `edit_others_pages`, `edit_published_pages` | yes | yes | yes |
| **`publish_pages`** | **–** | **yes** | yes |
| `edit_theme_options` (menus) | – | yes | yes |
| `gr_manage_globals` (footer, identity) | – | yes | yes |
| `manage_options`, `install_plugins`, `edit_plugins`, `edit_themes` | – | – | see note |
| **`unfiltered_html`** | **–** | **–** | yes |

`DISALLOW_FILE_EDIT` and `DISALLOW_FILE_MODS` mean no role edits PHP through the dashboard, including administrators. Asserted by 14 tests.

---

## 17. Backup and rollback evidence

A backup nobody has restored is a hypothesis. The production dump was verified four ways — checksum, completeness, restorability, and content — then **used as the staging instance for the entire engagement**, and restored a second time mid-engagement to reset test-mutated content. Both restores produced working instances.

| Rollback level | Verified |
|---|---|
| Deactivate the plugin (seconds, no data change) | yes |
| `wp gemreserve rollback --apply` | **58 / 58 routes identical** |
| Git checkout + redeploy | see §25 — a Git rollback removes two uncommitted plugins |
| Database restore | yes, twice |

---

## 18. Test totals

| Suite | Assertions | Result |
|---|---:|---|
| WordPress (`tests/run-tests.php`) | 132 | **132 passed, 0 failed** |
| Renderer parity | 268 sections / 58 routes | **268 identical** |
| Route byte comparison | 58 routes × 4 stages | **58/58 each time** |
| Client acceptance | 11 | see §20 |
| TypeScript strict | — | passes |
| ESLint | — | 0 errors, 2 pre-existing warnings |
| Production build | 122 static pages | succeeds |

The two lint warnings are in theme JavaScript committed in `425444c`, untouched by this work.

---

## 19. Coverage

Line-coverage instrumentation was not set up: WordPress's PHPUnit harness needs its own database, bootstrap and a checkout of the core test library — infrastructure this project does not have, stood up to produce a percentage.

What is measured instead is **behavioural coverage against the real content**, which is the more useful number here:

| Measure | Coverage |
|---|---|
| Public routes byte-verified | 58 / 58 (100%) |
| Markup attributes verified non-destructive under the policy | 2,591 / 2,591 (100%) |
| Blocks re-rendering identically | 2,480 / 2,480 (100%) |
| Injection payloads neutralised | 10 / 10 |
| Preview security properties | 9 / 9 |
| Webhook signature cases | 8 / 8 |
| Non-public content states refused | 5 / 5 |

---

## 20. Acceptance-test results

Run against the isolated staging instance, reset from the verified backup, as the real marketing roles in Chromium, asserting on the **public page**.

| # | Requirement | Result |
|---|---|---|
| AT-01 | Edit the complete content of an existing page | **pass** |
| AT-02 | Replace text and images | **pass** |
| AT-03 | Add and remove a page section | **pass** |
| AT-04 | Reorder sections | **pass** |
| AT-05 | Add or duplicate a card | **pass** |
| AT-06 | Modify navigation and footer | **pass** |
| AT-07 | Update page SEO | **pass** |
| AT-08 | Preview desktop and mobile output | **pass** |
| AT-09 | Save a draft and publish it | **pass** |
| AT-10 | Create a new page using the approved design | **pass** |
| AT-11 | Restore a previous version | **pass** |

All eleven pass. **This is automated verification, not client acceptance** — see §25.

Writing them found five real product defects, three of which made a requirement unachievable. The most consequential: the Site Settings screen was administrator-only, so the role accountable for the footer could not edit it.

---

## 21. Route results

**All 58 routes: HTTP 200, byte-identical to the pre-migration baseline.** Verified after migration, after rollback, after a second migration, and again after the whitespace change on a pristine restore. Full matrix in `evidence/route-migration-matrix.md`.

---

## 22. Visual regression

**58/58 byte-identical** — the stronger claim, since identical bytes necessarily render identically. Renderer parity **268/268 sections**. No horizontal overflow at 1440, 1024, 768 or 390 px. Fresh screenshots captured at all four widths for eight representative routes covering every page family.

No unintended visual difference on any route.

---

## 23. Security findings

| ID | Severity | Status |
|---|---|---|
| SEC-1 Stored XSS via block attributes | **Critical** | Fixed, regression-tested |
| SEC-4 Global settings unreachable by the accountable role | Medium | Fixed |
| SEC-2 SVG and executable uploads | Low | Fixed |
| SEC-3 Route parameter accepted a foreign origin | Low | Fixed |
| SEC-5 Raw JSON field exposed to marketing users | Low | Fixed |

**SEC-1 is the one that matters.** WordPress does not sanitise block attributes — they are serialised with `<` escaped as `&lt;` precisely so kses leaves the comment intact, and that same escaping carries a payload past the filter. An `<img src=x onerror=alert(1)>` placed in a template by a Marketing Editor **reached the rendered page**. Confirmed, not theorised.

The fix is a closed allowlist applied on save, verified non-destructive against all 2,591 markup attributes on the site. No Critical or High finding is outstanding.

---

## 24. Performance

| | Before | After |
|---|---|---|
| Rendering | `echo` of a meta blob | `do_blocks()` over ~62 blocks/page |
| Public HTML | — | **byte-identical**, so payload, images and CWV inputs are unchanged |
| Extra queries | — | none; blocks come from `post_content`, already loaded |
| Build | 64 static pages | 122 (58 CMS routes added) |

Because the output bytes are identical, Core Web Vitals inputs are identical by construction. The only new cost is server-side block rendering, which replaces a string echo.

**Not measured:** production Lighthouse/CWV. Doing so would require deploying, which §29 prohibits. Recorded as an outstanding measurement rather than claimed.

---

## 25. Remaining blockers

| # | Blocker | Needs |
|---|---|---|
| 1 | **Client acceptance not recorded.** Automated tests pass; no marketing user has signed off. | A marketing user to work through `CMS_ACCEPTANCE_TESTS.md` on staging. |
| 2 | **Production authorisation.** §29. | An explicit separate instruction. |
| 3 | **Production has drifted from Git.** Two plugins active and in no commit; one is load-bearing for responsive layout and holds the mandated director identity. A Git rollback removes both. | A decision: version them, or add them to the deployment checklist explicitly. |
| 4 | **The vhost is unreadable to the deploy account.** CloudPanel-managed; the path named in the brief does not exist. | CloudPanel access to confirm how the vhost is switched — before it is needed. |
| 5 | **Production content changed during this engagement.** Fifteen pages and two gemstones added by another party after the baseline snapshot. | Re-take the snapshot and re-run the dry run on the day. |

Blockers 3–5 are pre-existing conditions of the production environment, not introduced by this work.

---

## 26. Production-change confirmation

**No production change was made.**

Not modified: the production database, the public site, any service (nginx, PHP-FPM, MySQL, Next.js), production `.env` values, DNS, TLS, the vhost, production cron, any public URL, SEO metadata, or migrated content. No plugin was activated on production. Nothing was pushed or merged. No credential is stored in Git.

All inspection was read-only. All implementation and migration ran against an isolated MySQL instance on `:13306` and an isolated WordPress on `:8899`, restored from a verified dump.

Production content was read once, at 01:31 UTC, to take that dump.

---

## 27. Documentation paths

`docs/phase-2/cms-remediation/`

`CMS_CURRENT_STATE_AUDIT.md` · `CMS_TARGET_ARCHITECTURE.md` · `CMS_COMPONENT_AND_BLOCK_INVENTORY.md` · `CMS_CONTENT_SCHEMA.md` · `CMS_API_SPECIFICATION.md` · `CMS_PREVIEW_AND_PUBLISHING.md` · `CMS_ROLES_AND_PERMISSIONS.md` · `CMS_MIGRATION_RUNBOOK.md` · `CMS_BACKUP_AND_ROLLBACK.md` · `CMS_SECURITY_REVIEW.md` · `CMS_MEDIA_REMEDIATION.md` · `CMS_MARKETING_USER_GUIDE.md` · `CMS_DEVELOPER_GUIDE.md` · `CMS_ACCEPTANCE_TESTS.md` · `CMS_VISUAL_REGRESSION_REPORT.md` · `CMS_DEPLOYMENT_READINESS.md` · `CMS_REMEDIATION_FINAL_REPORT.md`

`evidence/` — route matrix, block inventory, migration report, legacy-content scan, route baseline, migration verification.

**Documents sought and not found**, recorded as missing rather than assumed: Final Master Developer Instructions v1.5, any White Paper version, the WordPress improvement request, Phase 1 and Phase 2 reports, prior CMS test reports, prior route acceptance matrix.

---

## 28. Deployment package

**Build:** `bash wordpress/deploy/build-cms-package.sh`
**Output:** `dist/gemreserve-cms-<UTC stamp>.tar.gz` — 95 files, 224 KB, `SHA256SUMS` verified.

Built with `git archive` from committed source only; the script refuses to run on a dirty tree, and did refuse its own uncommitted fix. The generated stylesheet is not in the repository and so is not in the package — the theme's css directory carries a note saying what is missing and how to supply it, rather than shipping something that looks complete and renders unstyled.

---

## 29. Notion update block

```
Phase 2 — In Progress — CMS Marketing Remediation

Status:        Technically complete; awaiting client acceptance and deployment
               authorisation.
Branch:        phase-2-headless-visual-cms-remediation (base main @ f3a46ad)
Commits:       8, none pushed.

Delivered
  · gemreserve-visual-cms: 6 server-rendered blocks, versioned API, signed
    preview, HMAC revalidation, 2 marketing roles, 7 page patterns
  · Migration: dry-run first, idempotent, reversible, verified before it writes
  · Next.js block renderer, parity-tested; NOT switched on in production

Verified
  · 58/58 routes byte-identical after migration, rollback and re-migration
  · 2,480 blocks · 7,227 editable fields · 235 card groups · 0 fallbacks
  · Renderer parity 268/268 sections
  · WordPress suite 132/132 · acceptance 11/11 automated
  · 1 Critical + 4 lower security findings, all fixed and regression-tested

Production
  · NO production change. All work on an isolated staging copy.

Blockers
  1. Marketing sign-off on the 11 acceptance tests not recorded
  2. Production deployment authorisation (§29)
  3. Two plugins active on production and absent from version control
  4. CloudPanel vhost not readable by the deploy account
  5. 15 pages added to production by another party after the baseline snapshot

Do NOT mark Phase 2 Completed. Phases 3–6 unchanged.
```

---

## 30. Recommended next action

1. **Stand up staging for the client** from `CMS_MIGRATION_RUNBOOK.md` and give the marketing team access.
2. **Have a marketing user work through the eleven acceptance tests** and record the result in their own words. This is the only outstanding item that is genuinely about whether the remediation worked.
3. **Resolve blockers 3 and 4** — the uncommitted plugins and the vhost — before any deployment, this one or otherwise.
4. **Then, and only then**, request production authorisation and follow the nine-step deployment order.

Steps 1 and 2 need no developer time. Step 3 needs a decision and server access.

---

**CMS REMEDIATION TECHNICALLY READY — CLIENT/DEPLOYMENT APPROVAL BLOCKED**
