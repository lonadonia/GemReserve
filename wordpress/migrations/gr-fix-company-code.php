<?php
/**
 * Correct the company code inside migrated markup.
 *
 * The master instructions specify company code 307501935 with no country
 * prefix. The Next.js build carried "LT307501935", so the migration brought
 * that string across inside the body and hero markup of four pages.
 *
 * The footer and every settings-driven surface were already correct — they read
 * from Site Settings, which holds 307501935. This fixes the four occurrences
 * baked into migrated HTML.
 *
 * Narrow on purpose: only the exact token, only in the two migrated-markup
 * fields. `LT-12123` is the Vilnius postcode and must not be touched, which is
 * why the pattern is anchored to the code and not to "LT".
 *
 * Run: wp eval-file gr-fix-company-code.php --path=.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$fixed = 0;
$posts = get_posts([
    'post_type' => ['page', 'gemstone'],
    'post_status' => 'any',
    'numberposts' => -1,
    'fields' => 'ids',
]);

foreach ($posts as $id) {
    foreach (['_gr_body_html', '_gr_hero_extra_html'] as $key) {
        $html = get_post_meta($id, $key, true);
        if (!$html || !str_contains($html, 'LT307501935')) {
            continue;
        }
        $updated = str_replace('LT307501935', '307501935', $html);
        update_post_meta($id, $key, $updated);
        $fixed++;
        WP_CLI::log(sprintf('  %s: %s', get_post_field('post_name', $id), $key));
    }
}

WP_CLI::success("Corrected the company code in {$fixed} migrated field(s).");
