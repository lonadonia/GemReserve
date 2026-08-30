<?php
/**
 * Store each page's original CSS class prefix.
 *
 * The ported stylesheet is keyed on the class names the React pages used —
 * `.verification-hero`, `.fraud-page` and so on — and those do not follow from
 * the slug. `/independent-verification` used `verification-hero`, and
 * `/anti-fraud-notice` used `fraud-hero`. Deriving the class from the slug gets
 * both wrong and silently drops every per-page rule.
 *
 * So the mapping is read out of the original page components and stored per
 * post. The theme reads it; nothing is guessed.
 *
 * Run: wp eval-file gr-import-classes.php <classmap.tsv> --path=.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$file = $args[0] ?? '';
if (!$file || !file_exists($file)) {
    WP_CLI::error('Usage: wp eval-file gr-import-classes.php <classmap.tsv>');
}

$rows = array_filter(array_map('trim', file($file)));
array_shift($rows); // header
$applied = 0;
$missing = [];

foreach ($rows as $row) {
    [$route, $heroClass, $pageClass] = array_pad(explode("\t", $row), 3, '');
    $slug = $route === '/' ? null : trim($route, '/');

    if ($slug === null) {
        $id = (int) get_option('page_on_front');
    } else {
        $found = get_posts([
            'name' => $slug, 'post_type' => ['page', 'gemstone'],
            'post_status' => 'publish', 'numberposts' => 1, 'fields' => 'ids',
        ]);
        $id = $found[0] ?? 0;
    }
    if (!$id) {
        $missing[] = $route;
        continue;
    }
    update_post_meta($id, '_gr_hero_class', $heroClass);
    update_post_meta($id, '_gr_page_class', $pageClass);
    $applied++;
}

// The eighteen gemstone pages all share one component and one class prefix.
foreach (get_posts(['post_type' => 'gemstone', 'numberposts' => -1, 'fields' => 'ids']) as $id) {
    if (!get_post_meta($id, '_gr_hero_class', true)) {
        update_post_meta($id, '_gr_hero_class', 'gem-hero');
        update_post_meta($id, '_gr_page_class', 'gemstone-page');
        $applied++;
    }
}

WP_CLI::success("Applied class prefixes to {$applied} records.");
if ($missing) {
    WP_CLI::warning('No post for: ' . implode(', ', $missing));
}
