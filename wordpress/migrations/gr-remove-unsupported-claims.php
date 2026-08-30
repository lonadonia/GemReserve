<?php
/**
 * Remove two unsubstantiated holdings claims from the migrated page markup.
 *
 *   wp eval-file gr-remove-unsupported-claims.php [--dry] --path=.
 *
 * "1,850+ Verified Assets In Vaults" and "$186M+ Total Asset Value" stated, in
 * the present tense and without qualification, that the company holds a
 * specific quantity and value of customer assets. Nothing substantiates either
 * figure. They are removed rather than reduced: inventing a smaller number
 * would be the same claim with better manners.
 *
 * The match is anchored on the figure inside its own <div class="metric-item">
 * (or <li> on the programs page) and takes only that element. It is deliberately
 * narrow — a looser pattern would take the surrounding strip with it.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$dry = in_array('dry', $args ?? [], true) || in_array('--dry', $args ?? [], true);

/** Remove the one element containing $needle, balanced on $tag. */
function gr_strip_element(string $html, string $tag, string $needle): array
{
    $removed = 0;
    $offset = 0;
    while (($pos = strpos($html, $needle, $offset)) !== false) {
        // Walk back to the opening tag that encloses this figure.
        $start = strrpos(substr($html, 0, $pos), '<' . $tag);
        if ($start === false) {
            $offset = $pos + strlen($needle);
            continue;
        }
        // Walk forward, counting nesting, to the matching close.
        $depth = 0;
        $i = $start;
        $end = null;
        $len = strlen($html);
        while ($i < $len) {
            $open = strpos($html, '<' . $tag, $i);
            $close = strpos($html, '</' . $tag . '>', $i);
            if ($close === false) {
                break;
            }
            if ($open !== false && $open < $close) {
                $depth++;
                $i = $open + strlen($tag) + 1;
                continue;
            }
            $depth--;
            $i = $close + strlen($tag) + 3;
            if ($depth === 0) {
                $end = $i;
                break;
            }
        }
        if ($end === null || $end <= $pos) {
            // The element that opened here closes before the figure, so it does
            // not contain it. Anything removed on that basis would be unrelated
            // markup.
            $offset = $pos + strlen($needle);
            continue;
        }
        $html = substr($html, 0, $start) . substr($html, $end);
        $removed++;
        $offset = $start;
    }
    return [$html, $removed];
}

global $wpdb;
$targets = [
    ['slug' => 'assets',            'tag' => 'div', 'needles' => ['1,850+', '$186M+']],
    ['slug' => 'gemstone-programs', 'tag' => 'div', 'needles' => ['1,850+']],
];

foreach ($targets as $t) {
    $found = get_posts([
        'name' => $t['slug'], 'post_type' => 'page', 'post_status' => 'publish',
        'numberposts' => 1,
    ]);
    if (!$found) {
        WP_CLI::warning("page not found: {$t['slug']}");
        continue;
    }
    $id = $found[0]->ID;

    foreach (['_gr_body_html', '_gr_hero_extra_html'] as $key) {
        $html = get_post_meta($id, $key, true);
        if (!is_string($html) || $html === '') {
            continue;
        }
        $before = strlen($html);
        $total = 0;
        foreach ($t['needles'] as $needle) {
            if (!str_contains($html, $needle)) {
                continue;
            }
            [$html, $n] = gr_strip_element($html, $t['tag'], $needle);
            $total += $n;
        }
        if ($total === 0) {
            continue;
        }
        foreach ($t['needles'] as $needle) {
            if (str_contains($html, $needle)) {
                WP_CLI::error("{$t['slug']}/{$key}: {$needle} still present after removal — aborting.");
            }
        }
        WP_CLI::log(sprintf(
            '%s %s: removed %d element(s), %d -> %d bytes%s',
            $t['slug'], $key, $total, $before, strlen($html), $dry ? ' [dry run]' : ''
        ));
        if (!$dry) {
            update_post_meta($id, $key, $html);
        }
    }
}

WP_CLI::success($dry ? 'Dry run complete; nothing written.' : 'Claims removed.');
