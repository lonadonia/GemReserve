<?php
/**
 * The News page, wired to the newsroom.
 *
 * The migrated /news markup ships a list of placeholder entries reading
 * "Awaiting first publication" — an honest empty state, and the right thing to
 * show while nothing has been announced. It was still showing after an editor
 * published an announcement, because nothing on the front end ever read the
 * gr_news post type: the CPT, its fields, its taxonomy and its admin menu all
 * existed and rendered nowhere. This closes that loop.
 *
 * Published announcements replace placeholders from the top down. Any slot left
 * over keeps its placeholder, so a newsroom with one story still looks like the
 * approved design rather than a half-empty grid.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The News page.
 *
 * Looked up by slug, not by path: pages are nested in the admin tree while
 * their public URLs are flat, so get_page_by_path('news') finds nothing for a
 * page that lives under a parent. The flat resolver matches on the slug for
 * the same reason.
 */
function gemreserve_news_page(): ?WP_Post
{
    static $page = false;
    if ($page !== false) {
        return $page;
    }
    $found = get_posts([
        'name' => 'news', 'post_type' => 'page', 'post_status' => 'publish',
        'numberposts' => 1,
    ]);

    return $page = $found ? $found[0] : null;
}

/** The announcements the front end should show, newest first. */
function gemreserve_published_news(int $limit = 12): array
{
    return get_posts([
        'post_type' => 'gr_news',
        'post_status' => 'publish',
        'numberposts' => $limit,
        'orderby' => 'date',
        'order' => 'DESC',
        'suppress_filters' => false,
    ]);
}

/** The announcement's category, falling back to the slot's own label. */
function gemreserve_news_category(int $id, string $fallback): string
{
    $terms = get_the_terms($id, 'news_category');
    if (is_array($terms) && $terms) {
        return $terms[0]->name;
    }
    return $fallback;
}

/**
 * Build one entry in the shape the stylesheet expects.
 *
 * The placeholder markup marks its headline, standfirst and date aria-hidden
 * and carries an sr-only "Awaiting first publication" line, because there is
 * nothing there to read. A real entry drops both: the text is the content now.
 */
function gemreserve_news_entry_html(WP_Post $post, bool $featured, string $fallback_category): string
{
    $id = $post->ID;
    $link = get_permalink($id);
    $headline = get_the_title($id);
    $standfirst = (string) gr_field('standfirst', $id);
    if ($standfirst === '') {
        $standfirst = wp_strip_all_tags(get_the_excerpt($id) ?: '');
    }
    $category = gemreserve_news_category($id, $fallback_category);
    $date = get_the_date('j F Y', $id);

    $classes = 'news-entry news-entry--published' . ($featured ? ' news-entry--featured' : '');

    $has_cover = has_post_thumbnail($id);
    $media = '<div class="news-entry__media' . ($has_cover ? ' news-entry__media--image' : '') . '"'
        . ($has_cover || $featured ? '' : ' aria-hidden="true"') . '>';
    if ($has_cover) {
        $media .= get_the_post_thumbnail($id, 'large', ['alt' => '', 'loading' => 'lazy']);
    }
    if ($featured) {
        $media .= '<span class="news-entry__flag">Featured</span>';
    }
    $media .= '</div>';

    $html = '<li class="' . esc_attr($classes) . '">' . $media
        . '<div class="news-entry__body">'
        . '<p class="news-entry__meta">'
        . '<span class="news-entry__category">' . esc_html($category) . '</span>'
        . '<span class="news-entry__date">' . esc_html($date) . '</span>'
        . '</p>'
        . '<p class="news-entry__headline"><a href="' . esc_url($link) . '">' . esc_html($headline) . '</a></p>';
    if ($standfirst !== '') {
        $html .= '<p class="news-entry__standfirst">' . esc_html($standfirst) . '</p>';
    }

    return $html . '</div></li>';
}

/**
 * Replace placeholder slots with published announcements.
 *
 * The list items do not nest, so a non-greedy match over <li class="news-entry
 * ...">…</li> is exact here without pulling in an HTML parser. The slot's own
 * category label is reused when an announcement has no term of its own, which
 * keeps the section's three-category rhythm intact.
 */
function gemreserve_fill_news_entries(string $html): string
{
    if (!str_contains($html, 'news-entry')) {
        return $html;
    }
    $news = gemreserve_published_news();
    if (!$news) {
        return $html;   // Nothing published: the empty state is correct.
    }

    $index = 0;
    return (string) preg_replace_callback(
        '#<li class="news-entry[^"]*">.*?</li>#s',
        static function (array $m) use (&$index, $news): string {
            if (!isset($news[$index])) {
                return $m[0];   // No announcement for this slot; keep it empty.
            }
            $featured = str_contains($m[0], 'news-entry--featured');
            $fallback = '';
            if (preg_match('#<span class="news-entry__category">([^<]*)</span>#', $m[0], $c)) {
                $fallback = html_entity_decode($c[1], ENT_QUOTES, 'UTF-8');
            }

            return gemreserve_news_entry_html($news[$index++], $featured, $fallback);
        },
        $html
    );
}
