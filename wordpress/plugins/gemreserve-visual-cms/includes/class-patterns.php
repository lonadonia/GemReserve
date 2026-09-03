<?php
/**
 * Page templates and patterns.
 *
 * §10 asks that creating a new page from an approved design must not require a
 * developer. The way that is achieved here is worth explaining, because the
 * obvious implementation would have been wrong.
 *
 * The obvious implementation is to hand-write block markup for each pattern.
 * That would mean a developer transcribing the approved design into PHP string
 * literals, and every such transcription is a chance to get a class name wrong
 * — producing a "new page from the approved design" that is subtly not the
 * approved design, in a way nobody notices until it is live.
 *
 * Instead the patterns are **harvested from the real pages**. A pattern is a
 * section that already exists on the published site, lifted with its slot
 * values cleared to placeholder text. So a pattern cannot drift from the design,
 * because it *is* the design; if a designer changes a section and it is
 * re-harvested, the pattern changes with it.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Patterns
{
    private const CATEGORY = 'gemreserve';
    private const CACHE = 'gemreserve_vcms_patterns';

    /**
     * The page families found during inventory, and the page each borrows its
     * shape from. Chosen because these are the templates marketing actually
     * asks for, and each source page is a published, approved example.
     */
    private const TEMPLATES = [
        'general-content' => ['label' => 'General content page', 'source' => 'platform-infrastructure'],
        'landing' => ['label' => 'Landing page', 'source' => 'enterprise'],
        'legal' => ['label' => 'Legal / disclosure page', 'source' => 'risk-disclosure'],
        'resource' => ['label' => 'Document or resource page', 'source' => 'documents'],
        'process' => ['label' => 'How-it-works / process page', 'source' => 'how-it-works'],
        'faq' => ['label' => 'FAQ page', 'source' => 'faq'],
        'governance' => ['label' => 'Governance / team page', 'source' => 'governance'],
    ];

    public static function boot(): void
    {
        add_action('init', [self::class, 'register'], 20);
        add_action('gemreserve_vcms_migrated', [self::class, 'flush'], 10, 0);
    }

    public static function flush(): void
    {
        delete_transient(self::CACHE);
    }

    public static function register(): void
    {
        if (!function_exists('register_block_pattern_category')) {
            return;
        }

        register_block_pattern_category(self::CATEGORY, [
            'label' => __('GemReserve page designs', 'gemreserve-visual-cms'),
        ]);

        foreach (self::build() as $slug => $pattern) {
            register_block_pattern('gemreserve/' . $slug, [
                'title' => $pattern['title'],
                'description' => $pattern['description'],
                'categories' => [self::CATEGORY],
                'keywords' => ['gemreserve', 'page', 'template'],
                'content' => $pattern['content'],
                'postTypes' => ['page'],
                'inserter' => true,
            ]);
        }
    }

    /**
     * Harvest each template's blocks from its source page.
     *
     * Cached, because it parses several pages. Invalidated whenever a migration
     * runs, which is when the source content can change shape.
     *
     * @return array<string,array{title:string,description:string,content:string}>
     */
    public static function build(): array
    {
        $cached = get_transient(self::CACHE);
        if (is_array($cached)) {
            return $cached;
        }

        $patterns = [];

        foreach (self::TEMPLATES as $slug => $spec) {
            $source = self::page_by_slug($spec['source']);
            if (!$source instanceof \WP_Post) {
                continue;
            }
            $content = (string) $source->post_content;
            if (trim($content) === '') {
                continue; // Source not migrated yet; nothing to harvest.
            }

            $blocks = parse_blocks($content);
            $cleared = self::clear_values($blocks);
            if ($cleared === []) {
                continue;
            }

            $patterns[$slug] = [
                'title' => $spec['label'],
                'description' => sprintf(
                    /* translators: %s: the page the layout is taken from. */
                    __('The approved GemReserve layout, taken from the %s page. Replace the placeholder text with your own.', 'gemreserve-visual-cms'),
                    $spec['source']
                ),
                'content' => serialize_blocks($cleared),
            ];
        }

        set_transient(self::CACHE, $patterns, DAY_IN_SECONDS);

        return $patterns;
    }

    /**
     * Find a page by its slug alone.
     *
     * `get_page_by_path()` resolves a *path*, so on a hierarchical post type it
     * only matches top-level pages: `governance` is a child of `about` and has
     * to be asked for as `about/governance`. Five of the seven template sources
     * are children, so they silently resolved to null and their patterns were
     * never built — the inserter offered two designs instead of seven, with no
     * error anywhere. This site serves flat permalinks, so the slug is the
     * identifier that matters.
     */
    private static function page_by_slug(string $slug): ?\WP_Post
    {
        $found = get_posts([
            'post_type' => 'page',
            'post_status' => 'publish',
            'name' => $slug,
            'numberposts' => 1,
        ]);

        return $found[0] ?? null;
    }

    /**
     * Replace slot text with a prompt, keeping images, icons and structure.
     *
     * Text is cleared because it is the page's copy and would otherwise be
     * duplicated onto a new page as if it were approved for it. Images and
     * icons are kept: a template whose pictures are all missing looks broken,
     * and an editor replacing a placeholder image is a normal operation whereas
     * finding one is not.
     *
     * Nothing invented: `Placeholder` is a prompt, not content, which is what
     * §10 requires.
     *
     * @param array<int,array> $blocks
     * @return array<int,array>
     */
    private static function clear_values(array $blocks): array
    {
        foreach ($blocks as $i => $block) {
            $name = $block['blockName'] ?? '';

            if ($name === 'gemreserve/content' && !empty($block['attrs']['slots'])) {
                $blocks[$i]['attrs']['slots'] = array_map(
                    static function (array $slot): array {
                        if (($slot['kind'] ?? 'text') === 'text') {
                            $slot['value'] = self::prompt((string) ($slot['label'] ?? ''));
                        }

                        return $slot;
                    },
                    $block['attrs']['slots']
                );
            }

            if ($name === 'gemreserve/repeatable' && !empty($block['attrs']['items'])) {
                $slots = $block['attrs']['itemSlots'] ?? [];
                $kinds = [];
                foreach ($slots as $slot) {
                    $kinds[(string) ($slot['key'] ?? '')] = (string) ($slot['kind'] ?? 'text');
                    $labels[(string) ($slot['key'] ?? '')] = (string) ($slot['label'] ?? '');
                }

                // Two items, not the source page's ten: a template should show
                // the shape and invite the editor to add more, not arrive with
                // eight cards of someone else's copy to delete.
                $items = array_slice((array) $block['attrs']['items'], 0, 2);
                $blocks[$i]['attrs']['items'] = array_map(
                    static function (array $item) use ($kinds, $labels): array {
                        foreach ($item as $key => $value) {
                            if (($kinds[$key] ?? 'text') === 'text') {
                                $item[$key] = self::prompt($labels[$key] ?? '');
                            }
                        }

                        return $item;
                    },
                    $items
                );
            }

            if (!empty($block['innerBlocks'])) {
                $blocks[$i]['innerBlocks'] = self::clear_values($block['innerBlocks']);
            }
        }

        return $blocks;
    }

    private static function prompt(string $label): string
    {
        return match ($label) {
            'Heading' => __('Your heading here', 'gemreserve-visual-cms'),
            'Subheading' => __('Your subheading here', 'gemreserve-visual-cms'),
            'Paragraph' => __('Replace this with your own text.', 'gemreserve-visual-cms'),
            'Link text', 'Button label' => __('Button label', 'gemreserve-visual-cms'),
            'List item' => __('List item', 'gemreserve-visual-cms'),
            default => __('Your text here', 'gemreserve-visual-cms'),
        };
    }
}
