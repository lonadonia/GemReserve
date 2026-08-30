<?php
/**
 * Navigation rendering.
 *
 * WordPress menus drive this, so the client edits structure in Appearance →
 * Menus rather than in code. The markup is the original's, so the ported
 * stylesheet and the ported JavaScript both work unchanged: a group with
 * children becomes a dropdown, a group without becomes a plain link, and an
 * item flagged "coming soon" becomes the disabled span the original used.
 *
 * An item is marked "coming soon" by giving it the CSS class `is-upcoming` in
 * the menu editor — the one piece of convention a client has to learn, and it
 * is documented in docs/WORDPRESS.md.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function gemreserve_menu_tree(string $location): array
{
    $locations = get_nav_menu_locations();
    if (empty($locations[$location])) {
        return [];
    }
    $items = wp_get_nav_menu_items($locations[$location]);
    if (!$items) {
        return [];
    }
    $byParent = [];
    foreach ($items as $item) {
        $byParent[(int) $item->menu_item_parent][] = $item;
    }
    return $byParent;
}

function gemreserve_item_is_upcoming(object $item): bool
{
    return in_array('is-upcoming', (array) $item->classes, true);
}

function gemreserve_render_desktop_nav(): void
{
    $tree = gemreserve_menu_tree('primary');
    if (empty($tree[0])) {
        return;
    }
    $current = untrailingslashit((string) wp_parse_url(home_url(add_query_arg([])), PHP_URL_PATH)) ?: '/';

    foreach ($tree[0] as $group) {
        $children = $tree[(int) $group->ID] ?? [];
        $groupPath = untrailingslashit((string) wp_parse_url($group->url, PHP_URL_PATH)) ?: '/';

        if (!$children) {
            printf(
                '<a class="desktop-nav-link" href="%s">%s</a>',
                esc_url($group->url),
                esc_html($group->title)
            );
            continue;
        }

        $isActive = $groupPath === '/' ? $current === '/' : str_starts_with($current, $groupPath);
        $id = 'gr-menu-' . (int) $group->ID;
        ?>
        <div class="desktop-nav-group">
            <button class="desktop-nav-trigger<?php echo $isActive ? ' is-active' : ''; ?>"
                    type="button" aria-expanded="false" aria-controls="<?php echo esc_attr($id); ?>">
                <?php echo esc_html($group->title); ?>
                <svg class="desktop-nav-caret" width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="desktop-dropdown" id="<?php echo esc_attr($id); ?>" aria-hidden="true">
                <p><?php echo esc_html($group->title); ?></p>
                <ul>
                    <?php foreach ($children as $child) : ?>
                        <li>
                            <?php if (gemreserve_item_is_upcoming($child)) : ?>
                                <span aria-disabled="true" title="Coming in a future phase">
                                    <?php echo esc_html($child->title); ?><small>Coming soon</small>
                                </span>
                            <?php else : ?>
                                <a href="<?php echo esc_url($child->url); ?>"><?php echo esc_html($child->title); ?></a>
                            <?php endif; ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
        <?php
    }
}

function gemreserve_render_mobile_nav(): void
{
    $tree = gemreserve_menu_tree('primary');
    if (empty($tree[0])) {
        return;
    }
    foreach ($tree[0] as $group) {
        $children = $tree[(int) $group->ID] ?? [];
        if (!$children) {
            printf('<a class="mobile-nav-link" href="%s">%s</a>', esc_url($group->url), esc_html($group->title));
            continue;
        }
        ?>
        <details>
            <summary><?php echo esc_html($group->title); ?></summary>
            <ul>
                <?php foreach ($children as $child) : ?>
                    <li>
                        <?php if (gemreserve_item_is_upcoming($child)) : ?>
                            <span aria-disabled="true"><?php echo esc_html($child->title); ?><small>Coming soon</small></span>
                        <?php else : ?>
                            <a href="<?php echo esc_url($child->url); ?>"><?php echo esc_html($child->title); ?></a>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </details>
        <?php
    }
}

/** Footer columns come from their own menus, one per column. */
function gemreserve_render_footer_column(string $location, string $heading): void
{
    $locations = get_nav_menu_locations();
    if (empty($locations[$location])) {
        return;
    }
    $items = wp_get_nav_menu_items($locations[$location]);
    if (!$items) {
        return;
    }
    echo '<div class="footer-column"><h2>' . esc_html($heading) . '</h2><ul>';
    foreach ($items as $item) {
        echo '<li>';
        if (gemreserve_item_is_upcoming($item)) {
            echo '<span aria-disabled="true">' . esc_html($item->title) . '</span>';
        } else {
            echo '<a href="' . esc_url($item->url) . '">' . esc_html($item->title) . '</a>';
        }
        echo '</li>';
    }
    echo '</ul></div>';
}

/**
 * The announcement strip.
 *
 * The original showed it on informational pages and hid it on the compact
 * catalogue header. Editors control it per page with a checkbox rather than a
 * hard-coded list.
 */
function gemreserve_show_announcement(): bool
{
    if (!is_singular()) {
        return true;
    }
    return gr_field('hide_announcement') !== '1';
}

/** Page-level wrapper class, so per-page CSS from the original still applies. */
function gemreserve_page_class(): string
{
    if (is_front_page()) {
        return 'home-page';
    }
    if (is_singular()) {
        // Stored by the migration from the original component; see parts/hero.php.
        $stored = gr_field('page_class');
        if ($stored) {
            return sanitize_html_class($stored);
        }
        $slug = get_post_field('post_name', get_the_ID());
        if ($slug) {
            return sanitize_html_class($slug . '-page');
        }
    }
    return 'site-page';
}

/**
 * Breadcrumbs, from the page's own ancestry.
 *
 * The original hard-coded a trail per page; deriving it from the WordPress
 * hierarchy means moving a page in the admin moves its breadcrumb too, which is
 * what a CMS is for.
 */
function gemreserve_breadcrumbs(): void
{
    if (!is_singular()) {
        return;
    }
    $id = get_the_ID();
    $crumbs = [['Home', home_url('/')]];

    foreach (array_reverse(get_post_ancestors($id)) as $ancestor) {
        $crumbs[] = [get_the_title($ancestor), get_permalink($ancestor)];
    }

    // An announcement's parent is the News page, which is not an ancestor in
    // the post tree — gr_news is flat, and /news is a page. Name it explicitly
    // so the trail reads Home > News & Announcements > Headline.
    if (get_post_type($id) === 'gr_news' && ($news = gemreserve_news_page())) {
        $crumbs[] = [get_the_title($news), get_permalink($news)];
    }

    // A label set on the page wins, for the cases where the trail names a
    // section rather than a real parent page.
    if ($parent = gr_field('hero_eyebrow', $id)) {
        if (count($crumbs) === 1) {
            $crumbs[] = [$parent, null];
        }
    }
    $crumbs[] = [get_the_title($id), null];

    echo '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>';
    $last = count($crumbs) - 1;
    foreach ($crumbs as $i => [$label, $url]) {
        echo '<li>';
        if ($url && $i < $last) {
            echo '<a href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
        } else {
            echo '<span' . ($i === $last ? ' aria-current="page"' : '') . '>' . esc_html($label) . '</span>';
        }
        echo '</li>';
    }
    echo '</ol></nav>';
}
