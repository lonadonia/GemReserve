<?php
/**
 * Export the SQLite WordPress database as a MySQL dump.
 *
 *   wp eval-file migrations/sqlite-to-mysql.php <output.sql> --path=.
 *
 * Why not `wp db export`: that shells out to mysqldump, which cannot see a
 * SQLite database. And why not `wp export`: WXR carries posts and terms but not
 * options, not user accounts, not menu location assignments and not the
 * GemReserve settings — which is most of what makes this install the site it is.
 *
 * So the dump is built from WordPress's own schema plus a full row read through
 * $wpdb. The schema comes from wp_get_db_schema(), so the MySQL side gets
 * exactly the column types and indexes core expects rather than whatever the
 * SQLite driver approximated.
 *
 * Values are escaped with a MySQL escaper rather than $wpdb->prepare(), because
 * $wpdb is talking to SQLite here and its quoting rules are not MySQL's.
 * Binary-unsafe bytes are emitted as hex literals.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run through wp-cli.\n");
    exit(1);
}

$out_path = $args[0] ?? '';
if (!$out_path) {
    WP_CLI::error('Usage: wp eval-file migrations/sqlite-to-mysql.php <output.sql>');
}

global $wpdb;
require_once ABSPATH . 'wp-admin/includes/schema.php';

/** MySQL string escaping. Not $wpdb's — that one is quoting for SQLite. */
function gr_mysql_quote($value): string
{
    if ($value === null) {
        return 'NULL';
    }
    $s = (string) $value;
    // Anything that is not valid UTF-8 goes out as a hex literal, which is
    // lossless and avoids a broken multibyte sequence poisoning the import.
    if (!mb_check_encoding($s, 'UTF-8')) {
        return '0x' . bin2hex($s);
    }
    $escaped = str_replace(
        ["\\", "'", "\0", "\n", "\r", "\x1a", '"'],
        ["\\\\", "\\'", "\\0", "\\n", "\\r", "\\Z", '\\"'],
        $s
    );
    return "'" . $escaped . "'";
}

$tables = [];
foreach ($wpdb->get_col('SHOW TABLES') ?: [] as $t) {
    $tables[] = $t;
}
// The SQLite driver does not always answer SHOW TABLES; fall back to the known
// core set plus the prefix, which is what this install actually has.
if (!$tables) {
    foreach (['users', 'usermeta', 'posts', 'postmeta', 'options', 'terms',
              'term_taxonomy', 'term_relationships', 'termmeta', 'comments',
              'commentmeta', 'links'] as $t) {
        $tables[] = $wpdb->prefix . $t;
    }
}

$fh = fopen($out_path, 'w');
if (!$fh) {
    WP_CLI::error("Cannot write {$out_path}");
}

fwrite($fh, "-- GemReserve WordPress: SQLite -> MySQL\n");
fwrite($fh, '-- Generated ' . gmdate('c') . "\n");
fwrite($fh, "-- Import into an EMPTY database. Table prefix: {$wpdb->prefix}\n\n");
fwrite($fh, "SET NAMES utf8mb4;\n");
fwrite($fh, "SET FOREIGN_KEY_CHECKS=0;\n");
fwrite($fh, "SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';\n\n");

// Core's schema, with the prefix already applied by wp_get_db_schema().
$schema = wp_get_db_schema('all');
foreach (explode(';', $schema) as $statement) {
    $statement = trim($statement);
    if ($statement === '' || stripos($statement, 'CREATE TABLE') !== 0) {
        continue;
    }
    if (preg_match('/CREATE TABLE\s+`?([A-Za-z0-9_]+)`?/i', $statement, $m)) {
        fwrite($fh, "DROP TABLE IF EXISTS `{$m[1]}`;\n");
    }
    fwrite($fh, $statement . " ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n");
}

$totals = [];
foreach ($tables as $table) {
    $rows = $wpdb->get_results("SELECT * FROM `{$table}`", ARRAY_A);
    $totals[$table] = is_array($rows) ? count($rows) : 0;
    if (!$rows) {
        continue;
    }
    fwrite($fh, "-- {$table}: " . count($rows) . " rows\n");
    $columns = array_keys($rows[0]);
    $collist = '`' . implode('`,`', $columns) . '`';

    // Batched so a large postmeta table does not become one statement the
    // server refuses on max_allowed_packet.
    foreach (array_chunk($rows, 200) as $chunk) {
        $values = [];
        foreach ($chunk as $row) {
            $cells = [];
            foreach ($columns as $c) {
                $cells[] = gr_mysql_quote($row[$c]);
            }
            $values[] = '(' . implode(',', $cells) . ')';
        }
        fwrite($fh, "INSERT INTO `{$table}` ({$collist}) VALUES\n" . implode(",\n", $values) . ";\n");
    }
    fwrite($fh, "\n");
}

fwrite($fh, "SET FOREIGN_KEY_CHECKS=1;\n");
fclose($fh);

WP_CLI::success('Wrote ' . $out_path . ' (' . size_format((int) filesize($out_path)) . ')');
foreach ($totals as $t => $n) {
    WP_CLI::log(sprintf('  %-34s %d', $t, $n));
}
