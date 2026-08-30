<?php
/**
 * A single announcement.
 *
 * The newsroom's own page. It reuses the /news art direction — the same hero
 * variant and the same panel — rather than introducing a shape the archive
 * does not contain, because nothing in the approved design was drawn for this
 * view and inventing one would be a redesign.
 */
declare(strict_types=1);

get_header();

while (have_posts()) :
    the_post();
    $gr_id = get_the_ID();
    $gr_standfirst = (string) gr_field('standfirst', $gr_id);
    $gr_category = gemreserve_news_category($gr_id, 'Announcement');
    ?>
    <section class="hero news-hero" aria-labelledby="gr-hero-title">
        <div class="hero__inner news-hero__inner container-wide">
            <div class="motion-reveal is-visible hero__copy news-hero__copy">
                <?php gemreserve_breadcrumbs(); ?>
                <h1 class="hero__title" id="gr-hero-title"><span><?php the_title(); ?></span></h1>
                <p class="news-entry__meta">
                    <span class="news-entry__category"><?php echo esc_html($gr_category); ?></span>
                    <span class="news-entry__date"><?php echo esc_html(get_the_date('j F Y', $gr_id)); ?></span>
                </p>
            </div>
        </div>
    </section>

    <section class="news-body news-body--single container-wide">
        <div class="motion-reveal is-visible news-panel">
            <div class="news-single__body">
                <?php if (has_post_thumbnail($gr_id)) : ?>
                    <figure class="news-single__cover">
                        <?php the_post_thumbnail('large', ['alt' => '']); ?>
                    </figure>
                <?php endif; ?>

                <?php if ($gr_standfirst !== '') : ?>
                    <p class="news-single__standfirst"><?php echo esc_html($gr_standfirst); ?></p>
                <?php endif; ?>

                <?php the_content(); ?>

                <p class="news-single__back">
                    <a href="<?php echo esc_url(home_url('/news/')); ?>">Back to News &amp; Announcements</a>
                </p>
            </div>
        </div>
    </section>
    <?php
endwhile;

get_footer();
