"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setError("Enter a valid email address.");
      setSubmitted(false);
      inputRef.current?.focus();
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
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
          <strong>You’re on the preview list.</strong>
          <p>No data was sent; this is a demonstration success state.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
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
      <button className="button button--gold" type="submit">
        {buttonLabel}
      </button>
      <p className="waitlist-error" id={`${id}-error`} role="alert">
        {error}
      </p>
    </form>
  );
}
