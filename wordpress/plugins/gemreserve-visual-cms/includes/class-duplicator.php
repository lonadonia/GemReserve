<?php
/**
 * Duplicate a page or gemstone.
 *
 * WordPress has no duplicate function. A marketing user who wants to build a
 * new page from an existing one has, until now, had to open both side by side
 * and copy blocks across — which is exactly the manual, error-prone work this
 * project exists to remove. It is on the client's list ("duplicate an existing
 * page safely") and it was the one item on that list the admin genuinely could
 * not do.
 *
 * Four decisions shape this, and each is a safety property rather than a
 * preference.
 *
 * **The copy is always a draft.** Never published, never scheduled, whatever
 * the source was. Duplicating is how somebody explores an idea; it must not put
 * a second copy of a live page in front of visitors, and it must not create a
 * duplicate URL competing with the original in search results.
 *
 * **The copy is not "migrated".** `_gr_vcms_migrated`, `_gr_vcms_legacy_body`
 * and `_gr_vcms_source_sha256` record that a specific post's body was converted
 * from a specific legacy blob and verified byte-identical against it. A copy
 * has no such history. Carrying the provenance across would make
 * `wp gemreserve verify` compare the copy against the original's snapshot and
 * report a page that was never migrated as if it had been. The copy is a
 * perfectly ordinary block page, which is what it is.
 *
 * **A user without the record capability gets a copy with the asset record
 * stripped.** Copying a gemstone would otherwise be a way around
 * `GemstonePolicy`: a marketing user cannot set `evidence_state` to `verified`,
 * but could duplicate a stone that already is, and inherit the claim on a new
 * page. The protected fields are simply not copied, so the copy starts at the
 * schema defaults — illustrative, not scheduled — and renders the standing
 * "not a record of a stone held today" notice until somebody with the
 * capability fills it in.
 *
 * **Capabilities are checked against the real post.** `create_*` for the target
 * type and `edit_post` on the source, so a user who cannot read a private page
 * cannot copy its contents out of it.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Duplicator
{
    public const ACTION = 'gemreserve_duplicate';
    public const NONCE = 'gemreserve_duplicate_post';

    /** Post types offered a Duplicate action. */
    public const TYPES = ['page', 'gemstone'];

    /**
     * Meta that must never be carried onto a copy.
     *
     * The migration provenance, the editor's own transient state, and anything
     * that identifies the *original* rather than describing content.
     */
    public const NEVER_COPY = [
        '_gr_vcms_migrated',
        '_gr_vcms_legacy_body',
        '_gr_vcms_source_sha256',
        '_gr_body_html',
        '_edit_lock',
        '_edit_last',
        '_wp_old_slug',
        '_wp_old_date',
    ];

    public static function boot(): void
    {
        add_filter('page_row_actions', [self::class, 'row_action'], 10, 2);
        add_filter('post_row_actions', [self::class, 'row_action'], 10, 2);
        add_action('admin_action_' . self::ACTION, [self::class, 'handle']);
        add_action('admin_notices', [self::class, 'notice']);
    }

    /**
     * Add "Duplicate" beside Edit / Quick Edit / Trash.
     *
     * @param array<string,string> $actions
     * @return array<string,string>
     */
    public static function row_action(array $actions, \WP_Post $post): array
    {
        if (!in_array($post->post_type, self::TYPES, true) || !self::user_may_duplicate($post)) {
            return $actions;
        }

        $url = wp_nonce_url(
            admin_url('admin.php?action=' . self::ACTION . '&post=' . $post->ID),
            self::NONCE . '_' . $post->ID
        );

        $actions['gemreserve_duplicate'] = sprintf(
            '<a href="%s" aria-label="%s">%s</a>',
            esc_url($url),
            esc_attr(sprintf(
                /* translators: %s: post title */
                __('Duplicate “%s” as a new draft', 'gemreserve-visual-cms'),
                get_the_title($post)
            )),
            esc_html__('Duplicate', 'gemreserve-visual-cms')
        );

        return $actions;
    }

    /** May the current user copy this post into a new one? */
    public static function user_may_duplicate(\WP_Post $post): bool
    {
        $type = get_post_type_object($post->post_type);
        if (!$type) {
            return false;
        }

        $create = $type->cap->create_posts ?? $type->cap->edit_posts;

        return current_user_can($create) && current_user_can('edit_post', $post->ID);
    }

    /** The admin action behind the row link. */
    public static function handle(): void
    {
        $source_id = isset($_GET['post']) ? (int) $_GET['post'] : 0;
        $post = $source_id ? get_post($source_id) : null;

        if (!$post instanceof \WP_Post || !in_array($post->post_type, self::TYPES, true)) {
            wp_die(esc_html__('Nothing to duplicate.', 'gemreserve-visual-cms'), '', ['response' => 404]);
        }

        check_admin_referer(self::NONCE . '_' . $source_id);

        if (!self::user_may_duplicate($post)) {
            wp_die(
                esc_html__('You are not allowed to duplicate this item.', 'gemreserve-visual-cms'),
                '',
                ['response' => 403]
            );
        }

        $new_id = self::duplicate($source_id);

        if (is_wp_error($new_id)) {
            wp_safe_redirect(add_query_arg(
                ['post_type' => $post->post_type, 'gr_duplicated' => 'error'],
                admin_url('edit.php')
            ));
            exit;
        }

        // Straight into the editor on the copy. Duplicating is the first half
        // of an edit; making the user hunt for the draft afterwards is not.
        wp_safe_redirect(add_query_arg('gr_duplicated', '1', get_edit_post_link($new_id, 'raw')));
        exit;
    }

    /**
     * Copy a post into a new draft.
     *
     * @return int|\WP_Error the new post id
     */
    public static function duplicate(int $source_id)
    {
        $post = get_post($source_id);
        if (!$post instanceof \WP_Post) {
            return new \WP_Error('gemreserve_duplicate_missing', 'Source post not found.');
        }

        $new_id = wp_insert_post([
            'post_type' => $post->post_type,
            // Always a draft. See the class docblock.
            'post_status' => 'draft',
            'post_title' => sprintf(
                /* translators: %s: original page title */
                __('%s (copy)', 'gemreserve-visual-cms'),
                $post->post_title
            ),
            // wp_insert_post expects slashed input, and block markup carries
            // backslash-escaped JSON in its attribute comments.
            'post_content' => wp_slash($post->post_content),
            'post_excerpt' => wp_slash($post->post_excerpt),
            'post_parent' => $post->post_parent,
            'menu_order' => $post->menu_order,
            'comment_status' => $post->comment_status,
            'ping_status' => $post->ping_status,
            // Deliberately not carried: post_name (WordPress derives a unique
            // slug), post_date (the copy is new), and post_author (the person
            // duplicating owns the copy).
            'post_author' => get_current_user_id() ?: $post->post_author,
        ], true);

        if (is_wp_error($new_id)) {
            return $new_id;
        }

        self::copy_taxonomies($source_id, (int) $new_id, $post->post_type);
        self::copy_meta($source_id, (int) $new_id);

        do_action('gemreserve_vcms_duplicated', (int) $new_id, $source_id);
        Audit::record('duplicated', (int) $new_id, 'copied from #' . $source_id);

        return (int) $new_id;
    }

    private static function copy_taxonomies(int $from, int $to, string $post_type): void
    {
        foreach (get_object_taxonomies($post_type) as $taxonomy) {
            $terms = wp_get_object_terms($from, $taxonomy, ['fields' => 'slugs']);
            if (!is_wp_error($terms) && $terms !== []) {
                wp_set_object_terms($to, $terms, $taxonomy);
            }
        }
    }

    /**
     * Copy post meta, minus the keys that must not travel.
     *
     * A user without `gr_manage_gemstone_record` gets no asset-record fields at
     * all, so duplication cannot be used to inherit an evidence or custody
     * claim they could not have set directly.
     */
    private static function copy_meta(int $from, int $to): void
    {
        $strip_record = get_post_type($from) === 'gemstone' && !GemstonePolicy::may_edit_record();

        foreach (get_post_meta($from) as $key => $values) {
            $key = (string) $key;

            if (in_array($key, self::NEVER_COPY, true)) {
                continue;
            }
            if ($strip_record && GemstonePolicy::is_record_meta($key)) {
                continue;
            }

            foreach ((array) $values as $value) {
                // get_post_meta() returns serialised strings; maybe_unserialize
                // restores arrays so update_post_meta stores them correctly,
                // and wp_slash undoes the unslashing add_post_meta will do.
                add_post_meta($to, $key, wp_slash(maybe_unserialize($value)));
            }
        }
    }

    /** Confirm the copy was made, on the screen the user lands on. */
    public static function notice(): void
    {
        if (!isset($_GET['gr_duplicated'])) {
            return;
        }

        if ($_GET['gr_duplicated'] === 'error') {
            printf(
                '<div class="notice notice-error is-dismissible"><p>%s</p></div>',
                esc_html__('The copy could not be created.', 'gemreserve-visual-cms')
            );

            return;
        }

        printf(
            '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
            esc_html__(
                'This is a new draft copy. It is not published, and it has its own address — publish it when you are ready.',
                'gemreserve-visual-cms'
            )
        );
    }
}
