"use client";

import { useId, useRef, useState, type FormEvent } from "react";

import { LineIcon } from "@/components/icons/LineIcon";

/** GR, a three-letter stone code, and a six-digit serial. */
const PASSPORT_ID = /^GR-[A-Z]{3}-\d{6}$/;

/**
 * The lookup the board draws beside the sample record.
 *
 * There is no registry to query yet, so this checks the shape of the ID and says
 * so plainly. It never reports a stone as found or not found, because either
 * answer would be invented — the same line the waitlist and contact forms hold.
 */
export function PassportVerifier({
  placeholder,
  submitLabel,
  dividerLabel,
  cameraLabel,
}: {
  readonly placeholder: string;
  readonly submitLabel: string;
  readonly dividerLabel: string;
  readonly cameraLabel: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = value.trim().toUpperCase();
    if (!PASSPORT_ID.test(normalized)) {
      setChecked("");
      setError("Passport IDs look like GR-RUB-000245.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setChecked(normalized);
  };

  return (
    <div className="passport-verify">
      <form onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor={id}>
          Passport ID
        </label>
        <input
          ref={inputRef}
          id={id}
          name="passport-id"
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
        className={`passport-verify__status${
          error ? " passport-verify__status--error" : ""
        }`}
        id={`${id}-status`}
        role="status"
        aria-live="polite"
      >
        {error ||
          (checked
            ? `${checked} is a valid Passport ID format. Lookup opens with the platform.`
            : "")}
      </p>

      <p className="passport-verify__divider" aria-hidden="true">
        <span />
        {dividerLabel}
        <span />
      </p>

      {/* Scanning needs the registry behind it, so the control is shown as a
          label rather than a button that would open a camera and then have
          nothing to check the code against. */}
      <span className="button button--outline" aria-hidden="true">
        {cameraLabel}
      </span>
    </div>
  );
}
