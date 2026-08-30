<?php
/**
 * Requalify the backing/solvency claim family across every page.
 *
 *   wp eval-file gr-requalify-backing.php <map.json> [dry] --path=.
 *
 * The site asserted current reserve backing as established fact in about
 * seventy places — "100% BACKED", "Every token is backed 1:1", "fully backed",
 * "Backed by real assets" — with no admitted-reserve evidence behind any of it.
 * Each is rewritten to name the design, or to gate the assertion on
 * verification that has not happened yet.
 *
 * The map is an explicit list of exact old/new text, generated from the same
 * list applied to the Next.js source, so the two stay in step. It is NOT
 * derived from a diff: a mis-paired hunk would rewrite the wrong sentence.
 *
 * What this deliberately does not touch: "100% natural" and "100% untreated"
 * on the gemstone pages. Those are gemological descriptions of an unenhanced
 * stone, not claims about reserves, and there are forty-four of them.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$map_path = $args[0] ?? '';
$dry = in_array('dry', $args ?? [], true);
if (!$map_path || !is_readable($map_path)) {
    WP_CLI::error('Usage: wp eval-file gr-requalify-backing.php <map.json> [dry]');
}
$map = json_decode((string) file_get_contents($map_path), true);
if (!is_array($map)) {
    WP_CLI::error('Map did not parse.');
}

// Every text-bearing field, not just the body. The hero description and
// tagline carry the page's opening claim on most routes, and the first pass
// missed them: ten assertions survived in fields the map never opened.
$keys = ['_gr_body_html', '_gr_hero_extra_html', '_gr_section_json',
         '_gr_hero_description', '_gr_hero_tagline', '_gr_hero_title_lines',
         '_gr_hero_eyebrow', '_gr_seo_description', '_gr_seo_title'];

$pages = get_posts([
    'post_type' => ['page', 'gemstone'],
    'post_status' => 'publish',
    'numberposts' => -1,
    'fields' => 'ids',
]);

$total = 0;
$touched = [];

foreach ($pages as $id) {
    $slug = get_post_field('post_name', $id);
    foreach ($keys as $key) {
        $value = get_post_meta($id, $key, true);
        if (!is_string($value) || $value === '') {
            continue;
        }
        $before = $value;
        $hits = 0;
        $is_json = $key === '_gr_section_json';

        foreach ($map as [$old, $new]) {
            // The section JSON holds the same text with JSON escaping, so the
            // encoded form has to be matched there — and ONLY there. Writing a
            // JSON-escaped string into an HTML field puts a literal \u2014 in
            // the markup, and the wp_unslash below then eats the backslash and
            // leaves the reader the word "u2014".
            $pairs = $is_json
                ? [[trim(json_encode($old), '"'), trim(json_encode($new), '"')], [$old, $new]]
                : [[$old, $new]];

            foreach ($pairs as [$o, $nw]) {
                $n = substr_count($value, $o);
                if ($n > 0) {
                    $value = str_replace($o, $nw, $value);
                    $hits += $n;
                }
            }
        }
        if ($hits > 0) {
            $total += $hits;
            $touched[$slug] = ($touched[$slug] ?? 0) + $hits;
            if ($is_json) {
                json_decode($value, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    WP_CLI::error("{$slug}/{$key}: edit would leave invalid JSON — aborting.");
                }
            }
            if (!$dry) {
                // update_metadata() runs wp_unslash() on the value, which
                // strips a level of backslashes from the whole field — every
                // JSON \uXXXX escape in it, not only the part edited here.
                // Slashing on the way in cancels that out exactly.
                update_post_meta($id, $key, wp_slash($value));
            }
        }
        unset($before);
    }
}

ksort($touched);
foreach ($touched as $slug => $n) {
    WP_CLI::log(sprintf('  %-34s %d', $slug, $n));
}
WP_CLI::success(sprintf(
    '%d replacement(s) across %d page(s)%s',
    $total, count($touched), $dry ? ' [dry run, nothing written]' : ''
));
