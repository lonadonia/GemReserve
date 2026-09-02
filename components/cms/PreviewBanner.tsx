/**
 * The draft-preview banner.
 *
 * Two jobs, and the first is the one that matters: make it impossible to mistake
 * a draft for the live site. Someone reviewing a preview link should never
 * screenshot it, send it on, and have a colleague read unreleased copy as
 * published. So the banner is fixed, high-contrast, and says what it is in
 * plain words rather than a subtle chrome tint.
 *
 * The second is the exit control, which is a real navigation to a server route
 * rather than a client-side toggle: draft mode is a server cookie, and only the
 * server can clear it.
 *
 * The viewport buttons are deliberately links to the same page rather than a
 * device-frame emulator. An emulator inside a page lies — it renders at a CSS
 * width the browser never actually uses, so media queries and viewport units
 * disagree with a real device. Resizing the window is the honest tool, and the
 * hint says so.
 */

export interface PreviewBannerProps {
  readonly route: string;
  readonly status: string;
  readonly expiresAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  pending: "Pending review",
  future: "Scheduled",
  private: "Private",
  publish: "Published — showing unsaved changes",
};

export function PreviewBanner({ route, status, expiresAt }: PreviewBannerProps): React.ReactElement {
  const label = STATUS_LABEL[status] ?? status;
  const expires = (() => {
    const at = Date.parse(expiresAt);
    return Number.isFinite(at)
      ? new Date(at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      : null;
  })();

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.6rem 1rem",
        background: "#7a2e00",
        color: "#fff",
        font: "500 0.85rem/1.4 var(--font-sans, system-ui), sans-serif",
      }}
    >
      <strong style={{ letterSpacing: "0.04em", textTransform: "uppercase" }}>
        Preview — not live
      </strong>
      <span>
        You are viewing <strong>{label}</strong> content for <code>{route}</code>. Visitors still see
        the published page.
      </span>
      {expires ? <span style={{ opacity: 0.85 }}>This preview expires at {expires}.</span> : null}
      <span style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ opacity: 0.85 }}>
          To check mobile and tablet, resize the browser window — that is what a real device does.
        </span>
        <a
          href={`/api/exit-preview?redirect=${encodeURIComponent(route)}`}
          style={{
            padding: "0.35rem 0.8rem",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: "2px",
            color: "#fff",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Exit preview
        </a>
      </span>
    </div>
  );
}

export default PreviewBanner;
