"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { LineIcon } from "@/components/icons/LineIcon";

/** GR, a three-letter stone code, and a six-digit serial. */
const GEM_ID = /^GR-[A-Z]{3}-\d{6}$/;

/**
 * The identifier lookup two boards draw: "Verify in seconds" beside the sample
 * passport, and "Search the registry" beside the sample asset record. They are
 * the same control over the same identifier, so they are the same component with
 * a different noun.
 *
 * Neither registry exists yet, so this checks the shape of the ID and says so
 * plainly. It never reports a stone as found or not found, because either answer
 * would be invented — the same line the waitlist and contact forms hold.
 */
export function IdLookup({
  noun,
  placeholder,
  submitLabel,
  children,
}: {
  /** What the identifier is called here: "Passport ID" or "Asset ID". */
  readonly noun: string;
  readonly placeholder: string;
  readonly submitLabel: string;
  /** The alternative route the board offers beneath the field, if any. */
  readonly children?: ReactNode;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = value.trim().toUpperCase();
    if (!GEM_ID.test(normalized)) {
      setChecked("");
      setError(`${noun}s look like GR-RUB-000245.`);
      inputRef.current?.focus();
      return;
    }
    setError("");
    setChecked(normalized);
  };

  return (
    <div className="id-lookup">
      <form onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor={id}>
          {noun}
        </label>
        <input
          ref={inputRef}
          id={id}
          name={noun.toLowerCase().replace(/\s+/g, "-")}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-status`}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError("");
            if (checked) setChecked("");
          }}
        />
        <button className="button button--gold" type="submit">
          <LineIcon name="search" size={17} />
          <span>{submitLabel}</span>
        </button>
      </form>

      <p
        className={`id-lookup__status${
          error ? " id-lookup__status--error" : ""
        }`}
        id={`${id}-status`}
        role="status"
        aria-live="polite"
      >
        {error ||
          (checked
            ? `${checked} is a valid ${noun} format. Lookup opens with the platform.`
            : "")}
      </p>

      {children}
    </div>
  );
}
