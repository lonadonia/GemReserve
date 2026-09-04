# CMS Deployment Readiness

**Superseded on 2026-09-04: the deployment described here has been performed
and verified.** `gemreserve-visual-cms` is installed and active on production,
the theme and `gemreserve-core` changes are deployed, and 58 page and gemstone
bodies are migrated to blocks. All 88 public routes are byte-identical to the
pre-deployment baseline.

No service was restarted or reloaded, no vhost was changed, and no environment
variable was altered. BLOCKER-3 and BLOCKER-4 below were resolved during that
deployment — the vhost was read directly and staging was rebuilt with all
seventeen production plugins present, which found two defects that are recorded
in `CMS_PRODUCTION_DEPLOYMENT_REPORT.md` §8.

BLOCKER-1 (recorded client acceptance) remains open, and a new blocker was found
and is **not** closed: the marketing roles cannot edit the 18 gemstone pages,
because the capabilities that would let them also unlock the
compliance-controlled documents. See that report's §14.

---

## 1. What is ready

| | Status | Evidence |
|---|---|---|
| Block library and editor | Built | 6 blocks, 132 WordPress assertions passing |
| Migration | Built and verified | 58/58 routes byte-identical, idempotent, reversible |
| Rollback | Verified | 58/58 identical after rollback; plugin deactivation is a second, faster lever |
| Versioned API | Built | `/wp-json/gemreserve/v1/`, schema `1.0.0` |
| Preview | Built and verified | 9 token properties tested |
| Publish → revalidation | Built and verified | 8 signature cases tested |
| Roles | Built and verified | 14 capability assertions |
| Next.js renderer | Built and verified | 268/268 sections identical to WordPress across 58 routes |
| Security | Reviewed | 1 Critical + 4 lower findings, all fixed and regression-tested |
| Deployment package | Buildable from committed source | `wordpress/deploy/build-cms-package.sh` |

---

## 2. What is not ready, and what it needs

### BLOCKER-1 — Client acceptance has not been recorded

The eleven acceptance tests are automated and run against a real browser, but **no member of the marketing team has performed them and signed off**. §30 makes recorded client acceptance a precondition for Phase 2, and that is a signature this work cannot supply for itself.

*Needs:* a marketing user to work through `CMS_ACCEPTANCE_TESTS.md` on the staging instance and record the result.

### BLOCKER-2 — Production authorisation

§29 prohibits production deployment during this task. Nothing here can lift that.

*Needs:* an explicit, separate instruction after staging acceptance.

### BLOCKER-3 — Sixteen of seventeen active production plugins are outside version control

This grew during the engagement. At the 2026-09-02 baseline, production ran four plugins with two uncommitted. By 2026-09-03 it runs **seventeen, of which only `gemreserve-core` is in the repository** — the rest installed by another party over three days.

Three consequences:

**The staging verification was performed against a different site.** Staging was restored from the 01:31 UTC dump and has none of the later plugins. At least six of them — `gemreserve-seo-fixes`, `-seo-polish`, `-seo-runtime`, `-empty-alt-fix`, `-flat-sitemap`, `-combined-sitemap` — filter exactly the SEO and markup surface this remediation touches. **The 58/58 byte-identity result therefore holds for the environment it was measured in, and must be re-established on production with those plugins present.** That re-verification is a precondition of deployment, not a formality.

**A Git deploy or rollback removes all sixteen.** `gemreserve-leadership-profiles` enqueues a stylesheet repairing "the responsive public site shell" on every route and holds the mandated director identity; `circumflex-booking` has created 15 database tables.

**Nobody can say what production is running from a commit hash.** That is the underlying problem.

*Needs:* a decision — bring them into version control, or record them explicitly as unmanaged and add each to the deployment checklist. Either way, **re-run the dry run on production with them active before migrating.**

### BLOCKER-4 — The vhost is unreadable to the deploy account

`/etc/nginx` is not readable by `hamza`, `sites-enabled` is empty, and the path named in the brief (`/etc/nginx/sites-enabled/www.gemreserve.io.conf`) does not exist. The site is CloudPanel-managed.

*Needs:* whoever holds CloudPanel access to confirm how the vhost is switched, **before** it is needed, not during an incident.

### BLOCKER-5 — Production content changed during this engagement

Between the baseline snapshot (2026-09-02 01:31 UTC) and the time of writing, fifteen pages and two gemstone records were added to production by another party — a "Learn" section. They are not in the staging copy and have not been through this migration.

