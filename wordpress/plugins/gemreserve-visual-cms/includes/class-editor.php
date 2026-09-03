<?php
/**
 * The editing surface.
 *
 * Two jobs. First, load the site's own stylesheet into the editor canvas, so a
 * section looks in the editor exactly as it looks on the site — that single
 * step is most of the difference between "a visual CMS" and "a form that claims
 * to describe the page". Second, keep the inserter honest: a marketing user
 * opening the block list should see the blocks that belong in this design and
 * not forty core blocks that would break it.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Editor
{
    public static function boot(): void
    {
        add_action('init', [self::class, 'register_assets']);
        add_action('after_setup_theme', [self::class, 'editor_styles'], 20);
        add_action('enqueue_block_editor_assets', [self::class, 'localise']);
        add_filter('allowed_block_types_all', [self::class, 'allowed_blocks'], 10, 2);
        add_action('admin_notices', [self::class, 'unmigrated_notice']);
        add_action('add_meta_boxes', [self::class, 'hide_technical_fields'], 99);
    }

    /**
     * Keep technical fields out of the marketing editing surface.
     *
     * §7 is explicit: "Do not expose JSON textareas, file paths, raw database
     * values or technical identifiers to marketing users." `gemreserve-core`
     * renders a "Sections" meta box containing `_gr_section_json` as a raw JSON
     * textarea on every page.
     *
     * Two reasons to remove it rather than leave it:
     *
     * It is exactly the thing the brief forbids — an editable JSON blob in the
     * middle of an editor built for people who do not read JSON, where a stray
     * keystroke produces an unparseable value with no feedback.
     *
     * And it is dead. The audit established that the field holds migration
     * provenance (`migrated_from`, `source_sections`), not renderable sections:
     * the theme's `gemreserve_render_sections()` looks for a `type` key, finds
     * none, and renders nothing. Editing it changes no pixel on the site.
     *
     * It is hidden from the editing surface rather than deleted, and stays
     * visible to an administrator, because it is the record of where each page
     * came from and is worth keeping for exactly that.
     */
    public static function hide_technical_fields(): void
    {
        if (current_user_can('manage_options')) {
            return;
        }

        foreach (['page', 'gemstone'] as $post_type) {
            remove_meta_box('gr_' . sanitize_key($post_type . '_Sections'), $post_type, 'normal');
        }
    }

    public static function register_assets(): void
    {
        $js = GEMRESERVE_VCMS_PATH . 'assets/editor.js';
        $css = GEMRESERVE_VCMS_PATH . 'assets/editor.css';

        wp_register_script(
            'gemreserve-vcms-editor',
            GEMRESERVE_VCMS_URL . 'assets/editor.js',
            [
                'wp-blocks',
                'wp-block-editor',
                'wp-components',
                'wp-element',
                'wp-i18n',
                'wp-data',
            ],
            is_file($js) ? (string) filemtime($js) : VERSION,
            true
        );

        wp_register_style(
            'gemreserve-vcms-editor',
            GEMRESERVE_VCMS_URL . 'assets/editor.css',
            [],
            is_file($css) ? (string) filemtime($css) : VERSION
        );
    }

    /**
     * Put the approved stylesheet into the editor canvas.
     *
     * The theme already declares `editor-styles` support. What it never did was
     * add the actual site stylesheet, so the editor rendered the design's markup
     * with none of the design's CSS. `add_editor_style` scopes and loads it into
     * the iframe, which is why a section in the editor is drawn by the same
     * rules that draw it on the site.
     */
    public static function editor_styles(): void
    {
        $relative = 'assets/css/gemreserve.css';
        if (!is_file(get_template_directory() . '/' . $relative)) {
            return;
        }
        add_editor_style($relative);
    }

    public static function localise(): void
    {
        wp_localize_script('gemreserve-vcms-editor', 'gemreserveVcms', [
            'schemaVersion' => SCHEMA_VERSION,
            'canUnfilteredHtml' => current_user_can('unfiltered_html'),
            'icons' => self::icon_set(),
        ]);
    }

    /**
     * The icon set offered by the picker.
     *
     * Gathered from the site's own published pages rather than hand-listed: the
     * icons in use *are* the approved set, and a curated list here would drift
     * from the design the moment a page changed. De-duplicated on the markup
     * itself, so the same icon drawn on ten pages appears once.
     *
     * Cached for a day. Scanning forty page bodies on every editor load would be
     * a real cost for a set that changes when a designer ships, not hourly.
     *
     * @return array<int,array{label:string,svg:string}>
     */
    public static function icon_set(): array
    {
        $cached = get_transient('gemreserve_vcms_icons');
        if (is_array($cached)) {
            return $cached;
        }

        $found = [];
        $pages = get_posts([
            'post_type' => ['page', 'gemstone'],
            'post_status' => 'publish',
            'numberposts' => 100,
            'fields' => 'ids',
        ]);

        foreach ($pages as $id) {
            $sources = [
                (string) get_post_field('post_content', $id),
                (string) get_post_meta($id, '_gr_body_html', true),
            ];
            foreach ($sources as $source) {
                if ($source === '') {
                    continue;
                }
                if (!preg_match_all('#<svg\b[^>]*>.*?</svg>#is', $source, $matches)) {
                    continue;
                }
                foreach ($matches[0] as $svg) {
                    // Diagrams are not icons; the same rule the slot engine uses.
                    if (stripos($svg, '<text') !== false || strlen($svg) > 4000) {
                        continue;
                    }
                    $clean = Renderer::sanitize_icon($svg);
                    if ($clean === '') {
                        continue;
                    }
                    $found[md5($clean)] = $clean;
                }
            }
        }

        $icons = [];
        $n = 0;
        foreach ($found as $svg) {
            $icons[] = [
                'label' => sprintf(
                    /* translators: %d: sequential icon number. */
                    __('Icon %d', 'gemreserve-visual-cms'),
                    ++$n
                ),
                'svg' => $svg,
            ];
        }

        set_transient('gemreserve_vcms_icons', $icons, DAY_IN_SECONDS);

        return $icons;
    }

    /**
     * Which blocks may be inserted into a page.
     *
     * This design has no use for core's cover, columns, gallery or embed blocks,
     * and inserting one produces markup the stylesheet has no rules for — a
     * marketing user would get a visibly broken page and no explanation.
     *
     * The allowlist is not a cage: it carries the GemReserve blocks plus the
     * genuinely universal core ones (paragraph, heading, list, image, quote,
     * table, separator, spacer, buttons), which the theme's prose styles do
     * cover. An administrator gets everything, because an administrator
     * introducing a new block is doing so deliberately.
     *
     * @param bool|string[] $allowed
     * @return bool|string[]
     */
    public static function allowed_blocks(bool|array $allowed, mixed $context): bool|array
    {
        $post = $context->post ?? null;
        if (!$post instanceof \WP_Post || $post->post_type !== 'page') {
            return $allowed;
        }

        if (current_user_can('manage_options')) {
            return $allowed;
        }

        return array_merge(Blocks::names(), [
            'core/paragraph',
            'core/heading',
            'core/list',
            'core/list-item',
            'core/image',
            'core/quote',
            'core/table',
            'core/separator',
            'core/spacer',
            'core/buttons',
            'core/button',
            'core/html',
        ]);
    }

    /**
     * Tell an editor when a page has not been migrated yet.
     *
     * Before migration a page's body still lives in `_gr_body_html` and the
     * editor will show an empty canvas. Without a notice that reads as "my page
     * has been wiped", which is the worst possible first impression for the
     * feature this project exists to deliver.
     */
    public static function unmigrated_notice(): void
    {
        $screen = get_current_screen();
        if (!$screen || $screen->base !== 'post' || $screen->post_type !== 'page') {
            return;
        }

        $id = (int) get_the_ID();
        if ($id === 0) {
            return;
        }

        $legacy = (string) get_post_meta($id, '_gr_body_html', true);
        $migrated = (string) get_post_meta($id, '_gr_vcms_migrated', true);

        if ($legacy === '' || $migrated !== '') {
            return;
        }

        printf(
            '<div class="notice notice-warning"><p><strong>%s</strong> %s</p></div>',
            esc_html__('This page has not been converted yet.', 'gemreserve-visual-cms'),
            esc_html__(
                'Its sections are still stored in the old format, so the editor below will look empty while the live page is unchanged. An administrator needs to run the content conversion for this page. Nothing you do here will affect the live page until then.',
                'gemreserve-visual-cms'
            )
        );
    }
}
