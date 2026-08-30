<?php
/**
 * Gemstone detail.
 *
 * The evidence state decides what this page is allowed to look like. Anything
 * below "Verified" renders a standing sample notice above the specification, so
 * an illustrative record cannot read as held inventory no matter what an editor
 * typed into the fields.
 */
declare(strict_types=1);

get_header();

while (have_posts()) :
    the_post();
    $id = get_the_ID();
    $evidence = gr_field('evidence_state', $id, 'illustrative');
    $states = gemreserve_evidence_states();

    get_template_part('parts/hero');
    ?>

    <?php if ($evidence !== 'verified') : ?>
        <section class="container-wide" style="margin-top:calc(var(--section-gap) * 0.5)">
            <p class="verification-card__note" role="note">
                <?php echo gemreserve_icon('alert-triangle', 22); ?>
                <span><strong><?php echo esc_html($states[$evidence] ?? $evidence); ?>.</strong>
                The specification below describes this programme. It is not a record of a stone held today.</span>
            </p>
        </section>
    <?php endif; ?>

    <?php
    $spec = [
        'Species' => gr_field('species', $id),
        'Variety' => gr_field('variety', $id),
        'Origin' => gr_field('origin', $id),
        'Weight' => trim(gr_field('weight', $id) . ' ' . gr_field('weight_unit', $id)),
        'Colour' => gr_field('colour', $id),
        'Clarity' => gr_field('clarity', $id),
        'Hardness (Mohs)' => gr_field('hardness', $id),
        'Quality' => gr_field('quality', $id),
        'Treatment' => gr_field('treatment', $id),
    ];
    $spec = array_filter($spec, static fn($v) => trim((string) $v) !== '');
    if ($spec) : ?>
        <section class="container-wide" style="margin-top:var(--section-gap)">
            <div class="motion-reveal is-visible">
                <?php gemreserve_section_heading('Specification'); ?>
            </div>
            <div class="motion-reveal is-visible verification-card">
                <dl class="program-details">
                    <?php foreach ($spec as $label => $value) : ?>
                        <div>
                            <dt><?php echo esc_html($label); ?></dt>
                            <dd><?php echo esc_html((string) $value); ?></dd>
                        </div>
                    <?php endforeach; ?>
                </dl>
                <?php
                $issuer = gr_field('lab_report_issuer', $id);
                $number = gr_field('lab_report_number', $id);
                if ($issuer || $number) : ?>
                    <p class="verification-card__note" role="note">
                        <?php echo gemreserve_icon('certificate', 22); ?>
                        <span>Report <?php echo esc_html($number ?: '—'); ?><?php echo $issuer ? ', issued by ' . esc_html($issuer) : ''; ?>.
                        A laboratory named here issued the report; it is not a partner of GemReserve.io.</span>
                    </p>
                <?php endif; ?>
            </div>
        </section>
    <?php endif;

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

    if (trim(get_the_content())) : ?>
        <section class="container-wide" style="margin-top:var(--section-gap)">
            <div class="motion-reveal is-visible page-copy"><?php the_content(); ?></div>
        </section>
    <?php endif;
endwhile;

get_footer();
