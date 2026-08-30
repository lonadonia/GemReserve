<?php
/**
 * Two-factor enforcement.
 *
 * The mechanism is the `two-factor` feature plugin — WordPress's own, GPLv2,
 * free, no upsell. This file does not reimplement any cryptography; it decides
 * who must use it and makes sure nobody is locked out on the way there.
 *
 * Administrator and Compliance Reviewer must enable a second factor. Both can
 * change published content or approve a controlled document, so a stolen
 * password on either is the whole site.
 *
 * The rollout is deliberately a nag, not a wall. Turning enforcement into a
 * hard block the moment it ships would lock out the only administrator, who has
 * not enrolled yet and could not then reach the screen to do it. Instead the
 * account is warned on every admin page until it enrols, and hard enforcement
 * is switched on afterwards with GR_REQUIRE_MFA — see docs/WORDPRESS.md.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Roles that must carry a second factor. */
function gemreserve_mfa_required_roles(): array
{
    return ['administrator', 'gr_compliance'];
}

function gemreserve_user_needs_mfa(?WP_User $user = null): bool
{
    $user = $user ?: wp_get_current_user();
    if (!$user || !$user->exists()) {
        return false;
    }
    return (bool) array_intersect($user->roles, gemreserve_mfa_required_roles());
}

function gemreserve_user_has_mfa(?WP_User $user = null): bool
{
    if (!class_exists('Two_Factor_Core')) {
        return false;
    }
    $user = $user ?: wp_get_current_user();
    return Two_Factor_Core::is_user_using_two_factor($user->ID);
}

/** The nag. Shown on every admin screen until the account enrols. */
function gemreserve_mfa_notice(): void
{
    if (!is_user_logged_in() || !gemreserve_mfa_required_roles()) {
        return;
    }
    if (!gemreserve_user_needs_mfa() || gemreserve_user_has_mfa()) {
        return;
    }
    $url = esc_url(get_edit_user_link(get_current_user_id()) . '#two-factor-options');
    echo '<div class="notice notice-error"><p><strong>Two-factor authentication is required for this role.</strong> '
        . 'Your account does not have a second factor enabled yet. '
        . '<a href="' . $url . '">Set it up now</a> — choose an authenticator app (TOTP), '
        . 'then <strong>print or save the backup codes</strong>. Without them, losing the device means losing access.</p></div>';
}
add_action('admin_notices', 'gemreserve_mfa_notice');

/**
 * Hard enforcement, off until switched on.
 *
 * Define GR_REQUIRE_MFA in wp-config.php once every account in these roles has
 * enrolled. After that an account without a second factor can reach only its
 * own profile, so it can still fix the situation rather than being shut out.
 */
function gemreserve_enforce_mfa(): void
{
    if (!defined('GR_REQUIRE_MFA') || !GR_REQUIRE_MFA) {
        return;
    }
    if (wp_doing_ajax() || !is_user_logged_in()) {
        return;
    }
    if (!gemreserve_user_needs_mfa() || gemreserve_user_has_mfa()) {
        return;
    }

    global $pagenow;
    $allowed = ['profile.php', 'user-edit.php', 'admin-ajax.php', 'options.php'];
    if (in_array($pagenow, $allowed, true)) {
        return;
    }
    wp_safe_redirect(admin_url('profile.php#two-factor-options'));
    exit;
}
add_action('admin_init', 'gemreserve_enforce_mfa', 1);

/** Surface enrolment state in the user list, so it can be audited at a glance. */
function gemreserve_user_mfa_column(array $columns): array
{
    $columns['gr_mfa'] = 'Two-factor';
    return $columns;
}
add_filter('manage_users_columns', 'gemreserve_user_mfa_column');

function gemreserve_user_mfa_cell(string $output, string $column, int $user_id): string
{
    if ($column !== 'gr_mfa') {
        return $output;
    }
    $user = get_userdata($user_id);
    if (!$user) {
        return $output;
    }
    if (!gemreserve_user_needs_mfa($user)) {
        return '<span style="color:#8a8a8a">not required</span>';
    }
    return gemreserve_user_has_mfa($user)
        ? '<span style="color:#1f9c62;font-weight:600">enabled</span>'
        : '<span style="color:#b32338;font-weight:600">REQUIRED — not set</span>';
}
add_filter('manage_users_custom_column', 'gemreserve_user_mfa_cell', 10, 3);
