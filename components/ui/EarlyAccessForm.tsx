"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { LineIcon } from "@/components/icons/LineIcon";

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  role?: string;
  consent?: string;
}

/**
 * The board's waitlist form. Like the other two forms on this site it validates
 * in the browser and reports a demonstration success state — there is no
 * endpoint behind the preview build, and it must never imply that a submission
 * reached anyone or that a place has actually been reserved.
 */
export function EarlyAccessForm({
  roles,
  countryLabel,
  roleLabel,
  consentLabel,
  buttonLabel,
  privacyNote,
}: {
  readonly roles: readonly string[];
  readonly countryLabel: string;
  readonly roleLabel: string;
  readonly consentLabel: string;
  readonly buttonLabel: string;
  readonly privacyNote: string;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const value = (name: string) => String(data.get(name) ?? "").trim();

    if (!value("firstName")) next.firstName = "Enter your first name.";
    if (!value("lastName")) next.lastName = "Enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(value("email")))
      next.email = "Enter a valid email address.";
    if (!value("country")) next.country = "Enter your country of residence.";
    if (!value("role")) next.role = "Choose how you are joining.";
    if (!data.get("consent"))
      next.consent = "Confirm you agree to receive updates.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      formRef.current
        ?.querySelector<HTMLElement>("[aria-invalid='true']")
        ?.focus();
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        ref={successRef}
        className="contact-success"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <span aria-hidden="true">✓</span>
        <div>
          <strong>Your details are ready to submit.</strong>
          <p>
            No data left this page and no place has been reserved; this is a
            demonstration success state. Email{" "}
            <a href="mailto:info@gemreserve.io">info@gemreserve.io</a> to reach
            the team today.
          </p>
        </div>
        <button type="button" onClick={() => setSubmitted(false)}>
          Enter different details
        </button>
      </div>
    );
  }

  const describedBy = (field: keyof Errors) =>
    errors[field] ? `${id}-${field}-error` : undefined;

  return (
    <form className="contact-form" ref={formRef} onSubmit={submit} noValidate>
      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={`${id}-first`}>
            First Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-first`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy("firstName")}
          />
          {errors.firstName ? (
            <p
              className="contact-error"
              id={`${id}-firstName-error`}
              role="alert"
            >
              {errors.firstName}
            </p>
          ) : null}
        </div>

        <div className="contact-field">
          <label htmlFor={`${id}-last`}>
            Last Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-last`}
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy("lastName")}
          />
          {errors.lastName ? (
            <p
              className="contact-error"
              id={`${id}-lastName-error`}
              role="alert"
            >
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor={`${id}-email`}>
          Email Address <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
        />
        {errors.email ? (
          <p className="contact-error" id={`${id}-email-error`} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      {/* The board draws this closed, so its list is not readable. A free-text
          field is honest where an invented roster of countries would not be. */}
      <div className="contact-field">
        <label htmlFor={`${id}-country`}>
          {countryLabel} <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-country`}
          name="country"
          type="text"
          autoComplete="country-name"
          required
          aria-invalid={Boolean(errors.country)}
          aria-describedby={describedBy("country")}
        />
        {errors.country ? (
          <p className="contact-error" id={`${id}-country-error`} role="alert">
            {errors.country}
          </p>
        ) : null}
      </div>

      <div className="contact-field">
        <label htmlFor={`${id}-role`}>
          {roleLabel} <span aria-hidden="true">*</span>
        </label>
        <select
          id={`${id}-role`}
          name="role"
          defaultValue=""
          required
          aria-invalid={Boolean(errors.role)}
          aria-describedby={describedBy("role")}
        >
          <option value="" disabled>
            Please select an option
          </option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role ? (
          <p className="contact-error" id={`${id}-role-error`} role="alert">
            {errors.role}
          </p>
        ) : null}
      </div>

      <div className="contact-consent">
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={describedBy("consent")}
        />
        <label htmlFor={`${id}-consent`}>{consentLabel}</label>
      </div>
      {errors.consent ? (
        <p className="contact-error" id={`${id}-consent-error`} role="alert">
          {errors.consent}
        </p>
      ) : null}

      <button
        className="button button--gold waitlist-form__submit"
        type="submit"
      >
        {buttonLabel}
      </button>

      <p className="waitlist-form__privacy">
        <LineIcon name="lock" size={15} />
        {privacyNote}
      </p>
    </form>
  );
}
