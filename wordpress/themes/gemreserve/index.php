<?php
/**
 * Fallback template. Every real surface has its own family under templates/;
 * this exists so the hierarchy is always satisfiable.
 */
declare(strict_types=1);
get_header();
?>
<section class="container-wide" style="padding-block: var(--section-gap)">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <h1 class="hero__title"><?php the_title(); ?></h1>
        <div class="page-copy"><?php the_content(); ?></div>
    <?php endwhile; else : ?>
        <h1 class="hero__title">Nothing here</h1>
    <?php endif; ?>
</section>
<?php
get_footer();
