<?php
/**
 * The shared hero. Every page family uses it; per-page variation comes from
 * fields and from the page's own wrapper class, exactly as before.
 */
declare(strict_types=1);

$gr_id = get_the_ID();
$gr_lines = array_values(array_filter(array_map('trim', explode("\n", gr_field('hero_title_lines', $gr_id) ?: get_the_title($gr_id)))));
$gr_desktop = gr_field('hero_image_desktop', $gr_id);
$gr_mobile = gr_field('hero_image_mobile', $gr_id);
// The class prefix the original component used. It does not follow from the
// slug — /independent-verification used "verification-hero" — so it is stored
// per page by the migration rather than guessed here.
$gr_prefix = gr_field('hero_class', $gr_id) ?: (get_post_field('post_name', $gr_id) . '-hero');
?>
<section class="hero <?php echo esc_attr($gr_prefix); ?>" aria-labelledby="gr-hero-title">
    <?php if ($gr_desktop) : ?>
        <div class="hero__media" aria-hidden="true">
            <?php gr_hero_image($gr_desktop, $gr_mobile); ?>
            <span class="hero__scrim <?php echo esc_attr($gr_prefix . '__scrim'); ?>"></span>
        </div>
    <?php endif; ?>

    <div class="hero__inner <?php echo esc_attr($gr_prefix . '__inner'); ?> container-wide">
        <div class="motion-reveal is-visible hero__copy <?php echo esc_attr($gr_prefix . '__copy'); ?>">
            <?php gemreserve_breadcrumbs(); ?>
            <h1 class="hero__title" id="gr-hero-title">
                <?php foreach ($gr_lines as $i => $line) : ?>
                    <span<?php echo $i === count($gr_lines) - 1 && count($gr_lines) > 1 ? ' class="hero__title-accent"' : ''; ?>><?php echo esc_html($line); ?></span>
                <?php endforeach; ?>
            </h1>
            <?php if ($t = gr_field('hero_tagline', $gr_id)) : ?>
                <p class="<?php echo esc_attr($gr_prefix . '__tagline'); ?>"><?php echo esc_html($t); ?></p>
            <?php endif; ?>
            <?php if ($d = gr_field('hero_description', $gr_id)) : ?>
                <p class="hero__description"><?php echo esc_html($d); ?></p>
            <?php endif; ?>
        </div>

        <?php
        // Staged hero content: the report card, metrics panel or preview some
        // heroes carry beside the copy. Migrated markup against the ported
        // stylesheet, same trust boundary as the body sections.
        $gr_extra = gr_field('hero_extra_html', $gr_id);
        if ($gr_extra) {
            echo gemreserve_prepare_body_html($gr_extra); // phpcs:ignore WordPress.Security.EscapeOutput
        }
        ?>
    </div>
</section>
