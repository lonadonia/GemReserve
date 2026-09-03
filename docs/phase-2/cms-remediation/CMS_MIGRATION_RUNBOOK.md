# CMS Migration Runbook

How to convert the migrated page bodies into editable blocks, verify the result, and undo it.

**This runbook has not been executed against production.** Every figure in it comes from an isolated staging instance restored from a verified production dump. Production deployment is prohibited under §29 until separately authorised.

---

## 1. What the migration does

For each page and gemstone that carries a `_gr_body_html` blob:

1. Parses the body into a tree of blocks (`Decomposer`).
2. Renders that tree back and **compares it byte for byte with the original**.
3. Serialises the tree to block markup and re-renders the *stored* form, comparing again.
4. Only if both comparisons pass: snapshots the original body, writes `post_content`, and records provenance.

Steps 2 and 3 are preconditions inside the write path, not tests that run elsewhere. The failure mode is *"page 33 was skipped and here is why"*, never *"page 33 is subtly wrong and nobody noticed"*.

### What it does not do

- It does not delete `_gr_body_html`. Rollback is a metadata flip, not a restore from a file.
- It does not create, delete or re-slug anything. Posts are updated in place, so IDs, slugs, parents, dates, status, SEO meta and permalinks are untouched by construction.
- It does not run on plugin activation. Migration is a deliberate act.

---

## 2. Preconditions

| | Requirement |
|---|---|
| Backup | A verified database dump. "Verified" means restored into a second instance and queried — not that the file exists. §6 below. |
| Plugin | `gemreserve-visual-cms` present and activated. |
| Theme | The `gemreserve` theme updated: `page.php`, `front-page.php`, `single-gemstone.php` and `functions.php` carry the block-rendering branch. |
| Access | Shell access with WP-CLI. There is no admin-screen button, deliberately: a button that rewrites 58 pages is a button somebody clicks to see what it does. |
| Baseline | A pre-migration capture of all 58 routes. §3. |

---

## 3. Capture the baseline first

The whole safety argument rests on being able to compare after with before.

```bash
PLUGIN=wordpress/plugins/gemreserve-visual-cms

# The 58 public routes, from the site itself.
wp post list --post_type=page     --post_status=publish --field=url > routes.txt
wp post list --post_type=gemstone --post_status=publish --field=url >> routes.txt
sed -i "s|$(wp option get home)||" routes.txt
sort -u routes.txt -o routes.txt
wc -l routes.txt          # expect 58

$PLUGIN/tools/compare-routes.sh capture "$(wp option get home)" routes.txt ./baseline
```

---

## 4. Dry run

```bash
wp gemreserve migrate
```

Writes nothing. Prints one row per page:

```
id  slug         status  blocks  fields  cards  preserved  identical  reason
4   home         ready   48      131     1      0          yes
...
ready=58 migrated=0 refused=0 skipped=0 error=0
```

**Read the `identical` column before going further.** Anything other than `yes` on every row means stop.

| Status | Meaning | Action |
|---|---|---|
| `ready` | Verified; would be written by `--apply`. | Proceed. |
| `refused` | Output did not reproduce the original body. **Page left untouched.** | Investigate. Nothing is broken — the page still renders from the legacy body. |
| `skipped` | No migrated body on this page. | Normal for a page authored after the original migration. |
| `error` | WordPress rejected the write. | Read the reason. |

Staging result, 2026-09-02: **58 ready, 0 refused, 0 skipped, 0 error.**

Save the report as evidence:

```bash
wp gemreserve migrate --format=csv > migration-dry-run.csv
```

---

## 5. Apply

```bash
wp gemreserve migrate --apply
```

Per page, `--apply` additionally: writes the snapshot (once), records the source checksum and a provenance stamp, and updates `post_content` — which also creates a WordPress revision, so the pre-migration state is recoverable through the editor's own Revisions panel as well as through this plugin's rollback.

### Verify immediately

```bash
$PLUGIN/tools/compare-routes.sh capture "$(wp option get home)" routes.txt ./after
$PLUGIN/tools/compare-routes.sh compare ./baseline ./after routes.txt
```

Expected: `identical: 58   differ: 0   missing: 0`.

The comparison normalises exactly two values, both time-varying by design and both named in the tool: `gr_nonce` (CSRF nonce) and `gr_t` (form issue timestamp). Nothing else — whitespace, attribute order, `srcset` contents and generated element ids are compared exactly.

```bash
wp gemreserve verify
```

Re-renders every migrated page's stored blocks and compares with its snapshot. A page that has since been *edited* shows as `edited` with a byte delta, which is correct and expected once marketing starts work; immediately after migration everything should read `yes`.

---

## 6. Backups, and what "verified" means

A backup nobody has restored is a hypothesis.

