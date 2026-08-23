"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { LineIcon } from "@/components/icons/LineIcon";
import type { PassportSection } from "@/content/passports";

/**
 * The record the board draws under "Inside every passport": a rail of the ten
 * sections a passport holds, and the open section beside it.
 *
 * It is a tab set rather than an accordion because the board shows one section
 * open against a fixed panel, and because the stone stays on screen while the
 * reader moves between sections — which is the point being made, that all of
 * this belongs to one asset.
 */
export function PassportExplorer({
  sections,
  name,
  species,
  imageSrc,
  imageAlt,
  sampleNote,
  actionLabel,
}: {
  readonly sections: readonly PassportSection[];
  readonly name: string;
  readonly species: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly sampleNote: string;
  readonly actionLabel: string;
}) {
  const id = useId();
  const [openId, setOpenId] = useState(sections[0]?.id ?? "");
  const open = sections.find((section) => section.id === openId) ?? sections[0];

  return (
    <div className="passport-explorer">
      <div
        className="passport-explorer__rail"
        role="tablist"
        aria-label="Sections of a Digital Asset Passport"
        aria-orientation="vertical"
      >
        {sections.map((section) => {
          const selected = section.id === open?.id;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              id={`${id}-tab-${section.id}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${section.id}`}
              tabIndex={selected ? 0 : -1}
              className={`passport-explorer__tab${
                selected ? " passport-explorer__tab--active" : ""
              }`}
              onClick={() => setOpenId(section.id)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
                  return;
                event.preventDefault();
                const index = sections.findIndex(
                  (item) => item.id === section.id,
                );
                const next =
                  event.key === "ArrowDown"
                    ? (index + 1) % sections.length
                    : (index - 1 + sections.length) % sections.length;
                const target = sections[next];
                setOpenId(target.id);
                document.getElementById(`${id}-tab-${target.id}`)?.focus();
              }}
            >
              <LineIcon name="passport" size={17} />
              {section.label}
            </button>
          );
        })}
      </div>

      {open ? (
        <div
          className="passport-explorer__record"
          role="tabpanel"
          id={`${id}-panel-${open.id}`}
          aria-labelledby={`${id}-tab-${open.id}`}
          tabIndex={0}
        >
          <Image
            className="passport-explorer__stone"
            src={imageSrc}
            alt={imageAlt}
            width={560}
            height={560}
            sizes="(max-width: 980px) 38vw, 200px"
          />

          <div className="passport-explorer__body">
            <p className="eyebrow">{sampleNote}</p>
            <h3>{name}</h3>
            <p className="passport-explorer__species">{species}</p>
            <p className="passport-explorer__summary">{open.summary}</p>

            <dl className="passport-explorer__fields">
              {open.fields.map((field) => (
                <div key={field.id}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>

            <span
              className="button button--outline button--small"
              aria-hidden="true"
            >
              {actionLabel}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
