# CMS Backup and Rollback

**Nothing in this document has been executed against production.** Every result recorded here comes from an isolated staging instance. Production deployment is prohibited under §29 until separately authorised.

---

## 1. What "verified" means here

A backup nobody has restored is a hypothesis. §21 is explicit that file existence is not evidence, so every backup taken for this work was checked four ways:

1. **Readable** — `sha256sum -c` on the recorded checksum.
2. **Complete** — the dump ends with `Dump completed on …`, and `CREATE TABLE` appears 27 times.
3. **Restorable** — loaded into a second, empty database.
4. **Correct** — the restored copy queried for the content that should be there.

### Evidence from this work

```
dump      prod-wp-20260902T013102Z.sql          3,175,776 bytes
sha256    f0dbce92179764803dc26c38fc40fac87c0193fa3edf579b14965a3a9d32e20e
tables    27
tail      -- Dump completed on 2026-09-02  1:31:02
```

Restored into the isolated MySQL instance on port 13306 and queried:

```
post_type      count
nav_menu_item  153
page            40
revision        37
gemstone        18
```

That restore was then used as the working staging instance for this entire engagement — the strongest possible evidence that it is usable, since every migration run, every test and every screenshot came out of it.

It was restored a **second** time mid-engagement, to reset content that the acceptance tests had deliberately mutated. That second restore also produced a working instance, and the 58-route fidelity comparison was re-run against it from scratch: **58 / 58 byte-identical**.

### A benign warning to expect

```
mysqldump: Error: 'Access denied; you need (at least one of) the PROCESS privilege(s)
for this operation' when trying to dump tablespaces
```

The application database user does not hold `PROCESS`. Tablespace metadata is not needed for a logical restore, and the dump is complete — checked by the four steps above. It is recorded here so nobody treats a working backup as a failed one.

---

## 2. Taking a backup

```bash
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
cd /var/www/GemReserve/wordpress

mysqldump --single-transaction --quick --routines --triggers --set-gtid-purged=OFF \
  "$DB_NAME" > "wp-$STAMP.sql"
sha256sum "wp-$STAMP.sql" > "wp-$STAMP.sql.sha256"

tar -czf "wp-content-$STAMP.tar.gz" wp-content/themes wp-content/plugins wp-content/uploads
sha256sum "wp-content-$STAMP.tar.gz" > "wp-content-$STAMP.tar.gz.sha256"

# The current route and SEO surface, so a later comparison has something to
# compare against.
wp post list --post_type=page     --post_status=publish --field=url >  "routes-$STAMP.txt"
wp post list --post_type=gemstone --post_status=publish --field=url >> "routes-$STAMP.txt"
```

`--single-transaction` keeps the dump consistent without locking the site; all tables are InnoDB.

### Verify before relying on it

```bash
sha256sum -c "wp-$STAMP.sql.sha256"
sha256sum -c "wp-content-$STAMP.tar.gz.sha256"
tar -tzf "wp-content-$STAMP.tar.gz" >/dev/null && echo "archive readable"
tail -1 "wp-$STAMP.sql" | grep -q 'Dump completed' && echo "dump complete"
grep -c 'CREATE TABLE' "wp-$STAMP.sql"

# And restore it somewhere isolated before trusting it.
mysql -h127.0.0.1 -P13306 -uroot -e "CREATE DATABASE restore_check"
mysql -h127.0.0.1 -P13306 -uroot restore_check < "wp-$STAMP.sql"
mysql -h127.0.0.1 -P13306 -uroot restore_check \
  -e "SELECT post_type, COUNT(*) FROM gr_posts GROUP BY post_type"
mysql -h127.0.0.1 -P13306 -uroot -e "DROP DATABASE restore_check"
```

### What a backup must include

| | Covered by |
|---|---|
| Database | `wp-$STAMP.sql` |
| Theme | `wp-content-$STAMP.tar.gz` |
| Plugins | same — **including the two that are not in Git** (see §6) |
| Uploads | same |
| Next.js source | Git, plus `/var/www/GemReserve/releases/` |
| Configuration | `wp-config.php`, `wp-salts.php`, `/etc/gemreserve/wordpress.env` — **root-owned; a backup run as the deploy user will silently miss them** |
| Routes and SEO | `routes-$STAMP.txt` |

---

## 3. Rollback, fastest first

### Level 1 — Deactivate the plugin (seconds, no data change)

**This is the lever to reach for first in an incident.**

```bash
wp plugin deactivate gemreserve-visual-cms
```

The theme's `gemreserve_body_is_blocks()` checks for the plugin's class and returns false when it is absent, so every page immediately renders from `_gr_body_html` — which is still on every row, because the migration never deletes it.

