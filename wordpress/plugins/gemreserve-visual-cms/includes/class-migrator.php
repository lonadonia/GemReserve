<?php
/**
 * Content migration.
 *
 * Converts a page's `_gr_body_html` blob into block markup in `post_content`.
 *
 * The design principle throughout: **the migration verifies itself and refuses
 * rather than guesses.** Before a page is written, its decomposed block tree is
 * rendered back and compared byte for byte with the original body. If they
 * differ by a single character the page is not written and the reason is
 * reported. That check is not a test that runs somewhere else — it is a
 * precondition inside the write path, so the failure mode is "page 33 was
 * skipped" rather than "page 33 is subtly wrong and nobody noticed".
 *
 * Other properties, each with a reason:
 *
 *   dry run by default   Writing is opt-in. `--apply` is a deliberate act.
 *   idempotent           Re-running produces the same content and does not
 *                        double-migrate; the legacy body is snapshotted once.
 *   reversible           `rollback` restores the exact original body from the
 *                        snapshot, not from a reconstruction.
 *   non-destructive      `_gr_body_html` is never deleted. The theme stops
 *                        reading it, but it stays on the row, so rollback needs
 *                        no backup file to be present.
 *   ID/slug preserving   Nothing is recreated. Posts are updated in place, so
 *                        IDs, slugs, parents, dates, status, SEO meta and
 *                        permalinks are untouched by construction.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Migrator
{
    /** The untouched pre-migration body. Written once; the source of truth for rollback. */
    public const META_SNAPSHOT = '_gr_vcms_legacy_body';

    /** Provenance: when, by which plugin version, and the checksum it verified against. */
    public const META_MIGRATED = '_gr_vcms_migrated';

    /** Checksum of the legacy body this page's blocks were produced from. */
    public const META_CHECKSUM = '_gr_vcms_source_sha256';

    public static function boot(): void
    {
        add_filter('wp_insert_post_data', [self::class, 'guard_preserved'], 10, 2);
    }

    /**
     * Migrate one page.
     *
     * @param bool $apply False (default) inspects and reports, writing nothing.
     * @return array<string,mixed> A per-page report row.
     */
    public static function migrate_post(int $post_id, bool $apply = false): array
    {
        $post = get_post($post_id);
        $row = [
            'id' => $post_id,
            'slug' => $post ? $post->post_name : '',
            'status' => 'skipped',
            'reason' => '',
            'blocks' => 0,
            'slots' => 0,
            'repeatables' => 0,
            'preserved' => 0,
            'identical' => false,
            'applied' => false,
        ];

        if (!$post instanceof \WP_Post) {
            $row['reason'] = 'post not found';

            return $row;
        }

        // The snapshot wins over the live meta. On a re-run the live body is
        // still present (it is never deleted), but taking the snapshot keeps a
        // second migration reading exactly what the first one did.
        $snapshot = (string) get_post_meta($post_id, self::META_SNAPSHOT, true);
        $legacy = $snapshot !== '' ? $snapshot : (string) get_post_meta($post_id, '_gr_body_html', true);

        if (trim($legacy) === '') {
            $row['reason'] = 'no migrated body on this page';

            return $row;
        }

        $decomposer = new Decomposer();
        $tree = $decomposer->decompose_body($legacy);
        $stats = $decomposer->stats();

        $rendered = self::render_tree($tree);
        $identical = ($rendered === $legacy);

        $row['blocks'] = self::count_blocks($tree);
        $row['slots'] = (int) $stats['slots'];
        $row['repeatables'] = (int) $stats['repeatables'];
        $row['preserved'] = (int) $stats['preserved'];
        $row['identical'] = $identical;
        $row['notes'] = $stats['notes'];

        if (!$identical) {
            // The whole safety argument rests on this branch existing.
            $row['status'] = 'refused';
            $row['reason'] = sprintf(
                'rendered output differs from the original body (%d vs %d bytes); page left untouched',
                strlen($rendered),
                strlen($legacy)
            );

            return $row;
        }

        $content = Blocks::serialize($tree);

        // Parse what we are about to store and render it back through the same
        // path WordPress will use. Serialisation and parsing are two more places
        // a byte can go missing, and checking the stored form closes that gap.
        $reparsed = self::render_blocks(parse_blocks($content));
        if ($reparsed !== $legacy) {
            $row['status'] = 'refused';
            $row['reason'] = 'block markup did not survive a parse/render cycle; page left untouched';

            return $row;
        }

        $row['status'] = 'ready';

        if (!$apply) {
            return $row;
        }

        if ($snapshot === '') {
            update_post_meta($post_id, self::META_SNAPSHOT, $legacy);
        }
        update_post_meta($post_id, self::META_CHECKSUM, hash('sha256', $legacy));
        update_post_meta($post_id, self::META_MIGRATED, gmdate('c') . ' v' . VERSION);

        // wp_update_post triggers the revision machinery, so the pre-migration
        // state is also recoverable through the editor's own Revisions panel,
        // not only through this plugin's rollback.
        //
        // wp_slash is not optional here and the reason is easy to miss.
        // wp_update_post expects slashed input and calls wp_unslash on what it
        // is given. Block attributes are serialised with `<` escaped as the JSON
        // sequence `<`, so an unslashed write has its backslashes eaten and
        // every template lands in the database as the literal text `u003cp...`.
        // The page then renders as visible gibberish. The verification above
        // would not catch it, because it checks the string before this call.
        $result = self::update_post_preserving_modified($post_id, [
            'ID' => $post_id,
            'post_content' => wp_slash($content),
        ]);

        if (is_wp_error($result)) {
            $row['status'] = 'error';
            $row['reason'] = $result->get_error_message();

            return $row;
        }

        $row['status'] = 'migrated';
        $row['applied'] = true;

        do_action('gemreserve_vcms_migrated', $post_id, [
            'blocks' => $row['blocks'],
            'slots' => $row['slots'],
            'repeatables' => $row['repeatables'],
        ]);

        return $row;
    }

    /**
     * Run a post update without disturbing post_modified.
     *
     * Neither migration nor rollback changes one byte of a page's public
     * output, so neither should claim the page was modified. WordPress gives
     * no way to say so: wp_insert_post() overwrites post_modified and
     * post_modified_gmt unconditionally on every update, and wp_update_post()
     * passes straight through it.
     *
     * That is not cosmetic here. `gemreserve-flat-sitemap` derives every
     * <lastmod> in /sitemap.xml from post_modified_gmt, so migrating 58 pages
     * moved 53 of the 87 sitemap entries to the deployment timestamp — telling
     * every crawler that most of the site had changed on a day when the bytes
     * it serves did not. It went unseen until this deployment because the
     * sitemap plugins are production-only and were absent from the earlier
     * staging copy.
     *
     * The filter is scoped to this one post id. Revisions are inserted through
     * the same code path during the update, and they carry ID 0 with the page
     * in post_parent, so they keep their own real timestamps.
     *
     * @param array<string,mixed> $postarr Passed to wp_update_post().
     * @return int|\WP_Error
     */
    private static function update_post_preserving_modified(int $post_id, array $postarr)
    {
        $post = get_post($post_id);
        if (!$post instanceof \WP_Post) {
            return new \WP_Error('gemreserve_vcms_missing_post', 'Post not found.');
        }

        $modified = $post->post_modified;
        $modified_gmt = $post->post_modified_gmt;

        $preserve = static function (array $data, array $incoming) use ($post_id, $modified, $modified_gmt): array {
            if ((int) ($incoming['ID'] ?? 0) === $post_id) {
                $data['post_modified'] = $modified;
                $data['post_modified_gmt'] = $modified_gmt;
            }

            return $data;
        };

        add_filter('wp_insert_post_data', $preserve, 99, 2);
        try {
            return wp_update_post($postarr, true);
        } finally {
            remove_filter('wp_insert_post_data', $preserve, 99);
        }
    }

    /**
     * Restore a page to its pre-migration state.
     *
     * Restores from the snapshot rather than reconstructing from blocks: a
     * rollback that has to compute its way back is a rollback that can fail in
     * the same way the migration did.
     */
    public static function rollback_post(int $post_id, bool $apply = false): array
    {
        $row = ['id' => $post_id, 'status' => 'skipped', 'reason' => ''];

        $snapshot = (string) get_post_meta($post_id, self::META_SNAPSHOT, true);
        if ($snapshot === '') {
            $row['reason'] = 'no pre-migration snapshot; this page was never migrated';

            return $row;
        }

        $row['status'] = 'ready';
        if (!$apply) {
            return $row;
        }

        update_post_meta($post_id, '_gr_body_html', $snapshot);
        self::update_post_preserving_modified($post_id, ['ID' => $post_id, 'post_content' => '']);
        delete_post_meta($post_id, self::META_MIGRATED);
        delete_post_meta($post_id, self::META_CHECKSUM);

        $row['status'] = 'rolled_back';
        do_action('gemreserve_vcms_rolled_back', $post_id);

        return $row;
    }

    /**
     * Should the theme still print the legacy body for this page?
     *
     * False once the page is migrated. The meta is left in place rather than
     * deleted so rollback stays a metadata flip.
     */
    public static function is_migrated(int $post_id): bool
    {
        return (string) get_post_meta($post_id, self::META_MIGRATED, true) !== '';
    }

    /**
     * Everything that carries a migrated body.
     *
     * Gemstones are here, not only pages. All 18 gemstone records store their
     * body in `_gr_body_html` exactly as the 40 pages do, and an earlier version
     * of this query listed only pages — which would have migrated 40 of the 58
     * public routes and left the other 18 un-editable, while every report said
     * "40/40 migrated". Counting the routes rather than the post type is what
     * caught it.
     *
     * @return int[]
     */
    public static function candidates(): array
    {
        return get_posts([
            'post_type' => MIGRATED_POST_TYPES,
            'post_status' => ['publish', 'draft', 'pending', 'private', 'future'],
            'numberposts' => -1,
            'fields' => 'ids',
            'meta_query' => [
                [
                    'key' => '_gr_body_html',
                    'compare' => 'EXISTS',
                ],
            ],
            'orderby' => 'ID',
            'order' => 'ASC',
        ]);
    }

    /**
     * Enforce the markup policy on every block attribute that renders as HTML.
     *
     * This is the single most important control in the plugin, and it exists
     * because of a gap that is easy to reason past.
     *
     * WordPress sanitises post content for users without `unfiltered_html` via
     * `wp_filter_post_kses`. That does not protect block attributes: they are
     * serialised inside an HTML comment with `<` and `>` escaped as the JSON
     * sequences `<` / `>`, specifically so kses leaves the block
     * comment intact. The escaping that keeps legitimate attributes safe from
     * the filter is the same escaping that carries a payload past it. This was
     * confirmed, not assumed: an `<img src=x onerror=alert(1)>` placed in a
     * `template` attribute by a Marketing Editor reached the rendered page.
     *
     * So markup-bearing attributes are filtered here, on save, for every user
     * who does not hold `unfiltered_html`. The policy is a closed allowlist
     * (see class-markup-policy.php) and is verified against the real content:
     * all 2,591 markup attributes across the 40 migrated pages pass through it
     * unchanged, so an ordinary edit is untouched and only injected markup is
     * altered.
     *
     * `preserved` blocks get the stricter treatment they always had — their
     * HTML is restored from what is stored rather than filtered — because a
     * preserved block renders verbatim by definition.
     *
     * @param array<string,mixed> $data
     * @param array<string,mixed> $postarr
     * @return array<string,mixed>
     */
    public static function guard_preserved(array $data, array $postarr): array
    {
        if (!in_array($data['post_type'] ?? '', MIGRATED_POST_TYPES, true)) {
            return $data;
        }
        if (current_user_can('unfiltered_html')) {
            return $data;
        }

        $incoming = (string) ($data['post_content'] ?? '');
        if (!str_contains($incoming, 'wp:gemreserve/')) {
            return $data;
        }

        // wp_insert_post_data receives slashed content.
        $unslashed = wp_unslash($incoming);

        $post_id = (int) ($postarr['ID'] ?? 0);
        $stored = $post_id ? (string) get_post_field('post_content', $post_id) : '';

        $allowed = self::preserved_values(parse_blocks($stored));
        $blocks = parse_blocks($unslashed);

        $changed = false;
        $seen = 0;
        $clean = self::apply_policy($blocks, $allowed, $changed, $seen);

        if ($changed) {
            $data['post_content'] = wp_slash(serialize_blocks($clean));
            set_transient('gemreserve_vcms_preserved_denied_' . get_current_user_id(), 1, 60);
        }

        return $data;
    }

    /**
     * Filter markup attributes and restore preserved HTML.
     *
     * @param array<int,array> $blocks
     * @param string[]         $allowed Preserved HTML values already stored on the post.
     * @return array<int,array>
     */
    private static function apply_policy(array $blocks, array $allowed, bool &$changed, int &$seen): array
    {
        foreach ($blocks as $i => $block) {
            $name = $block['blockName'] ?? '';

            if ($name === 'gemreserve/preserved') {
                $original = $allowed[$seen] ?? '';
                $seen++;
                if (($block['attrs']['html'] ?? '') !== $original) {
                    $blocks[$i]['attrs']['html'] = $original;
                    $changed = true;
                }
            } elseif (str_starts_with($name, 'gemreserve/')) {
                foreach (['template', 'itemTemplate', 'open', 'close'] as $key) {
                    $value = $block['attrs'][$key] ?? null;
                    if (!is_string($value) || $value === '') {
                        continue;
                    }
                    $filtered = MarkupPolicy::filter_fragment($value);
                    if ($filtered !== $value) {
                        $blocks[$i]['attrs'][$key] = $filtered;
                        $changed = true;
                    }
                }

                // Icon slot values are markup too. Renderer::sanitize_icon runs
                // on output as well; doing it here means the stored value is
                // clean, so what an editor sees next time is what will render.
                foreach (['slots', 'itemSlots'] as $key) {
                    if (empty($block['attrs'][$key]) || !is_array($block['attrs'][$key])) {
                        continue;
                    }
                    foreach ($block['attrs'][$key] as $j => $slot) {
                        if (!is_array($slot) || ($slot['kind'] ?? '') !== Slot::KIND_ICON) {
                            continue;
                        }
                        $clean_icon = Renderer::sanitize_icon((string) ($slot['value'] ?? ''));
                        if ($clean_icon !== ($slot['value'] ?? '')) {
                            $blocks[$i]['attrs'][$key][$j]['value'] = $clean_icon;
                            $changed = true;
                        }
                    }
                }

                if (!empty($block['attrs']['items']) && is_array($block['attrs']['items'])) {
                    $kinds = [];
                    foreach ((array) ($block['attrs']['itemSlots'] ?? []) as $slot) {
                        if (is_array($slot) && isset($slot['key'])) {
                            $kinds[(string) $slot['key']] = (string) ($slot['kind'] ?? 'text');
                        }
                    }
                    foreach ($block['attrs']['items'] as $j => $item) {
                        if (!is_array($item)) {
                            continue;
                        }
                        foreach ($item as $slot_key => $value) {
                            if (($kinds[$slot_key] ?? '') !== Slot::KIND_ICON || !is_string($value)) {
                                continue;
                            }
                            $clean_icon = Renderer::sanitize_icon($value);
                            if ($clean_icon !== $value) {
                                $blocks[$i]['attrs']['items'][$j][$slot_key] = $clean_icon;
                                $changed = true;
                            }
                        }
                    }
                }
            }

            if (!empty($block['innerBlocks'])) {
                $blocks[$i]['innerBlocks'] = self::apply_policy($block['innerBlocks'], $allowed, $changed, $seen);
            }
        }

        return $blocks;
    }

    /**
     * @param array<int,array> $blocks
     * @return string[]
     */
    private static function preserved_values(array $blocks): array
    {
        $out = [];
        foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === 'gemreserve/preserved') {
                $out[] = (string) ($block['attrs']['html'] ?? '');
            }
            if (!empty($block['innerBlocks'])) {
                foreach (self::preserved_values($block['innerBlocks']) as $v) {
                    $out[] = $v;
                }
            }
        }

        return $out;
    }

    /**
     * @param array<int,array> $blocks
     * @param string[]         $allowed
     * @return array<int,array>
     */
    private static function restore_preserved(array $blocks, array $allowed, bool &$changed, int &$seen = 0): array
    {
        foreach ($blocks as $i => $block) {
            if (($block['blockName'] ?? '') === 'gemreserve/preserved') {
                $original = $allowed[$seen] ?? '';
                $seen++;
                if (($block['attrs']['html'] ?? '') !== $original) {
                    $blocks[$i]['attrs']['html'] = $original;
                    $changed = true;
                }
            }
            if (!empty($block['innerBlocks'])) {
                $blocks[$i]['innerBlocks'] = self::restore_preserved(
                    $block['innerBlocks'],
                    $allowed,
                    $changed,
                    $seen
                );
            }
        }

        return $blocks;
    }

    /**
     * Render a decomposer tree directly, without going through WordPress.
     *
     * Used for the pre-write verification so the check does not depend on block
     * registration having happened.
     *
     * @param array<int,array> $tree
     */
    public static function render_tree(array $tree): string
    {
        $out = '';
        foreach ($tree as $node) {
            $inner = !empty($node['inner']) ? self::render_tree($node['inner']) : '';
            $attrs = $node['attrs'] ?? [];

            $out .= match ($node['name']) {
                'gemreserve/section' => Renderer::section($attrs, $inner),
                'gemreserve/wrapper' => Renderer::wrapper($attrs, $inner),
                'gemreserve/content' => Renderer::content($attrs),
                'gemreserve/repeatable' => Renderer::repeatable($attrs),
                'gemreserve/gap' => Renderer::gap($attrs),
                'gemreserve/preserved' => Renderer::preserved($attrs),
                default => '',
            };
        }

        return $out;
    }

    /**
     * Render parsed WordPress blocks the same way.
     *
     * @param array<int,array> $blocks
     */
    public static function render_blocks(array $blocks): string
    {
        $out = '';
        foreach ($blocks as $block) {
            $name = $block['blockName'] ?? null;
            if ($name === null) {
                // A null blockName is the whitespace between block comments.
                continue;
            }
            $inner = !empty($block['innerBlocks']) ? self::render_blocks($block['innerBlocks']) : '';
            $attrs = $block['attrs'] ?? [];

            $out .= match ($name) {
                'gemreserve/section' => Renderer::section($attrs, $inner),
                'gemreserve/wrapper' => Renderer::wrapper($attrs, $inner),
                'gemreserve/content' => Renderer::content($attrs),
                'gemreserve/repeatable' => Renderer::repeatable($attrs),
                'gemreserve/gap' => Renderer::gap($attrs),
                'gemreserve/preserved' => Renderer::preserved($attrs),
                default => '',
            };
        }

        return $out;
    }

    /** @param array<int,array> $tree */
    private static function count_blocks(array $tree): int
    {
        $n = 0;
        foreach ($tree as $node) {
            $n++;
            if (!empty($node['inner'])) {
                $n += self::count_blocks($node['inner']);
            }
        }

        return $n;
    }
}
