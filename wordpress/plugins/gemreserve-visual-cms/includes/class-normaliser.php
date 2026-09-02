<?php
/**
 * The normalised content model published by the API.
 *
 * The block tree stored in `post_content` is shaped for editing and for
 * byte-exact PHP rendering: it carries raw start tags, whitespace separators
 * and placeholder templates. That is the right shape for the editor and the
 * wrong shape for a consumer, so the API publishes a normalised projection
 * instead.
 *
 * The distinction that matters: the normalised form is **resolved**. Slots are
 * already substituted into their markup, so a consumer never has to reimplement
 * the slot engine, the escaping rules or the icon sanitiser to display a page
 * correctly. It also carries the structured values alongside, so a consumer
 * that wants to render natively — the Next.js block renderer does — can work
 * from typed fields rather than parsing HTML back apart.
 *
 * Every response carries `schemaVersion`. A consumer that does not recognise it
 * should refuse rather than guess, which is why it is on the envelope and not
 * buried per block.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Normaliser
{
    /**
     * Normalise a page for the API.
     *
     * @param bool $include_draft_fields Whether the caller is authorised to see status/revision detail.
     * @return array<string,mixed>
     */
    public static function page(\WP_Post $post, bool $include_draft_fields = false): array
    {
        $id = $post->ID;

        $out = [
            'schemaVersion' => SCHEMA_VERSION,
            'id' => $id,
            'slug' => $post->post_name,
            'route' => self::route($post),
            'title' => get_the_title($id),
            'excerpt' => wp_strip_all_tags((string) $post->post_excerpt),
            'parent' => (int) $post->post_parent,
            'menuOrder' => (int) $post->menu_order,
            'updatedAt' => get_post_modified_time('c', true, $post) ?: null,
            'publishedAt' => get_post_time('c', true, $post) ?: null,
            'hero' => self::hero($id),
            'seo' => self::seo($post),
            'featuredMedia' => self::featured($id),
            'blocks' => self::blocks(parse_blocks((string) $post->post_content)),
            'migrated' => Migrator::is_migrated($id),
        ];

        if ($include_draft_fields) {
            $out['status'] = $post->post_status;
            $out['revisionOf'] = wp_is_post_revision($id) ?: null;
        }

        return $out;
    }

    /**
     * Normalise a block tree.
     *
     * @param array<int,array> $blocks
     * @return array<int,array<string,mixed>>
     */
    public static function blocks(array $blocks): array
    {
        $out = [];

        foreach ($blocks as $block) {
            $name = $block['blockName'] ?? null;
            if ($name === null) {
                continue;
            }
            $attrs = $block['attrs'] ?? [];

            // A hidden section is absent from the API exactly as it is absent
            // from the page. Publishing it with a flag would invite a consumer
            // to render it, and would leak unpublished copy to anyone reading
            // the public endpoint.
            if (!empty($attrs['hidden'])) {
                continue;
            }

            $node = match ($name) {
                'gemreserve/section' => [
                    'type' => 'section',
                    'label' => (string) ($attrs['label'] ?? ''),
                    'variant' => self::classes($attrs['variant'] ?? ''),
                    'anchor' => (string) ($attrs['anchor'] ?? ''),
                    'tag' => self::tag_name($attrs['open'] ?? '', 'section'),
                    'children' => self::blocks($block['innerBlocks'] ?? []),
                ],
                'gemreserve/wrapper' => [
                    'type' => 'group',
                    'variant' => self::classes($attrs['variant'] ?? ''),
                    'tag' => self::tag_name($attrs['open'] ?? '', 'div'),
                    'children' => self::blocks($block['innerBlocks'] ?? []),
                ],
                'gemreserve/repeatable' => self::repeatable($attrs),
                'gemreserve/content' => self::content($attrs),
                'gemreserve/preserved' => [
                    'type' => 'preserved',
                    'html' => Renderer::preserved($attrs),
                ],
                // Whitespace carries no meaning to a consumer.
                'gemreserve/gap' => null,
                default => self::core_block($block),
            };

            if ($node !== null) {
                $out[] = $node;
            }
        }

        return $out;
    }

    /**
     * @param array<string,mixed> $attrs
     * @return array<string,mixed>
     */
    private static function content(array $attrs): array
    {
        $slots = is_array($attrs['slots'] ?? null) ? $attrs['slots'] : [];

        return [
            'type' => 'content',
            // Resolved markup: a consumer can render this directly and get the
            // approved design with no further processing.
            'html' => Renderer::content($attrs),
            // The same values as typed fields, for a consumer that renders
            // natively rather than injecting markup.
            'fields' => self::fields($slots),
        ];
    }

    /**
     * @param array<string,mixed> $attrs
     * @return array<string,mixed>
     */
    private static function repeatable(array $attrs): array
    {
        $slots = is_array($attrs['itemSlots'] ?? null) ? $attrs['itemSlots'] : [];
        $items = is_array($attrs['items'] ?? null) ? $attrs['items'] : [];

        $slot_objects = [];
        foreach ($slots as $s) {
            if (is_array($s) && isset($s['key'])) {
                $slot_objects[] = Slot::from_array($s);
            }
        }

        $normalised = [];
        foreach (array_values($items) as $values) {
            if (!is_array($values)) {
                continue;
            }
            $strings = [];
            foreach ($values as $k => $v) {
                if (is_scalar($v) || $v === null) {
                    $strings[(string) $k] = (string) $v;
                }
            }
            $normalised[] = [
                'html' => SlotEngine::render(
                    (string) ($attrs['itemTemplate'] ?? ''),
                    $slot_objects,
                    $strings
                ),
                'fields' => self::fields($slots, $strings),
            ];
        }

        return [
            'type' => 'collection',
            'variant' => self::classes($attrs['variant'] ?? ''),
            'tag' => self::tag_name($attrs['open'] ?? '', 'ul'),
            'items' => $normalised,
        ];
    }

    /**
     * Slots as named fields.
     *
     * The label is the human name the slot engine derived ("Heading",
     * "Paragraph", "Link destination"), which is more useful to a consumer than
     * the internal key. Keys are still published so a consumer can address a
     * specific field unambiguously.
     *
     * @param array<int,array>     $slots
     * @param array<string,string> $values
     * @return array<int,array<string,string>>
     */
    private static function fields(array $slots, array $values = []): array
    {
        $out = [];
        foreach ($slots as $s) {
            if (!is_array($s) || !isset($s['key'])) {
                continue;
            }
            $key = (string) $s['key'];
            $value = array_key_exists($key, $values) ? $values[$key] : (string) ($s['value'] ?? '');

            $out[] = [
                'key' => $key,
                'kind' => (string) ($s['kind'] ?? 'text'),
                'label' => (string) ($s['label'] ?? ''),
                'value' => $value,
            ];
        }

        return $out;
    }

    /**
     * A core block that survived the allowlist, rendered through WordPress.
     *
     * @param array<string,mixed> $block
     * @return array<string,mixed>|null
     */
    private static function core_block(array $block): ?array
    {
        $html = render_block($block);
        if (trim($html) === '') {
            return null;
        }

        return [
            'type' => 'core',
            'name' => (string) $block['blockName'],
            'html' => $html,
        ];
    }

    /**
     * The design variant, as a class list.
     *
     * Published because the Next.js renderer needs it to apply the same
     * stylesheet. It is presentation metadata, not a technical identifier the
     * editor exposes — see CMS_TARGET_ARCHITECTURE.md §2.
     *
     * @return string[]
     */
    private static function classes(mixed $variant): array
    {
        return array_values(array_filter(preg_split('/\s+/', trim((string) $variant)) ?: []));
    }

    private static function tag_name(mixed $open, string $fallback): string
    {
        if (preg_match('#^<([a-zA-Z][a-zA-Z0-9-]*)#', (string) $open, $m)) {
            return strtolower($m[1]);
        }

        return $fallback;
    }

    /**
     * The hero, read from gemreserve-core's structured fields.
     *
     * Included so a consumer receives the whole page. The hero is not a block
     * and is not migrated — see CMS_TARGET_ARCHITECTURE.md §3 for why moving
     * working functionality would have been a regression.
     *
     * @return array<string,mixed>
     */
    private static function hero(int $id): array
    {
        $lines = array_values(array_filter(array_map(
            'trim',
            explode("\n", (string) get_post_meta($id, '_gr_hero_title_lines', true))
        )));

        return [
            'eyebrow' => (string) get_post_meta($id, '_gr_hero_eyebrow', true),
            'titleLines' => $lines,
            'tagline' => (string) get_post_meta($id, '_gr_hero_tagline', true),
            'description' => (string) get_post_meta($id, '_gr_hero_description', true),
            'imageDesktop' => (string) get_post_meta($id, '_gr_hero_image_desktop', true),
            'imageMobile' => (string) get_post_meta($id, '_gr_hero_image_mobile', true),
            'variant' => (string) get_post_meta($id, '_gr_hero_class', true),
        ];
    }

    /**
     * @return array<string,mixed>
     */
    private static function seo(\WP_Post $post): array
    {
        $id = $post->ID;
        $title = (string) get_post_meta($id, '_gr_seo_title', true) ?: get_the_title($id);
        $description = (string) get_post_meta($id, '_gr_seo_description', true);
        $canonical = (string) get_post_meta($id, '_gr_canonical_url', true) ?: (string) get_permalink($id);
        $noindex = get_post_meta($id, '_gr_noindex', true) === '1';

        $og_image_id = (int) get_post_meta($id, '_gr_og_image', true);
        $og_image = $og_image_id ? (string) wp_get_attachment_image_url($og_image_id, 'full') : '';

        return [
            'title' => $title,
            'description' => $description,
            'canonical' => $canonical,
            'noindex' => $noindex,
            'nofollow' => get_post_meta($id, '_gr_nofollow', true) === '1',
            'openGraph' => [
                'title' => (string) get_post_meta($id, '_gr_og_title', true) ?: $title,
                'description' => (string) get_post_meta($id, '_gr_og_description', true) ?: $description,
                'image' => $og_image,
                'type' => 'website',
            ],
            'twitter' => [
                'card' => (string) get_post_meta($id, '_gr_twitter_card', true) ?: 'summary_large_image',
                'title' => (string) get_post_meta($id, '_gr_twitter_title', true) ?: $title,
                'description' => (string) get_post_meta($id, '_gr_twitter_description', true) ?: $description,
            ],
            'structuredData' => [
                'type' => (string) get_post_meta($id, '_gr_schema_type', true) ?: 'WebPage',
                'name' => $title,
                'description' => $description,
                'url' => $canonical,
            ],
            'inSitemap' => !$noindex && $post->post_status === 'publish',
        ];
    }

    /** @return array<string,mixed>|null */
    private static function featured(int $id): ?array
    {
        $thumb = get_post_thumbnail_id($id);
        if (!$thumb) {
            return null;
        }

        $meta = wp_get_attachment_metadata($thumb);

        return [
            'id' => (int) $thumb,
            'url' => (string) wp_get_attachment_image_url($thumb, 'full'),
            'alt' => (string) get_post_meta($thumb, '_wp_attachment_image_alt', true),
            'width' => (int) ($meta['width'] ?? 0),
            'height' => (int) ($meta['height'] ?? 0),
        ];
    }

    /**
     * The public route for a page.
     *
     * gemreserve-core flattens permalinks, so the route is `/slug/` regardless
     * of how deep the page sits in the parent tree. Derived from the permalink
     * rather than rebuilt, so it cannot disagree with what the site serves.
     */
    public static function route(\WP_Post $post): string
    {
        $home = (string) home_url();
        $link = (string) get_permalink($post);
        $route = str_starts_with($link, $home) ? substr($link, strlen($home)) : $link;

        return $route === '' ? '/' : $route;
    }
}