No database change, no deploy, no content loss. Verified on staging.

### Level 2 — Roll back the content (one command)

```bash
wp gemreserve rollback           # dry run
wp gemreserve rollback --apply
```

Restores `_gr_body_html` from the snapshot, empties `post_content`, clears the migrated flag. From the snapshot, not from a reconstruction — a rollback that has to compute its way back can fail the same way the migration did.

Verified on staging: **58 / 58 routes byte-identical to the pre-migration baseline.**

### Level 3 — Roll back the code

```bash
cd /var/www/GemReserve/GemReserve
git checkout main                        # f3a46ad, the pre-remediation baseline
bash wordpress/deploy/deploy.sh          # redeploys theme and plugins
```

**Read §6 before doing this.** A Git checkout does not restore the two plugins that are not in Git, and one of them is load-bearing for the site's responsive layout.

### Level 4 — Restore the database

```bash
wp db import "wp-$STAMP.sql"
# or:
mysql "$DB_NAME" < "wp-$STAMP.sql"
```

Loses any content authored since the backup. Levels 1–3 do not, which is why they come first.

### Level 5 — Switch the public renderer back to Next.js

The rollback service is already running on `127.0.0.1:3000` (`gemreserve-next.service`, release `2026-08-29-164814`). Switching the vhost to it is a **CloudPanel** change; `/etc/nginx` is not readable by the deploy account and the expected vhost path in the brief does not exist. Whoever holds CloudPanel access must make this change, and the path must be established before it is needed rather than during an incident.

### Cache

After any rollback, invalidate the renderer's cache — otherwise it serves the version it last fetched:

```bash
BODY='{"routes":["*"],"eventId":"rollback-'$(date +%s)'"}'
TS=$(date +%s)
SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -r | cut -d' ' -f1)
curl -X POST "$RENDERER/api/revalidate" \
  -H 'Content-Type: application/json' \
  -H "X-GemReserve-Timestamp: $TS" -H "X-GemReserve-Signature: sha256=$SIG" \
  --data "$BODY"
```

---

## 4. Rollback triggers

Roll back — do not investigate first — on any of:

- a public route returning non-200
- a page rendering visibly wrong markup (for example literal `u003cp` text)
- content missing from a page that had it
- the block editor failing to load for a marketing user
- any change to the site's SEO metadata that was not intended

Investigate first, rollback second, on:

- a webhook delivery failure (content is correct in WordPress; the site is at most a few minutes stale)
- a single section rendering oddly on one page
- a slow admin screen

---

## 5. What makes rollback cheap here

Three design decisions, each of which cost something at build time:

**`_gr_body_html` is never deleted.** The migration writes a snapshot and leaves the original in place, so a rollback is a metadata flip rather than a restore from a file. The cost is a duplicated body on every row — about 1 MB across the site, which is nothing next to being able to undo without a backup.

**The theme asks the plugin, not the content.** `gemreserve_body_is_blocks()` checks for the plugin's class, so deactivating the plugin *is* a rollback of rendering. Sniffing `post_content` for a block comment would have been simpler and would have made deactivation produce a blank page.

**Migration is idempotent and verified before it writes.** Re-running is safe, and a page that cannot be reproduced byte-for-byte is refused rather than written — so the state you roll back *from* is always one that was checked.

---

## 6. Two things that will surprise whoever does this

### A Git rollback removes plugins that are not in Git

`circumflex-booking` and `gemreserve-leadership-profiles` are active on production and in no commit. `gemreserve-leadership-profiles` enqueues a stylesheet described as repairing "the responsive public site shell" on **every** public route, and it is the only place the mandated director identity appears.

Rolling back with `git checkout` and redeploying will remove both. **Take a filesystem backup of `wp-content/plugins` before any code rollback**, and restore those two directories afterwards.

See `CMS_CURRENT_STATE_AUDIT.md` DRIFT-1 and IDENT-1.

### A backup run as the deploy user misses the configuration

`wp-config.php`, `wp-salts.php` and `/etc/gemreserve/wordpress.env` are root-owned. A backup script running as `hamza` reads none of them and will not say so. Configuration must be backed up as root, separately.

---

## 7. Restore drill

Run this before the production deployment, not after an incident starts.

1. Take a full backup and verify it by all four steps in §1.
2. Restore it into an isolated database.
3. Point a staging WordPress at that database.
4. Capture all 58 routes and compare against production's current output.
5. Record the elapsed time — that is the real recovery time, and it is the number that matters.

Steps 1–4 were performed twice during this engagement, both times successfully. Step 5 was not timed and should be, because a recovery time nobody has measured is a recovery time nobody can promise.
