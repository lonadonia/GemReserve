"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { CONSENT_VERSION, submitForm } from "@/lib/forms";

/**
 * Validation and transport now live in `lib/forms`, shared with the API route,
 * so this component only renders states.
 *
 * With form submission switched off — the default, and how the public
 * pre-launch site ships — `submitForm` performs no network call and returns
 * `preview`, which renders exactly the demonstration state this form has always
 * shown. The wording is unchanged and still says plainly that nothing was sent.
 */
export function WaitlistForm({
  placeholder = "Enter your email address",
  buttonLabel = "Join Waitlist",
  compact = false,
}: {
  readonly placeholder?: string;
  readonly buttonLabel?: string;
  readonly compact?: boolean;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<"preview" | "sent" | null>(null);

  useEffect(() => {
    if (outcome) successRef.current?.focus();
  }, [outcome]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    const result = await submitForm({
      kind: "waitlist",
      fields: { email: email.trim() },
      consentVersion: CONSENT_VERSION,
    });
    setPending(false);

    if (result.status === "invalid") {
      setError(result.errors.email ?? "Enter a valid email address.");
      setOutcome(null);
      inputRef.current?.focus();
      return;
    }

    if (result.status === "error") {
      setError(result.message);
      setOutcome(null);
      inputRef.current?.focus();
      return;
    }

    setError("");
    setOutcome(result.status);
  };

  if (outcome) {
    return (
      <div
        ref={successRef}
        className="waitlist-success"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <span aria-hidden="true">✓</span>
        <div>
          {outcome === "sent" ? (
            <>
              <strong>You’re on the list.</strong>
              <p>We’ll be in touch as the programme opens.</p>
            </>
          ) : (
            <>
              <strong>You’re on the preview list.</strong>
              <p>No data was sent; this is a demonstration success state.</p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setOutcome(null);
            setEmail("");
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        >
          Add another email
        </button>
      </div>
    );
  }

  return (
    <form
      className={`waitlist-form${compact ? " waitlist-form--compact" : ""}`}
      onSubmit={submit}
      noValidate
    >
      <label className="sr-only" htmlFor={id}>
        Email address
      </label>
      <input
        ref={inputRef}
        id={id}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={placeholder}
        value={email}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => {
          setEmail(event.target.value);
          if (error) setError("");
        }}
      />
      <button className="button button--gold" type="submit" disabled={pending}>
        {buttonLabel}
      </button>
      <p className="waitlist-error" id={`${id}-error`} role="alert">
        {error}
      </p>
    </form>
  );
}
