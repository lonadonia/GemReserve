<?php
/**
 * Remove metric cards left empty by an earlier claim removal.
 *
 *   wp eval-file gr-drop-empty-metrics.php [dry] --path=.
 *
 * When "1,850+ Verified Assets" and "$186M+ Total Asset Value" were taken off
 * /assets, the walker matched the inner <div> holding the <dt>/<dd> rather than
 * the .metric-item wrapper around it. The figures went; two wrappers stayed,
 * each still carrying its icon. The strip rendered four cells — two real, two
 * showing an icon and nothing else — and because the panel's height is set by
 * its tallest cell, the height-based parity check had no reason to complain.
 *
 * This removes any .metric-item that no longer contains a <dt>, which is the
 * definition of a card with nothing to say.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$dry = in_array('dry', $args ?? [], true);
$removed_total = 0;

foreach (get_posts(['post_type' => 'page', 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids']) as $id) {
    foreach (['_gr_body_html', '_gr_hero_extra_html'] as $key) {
        $html = get_post_meta($id, $key, true);
        if (!is_string($html) || !str_contains($html, 'metric-item')) {
            continue;
        }

        $removed = 0;
        $offset = 0;
        while (($start = strpos($html, '<div class="metric-item"', $offset)) !== false) {
            // Find this div's matching close, counting nested divs.
            $depth = 0;
            $i = $start;
            $end = null;
            while ($i < strlen($html)) {
                $open = strpos($html, '<div', $i);
                $close = strpos($html, '</div>', $i);
                if ($close === false) {
                    break;
                }
                if ($open !== false && $open < $close) {
                    $depth++;
                    $i = $open + 4;
                    continue;
                }
                $depth--;
                $i = $close + 6;
                if ($depth === 0) {
                    $end = $i;
                    break;
                }
            }
            if ($end === null) {
                break;
            }
            $card = substr($html, $start, $end - $start);
            if (!str_contains($card, '<dt')) {
                $html = substr($html, 0, $start) . substr($html, $end);
                $removed++;
                $offset = $start;          // re-scan from here
                continue;
            }
            $offset = $end;
        }

        if ($removed) {
            $slug = get_post_field('post_name', $id);
            WP_CLI::log(sprintf('  %s/%s: removed %d empty card(s)%s', $slug, $key, $removed, $dry ? ' [dry]' : ''));
            $removed_total += $removed;
            if (!$dry) {
                update_post_meta($id, $key, $html);
            }
        }
    }
}

WP_CLI::success(sprintf('%d empty metric card(s)%s', $removed_total, $dry ? ' found' : ' removed'));
