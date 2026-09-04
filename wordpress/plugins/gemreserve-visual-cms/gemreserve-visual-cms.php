<?php
/**
 * Plugin Name:  GemReserve Visual CMS
 * Description:  Makes the migrated page bodies editable in Gutenberg without changing the approved design. Owns the block library, the migration, the versioned content API, signed previews and publish-time cache revalidation.
 * Version:      1.0.0
 * Requires PHP: 8.1
 * Author:       GemReserve.io
 * Text Domain:  gemreserve-visual-cms
 *
 * Why a separate plugin rather than more of gemreserve-core: the two own
 * different things. gemreserve-core owns the content *model* — post types,
 * structured fields, the document register, corporate settings — and its own
 * header explains that it is a plugin so the model survives a theme change.
 * This plugin owns the editing *surface* and the rendering pipeline. Keeping
 * them apart means a fault in block rendering cannot take down the gemstone
 * register, and either can be rolled back without the other.
 *
 * @package GemReserveVisualCms
 */

declare(strict_types=1);

namespace GemReserve\VisualCms;

if (!defined('ABSPATH')) {
    exit;
}

const VERSION = '1.0.0';

/**
 * The block schema version.
 *
 * Bumped when a block's attribute shape changes in a way a consumer must know
 * about. It is published on every API response so the Next.js renderer can
 * refuse content it was not built for rather than rendering it wrongly, and so
 * a future migration has something to key off.
 */
const SCHEMA_VERSION = '1.0.0';

define('GEMRESERVE_VCMS_FILE', __FILE__);
define('GEMRESERVE_VCMS_PATH', plugin_dir_path(__FILE__));
define('GEMRESERVE_VCMS_URL', plugin_dir_url(__FILE__));

require_once GEMRESERVE_VCMS_PATH . 'includes/class-html.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-slot-template.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-markup-policy.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-renderer.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-decomposer.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-blocks.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-editor.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-roles.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-normaliser.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-rest.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-preview.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-revalidation.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-media.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-patterns.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-migrator.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-audit.php';
require_once GEMRESERVE_VCMS_PATH . 'includes/class-cli.php';

Blocks::boot();
Editor::boot();
Roles::boot();
Rest::boot();
Preview::boot();
Revalidation::boot();
Media::boot();
Patterns::boot();
Audit::boot();
Migrator::boot();

/**
 * Turn the block editor back on for pages.
 *
 * gemreserve-core disables it (`gemreserve_use_classic_editor`) because, at the
 * time, a page's body was an HTML blob in post meta that Gutenberg would have
 * reformatted on save. That reasoning was correct and is now obsolete: with the
 * body decomposed into blocks there is something for the editor to edit, and
 * leaving it off would defeat the entire remediation.
 *
 * The filter runs at priority 20 so it lands after core's own at 10. The
 * alternative — deleting the filter from gemreserve-core — would couple the two
 * plugins' deployment order and leave the site with no editor at all if this one
 * were ever deactivated. Overriding means deactivating this plugin restores
 * exactly the previous behaviour.
 */
/**
 * The post types the migration converts to blocks.
 *
 * This list and the migration's own candidate query must agree. They did not:
 * the filter named `page` alone while the migration also converts the 18
 * gemstone records, so those pages came out of the migration holding block
 * markup and were still handed to the classic editor.
 *
 * That is not merely unhelpful. TinyMCE posts the content back through
 * `wp_kses_post()` and `wpautop()`, which strip the SVG diagrams and reflow the
 * markup — one save on one gemstone rewrote 57,415 bytes down to 31,277 in a
 * staging measurement. Before the migration those bodies lived in post meta and
 * `post_content` was empty, so the classic editor had nothing to damage; the
 * migration is what put them within its reach.
 *
 * Keeping the two in step through one constant is the point: adding a post type
 * to the migration without making it editable is the failure this closes.
 */
const MIGRATED_POST_TYPES = ['page', 'gemstone'];

function enable_block_editor_for_pages(bool $use_block, string $post_type): bool
{
    return in_array($post_type, MIGRATED_POST_TYPES, true) ? true : $use_block;
}
add_filter('use_block_editor_for_post_type', __NAMESPACE__ . '\\enable_block_editor_for_pages', 20, 2);

/**
 * Activation.
 *
 * Deliberately does not migrate anything. Migration is an explicit, reviewed,
 * dry-run-first operation with a rollback (see class-migrator.php and
 * CMS_MIGRATION_RUNBOOK.md); running it as a side effect of ticking Activate
 * would rewrite forty pages with no backup and no chance to read the report.
 */
register_activation_hook(__FILE__, static function (): void {
    Roles::register();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, static function (): void {
    flush_rewrite_rules();
});
