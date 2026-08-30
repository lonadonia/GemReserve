<?php
/**
 * The global shell's top half. Markup mirrors components/layout/SiteHeader.tsx
 * so the ported stylesheet applies unchanged.
 */
declare(strict_types=1);
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link" href="#main-content">Skip to content</a>

<div class="<?php echo esc_attr(gemreserve_page_class()); ?>">
<header class="site-header">
    <?php if (gemreserve_show_announcement()) : ?>
        <div class="announcement-bar">
            <span class="announcement-gem" aria-hidden="true">&#9671;</span>
            <p><?php echo esc_html(gemreserve_setting('announcement_message')); ?></p>
            <div class="announcement-actions">
                <a class="announcement-login" href="<?php echo esc_url(home_url('/participant-portal')); ?>">Login</a>
                <a href="<?php echo esc_url(gemreserve_setting('waitlist_href')); ?>"><?php echo esc_html(gemreserve_setting('waitlist_label')); ?></a>
            </div>
        </div>
    <?php endif; ?>

    <div class="site-nav-shell">
        <a class="brand-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="GemReserve.io home">
            <img src="<?php echo esc_url(gr_asset('/brand/gemreserve-horizontal-1200.webp')); ?>" alt="GemReserve.io" width="1200" height="260">
        </a>

        <nav class="desktop-nav" aria-label="Primary navigation">
            <?php gemreserve_render_desktop_nav(); ?>
        </nav>

        <div class="header-actions">
            <?php if (!gemreserve_show_announcement()) : ?>
                <a class="login-link" href="<?php echo esc_url(home_url('/participant-portal')); ?>">Login</a>
            <?php endif; ?>
            <a class="button button--small button--outline" href="<?php echo esc_url(gemreserve_setting('waitlist_href')); ?>">
                <?php echo esc_html(gemreserve_setting('waitlist_label')); ?>
            </a>
        </div>

        <button class="mobile-menu-trigger" type="button" aria-label="Open navigation" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </div>

    <div class="mobile-navigation" aria-hidden="true">
        <button class="mobile-navigation-backdrop" type="button" aria-label="Close navigation" tabindex="-1"></button>
        <div class="mobile-navigation-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <div class="mobile-navigation-header">
                <a class="brand-logo brand-logo--compact" href="<?php echo esc_url(home_url('/')); ?>">
                    <img src="<?php echo esc_url(gr_asset('/brand/gemreserve-horizontal-1200.webp')); ?>" alt="GemReserve.io" width="1200" height="260">
                </a>
                <button type="button" aria-label="Close navigation">&times;</button>
            </div>
            <nav aria-label="Mobile primary navigation">
                <?php gemreserve_render_mobile_nav(); ?>
            </nav>
            <a class="button button--gold mobile-navigation-cta" href="<?php echo esc_url(gemreserve_setting('waitlist_href')); ?>">
                <?php echo esc_html(gemreserve_setting('waitlist_label')); ?>
            </a>
        </div>
    </div>
</header>

<main id="main-content">
