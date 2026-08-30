<?php
/**
 * Make the migrated forms real.
 *
 * The forms came across from the Next.js build with the right labels, fields
 * and classes, but no action, no method and no CSRF token — React handled
 * submission in JavaScript. Rather than rebuild the markup and risk the design,
 * this injects what a WordPress form needs into what is already there:
 * action/method on the <form>, the hidden token block after it, and a status
 * region the redirect can address.
 *
 * The field names carried across too, so only two need mapping: the waitlist
 * form's camelCase firstName/lastName become first_name/last_name.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Which form a page's markup carries, from its class. */
function gemreserve_form_type_for(string $class): string
{
    if (str_contains($class, 'waitlist-form')) {
        return 'gr_waitlist';
    }
    if (str_contains($class, 'contact-form')) {
        // The early-participation page uses the contact-form class for the
        // waitlist signup, so the page decides rather than the class alone.
        $slug = get_post_field('post_name', get_the_ID());
        return in_array($slug, ['early-participation', 'early-participation-program'], true)
            ? 'gr_waitlist'
            : 'gr_contact';
    }
    return '';
}

/** The hidden block every form needs. */
function gemreserve_form_tokens(string $type): string
{
    ob_start();
    ?>
    <input type="hidden" name="action" value="gr_submit">
    <input type="hidden" name="gr_form" value="<?php echo esc_attr($type); ?>">
    <input type="hidden" name="gr_t" value="<?php echo esc_attr((string) time()); ?>">
    <?php wp_nonce_field('gr_form_' . $type, 'gr_nonce', false); ?>
    <?php
    // Honeypot. Hidden from people with CSS and from screen readers with
    // aria-hidden and tabindex, so nobody who should be filling this form in
    // ever meets it.
    ?>
    <div class="gr-hp" aria-hidden="true">
        <label for="gr_website_<?php echo esc_attr($type); ?>">Leave this field empty</label>
        <input type="text" id="gr_website_<?php echo esc_attr($type); ?>" name="gr_website"
               tabindex="-1" autocomplete="off" value="">
    </div>
    <?php
    return (string) ob_get_clean();
}

/** The result banner, rendered from the redirect's query string. */
function gemreserve_form_status(): string
{
    $result = isset($_GET['gr_result']) ? sanitize_key($_GET['gr_result']) : '';
    if ($result === '') {
        return '<div id="gr-form-status" class="gr-form-status" role="status" aria-live="polite"></div>';
    }

    $messages = [
        'sent' => ['ok', 'Thank you — your message has been received and recorded.'],
        'invalid' => ['error', 'Some details need checking. Please review the highlighted fields.'],
        'expired' => ['error', 'That form had been open too long. Please submit it again.'],
        'throttled' => ['error', 'Several submissions have come from this connection recently. Please try again shortly.'],
        'error' => ['error', 'Your message could not be saved. Nothing was sent — please try again, or email us directly.'],
        'invalid_form' => ['error', 'That form could not be identified.'],
    ];
    [$kind, $text] = $messages[$result] ?? ['error', 'Something went wrong.'];

    return sprintf(
        '<div id="gr-form-status" class="gr-form-status gr-form-status--%s" role="status" aria-live="polite" tabindex="-1">%s</div>',
        esc_attr($kind),
        esc_html($text)
    );
}

/**
 * Rewrite the migrated markup.
 *
 * Applied to the body and hero HTML on the way out, so the stored migration
 * stays exactly as captured and this stays reversible.
 */
function gemreserve_activate_forms(string $html): string
{
    if (!str_contains($html, '<form')) {
        return $html;
    }
    $endpoint = esc_url(admin_url('admin-post.php'));

    return (string) preg_replace_callback(
        '#<form([^>]*)>#i',
        static function (array $m) use ($endpoint): string {
            $attrs = $m[1];
            preg_match('/class="([^"]*)"/i', $attrs, $c);
            $type = gemreserve_form_type_for($c[1] ?? '');
            if ($type === '') {
                return $m[0];
            }
            // novalidate came from React; the browser's own validation is
            // wanted here as a first pass in front of the server's.
            $attrs = str_replace(['novalidate=""', 'novalidate'], '', $attrs);
            return '<form' . $attrs . ' action="' . $endpoint . '" method="post">'
                . gemreserve_form_tokens($type)
                . gemreserve_form_status();
        },
        $html
    );
}

/** camelCase from the React form to the snake_case the handler stores. */
function gemreserve_normalise_field_names(string $html): string
{
    return str_replace(
        ['name="firstName"', 'name="lastName"'],
        ['name="first_name"', 'name="last_name"'],
        $html
    );
}

function gemreserve_prepare_body_html(string $html): string
{
    return gemreserve_fill_news_entries(
        gemreserve_activate_forms(gemreserve_normalise_field_names($html))
    );
}

/** The honeypot must be invisible without hiding a real field by accident. */
function gemreserve_form_styles(): void
{
    echo '<style>.gr-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}'
        . '.gr-form-status{margin:14px 0 0;font-size:.86rem;line-height:1.6}'
        . '.gr-form-status:empty{display:none}'
        . '.gr-form-status--ok{color:#28cbb8}'
        . '.gr-form-status--error{color:#f0b183}</style>' . "\n";
}
add_action('wp_head', 'gemreserve_form_styles', 20);
