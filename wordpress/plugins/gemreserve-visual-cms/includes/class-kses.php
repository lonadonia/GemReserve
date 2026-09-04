<?php
/**
 * Stop WordPress's own sanitiser from destroying the approved design.
 *
 * ## The defect this fixes
 *
 * `wp_filter_post_kses()` runs on `content_save_pre` for every user without
 * `unfiltered_html` — which is every marketing user, deliberately. WordPress
 * reaches inside block delimiters there, runs each string attribute through
 * `wp_kses( …, 'post' )`, and re-serialises.
 *
 * That is fatal for this content. Measured on the home page, saved by a
 * Marketing Publisher through the ordinary REST save the editor uses:
 *
 *     before   57,784 bytes   14 inline icons
 *     after    33,475 bytes    0 inline icons
 *
 * `<svg>` is not in kses's `post` allowlist, so every icon in a block attribute
 * was replaced with an empty string. `decoding` and `srcset` were stripped from
 * `<img>`, and `&amp;` was re-encoded to `&amp;amp;` so an ampersand appeared
 * literally on the page. One heading edit would have done that to the whole
 * page, silently.
 *
 * `CMS_SECURITY_REVIEW.md` §1 records the belief that escaping `<` as `<`
 * inside the block comment keeps kses out of block attributes. It keeps kses
 * from mangling the *comment syntax*; it does not stop core decoding the
 * attribute values and sanitising them, which is the half that mattered.
 *
 * ## Why the plugin's own policy could not prevent it
 *
 * `Migrator::guard_preserved()` already sanitises these attributes through
 * `MarkupPolicy` and `Renderer::sanitize_icon()` — a closed, reviewed allowlist
 * built for exactly this markup. But it runs on `wp_insert_post_data`, and
 * `content_save_pre` has already emptied the values by then. It was tidying a
 * field core had blanked.
 *
 * ## The fix
 *
 * Ordering, not weakening.
 *
 *   priority  9   parse the incoming content, run every GemReserve block's
 *                 attributes through the plugin's strict policy, and keep the
 *                 result.
 *   priority 10   core's `wp_filter_post_kses` runs, untouched. Core blocks —
 *                 a paragraph, a heading, anything a user might inject into —
 *                 are sanitised exactly as WordPress intends.
 *   priority 11   restore the policy-approved attributes onto the GemReserve
 *                 blocks kses just rewrote.
 *
 * So `<script>` in a core block is still removed by core, and a GemReserve
 * block's attributes are governed by the stricter of the two allowlists rather
 * than destroyed by the more generic one. `unfiltered_html` is not granted to
 * anybody, and the injection tests in `tests/run-tests.php` cover the same
 * payloads they always did.
 *
 * Restoration is keyed by walk order, which is safe because kses does not add
 * or remove blocks — verified across all 58 migrated bodies, every one of which
 * has the same block count before and after.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

final class Kses
{
    /** Policy-approved attributes for this save, in block walk order. */
    private static array $approved = [];

    private static bool $armed = false;

    public static function boot(): void
    {
        add_filter('content_save_pre', [self::class, 'capture'], 9);
        add_filter('content_save_pre', [self::class, 'restore'], 11);
    }

    /** Does this content need protecting, and is the user subject to kses? */
    private static function applies(string $content): bool
    {
        return str_contains($content, 'wp:gemreserve/')
            && has_filter('content_save_pre', 'wp_filter_post_kses') !== false;
    }

    /**
     * Priority 9 — before kses.
     *
     * Runs the plugin's strict policy and keeps the result, so what is restored
     * afterwards has been sanitised, not merely preserved.
     */
    public static function capture(string $content): string
    {
        self::$approved = [];
        self::$armed = false;

        if (!self::applies($content)) {
            return $content;
        }

        // content_save_pre receives slashed content.
        $blocks = parse_blocks(wp_unslash($content));
        $index = 0;
        self::walk($blocks, static function (array $block) use (&$index): void {
            $name = $block['blockName'] ?? '';
            if ($name === null || !str_starts_with((string) $name, 'gemreserve/')) {
                $index++;

                return;
            }
            self::$approved[$index] = self::sanitise_attrs((array) ($block['attrs'] ?? []));
            $index++;
        });

        self::$armed = self::$approved !== [];

        return $content;
    }

    /**
     * Priority 11 — after kses.
     *
     * Puts the policy-approved attributes back onto the blocks kses rewrote.
     */
    public static function restore(string $content): string
    {
        if (!self::$armed) {
            return $content;
        }
        self::$armed = false;

        $blocks = parse_blocks(wp_unslash($content));
        $index = 0;
        $blocks = self::map($blocks, static function (array $block) use (&$index): array {
            $name = $block['blockName'] ?? '';
            if ($name !== null && str_starts_with((string) $name, 'gemreserve/')
                && array_key_exists($index, self::$approved)) {
                $block['attrs'] = self::$approved[$index];
            }
            $index++;

            return $block;
        });

        self::$approved = [];

        return wp_slash(serialize_blocks($blocks));
    }

    /**
     * The plugin's own allowlist, applied to the attributes that carry markup.
     *
     * Identical in effect to `Migrator::apply_policy()`; kept here because this
     * runs earlier in the request and must not depend on the migration's
     * preserved-block bookkeeping.
     *
     * @param array<string,mixed> $attrs
     * @return array<string,mixed>
     */
    private static function sanitise_attrs(array $attrs): array
    {
        if (current_user_can('unfiltered_html')) {
            return $attrs;
        }

        foreach (['template', 'itemTemplate', 'open', 'close'] as $key) {
            if (isset($attrs[$key]) && is_string($attrs[$key]) && $attrs[$key] !== '') {
                $attrs[$key] = MarkupPolicy::filter_fragment($attrs[$key]);
            }
        }

        foreach (['slots', 'itemSlots'] as $key) {
            if (empty($attrs[$key]) || !is_array($attrs[$key])) {
                continue;
            }
            foreach ($attrs[$key] as $i => $slot) {
                if (is_array($slot) && ($slot['kind'] ?? '') === Slot::KIND_ICON) {
                    $attrs[$key][$i]['value'] = Renderer::sanitize_icon((string) ($slot['value'] ?? ''));
                }
            }
        }

        if (!empty($attrs['items']) && is_array($attrs['items'])) {
            $kinds = [];
            foreach ((array) ($attrs['itemSlots'] ?? []) as $slot) {
                if (is_array($slot) && isset($slot['key'])) {
                    $kinds[(string) $slot['key']] = (string) ($slot['kind'] ?? 'text');
                }
            }
            foreach ($attrs['items'] as $i => $item) {
                if (!is_array($item)) {
                    continue;
                }
                foreach ($item as $slot_key => $value) {
                    if (($kinds[$slot_key] ?? '') === Slot::KIND_ICON && is_string($value)) {
                        $attrs['items'][$i][$slot_key] = Renderer::sanitize_icon($value);
                    }
                }
            }
        }

        return $attrs;
    }

    /** @param array<int,array<string,mixed>> $blocks */
    private static function walk(array $blocks, callable $fn): void
    {
        foreach ($blocks as $block) {
            $fn($block);
            if (!empty($block['innerBlocks'])) {
                self::walk($block['innerBlocks'], $fn);
            }
        }
    }

    /**
     * @param array<int,array<string,mixed>> $blocks
     * @return array<int,array<string,mixed>>
     */
    private static function map(array $blocks, callable $fn): array
    {
        foreach ($blocks as $i => $block) {
            $blocks[$i] = $fn($block);
            if (!empty($blocks[$i]['innerBlocks'])) {
                $blocks[$i]['innerBlocks'] = self::map($blocks[$i]['innerBlocks'], $fn);
            }
        }

        return $blocks;
    }
}
