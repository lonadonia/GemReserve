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
// Credentials are read at runtime from a file outside the web root. Nothing in
// this file is secret, so it can be read, copied, diffed and committed as an
// example without care.
//
// Search order, first readable wins:
//
//   1. $_SERVER / getenv       — a systemd unit or container can supply the
//                                values with no file on disk at all.
//   2. GR_DB_ENV               — an explicit override, for a one-off restore
//                                or a second environment on the same host.
//   3. /etc/gemreserve/wordpress.env
//                              — PRODUCTION. Created by root as
//                                root:www-data 0640, so php-fpm reads it
//                                through the group and no other account on the
//                                box can. It is not under any web root and it
//                                is not in Git.
//   4. ~hamza/.gemreserve-wp-db.env
//                              — staging only, mode 600, owned by the deploy
//                                user who also runs the staging PHP server.
//                                Production php-fpm runs as www-data and
//                                cannot read it, which is the point: if the
//                                production file is missing, the site fails
//                                rather than quietly falling through to a
//                                staging database.
//
// The file is a plain KEY=value list and is PARSED, not sourced, so a backtick
// or a $( inside a password cannot execute anything.
(static function (): void {
    $candidates = array_filter([
        getenv('GR_DB_ENV') ?: null,
        '/etc/gemreserve/wordpress.env',
        '/home/hamza/.gemreserve-wp-db.env',
    ]);

    $env = [];
    $source = null;
    foreach ($candidates as $path) {
        if (!is_readable($path)) {
            continue;
        }
        $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            continue;
        }
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$k, $v] = explode('=', $line, 2);
            $v = trim($v);
            // Strip one layer of matching quotes, if present.
            if (strlen($v) > 1 && ($v[0] === '"' || $v[0] === "'") && $v[-1] === $v[0]) {
                $v = substr($v, 1, -1);
            }
            $env[trim($k)] = $v;
        }
        $source = $path;
        break;
    }

    // A world-readable credentials file is a real exposure — every account on
    // the host can read the database password. It is reported rather than made
    // fatal: taking the site down for a permission bit would trade a private
    // problem for a public one. The path is named; the contents never are.
    if ($source !== null && ($perms = @fileperms($source)) !== false && ($perms & 0o004)) {
        error_log("GemReserve: {$source} is world-readable; expected 0640 root:www-data.");
    }

    // One resolver for every setting: a real environment variable wins over
    // the file, so a systemd unit or a container can override any single value
    // without editing anything on disk.
    $resolve = static function (string $key) use ($env): ?string {
        $value = getenv($key);
        if ($value === false || $value === '') {
            $value = $env[$key] ?? null;
        }

        return ($value === null || $value === '') ? null : $value;
    };

    foreach (['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'] as $key) {
        $value = $resolve($key);
        if ($value === null) {
            // Fail closed. A half-configured database is how an install
            // silently reaches for the wrong one — or, worse, how a production
            // request ends up served from a staging database. The response
            // names neither the key nor the file: a 500 tells an attacker
            // nothing they did not already know.
            if (!headers_sent()) {
                http_response_code(500);
                header('Content-Type: text/plain; charset=utf-8');
                header('Cache-Control: no-store');
            }
            error_log("GemReserve: database configuration incomplete ({$key} unresolved).");
            exit("Service unavailable.\n");
        }
        define($key, $value);
    }

    // --- Site URLs --------------------------------------------------------
    // These come from the same runtime file as the credentials. They used to
    // read getenv() alone, which never sees a value parsed out of that file —
    // so production resolved the staging fallback and WordPress generated
    // every canonical, redirect and asset URL against 127.0.0.1:3200, no
    // matter what the database said.
    //
    // A trailing slash is trimmed: WordPress expects these without one and
    // emits doubled slashes if given one. A value that is not an absolute
    // http(s) URL is treated as absent rather than trusted.
    $url = static function (?string $value): ?string {
        if ($value === null) {
            return null;
        }
        $value = rtrim(trim($value), '/');

        return preg_match('#^https?://[^/\s]+#i', $value) === 1 ? $value : null;
    };

    $home = $url($resolve('WP_HOME'));
    $site = $url($resolve('WP_SITEURL'));

    // The local fallback applies only when NEITHER is configured anywhere.
    // Once either is set, a partial configuration completes itself from the
    // other rather than dropping half the site onto localhost.
    if ($home === null && $site === null) {
        $home = 'http://127.0.0.1:3200';
        $site = $home;
    }
    $home ??= $site;
    $site ??= $home;

    if (!defined('WP_HOME')) {
        define('WP_HOME', $home);
    }
    if (!defined('WP_SITEURL')) {
        define('WP_SITEURL', $site);
    }
})();

define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

$table_prefix = 'gr_';

// --- Salts ----------------------------------------------------------------
require_once __DIR__ . '/wp-salts.php';

// --- Environment ----------------------------------------------------------
define('WP_ENVIRONMENT_TYPE', getenv('GR_ENV') ?: 'production');
// WP_HOME and WP_SITEURL are resolved with the credentials above, from the
// same runtime file. Nothing site-specific is hard-coded here.

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
