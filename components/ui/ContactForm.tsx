"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

interface Errors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

/**
 * The board draws this form but there is no endpoint behind the preview build,
 * so it validates in the browser and reports a demonstration success state, the
 * same contract the waitlist form already keeps. It must never imply that a
 * message reached anyone.
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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!subject) next.subject = "Choose a subject.";
    if (!message) next.message = "Enter a message.";
    if (!data.get("consent"))
      next.consent = "Confirm you agree to the privacy policy.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = formRef.current?.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      first?.focus();
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
          <strong>Your message is ready to send.</strong>
          <p>
            No data left this page; this is a demonstration success state. Email{" "}
            <a href="mailto:info@gemreserve.io">info@gemreserve.io</a> to reach
            the team today.
          </p>
        </div>
        <button type="button" onClick={() => setSubmitted(false)}>
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
      >
        Send Message
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
