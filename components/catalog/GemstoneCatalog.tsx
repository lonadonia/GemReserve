"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";

import {
  assetCatalogHeading,
  assetFilterOptions,
  assetSortLabel,
  assetSortOptions,
  gemstoneAssets,
} from "../../content/assets";

type FilterValue = (typeof assetFilterOptions)[number]["value"];
type CatalogAsset = (typeof gemstoneAssets)[number];
type CatalogSortValue = "popularity" | "price-asc" | "price-desc" | "name";

interface CatalogSortOption {
  readonly value: CatalogSortValue;
  readonly label: string;
}

const supplementalSortOptions = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A–Z" },
] as const satisfies readonly CatalogSortOption[];

const importedSortOptions = assetSortOptions as readonly CatalogSortOption[];

const catalogSortOptions: readonly CatalogSortOption[] = [
  ...importedSortOptions,
  ...supplementalSortOptions.filter(
    ({ value }) =>
      !importedSortOptions.some((option) => option.value === value),
  ),
];

const catalogAssets = gemstoneAssets as readonly CatalogAsset[];
const popularityOrder = new Map(
  catalogAssets.map((asset, index) => [asset.id, index]),
);

function compareAssets(
  first: CatalogAsset,
  second: CatalogAsset,
  sortValue: CatalogSortValue,
) {
  let comparison = 0;

  if (sortValue === "price-asc") {
    comparison = first.price.amount - second.price.amount;
  } else if (sortValue === "price-desc") {
    comparison = second.price.amount - first.price.amount;
  } else if (sortValue === "name") {
    comparison = first.name.localeCompare(second.name, "en", {
      sensitivity: "base",
    });
  }

  if (comparison !== 0) {
    return comparison;
  }

  return (
    (popularityOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
    (popularityOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER)
  );
}

export function GemstoneCatalog() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [sortValue, setSortValue] = useState<CatalogSortValue>("popularity");
  const [isPending, startTransition] = useTransition();

  const selectedCategory =
    assetFilterOptions.find((option) => option.value === activeFilter)
      ?.category ?? null;

  const visibleAssets = useMemo(() => {
    const filteredAssets = selectedCategory
      ? catalogAssets.filter((asset) => asset.category === selectedCategory)
      : catalogAssets;

    return [...filteredAssets].sort((first, second) =>
      compareAssets(first, second, sortValue),
    );
  }, [selectedCategory, sortValue]);

  const updateFilter = (value: FilterValue) => {
    startTransition(() => setActiveFilter(value));
  };

  const updateSort = (value: CatalogSortValue) => {
    startTransition(() => setSortValue(value));
  };

  return (
    <section className="catalog-root" aria-labelledby="catalog-heading">
      <div className="catalog-heading-row">
        <span className="catalog-heading-rule" aria-hidden="true" />
        <h2 className="catalog-heading" id="catalog-heading">
          {assetCatalogHeading}
        </h2>
        <span className="catalog-heading-rule" aria-hidden="true" />
      </div>

      <div className="catalog-controls">
        <div
          className="catalog-filters"
          role="group"
          aria-label="Filter gemstone assets by category"
        >
          {assetFilterOptions.map((option) => {
            const isActive = activeFilter === option.value;

            return (
              <button
                className={`catalog-filter-button${
                  isActive ? " catalog-filter-button--active" : ""
                }`}
                type="button"
                key={option.value}
                aria-pressed={isActive}
                onClick={() => updateFilter(option.value)}
              >
                <span className="catalog-filter-label">{option.label}</span>
                {isActive ? (
                  <span className="catalog-filter-state">Selected</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="catalog-sort-control">
          <label className="catalog-sort-label" htmlFor="catalog-sort">
            {assetSortLabel}
          </label>
          <select
            className="catalog-sort-select"
            id="catalog-sort"
            value={sortValue}
            onChange={(event) =>
              updateSort(event.currentTarget.value as CatalogSortValue)
            }
          >
            {catalogSortOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="catalog-results-status" role="status" aria-live="polite">
        {visibleAssets.length} gemstone{visibleAssets.length === 1 ? "" : "s"}
      </p>

      <ul
        className={`catalog-grid catalog-grid--animated${
          isPending ? " catalog-grid--updating" : ""
        }`}
        aria-busy={isPending}
      >
        {visibleAssets.map((asset) => {
          const detailLabel = "quality" in asset ? "Quality" : "Treatment";
          const detailValue =
            "quality" in asset ? asset.quality : asset.treatment;

          return (
            <li className="catalog-grid-item" key={asset.id}>
              <article className="gemstone-card">
                <div className="gemstone-card-image-frame">
                  <Image
                    className="gemstone-card-image"
                    src={asset.imageSrc}
                    alt={asset.imageAlt}
                    width={480}
                    height={480}
                    sizes="(max-width: 479px) 92vw, (max-width: 767px) 44vw, (max-width: 1099px) 30vw, 19vw"
                  />
                  <span className="image-glint" aria-hidden="true" />
                </div>

                <div className="gemstone-card-body">
                  <header className="gemstone-card-header">
                    <h3 className="gemstone-card-title">{asset.name}</h3>
                    <p className="gemstone-card-origin">
                      {asset.originOrGrade.value}
                    </p>
                  </header>

                  <dl className="gemstone-card-details">
                    <div className="gemstone-card-detail-row">
                      <dt>Weight</dt>
                      <dd>{asset.weight.label}</dd>
                    </div>
                    <div className="gemstone-card-detail-row">
                      <dt>Shape</dt>
                      <dd>{asset.shape}</dd>
                    </div>
                    <div className="gemstone-card-detail-row">
                      <dt>{detailLabel}</dt>
                      <dd>{detailValue}</dd>
                    </div>
                    <div className="gemstone-card-detail-row">
                      <dt>Report</dt>
                      <dd>{asset.report}</dd>
                    </div>
                  </dl>

                  <div className="gemstone-card-price-row">
                    <span className="gemstone-card-price-label">
                      Price per Token
                    </span>
                    <span className="gemstone-card-price">
                      {asset.price.formatted}
                    </span>
                  </div>

                  <button
                    className="gemstone-card-details-button"
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Gemstone details are coming soon"
                  >
                    {asset.ctaLabel}
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default GemstoneCatalog;