*Needs:* re-take the snapshot and re-run the dry run immediately before the production migration, so the report covers what is actually there.

---

## 3. Outstanding items that are not blockers

| Item | Recommendation |
|---|---|
| **Cron** | Set `DISABLE_WP_CRON` and add a real cron entry, or scheduled publishing will be late on a low-traffic site. Not applied: §4 forbids altering production cron without approval. |
| **2FA for publishers** | `gemreserve-core` treats 2FA as a nag; hard enforcement is written but off, and marketing roles are not in the required list. Marketing Publisher can change what the public sees and should require it. Client decision. |
| **Leadership registry** | Currently hardcoded PHP in an uncommitted plugin. Moving it into structured content would make it editable and version-controlled. Not done: §13 forbids rewriting identity content without the controlling documents, which could not be located. |
| **Credentials file** | `wp-config.example.php` documents `/home/hamza/.gemreserve-wp-db.env` as "staging only … cannot reach production". It holds production credentials. Either the file or the documentation should change. |
| **Recovery time** | The restore procedure was exercised twice successfully but never timed. A recovery time nobody has measured is one nobody can promise. |

---

## 4. Deployment order

Each step is independently reversible, and each is verifiable before the next.

| # | Step | Verify | Rollback |
|--:|---|---|---|
| 1 | Back up database, `wp-content`, and configuration **as root** | All four checks in `CMS_BACKUP_AND_ROLLBACK.md` §1 | — |
| 2 | Capture the route baseline | 58 routes at HTTP 200 | — |
| 3 | Install theme + both plugins; **do not activate** the CMS plugin | Site unchanged | Restore files |
| 4 | Copy `gemreserve.css` into the theme | Site unchanged | — |
| 5 | Activate `gemreserve-visual-cms` | Site unchanged — activation does not migrate | Deactivate |
| 6 | `wp gemreserve migrate` (dry run) | Every row reads `identical=yes` | — nothing written |
| 7 | `wp gemreserve migrate --apply` | 58/58 routes identical to the baseline | `wp gemreserve rollback --apply` |
| 8 | Spot-check the editor as a marketing user | Sections visible and editable | Deactivate the plugin |
| 9 | *(Only if separately authorised)* deploy the Next.js renderer and switch the vhost | Parity suite, then route comparison | Switch the vhost back |

**Stop at step 8** unless the Next.js cutover has its own authorisation. Steps 1–8 leave WordPress as the public renderer, which is what it is today.

---

## 5. Smoke tests

```bash
# The contract and migration state.
curl -sS "$SITE/wp-json/gemreserve/v1/health"
# pagesMigrated must equal pagesWithLegacyBody

# Every migrated page still renders as its pre-migration snapshot.
wp gemreserve verify

# Every route, byte for byte, against the pre-deployment baseline.
tools/compare-routes.sh capture "$SITE" routes.txt ./after
tools/compare-routes.sh compare ./baseline ./after routes.txt

# Non-public content stays non-public.
curl -sS -o /dev/null -w '%{http_code}\n' \
  "$SITE/wp-json/gemreserve/v1/page?route=/some-draft-slug/"     # expect 404

# The shared webhook secret agrees on both sides.
# → {"valid":true,"reason":"ok"}
```

Then, by eye: open one page in the editor as a Marketing Publisher, change a word, publish, and confirm it on the public page. That single round trip exercises the editor, the save path, the markup policy, the renderer and the cache in one action.

---

## 6. Rollback triggers

Roll back immediately, without investigating first, on:

- any public route returning non-200
- visibly wrong markup on a page (for example literal `u003cp` text)
- content missing from a page that had it
- the block editor failing to load for a marketing user
- any unintended change to SEO metadata

The first lever is `wp plugin deactivate gemreserve-visual-cms` — seconds, no database change, and the site renders exactly as it does today.

---

## 7. Recommendation

**Technically ready for authorised production deployment; not yet accepted.**

The engineering is complete and verified: the migration reproduces all 58 routes byte for byte, it is idempotent and reversible, the security findings are fixed and regression-tested, and both renderers agree section by section.

What is missing is not engineering. It is a marketing user working through the eleven acceptance tests and signing off (BLOCKER-1), and an explicit production authorisation (BLOCKER-2). BLOCKER-3 and BLOCKER-4 are pre-existing conditions of the production environment that must be resolved before *any* deployment, not only this one, and BLOCKER-5 simply means re-running the dry run against current content on the day.
