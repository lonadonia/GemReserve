<?php
/**
 * Block registration.
 *
 * Every block is server-rendered: `post_content` carries attributes and nothing
 * else. That choice is what makes the design correctable — a fix to a renderer
 * ships as a plugin deploy rather than as a re-save of forty pages — and it is
 * what removes the "this block contains unexpected content" recovery wall that
 * a marketing user has no way to answer.
 *
 * Block metadata lives in block.json beside each block so WordPress can read it
 * for both PHP and JavaScript, which is the current registration API and keeps
 * the attribute schema in exactly one place.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Blocks
{
    /**
     * Block name => renderer.
     *
     * The order is the order they appear in the inserter.
     */
    private const BLOCKS = [
        'section' => [Renderer::class, 'section'],
        'repeatable' => [Renderer::class, 'repeatable'],
        'content' => [Renderer::class, 'content'],
        'wrapper' => [Renderer::class, 'wrapper'],
        'gap' => [Renderer::class, 'gap'],
        'preserved' => [Renderer::class, 'preserved'],
    ];

    public static function boot(): void
    {
        add_action('init', [self::class, 'register'], 5);
        add_filter('block_categories_all', [self::class, 'category'], 10, 1);
    }

    public static function register(): void
    {
        foreach (self::BLOCKS as $name => $callback) {
            $dir = GEMRESERVE_VCMS_PATH . 'blocks/' . $name;
            if (!is_file($dir . '/block.json')) {
                continue;
            }

            register_block_type($dir, [
                'render_callback' => static function (array $attrs, string $content = '') use ($callback): string {
                    // Container blocks take their inner markup; leaves ignore it.
                    $reflect = new \ReflectionMethod($callback[0], $callback[1]);

                    return $reflect->getNumberOfParameters() > 1
                        ? $callback($attrs, $content)
                        : $callback($attrs);
                },
            ]);
        }
    }

    /**
     * A category of our own, so the GemReserve blocks are not scattered through
     * "Design" and "Widgets" alongside forty core blocks a marketing user has no
     * business inserting into this design.
     */
    public static function category(array $categories): array
    {
        array_unshift($categories, [
            'slug' => 'gemreserve',
            'title' => __('GemReserve', 'gemreserve-visual-cms'),
            'icon' => null,
        ]);

        return $categories;
    }

    /** @return string[] Fully-qualified block names this plugin owns. */
    public static function names(): array
    {
        return array_map(static fn(string $n): string => 'gemreserve/' . $n, array_keys(self::BLOCKS));
    }

    /**
     * Serialise a decomposer tree into block markup for `post_content`.
     *
     * Uses `serialize_blocks` rather than string concatenation so attribute
     * encoding, escaping and the comment-delimiter format come from WordPress
     * itself. A hand-rolled serialiser here would be one more thing that can
     * drift from the parser on the other side.
     *
     * @param array<int,array> $tree
     */
    public static function serialize(array $tree): string
    {
        return serialize_blocks(self::to_wp_blocks($tree));
    }

    /**
     * @param array<int,array> $tree
     * @return array<int,array>
     */
    private static function to_wp_blocks(array $tree): array
    {
        $out = [];
        foreach ($tree as $node) {
            $inner = isset($node['inner']) && is_array($node['inner'])
                ? self::to_wp_blocks($node['inner'])
                : [];

            // innerContent describes where inner blocks sit relative to literal
            // strings. All of our containers are "nothing but children", so it
            // is one null per child and no literal content.
            $inner_content = array_fill(0, count($inner), null);

            $out[] = [
                'blockName' => $node['name'],
                'attrs' => $node['attrs'] ?? [],
                'innerBlocks' => $inner,
                'innerHTML' => '',
                'innerContent' => $inner_content,
            ];
        }

        return $out;
    }
}
