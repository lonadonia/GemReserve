"use client";

import { useId, useMemo, useState, type ReactNode } from "react";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";

interface Category {
  readonly id: string;
  readonly label: string;
}

interface Entry {
  readonly id: string;
  readonly category: string;
  readonly question: string;
  readonly answer: string;
}

const categoryIcons: Record<string, IconName> = {
  all: "search",
  general: "diamond",
  assets: "box",
  buying: "hand-gem",
  trading: "trade",
  security: "shield-check",
};

/**
 * The board draws a category rail with a count beside each label, a search box
 * and a column of collapsed questions. Counts are computed from the entries
 * rather than written into the content, so a question added or removed can never
 * leave the rail lying — the board's own figures do not agree with each other.
 *
 * Each question is a real <button> toggling a panel rather than a details/summary
 * pair, so the open state can be driven by search as well as by clicking.
 */
export function FaqAccordion({
  categories,
  entries,
  searchPlaceholder,
  railFooter,
}: {
  readonly categories: readonly Category[];
  readonly entries: readonly Entry[];
  readonly searchPlaceholder: string;
  /** Rendered beneath the category list, where the board puts its contact card. */
  readonly railFooter?: ReactNode;
}) {
  const id = useId();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: entries.length };
    for (const entry of entries) {
      tally[entry.category] = (tally[entry.category] ?? 0) + 1;
    }
    return tally;
  }, [entries]);

  const normalized = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      entries.filter((entry) => {
        if (activeCategory !== "all" && entry.category !== activeCategory)
          return false;
        if (!normalized) return true;
        return (
          entry.question.toLowerCase().includes(normalized) ||
          entry.answer.toLowerCase().includes(normalized)
        );
      }),
    [entries, activeCategory, normalized],
  );

  // Grouped so the column keeps the board's section headings when nothing is
  // filtering it down to a single category.
  const groups = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: visible.filter((entry) => entry.category === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, visible]);

  return (
    <div className="faq-layout">
      <div className="faq-rail">
        <div className="faq-search">
          <LineIcon name="search" size={19} />
          <label className="sr-only" htmlFor={`${id}-search`}>
            Search questions
          </label>
          <input
            id={`${id}-search`}
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <nav className="faq-categories" aria-label="Question categories">
          <h2>Categories</h2>
          <ul>
            {[{ id: "all", label: "All Questions" }, ...categories].map(
              (category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    aria-pressed={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <LineIcon
                      name={categoryIcons[category.id] ?? "diamond"}
                      size={20}
                    />
                    <span>{category.label}</span>
                    <span className="faq-categories__count">
                      {counts[category.id] ?? 0}
                    </span>
                  </button>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* Wrapped rather than rendered bare: the node is created by the page,
            so as a direct child of this element's children array React cannot
            verify its key and warns. The wrapper is created here, which it can. */}
        {railFooter ? (
          <div className="faq-rail__footer">{railFooter}</div>
        ) : null}
      </div>

      <div className="faq-column">
        <p className="faq-status" role="status">
          {visible.length === entries.length
            ? `Showing all ${entries.length} questions`
            : `Showing ${visible.length} of ${entries.length} questions`}
        </p>

        {groups.length === 0 ? (
          <p className="faq-empty">
            No questions match that search. Try another term, or contact our
            team and we will answer it directly.
          </p>
        ) : (
          groups.map((group) => (
            <section
              className="faq-group"
              key={group.category.id}
              aria-labelledby={`${id}-${group.category.id}`}
            >
              <h3 id={`${id}-${group.category.id}`}>{group.category.label}</h3>
              <ul>
                {group.items.map((entry) => {
                  const open = openId === entry.id;
                  return (
                    <li key={entry.id} className={open ? "is-open" : undefined}>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`${id}-${entry.id}-panel`}
                        id={`${id}-${entry.id}-trigger`}
                        onClick={() => setOpenId(open ? null : entry.id)}
                      >
                        <span>{entry.question}</span>
                        <span className="faq-toggle" aria-hidden="true" />
                      </button>
                      <div
                        className="faq-panel"
                        id={`${id}-${entry.id}-panel`}
                        role="region"
                        aria-labelledby={`${id}-${entry.id}-trigger`}
                        hidden={!open}
                      >
                        <p>{entry.answer}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
