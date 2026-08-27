"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary.
 *
 * Without this, an unexpected render error takes the whole route down to Next's
 * bare fallback. This keeps the visitor on a branded page with a way out.
 *
 * The message itself is deliberately not shown: `error.message` can carry
 * internal detail, and in production Next already replaces it with a digest.
 * The digest alone is surfaced, which is enough to correlate a report with a
 * server log without disclosing anything about the failure.
 */
export default function RouteError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    // Console only. No third-party reporter is wired up yet, and none should be
    // added without a decision on what visitor data it would carry.
    console.error("Route error", error.digest ?? error);
  }, [error]);

  return (
    <div className="notfound-page">
      <main id="main-content">
        <section
          className="notfound container-wide"
          aria-labelledby="err-title"
        >
          <div className="notfound__inner">
            <p className="eyebrow">Something went wrong</p>
            <h1 className="notfound__title" id="err-title">
              <span>This page could not</span>
              <span className="hero__title-accent">be displayed</span>
            </h1>
            <p className="notfound__lead">
              The problem has been logged. You can try again, or return to the
              home page.
            </p>

            {error.digest ? (
              <p className="notfound__digest">Reference: {error.digest}</p>
            ) : null}

            <div className="notfound__actions">
              <button
                className="button button--gold"
                onClick={reset}
                type="button"
              >
                Try again
              </button>
              <Link className="button button--outline" href="/">
                Return home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
