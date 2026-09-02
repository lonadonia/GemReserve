<?php
/**
 * Editorial audit log.
 *
 * §19 asks for important editorial actions to be audited. What is recorded here
 * is who did what to which page and when — enough to answer "when did this copy
 * change and who changed it", which is the question that actually gets asked
 * after a page goes out wrong.
 *
 * What is deliberately *not* recorded: the content itself. WordPress already
 * keeps revisions, which are a better record of content than a log line, and
 * copying page bodies into an option would duplicate the data, bloat the table
 * and put draft copy somewhere with no access control of its own.
 *
 * No personal data beyond the WordPress user ID and display name is stored. No
 * IP addresses: they are personal data under GDPR, this is a Lithuanian
 * company, and an editorial audit trail does not need them.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Audit
{
    private const OPTION = 'gemreserve_vcms_audit';

    /** Entries kept. Old ones fall off the end rather than growing without limit. */
    private const LIMIT = 500;

    public static function boot(): void
    {
        add_action('transition_post_status', [self::class, 'on_status'], 10, 3);
        add_action('gemreserve_vcms_migrated', [self::class, 'on_migrated'], 10, 2);
        add_action('gemreserve_vcms_rolled_back', [self::class, 'on_rollback'], 10, 1);
        add_action('wp_restore_post_revision', [self::class, 'on_restore'], 10, 2);
    }

    public static function on_status(string $new, string $old, \WP_Post $post): void
    {
        if (!in_array($post->post_type, ['page', 'gemstone', 'gr_news'], true)) {
            return;
        }
        if ($new === $old || $new === 'auto-draft' || $old === 'auto-draft') {
            return;
        }

        self::record('status', $post->ID, sprintf('%s → %s', $old, $new));
    }

    public static function on_migrated(int $post_id, array $stats): void
    {
        self::record('migrated', $post_id, sprintf(
            '%d blocks, %d fields, %d card groups',
            (int) ($stats['blocks'] ?? 0),
            (int) ($stats['slots'] ?? 0),
            (int) ($stats['repeatables'] ?? 0)
        ));
    }

    public static function on_rollback(int $post_id): void
    {
        self::record('rolled_back', $post_id, 'restored pre-migration body');
    }

    public static function on_restore(int $post_id, int $revision_id): void
    {
        self::record('revision_restored', $post_id, 'revision #' . $revision_id);
    }

    public static function record(string $action, int $post_id, string $detail = ''): void
    {
        $user = wp_get_current_user();

        $entry = [
            'at' => gmdate('c'),
            'action' => $action,
            'post' => $post_id,
            'slug' => (string) get_post_field('post_name', $post_id),
            'user' => $user->ID ?: 0,
            'name' => $user->ID ? $user->display_name : 'system',
            'detail' => $detail,
        ];

        $log = get_option(self::OPTION, []);
        if (!is_array($log)) {
            $log = [];
        }
        $log[] = $entry;
        if (count($log) > self::LIMIT) {
            $log = array_slice($log, -self::LIMIT);
        }

        // autoload=false: this grows, and it is read only on the audit screen.
        update_option(self::OPTION, $log, false);
    }

    /** @return array<int,array<string,mixed>> Newest first. */
    public static function entries(int $limit = 100): array
    {
        $log = get_option(self::OPTION, []);
        if (!is_array($log)) {
            return [];
        }

        return array_slice(array_reverse($log), 0, $limit);
    }
}
