<?php
/**
 * Requalify four unsupported figures in the migrated page markup.
 *
 *   wp eval-file gr-requalify-claims.php [dry] --path=.
 *
 * "25+ Gemstone Types Available", "18 Countries Served", "10+ Gemstone
 * Programs" and "100% Backed by Real Assets" each stated a figure nothing on
 * record supports. Rather than delete the cards — which would leave the strips
 * and the highlights panel visibly short — each keeps its place, its icon and
 * its subject, and the figure slot carries a status instead.
 *
 * Text nodes only. The replacements are anchored on the exact element that
 * holds the figure, so no attribute, class or SVG path is touched.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$dry = in_array('dry', $args ?? [], true);

/**
 * One replacement: an exact old fragment and its new form.
 *
 * Written out in full rather than assembled from parts, so what lands in the
 * database is reviewable here rather than inferred from a pattern.
 */
$edits = [
    'assets' => [
        // <dt><span>25+</span></dt><dd>Gemstone Types<small>Available</small></dd>
        [
            '<dt><span>25+</span></dt><dd>Gemstone Types<small>Available</small></dd>',
            '<dt><span>Listed</span></dt><dd>Gemstone Types<small>In the published catalogue</small></dd>',
        ],
        // <dt><span>18</span></dt><dd>Countries<small>Served</small></dd>
        [
            '<dt><span>18</span></dt><dd>Countries<small>Served</small></dd>',
            '<dt><span>Pending</span></dt><dd>Jurisdictions<small>Eligibility to be published</small></dd>',
        ],
    ],
    'gemstone-programs' => [
        ['<dt>10+</dt><dd>Gemstone Programs</dd>',
         '<dt>Illustrative</dt><dd>Gemstone programs, pending launch</dd>'],
        ['<dt>25+</dt><dd>Gemstone Types Available</dd>',
         '<dt>Listed</dt><dd>Gemstone types in the catalogue</dd>'],
        ['<dt>18</dt><dd>Countries Served</dd>',
         '<dt>Pre-launch</dt><dd>Jurisdiction eligibility</dd>'],
        ['<dt>100%</dt><dd>Backed by Real Assets</dd>',
         '<dt>Pending</dt><dd>Independent reserve attestation</dd>'],
    ],
];

$applied = 0;
$missing = [];

foreach ($edits as $slug => $pairs) {
    $found = get_posts([
        'name' => $slug, 'post_type' => 'page', 'post_status' => 'publish',
        'numberposts' => 1,
    ]);
    if (!$found) {
        WP_CLI::error("page not found: {$slug}");
    }
    $id = $found[0]->ID;

    foreach (['_gr_body_html', '_gr_hero_extra_html'] as $key) {
        $html = get_post_meta($id, $key, true);
        if (!is_string($html) || $html === '') {
            continue;
        }
        $changed = 0;
        foreach ($pairs as [$from, $to]) {
            $n = substr_count($html, $from);
            if ($n === 0) {
                continue;
            }
            if ($n > 1) {
                WP_CLI::error("{$slug}/{$key}: fragment appears {$n} times, refusing an ambiguous edit:\n  {$from}");
            }
            $html = str_replace($from, $to, $html);
            $changed++;
            $applied++;
            WP_CLI::log("  {$slug}/{$key}: " . substr($from, 0, 58) . '…');
        }
        if ($changed && !$dry) {
            update_post_meta($id, $key, $html);
        }
    }
}

// Every old figure must be gone from every page, not just the two edited.
$stale = ['25+', '100%', '10+', 'Countries Served', 'Backed by Real Assets', 'Gemstone Types Available'];
foreach (get_posts(['post_type' => 'page', 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids']) as $pid) {
    foreach (['_gr_body_html', '_gr_hero_extra_html'] as $key) {
        $html = get_post_meta($pid, $key, true);
        if (!is_string($html)) {
            continue;
        }
        foreach ($stale as $needle) {
            if (str_contains($html, $needle)) {
                $missing[] = get_post_field('post_name', $pid) . "/{$key}: {$needle}";
            }
        }
    }
}

WP_CLI::log(sprintf('%d replacement(s)%s', $applied, $dry ? ' [dry run, nothing written]' : ''));
if ($missing) {
    WP_CLI::warning("Old wording still present elsewhere:\n  " . implode("\n  ", array_unique($missing)));
} else {
    WP_CLI::success('No old figure remains on any published page.');
}
