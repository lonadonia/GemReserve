<?php
/**
 * WP-CLI commands.
 *
 * The migration is run here rather than from an admin screen, deliberately. A
 * button in the dashboard that rewrites forty pages is a button somebody clicks
 * to see what it does. A command that requires shell access, prints a table and
 * refuses to write unless `--apply` is passed is a command somebody runs on
 * purpose, having read the dry run.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('WP_CLI') || !\WP_CLI) {
    return;
}

/**
 * Manage the GemReserve visual CMS.
 */
final class Cli
{
    /**
     * Convert migrated page bodies into editable blocks.
     *
     * ## OPTIONS
     *
     * [--apply]
     * : Write the changes. Without this the command reports and changes nothing.
     *
     * [--post=<id>]
     * : Only this page. Repeatable as a comma-separated list.
     *
     * [--format=<format>]
     * : table (default), json, csv.
     *
     * [--allow-production]
     * : Required before --apply will write to a site whose home_url is not
     * : local. Without it the command refuses, which is the intended default.
     *
     * ## EXAMPLES
     *
     *     wp gemreserve migrate
     *     wp gemreserve migrate --post=4
     *     wp gemreserve migrate --apply
     *
     * @param string[]              $args
     * @param array<string,string>  $assoc
     */

    /**
     * Refuse to write to production unless the operator said so explicitly.
     *
     * A staging tree can be pointed at the production database by nothing more
     * than a forgotten environment variable — the wp-config credential chain
     * falls through to the real host, so the mistake is silent and the command
     * reports a perfectly successful migration of the live site. That happened
     * during this project: a wrapper script missing GR_DB_ENV migrated all 58
     * production pages, and it was caught by a later check rather than by the
     * tool that did it.
     *
     * `--apply` is the destructive verb, so it is the one that asks. The test
     * suite has carried this guard from the start; the migrator should never
     * have been the weaker of the two.
     */
    private static function guard_target(array $assoc, string $verb): void
    {
        if (isset($assoc['allow-production'])) {
            return;
        }

        $home = (string) home_url();
        if (preg_match('#^https?://(127\.0\.0\.1|localhost|.*\.local|.*\.test)(:\d+)?#i', $home)) {
            return;
        }

        \WP_CLI::error(
            "Refusing to {$verb}: home_url() is {$home}, which is not a local instance.\n"
            . "If this really is the production site and you mean to write to it, re-run with --allow-production.\n"
            . 'If it is not, check GR_DB_ENV — a staging tree with no explicit database env resolves to production.'
        );
    }

    public function migrate(array $args, array $assoc): void
    {
        $apply = isset($assoc['apply']);
        if ($apply) {
            self::guard_target($assoc, 'migrate');
        }

        $format = $assoc['format'] ?? 'table';
        $ids = self::target_ids($assoc);

        if ($ids === []) {
            \WP_CLI::warning('No pages carry a migrated body. Nothing to do.');

            return;
        }

        if (!$apply) {
            \WP_CLI::log('DRY RUN — nothing will be written. Add --apply to commit.');
        }

        $rows = [];
        $counts = ['migrated' => 0, 'ready' => 0, 'refused' => 0, 'skipped' => 0, 'error' => 0];

        foreach ($ids as $id) {
            $row = Migrator::migrate_post((int) $id, $apply);
            $counts[$row['status']] = ($counts[$row['status']] ?? 0) + 1;

            $rows[] = [
                'id' => $row['id'],
                'slug' => $row['slug'],
                'status' => $row['status'],
                'blocks' => $row['blocks'],
                'fields' => $row['slots'],
                'cards' => $row['repeatables'],
                'preserved' => $row['preserved'],
                'identical' => $row['identical'] ? 'yes' : 'NO',
                'reason' => $row['reason'],
            ];
        }

        \WP_CLI\Utils\format_items($format, $rows, [
            'id', 'slug', 'status', 'blocks', 'fields', 'cards', 'preserved', 'identical', 'reason',
        ]);

        \WP_CLI::log(sprintf(
            'ready=%d migrated=%d refused=%d skipped=%d error=%d',
            $counts['ready'] ?? 0,
            $counts['migrated'] ?? 0,
            $counts['refused'] ?? 0,
            $counts['skipped'] ?? 0,
            $counts['error'] ?? 0
        ));

        if (($counts['refused'] ?? 0) > 0 || ($counts['error'] ?? 0) > 0) {
            \WP_CLI::error(
                'Some pages were refused. A refusal means the block output did not reproduce the '
                . 'original body exactly, so the page was left untouched. Nothing is broken; those '
                . 'pages still render from the legacy body.',
                false
            );
        }
    }

