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

    // Migrated body sections. Rendered raw against the ported stylesheet: this
    // is the approved design's own markup, and running it through wp_kses would
    // strip the SVG diagrams and the data attributes the layout depends on.
    // It is not editor input — only the migration and an administrator can set
    // it — so the trust boundary is the same as a theme template's.
    $body = gr_field('body_html');
    if ($body) {
        echo gemreserve_prepare_body_html($body); // phpcs:ignore WordPress.Security.EscapeOutput
    }
endwhile;
get_footer();
