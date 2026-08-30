<?php
/**
 * The global shell's lower half. Mirrors components/layout/SiteFooter.tsx.
 * Every corporate string comes from GemReserve Site Settings.
 */
declare(strict_types=1);
?>
</main>

<footer class="site-footer">
    <div class="footer-grid container-wide">
        <div class="footer-brand">
            <a class="brand-logo brand-logo--compact" href="<?php echo esc_url(home_url('/')); ?>">
                <img src="<?php echo esc_url(gr_asset('/brand/gemreserve-horizontal-1200.webp')); ?>" alt="GemReserve.io" width="1200" height="260">
            </a>
            <p><?php echo esc_html(gemreserve_setting('footer_blurb')); ?></p>
            <p class="footer-location">
                <span aria-hidden="true"><?php echo esc_html(gemreserve_setting('company_flag')); ?></span>
                <?php echo esc_html(gemreserve_setting('company_city') . ', ' . gemreserve_setting('company_country')); ?>
            </p>
            <?php
            // The Anti-Fraud Notice states that GemReserve operates no social
            // account, so these are markers rather than links — which is what
            // the approved design already does. Turning the setting on swaps
            // them for real links, and must not be done before the accounts
            // genuinely exist.
            if (gemreserve_flag('social_enabled')) : ?>
                <div class="footer-socials">
                    <?php wp_nav_menu(['theme_location' => 'footer_social', 'container' => false, 'fallback_cb' => false]); ?>
                </div>
            <?php else : ?>
                <div class="footer-socials" aria-label="Social channels coming soon">
                    <?php foreach (['X' => 'X', 'in' => 'in', 'Instagram' => '◎', 'Telegram' => '↗', 'YouTube' => '▶'] as $name => $glyph) : ?>
                        <span aria-disabled="true" title="Coming soon"><?php echo esc_html($glyph); ?></span>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <?php
        foreach ([
            ['footer_platform', 'Platform'],
            ['footer_assets', 'Assets'],
            ['footer_how', 'How It Works'],
            ['footer_technology', 'Technology'],
            ['footer_enterprise', 'Enterprise'],
            ['footer_investors', 'Investors'],
            ['footer_company', 'Company'],
            ['footer_resources', 'Resources'],
            ['footer_participation', 'Early Participation'],
        ] as [$location, $heading]) {
            gemreserve_render_footer_column($location, $heading);
        }
        ?>
    </div>

    <div class="footer-bottom container-wide">
        <p><?php echo esc_html(gemreserve_setting('footer_copyright')); ?></p>
        <p class="footer-legal"><?php echo esc_html(gemreserve_legal_line()); ?></p>
        <p class="footer-motto">
            <span aria-hidden="true">&#9671;</span> <?php echo esc_html(gemreserve_setting('footer_motto')); ?>
        </p>
        <p class="footer-tagline"><?php echo esc_html(gemreserve_setting('footer_tagline')); ?></p>
    </div>
</footer>
</div>

<?php wp_footer(); ?>
</body>
</html>