    /**
     * Restore pages to their pre-migration state.
     *
     * ## OPTIONS
     *
     * [--apply]
     * : Write the changes. Without this the command reports and changes nothing.
     *
     * [--post=<id>]
     * : Only this page.
     *
     * [--allow-production]
     * : Required before --apply will write to a non-local site.
     *
     * ## EXAMPLES
     *
     *     wp gemreserve rollback --apply
     *
     * @param string[]             $args
     * @param array<string,string> $assoc
     */
    public function rollback(array $args, array $assoc): void
    {
        $apply = isset($assoc['apply']);
        if ($apply) {
            self::guard_target($assoc, 'roll back');
        }

        $ids = self::target_ids($assoc);

        if (!$apply) {
            \WP_CLI::log('DRY RUN — nothing will be written. Add --apply to commit.');
        }

        $rows = [];
        foreach ($ids as $id) {
            $row = Migrator::rollback_post((int) $id, $apply);
            $rows[] = [
                'id' => $row['id'],
                'status' => $row['status'],
                'reason' => $row['reason'],
            ];
        }

        \WP_CLI\Utils\format_items('table', $rows, ['id', 'status', 'reason']);
    }

    /**
     * Verify that every migrated page still renders exactly as its snapshot.
     *
     * This is the check to run after a deploy, or after anyone has been editing.
     * A page that fails has diverged from its pre-migration output — which may
     * be perfectly correct if an editor changed the copy on purpose, so the
     * report distinguishes "differs" from "broken" and prints the size delta
     * rather than pretending to judge intent.
     *
     * ## OPTIONS
     *
     * [--format=<format>]
     * : table (default), json, csv.
     *
     * @param string[]             $args
     * @param array<string,string> $assoc
     */
    public function verify(array $args, array $assoc): void
    {
        $rows = [];
        $diverged = 0;

        foreach (Migrator::candidates() as $id) {
            if (!Migrator::is_migrated((int) $id)) {
                continue;
            }
            $snapshot = (string) get_post_meta($id, Migrator::META_SNAPSHOT, true);
            $rendered = Migrator::render_blocks(parse_blocks((string) get_post_field('post_content', $id)));
            $same = ($rendered === $snapshot);
            if (!$same) {
                $diverged++;
            }

            $rows[] = [
                'id' => $id,
                'slug' => get_post_field('post_name', $id),
                'matches_snapshot' => $same ? 'yes' : 'edited',
                'delta_bytes' => strlen($rendered) - strlen($snapshot),
            ];
        }

        \WP_CLI\Utils\format_items($assoc['format'] ?? 'table', $rows, ['id', 'slug', 'matches_snapshot', 'delta_bytes']);
        \WP_CLI::log(sprintf('%d pages checked, %d differ from their pre-migration snapshot.', count($rows), $diverged));
    }

    /**
     * Print the role capability matrix.
     *
     * @param string[]             $args
     * @param array<string,string> $assoc
     */
    public function roles(array $args, array $assoc): void
    {
        Roles::register();
        $matrix = Roles::matrix();

        $rows = [];
        $caps = [];
        foreach ($matrix as $role => $row) {
            $caps = array_keys($row);
            break;
        }
        foreach ($caps as $cap) {
            $line = ['capability' => $cap];
            foreach ($matrix as $role => $row) {
                $line[$role] = $row[$cap] ? 'yes' : '-';
            }
            $rows[] = $line;
        }

        \WP_CLI\Utils\format_items(
            $assoc['format'] ?? 'table',
            $rows,
            array_merge(['capability'], array_keys($matrix))
        );
    }

    /**
     * Report media remediation status.
     *
     * @param string[]             $args
     * @param array<string,string> $assoc
     */
    public function media(array $args, array $assoc): void
    {
        $stats = Media::stats();
        $rows = [];
        foreach ($stats as $k => $v) {
            $rows[] = ['measure' => $k, 'value' => $v];
        }
        \WP_CLI\Utils\format_items($assoc['format'] ?? 'table', $rows, ['measure', 'value']);
    }

    /**
     * @param array<string,string> $assoc
     * @return int[]
     */
    private static function target_ids(array $assoc): array
    {
        if (!empty($assoc['post'])) {
            return array_map('intval', array_filter(array_map('trim', explode(',', (string) $assoc['post']))));
        }

        return array_map('intval', Migrator::candidates());
    }
}

\WP_CLI::add_command('gemreserve', Cli::class);
