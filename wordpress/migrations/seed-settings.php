<?php
/**
 * Persist the GemReserve settings into the options table.
 *
 *   wp eval-file migrations/seed-settings.php --path=.
 *
 * Before this runs, every setting resolves from the schema default in
 * includes/settings.php and nothing is stored. That works, but it makes code the
 * source of truth for the corporate identity: edit a default in a deploy and the
 * live footer changes with it, silently, with no revision and nothing in the
 * database to say otherwise.
 *
 * Seeding makes the database authoritative. The defaults stay as a fallback for
 * a setting added later, but the values in force are rows an administrator can
 * see, edit and audit.
 *
 * Idempotent: a setting already stored is left exactly as it is, so re-running
 * after an editor has changed something cannot overwrite their work.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

if (!function_exists('gemreserve_settings_schema')) {
    WP_CLI::error('GemReserve Core is not active.');
}

$seeded = 0;
$kept = 0;
foreach (gemreserve_settings_schema() as $group) {
    foreach ($group['fields'] as $key => $field) {
        $name = "gr_{$key}";
        $existing = get_option($name, null);
        if ($existing !== null && $existing !== false) {
            $kept++;
            continue;
        }
        // A checkbox default of '' is meaningful — it means off — so it is
        // stored as '' rather than skipped.
        add_option($name, (string) ($field['default'] ?? ''));
        $seeded++;
    }
}

WP_CLI::success("Seeded {$seeded} settings; left {$kept} already-stored value(s) untouched.");
WP_CLI::log('  company code now stored as: ' . get_option('gr_company_code'));
