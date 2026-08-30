<?php
/**
 * Generate WordPress salts with a CSPRNG.
 *
 * Prints to stdout so nothing lands on disk unless redirected:
 *   php deploy/make-salts.php > /path/to/wordpress/wp-salts.php
 *   chmod 600 /path/to/wordpress/wp-salts.php
 *
 * Deliberately not fetched from api.wordpress.org — that hands the keys to
 * whatever is between here and there.
 */
declare(strict_types=1);

$keys = [
    'AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY',
    'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT',
];
$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    . '!@#%^&*()-_[]{}<>~`+=,.;:/?|';

echo "<?php\n";
echo "// Generated " . gmdate('c') . ". Never commit this file.\n";
foreach ($keys as $key) {
    $value = '';
    for ($i = 0; $i < 64; $i++) {
        $value .= $chars[random_int(0, strlen($chars) - 1)];
    }
    printf("define(%s, %s);\n", var_export($key, true), var_export($value, true));
}
