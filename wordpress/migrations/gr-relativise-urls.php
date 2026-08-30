<?php
/**
 * Strip the staging origin out of stored links.
 *
 *   wp eval-file gr-relativise-urls.php [dry] --path=.
 *
 * The migration wrote absolute URLs into the navigation and into some migrated
 * markup, built from home_url() at a time when home_url() was the staging
 * server. 205 rows therefore carried http://127.0.0.1:3200 — and because they
 * are stored strings, not generated ones, fixing WP_HOME does not touch them.
 * Every internal link on the site would have pointed at localhost in
 * production while the canonical tag, og:url and admin URLs all looked right.
 *
 * They become root-relative rather than absolute-to-production: "/about"
 * works on staging, on production and on whatever the host is next, and it is
 * what the rest of the migrated markup already uses. Nothing here needs an
 * absolute URL — WordPress builds those from WP_HOME at render time.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$dry = in_array('dry', $args ?? [], true);

global $wpdb;

// Any loopback origin with any port, so a re-run after a port change still
// catches it. Anchored on the scheme so it cannot match inside prose.
$pattern = '#https?://127\.0\.0\.1(?::\d+)?#';

$rows = $wpdb->get_results(
    "SELECT meta_id, post_id, meta_key, meta_value FROM {$wpdb->postmeta}
     WHERE meta_value REGEXP 'https?://127\\\\.0\\\\.0\\\\.1'"
);

$changed = 0;
$by_key = [];

foreach ($rows as $row) {
    $value = preg_replace($pattern, '', $row->meta_value);
    if ($value === null || $value === $row->meta_value) {
        continue;
    }

    // A link that was exactly the origin becomes "", which is not a link.
    // Give it the site root instead.
    if (in_array($row->meta_key, ['_menu_item_url'], true) && trim($value) === '') {
        $value = '/';
    }

    if ($row->meta_key === '_gr_section_json') {
        json_decode($value, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            WP_CLI::error("post {$row->post_id}/{$row->meta_key}: edit would leave invalid JSON — aborting.");
        }
    }

    $changed++;
    $by_key[$row->meta_key] = ($by_key[$row->meta_key] ?? 0) + 1;

    if (!$dry) {
        // wp_slash, because update_metadata() unslashes on the way in and would
        // otherwise strip a level of backslashes from the whole field.
        update_post_meta($row->post_id, $row->meta_key, wp_slash($value));
    }
}

ksort($by_key);
foreach ($by_key as $key => $n) {
    WP_CLI::log(sprintf('  %-24s %d row(s)', $key, $n));
}

if (!$dry) {
    $left = (int) $wpdb->get_var(
        "SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_value REGEXP 'https?://127\\\\.0\\\\.0\\\\.1'"
    );
    if ($left > 0) {
        WP_CLI::error("{$left} row(s) still carry a loopback URL.");
    }
    WP_CLI::log('  verified: 0 rows left with a loopback URL');
}

WP_CLI::success(sprintf('%d row(s) relativised%s', $changed, $dry ? ' [dry run, nothing written]' : ''));
