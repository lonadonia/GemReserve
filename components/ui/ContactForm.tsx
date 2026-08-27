"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { CONSENT_VERSION, submitForm, validateSubmission } from "@/lib/forms";

interface Errors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

/**
 * Field validation and transport are shared with the API route through
 * `lib/forms`, so the browser and the server apply identical rules.
 *
 * With submission switched off — the default for the public pre-launch site —
 * nothing is transmitted and the demonstration state below is shown, with its
 * original wording intact. It must never imply that a message reached anyone.
 */
export function ContactForm({
  subjects,
}: {
  readonly subjects: readonly string[];
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<"preview" | "sent" | null>(null);

  useEffect(() => {
    if (outcome) successRef.current?.focus();
  }, [outcome]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const data = new FormData(event.currentTarget);
    const fields = {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    // The shared rules and this form's own consent check are collected
    // together, so an empty submit reports every problem at once rather than
    // one at a time. Consent belongs to the form, not to the payload, so it is
    // never sent as a field.
    const merged: Errors = validateSubmission({
      kind: "contact",
      fields,
      consentVersion: CONSENT_VERSION,
    });
    if (!data.get("consent")) {
      merged.consent = "Confirm you agree to the privacy policy.";
    }

    if (Object.keys(merged).length > 0) {
      setErrors(merged);
      formRef.current
        ?.querySelector<HTMLElement>("[aria-invalid='true']")
        ?.focus();
      return;
    }

    setPending(true);
    const result = await submitForm({
      kind: "contact",
      fields,
      consentVersion: CONSENT_VERSION,
    });
    setPending(false);

    if (result.status === "invalid") {
      setErrors(result.errors as Errors);
      const first = formRef.current?.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      first?.focus();
      return;
    }

    if (result.status === "error") {
      setErrors({ message: result.message });
      return;
    }

    setErrors({});
    setOutcome(result.status);
  };

  if (outcome) {
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
          {outcome === "sent" ? (
            <>
              <strong>Your message has been sent.</strong>
              <p>
                We will reply to the address you gave. Email{" "}
                <a href="mailto:info@gemreserve.io">info@gemreserve.io</a> if
                you need to reach the team sooner.
              </p>
            </>
          ) : (
            <>
              <strong>Your message is ready to send.</strong>
              <p>
                No data left this page; this is a demonstration success state.
                Email <a href="mailto:info@gemreserve.io">info@gemreserve.io</a>{" "}
                to reach the team today.
              </p>
            </>
          )}
        </div>
        <button type="button" onClick={() => setOutcome(null)}>
          Write another message
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
          <label htmlFor={`${id}-name`}>
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
          />
          {errors.name ? (
            <p className="contact-error" id={`${id}-name-error`} role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="contact-field">
          <label htmlFor={`${id}-company`}>Company / Organization</label>
          <input
            id={`${id}-company`}
            name="company"
            type="text"
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="contact-form__row">
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

        <div className="contact-field">
          <label htmlFor={`${id}-phone`}>Phone Number</label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor={`${id}-subject`}>
          Subject <span aria-hidden="true">*</span>
        </label>
        <select
          id={`${id}-subject`}
          name="subject"
          defaultValue=""
          required
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={describedBy("subject")}
        >
          <option value="" disabled>
            Please select a subject
          </option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        {errors.subject ? (
          <p className="contact-error" id={`${id}-subject-error`} role="alert">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div className="contact-field">
        <label htmlFor={`${id}-message`}>
          Your Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          placeholder="How can we assist you?"
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
        />
        {errors.message ? (
          <p className="contact-error" id={`${id}-message-error`} role="alert">
            {errors.message}
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
        <label htmlFor={`${id}-consent`}>
          I confirm that I have read and agree to the Privacy Policy.
        </label>
      </div>
      {errors.consent ? (
        <p className="contact-error" id={`${id}-consent-error`} role="alert">
          {errors.consent}
        </p>
      ) : null}

      <button
        className="button button--gold contact-form__submit"
        type="submit"
        disabled={pending}
      >
        Send Message
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
