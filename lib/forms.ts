/**
 * The public lead forms' shared contract.
 *
 * Validation lives here rather than in the components so that the browser and
 * the API route apply exactly the same rules. Client-side validation is a
 * convenience for the visitor; the server repeats it because a POST can arrive
 * from anywhere.
 */

import { features } from "./config";

export type FormKind = "waitlist" | "contact" | "early-access";

export interface FormSubmission {
  readonly kind: FormKind;
  readonly fields: Readonly<Record<string, string>>;
  /**
   * Which consent wording the visitor agreed to. Recorded so a later request to
   * produce evidence of consent can name the exact text that was shown, not
   * merely that a box was ticked.
   */
  readonly consentVersion: string;
}

/** The consent copy currently in the interface. Bump when the wording changes. */
export const CONSENT_VERSION = "2026-08-preview";

export type FieldErrors = Readonly<Record<string, string>>;

const EMAIL = /^\S+@\S+\.\S+$/;

/** Caps that keep an oversized body from reaching a delivery provider. */
const LIMITS: Readonly<Record<string, number>> = {
  name: 120,
  email: 254,
  subject: 160,
  country: 120,
  role: 120,
  message: 4000,
};

/**
 * The single source of truth for what a valid submission looks like.
 *
 * Returns a map of field name to message; an empty map means valid. The
 * messages are the ones already shown in the interface, so moving validation
 * here changed no visible text.
 */
export function validateSubmission(submission: FormSubmission): FieldErrors {
  const errors: Record<string, string> = {};
  const { kind, fields } = submission;
  const value = (key: string) => (fields[key] ?? "").trim();

  if (kind === "contact") {
    if (!value("name")) errors.name = "Enter your full name.";
    if (!EMAIL.test(value("email")))
      errors.email = "Enter a valid email address.";
    if (!value("subject")) errors.subject = "Choose a subject.";
    if (!value("message")) errors.message = "Enter a message.";
  } else {
    if (!EMAIL.test(value("email")))
      errors.email = "Enter a valid email address.";
  }

  for (const [key, max] of Object.entries(LIMITS)) {
    if (value(key).length > max) {
      errors[key] = `Keep this under ${max} characters.`;
    }
  }

  return errors;
}

export type SubmitOutcome =
  /** Delivered by the server to the configured provider. */
  | { readonly status: "sent" }
  /**
   * Submission is switched off for this deployment. The interface must say so
   * plainly — this is the state that keeps the preview honest, and it must
   * never be presented to the visitor as a successful send.
   */
  | { readonly status: "preview" }
  | { readonly status: "invalid"; readonly errors: FieldErrors }
  | { readonly status: "error"; readonly message: string };

/**
 * Submit a form from the browser.
 *
 * With the feature flag off — which is the default, and the state the public
 * pre-launch site ships in — this performs no network call and returns
 * `preview`. Nothing is transmitted and nothing is claimed.
 */
export async function submitForm(
  submission: FormSubmission,
): Promise<SubmitOutcome> {
  const errors = validateSubmission(submission);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  if (!features.formSubmission) return { status: "preview" };

  try {
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    if (response.ok) return { status: "sent" };

    // 503 is the server saying it has no delivery destination configured. That
    // is the same honest outcome as the flag being off, not a failure to show
    // the visitor as an error.
    if (response.status === 503) return { status: "preview" };

    if (response.status === 400) {
      const body = (await response.json().catch(() => null)) as {
        errors?: FieldErrors;
      } | null;
      return { status: "invalid", errors: body?.errors ?? {} };
    }

    if (response.status === 429) {
      return {
        status: "error",
        message: "Too many attempts. Please try again in a few minutes.",
      };
    }

    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  } catch {
    return {
      status: "error",
      message: "Could not reach the server. Please check your connection.",
    };
  }
}
