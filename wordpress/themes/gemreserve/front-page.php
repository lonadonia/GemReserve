<?php
/**
 * Home. Same machinery as page.php — the homepage is a page with sections, and
 * giving it a bespoke template would only mean two places to keep in step.
 */
declare(strict_types=1);
get_header();
while (have_posts()) :
    the_post();
    get_template_part('parts/hero');
    gemreserve_render_sections(gr_sections());

    // The page body. See page.php for why both eras are handled: a migrated
    // page renders from blocks, one that has not been migrated yet renders from
    // the legacy meta blob exactly as before.
    if (gemreserve_body_is_blocks()) {
        gemreserve_render_block_body();
    } else {
        $body = gr_field('body_html');
        if ($body) {
            echo gemreserve_prepare_body_html($body); // phpcs:ignore WordPress.Security.EscapeOutput
        }
    }
endwhile;
get_footer();