```bash
STAMP=$(date -u +%Y%m%dT%H%M%SZ)

mysqldump --single-transaction --quick --routines --triggers \
  --set-gtid-purged=OFF "$DB_NAME" > "wp-$STAMP.sql"
sha256sum "wp-$STAMP.sql" > "wp-$STAMP.sql.sha256"

tar -czf "wp-content-$STAMP.tar.gz" wp-content/themes wp-content/plugins wp-content/uploads
sha256sum "wp-content-$STAMP.tar.gz" > "wp-content-$STAMP.tar.gz.sha256"
```

Then **prove they are readable**:

```bash
sha256sum -c "wp-$STAMP.sql.sha256"
sha256sum -c "wp-content-$STAMP.tar.gz.sha256"
tar -tzf "wp-content-$STAMP.tar.gz" >/dev/null && echo "archive readable"
tail -1 "wp-$STAMP.sql" | grep -q "Dump completed" && echo "dump complete"
grep -c 'CREATE TABLE' "wp-$STAMP.sql"          # expect 27
```

And restore it somewhere isolated:

```bash
mysql -h127.0.0.1 -P13306 -uroot -e "CREATE DATABASE restore_check"
mysql -h127.0.0.1 -P13306 -uroot restore_check < "wp-$STAMP.sql"
mysql -h127.0.0.1 -P13306 -uroot restore_check \
  -e "SELECT post_type, COUNT(*) FROM gr_posts GROUP BY post_type"
```

This was done for this work; see `CMS_BACKUP_AND_ROLLBACK.md` for the results.

`mysqldump` will warn `Access denied; you need the PROCESS privilege … when trying to dump tablespaces`. That is benign — tablespace metadata is not needed for a logical restore — and the dump is complete. It is recorded here so nobody treats it as a failed backup.

---

## 7. Rollback

```bash
wp gemreserve rollback              # dry run
wp gemreserve rollback --apply
```

Restores `_gr_body_html` from the snapshot, empties `post_content`, and clears the migrated flag. The theme's `gemreserve_body_is_blocks()` then returns false and the page renders from the legacy body exactly as before.

It restores **from the snapshot, not from a reconstruction**: a rollback that has to compute its way back can fail the same way the migration did.

Verify:

```bash
$PLUGIN/tools/compare-routes.sh capture "$(wp option get home)" routes.txt ./rolledback
$PLUGIN/tools/compare-routes.sh compare ./baseline ./rolledback routes.txt
```

Staging result: **58 identical, 0 differ**.

### The larger rollback

Deactivating `gemreserve-visual-cms` is itself a complete rollback of rendering, without touching content. `gemreserve_body_is_blocks()` checks for the plugin's class and returns false when it is absent, so the theme reverts to the legacy body — which is still on every row, because the migration never deletes it.

That is the fastest lever in an incident: **deactivate the plugin**, and the site renders as it did before, with no database change.

---

## 8. Idempotency

Running `--apply` twice produces identical `post_content` — verified by comparing SHA-256 of all 58 rows across two runs.

The snapshot is written once and read in preference to the live meta on subsequent runs, so a second migration reads exactly what the first one did even after the first has rewritten the page.

---

## 9. Migrating content added after the migration

A page authored later has no `_gr_body_html` and is authored in blocks from the start — it shows as `skipped`, which is correct.

**A note on production drift.** Between this work's baseline snapshot (2026-09-02 01:31 UTC) and the time of writing, fifteen pages and two gemstone records were added to production by another party. They are not in the staging copy and have not been through this migration. Before the production run, re-take the snapshot and re-run the dry run so the report covers what is actually there. See `CMS_CURRENT_STATE_AUDIT.md` DRIFT-3.

---

## 10. What can go wrong, and what it looks like

| Symptom | Cause | Response |
|---|---|---|
| A page reports `refused` | Its body does not survive the round trip | Nothing is broken; the page still renders from the legacy body. Capture the body and investigate offline. |
| Pages render as literal `u003cp…` text | Content was written without `wp_slash` | Not reachable through the shipped command — `Migrator` slashes. If seen, roll back and report it as a defect. |
| `sizes="auto, …"` appears in the output | The body was rendered through `the_content()` | The theme must call `gemreserve_render_block_body()`. Check the template. |
| Sections vanish from a page | A `hidden` flag was set in the editor | That is the "hide this section" feature working. Unhide it in the editor. |
| Editor shows an empty canvas | The page is not migrated | The admin notice says so. Run the migration for that page. |

---

## 11. Command reference

| Command | Purpose |
|---|---|
| `wp gemreserve migrate` | Dry run. Writes nothing. |
| `wp gemreserve migrate --apply` | Convert. |
| `wp gemreserve migrate --post=41` | One page. |
| `wp gemreserve migrate --format=csv` | Machine-readable report. |
| `wp gemreserve rollback [--apply]` | Restore pre-migration bodies. |
| `wp gemreserve verify` | Re-render every migrated page and compare with its snapshot. |
| `wp gemreserve roles` | Print the capability matrix. |
| `wp gemreserve media` | Media remediation status. |
| `tools/compare-routes.sh` | Capture and compare all routes. |
| `tools/inventory.php` | Regenerate the block inventory. |
| `tests/run-tests.php` | The WordPress test suite (132 assertions). |
