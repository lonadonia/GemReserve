<?php
/**
 * Staging router for PHP's built-in server.
 *
 * PHP's server ignores .htaccess entirely, so the deny rules that would protect
 * the database and the config files on Apache do nothing here. Without the
 * guard below, http://host/wp-content/database/.ht.sqlite serves the whole
 * database — password hashes included. It was verified reachable before this
 * was added.
 *
 * nginx has the same gap by default. The production vhost needs the equivalent
 * location blocks; they are written out in docs/WORDPRESS.md and must be in
 * place before the site is exposed.
 */

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

/** Nothing under these paths is ever served. */
$denied = [
    '#^/wp-content/database/#i',   // the SQLite database
    '#^/wp-content/uploads/.*\.(php|phtml|phar|cgi|pl|py|sh)$#i',
    '#(^|/)\.#',                    // dotfiles, including .ht.sqlite and .env
    '#^/wp-content/debug\.log$#i',
    '#^/(wp-config|wp-salts)\.php$#i',
    '#^/(readme\.html|license\.txt)$#i',
    '#\.(sqlite|sql|log|bak|swp|ini)$#i',
    // The router itself, and anything left in the web root that is not a
    // WordPress entry point. A migration script belongs in version control and
    // is run through wp-cli, never fetched over HTTP.
    '#^/router\.php$#i',
    '#^/gr-[a-z-]+\.php$#i',
    // Theme and plugin PHP is included by WordPress, never requested directly.
    // Each file already guards on ABSPATH, so this is depth rather than the
    // only line — but a guard that is never reached is a guard that cannot be
    // forgotten in a file added later.
    '#^/wp-content/(themes|plugins|mu-plugins)/.+\.php$#i',
];
foreach ($denied as $pattern) {
    if (preg_match($pattern, $path)) {
        http_response_code(403);
        header('Content-Type: text/plain');
        echo "403 Forbidden\n";
        return true;
    }
}

// A real file is served as-is.
$file = __DIR__ . $path;
if ($path !== '/' && is_file($file)) {
    return false;
}

// A directory resolves to its index.php — /wp-admin/ is a directory, and
// without this it fell through to the front-end controller and rendered the
// public site inside the dashboard.
if ($path !== '/' && is_dir($file) && is_file(rtrim($file, '/') . '/index.php')) {
    $_SERVER['SCRIPT_NAME'] = rtrim($path, '/') . '/index.php';
    $_SERVER['SCRIPT_FILENAME'] = rtrim($file, '/') . '/index.php';
    require rtrim($file, '/') . '/index.php';
    return true;
}

// Everything else goes to WordPress, which is what nginx's try_files does.
$_SERVER['SCRIPT_NAME'] = '/index.php';
require __DIR__ . '/index.php';
