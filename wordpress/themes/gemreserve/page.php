<?php
/**
 * The general page family: hero, migrated sections, then any editor prose.
 *
 * 55 of the 58 routes are this template. The families under templates/ exist
 * for the three shapes that genuinely differ.
 */
declare(strict_types=1);

get_header();

while (have_posts()) :
    the_post();
    get_template_part('parts/hero');

    $sections = gr_sections();
    if ($sections) {
        gemreserve_render_sections($sections);
    }

    // Migrated body sections. Rendered raw against the ported stylesheet: this
    // is the approved design's own markup, and running it through wp_kses would
    // strip the SVG diagrams and the data attributes the layout depends on.
    // It is not editor input — only the migration and an administrator can set
    // it — so the trust boundary is the same as a theme template's.
    $body = gr_field('body_html');
    if ($body) {
        echo gemreserve_prepare_body_html($body); // phpcs:ignore WordPress.Security.EscapeOutput
    }

    $content = trim(get_the_content());
    if ($content) : ?>
        <section class="container-wide" style="margin-top:var(--section-gap)">
            <div class="motion-reveal is-visible page-copy"><?php the_content(); ?></div>
        </section>
    <?php endif;
endwhile;

get_footer();
