<?php
/**
 * GemReserve Site Settings.
 *
 * The corporate identity lives here, in one place, exactly as content/company.ts
 * did in the Next.js build. That file existed because the entity had been
 * written out by hand across the footer, the About copy, the Contact offices and
 * two FAQ answers, and changing operating company meant hunting all of them
 * down. The same rule holds here: a surface that needs the entity reads it from
 * these options rather than repeating it.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Defaults are the current approved identity.
 *
 * Company code is 307501935 with no LT prefix, per the master instructions. The
 * previous implementation carried "LT307501935"; that is corrected here and the
 * value is not to be prefixed again without the owner's instruction.
 */
function gemreserve_settings_schema(): array
{
    return [
        'company' => [
            'title' => 'Company',
            'fields' => [
                'company_legal_name' => ['label' => 'Legal name', 'default' => 'UAB GemVault Capital'],
                'company_code' => ['label' => 'Company code', 'default' => '307501935', 'help' => 'No country prefix. Per the master instructions this is 307501935.'],
                'company_address_1' => ['label' => 'Address line 1', 'default' => 'Girulių g. 20'],
                'company_address_2' => ['label' => 'Address line 2', 'default' => 'Vilnius, LT-12123'],
                'company_country' => ['label' => 'Country', 'default' => 'Lithuania'],
                'company_country_adjective' => ['label' => 'Country adjective', 'default' => 'Lithuanian'],
                'company_city' => ['label' => 'City', 'default' => 'Vilnius'],
                'company_flag' => ['label' => 'Flag emoji', 'default' => '🇱🇹'],
            ],
        ],
        'contact' => [
            'title' => 'Contact addresses',
            'fields' => [
                'email_general' => ['label' => 'General enquiries', 'default' => 'info@gemreserve.io'],
                'email_investor' => ['label' => 'Investor relations', 'default' => 'investor-relations@gemreserve.io'],
                'email_media' => ['label' => 'Media', 'default' => 'media@gemreserve.io'],
                'email_partnerships' => ['label' => 'Partnerships', 'default' => 'partnerships@gemreserve.io'],
            ],
        ],
        'footer' => [
            'title' => 'Footer',
            'fields' => [
                'footer_blurb' => ['label' => 'Footer description', 'default' => 'GemReserve.io is a Lithuanian company building the bridge between the world of precious gemstones and the future of digital assets.', 'type' => 'textarea'],
                'footer_motto' => ['label' => 'Motto', 'default' => 'Built on Trust. Backed by Gems.'],
                'footer_tagline' => ['label' => 'Tagline', 'default' => 'OWN. TRADE. REDEEM.'],
                'footer_copyright' => ['label' => 'Copyright line', 'default' => '© 2026 GemReserve.io. All rights reserved.'],
            ],
        ],
        'disclosure' => [
            'title' => 'Global disclosures',
            'fields' => [
                'announcement_message' => ['label' => 'Announcement strip', 'default' => 'GEMRESERVE.IO IS A LITHUANIAN COMPANY BUILDING THE BRIDGE BETWEEN THE WORLD OF PRECIOUS GEMSTONES AND THE FUTURE OF DIGITAL ASSETS.', 'type' => 'textarea'],
                'waitlist_label' => ['label' => 'Primary CTA label', 'default' => 'Join Waitlist'],
                'waitlist_href' => ['label' => 'Primary CTA destination', 'default' => '/#waitlist'],
                'social_enabled' => ['label' => 'Social channels are live', 'type' => 'checkbox', 'default' => '', 'help' => 'Leave off until GemReserve genuinely operates accounts. The Anti-Fraud Notice states that none exist; turning this on without opening them would contradict it.'],
            ],
        ],
        'forms' => [
            'title' => 'Forms',
            'fields' => [
                'forms_enabled' => ['label' => 'Deliver form submissions', 'type' => 'checkbox', 'default' => '', 'help' => 'Off means forms validate and report honestly that nothing was sent. Do not enable without a delivery destination and a retention policy.'],
                'forms_destination' => ['label' => 'Delivery email', 'default' => ''],
                'forms_consent_version' => ['label' => 'Consent version', 'default' => '2026-08-v1', 'help' => 'Bump when the visible consent wording changes.'],
            ],
        ],
    ];
}

function gemreserve_setting(string $key, string $fallback = ''): string
{
    $value = get_option("gr_{$key}", null);
    if ($value !== null && $value !== '') {
        return (string) $value;
    }
    foreach (gemreserve_settings_schema() as $group) {
        if (isset($group['fields'][$key]['default'])) {
            return (string) $group['fields'][$key]['default'];
        }
    }
    return $fallback;
}

function gemreserve_flag(string $key): bool
{
    return get_option("gr_{$key}", '') === '1';
}

/** One legal attribution line, assembled from the settings. */
function gemreserve_legal_line(): string
{
    return sprintf(
        'GemReserve.io is operated by %s, Company Code %s, %s, %s, %s.',
        gemreserve_setting('company_legal_name'),
        gemreserve_setting('company_code'),
        gemreserve_setting('company_address_1'),
        gemreserve_setting('company_address_2'),
        gemreserve_setting('company_country')
    );
}

function gemreserve_register_settings(): void
{
    foreach (gemreserve_settings_schema() as $group_key => $group) {
        foreach ($group['fields'] as $key => $field) {
            register_setting('gemreserve_settings', "gr_{$key}", [
                'type' => 'string',
                'sanitize_callback' => ($field['type'] ?? 'text') === 'textarea'
                    ? 'sanitize_textarea_field'
                    : 'sanitize_text_field',
                'default' => $field['default'] ?? '',
                'show_in_rest' => false,
            ]);
        }
    }
}
add_action('admin_init', 'gemreserve_register_settings');

function gemreserve_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        wp_die('You do not have permission to change site settings.');
    }
    ?>
    <div class="wrap">
        <h1>GemReserve Site Settings</h1>
        <p class="description">
            These values feed the footer, the legal line, the contact page and the
            announcement strip across the whole site. Changing one here changes it
            everywhere.
        </p>
        <form method="post" action="options.php">
            <?php settings_fields('gemreserve_settings'); ?>
            <?php foreach (gemreserve_settings_schema() as $group) : ?>
                <h2><?php echo esc_html($group['title']); ?></h2>
                <table class="form-table" role="presentation">
                    <?php foreach ($group['fields'] as $key => $field) :
                        $name = "gr_{$key}";
                        $value = get_option($name, $field['default'] ?? '');
                        $type = $field['type'] ?? 'text'; ?>
                        <tr>
                            <th scope="row"><label for="<?php echo esc_attr($name); ?>"><?php echo esc_html($field['label']); ?></label></th>
                            <td>
                                <?php if ($type === 'textarea') : ?>
                                    <textarea class="large-text" rows="3" id="<?php echo esc_attr($name); ?>" name="<?php echo esc_attr($name); ?>"><?php echo esc_textarea((string) $value); ?></textarea>
                                <?php elseif ($type === 'checkbox') : ?>
                                    <input type="checkbox" id="<?php echo esc_attr($name); ?>" name="<?php echo esc_attr($name); ?>" value="1" <?php checked($value, '1'); ?>>
                                <?php else : ?>
                                    <input type="text" class="regular-text" id="<?php echo esc_attr($name); ?>" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr((string) $value); ?>">
                                <?php endif; ?>
                                <?php if (!empty($field['help'])) : ?>
                                    <p class="description"><?php echo esc_html($field['help']); ?></p>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </table>
            <?php endforeach; ?>
            <?php submit_button('Save settings'); ?>
        </form>
    </div>
    <?php
}
