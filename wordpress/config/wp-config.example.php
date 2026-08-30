<?php
/**
 * GemReserve.io — wp-config template.
 *
 * Copy to the WordPress root as wp-config.php, fill in the database block and
 * generate wp-salts.php beside it. Neither file is ever committed.
 *
 *   cp config/wp-config.example.php /path/to/wordpress/wp-config.php
 *   chmod 600 /path/to/wordpress/wp-config.php
 *   php deploy/make-salts.php > /path/to/wordpress/wp-salts.php
 *   chmod 600 /path/to/wordpress/wp-salts.php
 */

// --- Database -------------------------------------------------------------
// Credentials come from the server, never from this file in version control.
// On this host the database is CloudPanel-managed Percona; see deploy/README.
// Credentials are read from an env file outside the web root, or from real
// environment variables where the platform supplies them. Nothing secret
// belongs in this file, so it stays safe to read, copy and diff.
//
// The file is a plain KEY=value list and is parsed, not sourced: a backtick or
// a $( in a password cannot execute anything.
(static function (): void {
    $env_path = getenv('GR_DB_ENV') ?: '/home/hamza/.gemreserve-wp-db.env';
    $env = [];

    if (is_readable($env_path)) {
        foreach (file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$k, $v] = explode('=', $line, 2);
            $v = trim($v);
            if (strlen($v) > 1 && ($v[0] === '"' || $v[0] === "'") && $v[-1] === $v[0]) {
                $v = substr($v, 1, -1);
            }
            $env[trim($k)] = $v;
        }
    }

    foreach (['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'] as $key) {
        $value = getenv($key);
        if ($value === false || $value === '') {
            $value = $env[$key] ?? null;
        }
        if ($value === null) {
            // Fail loudly and without detail. A half-configured database is how
            // an install silently reaches for the wrong one.
            http_response_code(500);
            exit('Database configuration is incomplete.');
        }
        define($key, $value);
    }
})();

define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

$table_prefix = 'gr_';

// --- Salts ----------------------------------------------------------------
require_once __DIR__ . '/wp-salts.php';

// --- Environment ----------------------------------------------------------
define('WP_ENVIRONMENT_TYPE', getenv('GR_ENV') ?: 'production');
define('WP_HOME', getenv('WP_HOME') ?: 'https://www.gemreserve.io');
define('WP_SITEURL', WP_HOME);

// --- Hardening ------------------------------------------------------------
// No PHP editing from the dashboard, and no plugin or theme installs through
// it either: this deployment is file-managed, so the admin must never be a
// route for putting executable code on the server.
define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_FILE_MODS', true);

define('FORCE_SSL_ADMIN', true);
define('WP_AUTO_UPDATE_CORE', 'minor');

// Cookies only over HTTPS, and never readable from JavaScript.
@ini_set('session.cookie_httponly', '1');
@ini_set('session.cookie_secure', '1');
@ini_set('session.use_only_cookies', '1');

// Debug output must never reach a visitor. Log it instead.
define('WP_DEBUG', false);
define('WP_DEBUG_DISPLAY', false);
define('WP_DEBUG_LOG', false);
@ini_set('display_errors', '0');

define('WP_POST_REVISIONS', 10);
define('EMPTY_TRASH_DAYS', 30);
define('WP_MEMORY_LIMIT', '256M');

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}
require_once ABSPATH . 'wp-settings.php';
