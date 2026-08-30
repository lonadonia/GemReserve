<?php
/**
 * Plugin Name:  GemReserve Core
 * Description:  GemReserve-specific content model: post types, taxonomies, structured fields, publication workflow and corporate settings. Owns data; the theme owns presentation.
 * Version:      1.0.0
 * Requires PHP: 8.1
 * Author:       GemReserve.io
 * Text Domain:  gemreserve
 *
 * Why a plugin and not functions.php: the content model has to survive a theme
 * change. A client who switches or rebuilds the theme must not lose the gemstone
 * records, the document register or the corporate identity with it.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('GEMRESERVE_CORE_VERSION', '1.0.0');
define('GEMRESERVE_CORE_PATH', plugin_dir_path(__FILE__));

require_once GEMRESERVE_CORE_PATH . 'includes/post-types.php';
require_once GEMRESERVE_CORE_PATH . 'includes/taxonomies.php';
require_once GEMRESERVE_CORE_PATH . 'includes/fields.php';
require_once GEMRESERVE_CORE_PATH . 'includes/settings.php';
require_once GEMRESERVE_CORE_PATH . 'includes/admin-menu.php';
require_once GEMRESERVE_CORE_PATH . 'includes/roles.php';
require_once GEMRESERVE_CORE_PATH . 'includes/flat-permalinks.php';
require_once GEMRESERVE_CORE_PATH . 'includes/hardening.php';
require_once GEMRESERVE_CORE_PATH . 'includes/forms.php';
require_once GEMRESERVE_CORE_PATH . 'includes/form-render.php';
require_once GEMRESERVE_CORE_PATH . 'includes/news-render.php';
require_once GEMRESERVE_CORE_PATH . 'includes/mfa.php';

register_activation_hook(__FILE__, static function (): void {
    gemreserve_register_post_types();
    gemreserve_register_submission_types();
    gemreserve_register_taxonomies();
    gemreserve_register_roles();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, static function (): void {
    flush_rewrite_rules();
});
