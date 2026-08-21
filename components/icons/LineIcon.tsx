export type IconName =
  | "diamond"
  | "shield-check"
  | "lock"
  | "globe"
  | "chart"
  | "refresh"
  | "search"
  | "certificate"
  | "vault"
  | "token"
  | "phone"
  | "box"
  | "hand-gem"
  | "passport"
  | "cubes"
  | "eye"
  | "users"
  | "contract"
  | "network"
  | "check"
  | "trade"
  | "source"
  | "redeem"
  | "mountain"
  | "chevron-down";

export interface LineIconProps {
  name: IconName;
  title?: string;
  className?: string;
  size?: number | string;
}

function IconGlyph({ name }: Pick<LineIconProps, "name">) {
  switch (name) {
    case "chevron-down":
      return <path d="m6 9.5 6 5.5 6-5.5" />;
    case "diamond":
      return (
        <>
          <path d="M3 8.5 7.25 4h9.5L21 8.5 12 20 3 8.5Z" />
          <path d="m7.25 4 4.75 16 4.75-16M3 8.5h18M7.25 4 12 8.5 16.75 4" />
        </>
      );
    case "shield-check":
      return (
        <>
          <path d="M12 2.75 19 5.6v5.2c0 4.5-2.8 7.9-7 10.45-4.2-2.55-7-5.95-7-10.45V5.6L12 2.75Z" />
          <path d="m8.5 11.8 2.15 2.15 4.85-5.2" />
        </>
      );
    case "lock":
      return (
        <>
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 9h17M3.5 15h17M12 3c2.2 2.45 3.25 5.45 3.25 9S14.2 18.55 12 21M12 3C9.8 5.45 8.75 8.45 8.75 12S9.8 18.55 12 21" />
        </>
      );
    case "chart":
      return (
        <>
          <path d="M4 20V5M4 20h16" />
          <path d="M7 20v-5h3v5m2 0v-8h3v8m2 0V9h3v11M7 11l4-4 3 2 6-6" />
          <path d="M16.5 3H20v3.5" />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M18.2 9A7.5 7.5 0 0 0 5.5 6.7L4 8M5.8 15A7.5 7.5 0 0 0 18.5 17.3L20 16" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.25 15.25 4.75 4.75" />
        </>
      );
    case "certificate":
      return (
        <>
          <path d="M6 3h9l3 3v7M15 3v4h3M6 3v18h6M9 8h4M9 11h3" />
          <circle cx="15.5" cy="16" r="3" />
          <path d="m13.8 18.5-.55 2.5 2.25-1 2.25 1-.55-2.5" />
        </>
      );
    case "vault":
      return (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 8v2m0 4v2m-4-4h2m4 0h2m-2.8-1.2 1.4-1.4m-5.2 5.2 1.4-1.4M5.5 7h1M5.5 17h1M19 9v6" />
        </>
      );
    case "token":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m12 6.75 4.5 2.6v5.3L12 17.25l-4.5-2.6v-5.3L12 6.75Z" />
          <path d="m7.5 9.35 4.5 2.6 4.5-2.6M12 11.95v5.3" />
        </>
      );
    case "phone":
      return (
        <path d="M8.25 3.75 10 8.2 7.75 9.75a15 15 0 0 0 6.5 6.5L15.8 14 20.25 15.75l-.35 3.1a2 2 0 0 1-2.1 1.75C9.95 20.05 3.95 14.05 3.4 6.2a2 2 0 0 1 1.75-2.1l3.1-.35Z" />
      );
    case "box":
      return (
        <>
          <path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" />
          <path d="m4 7 8 4 8-4M12 11v10M8 5l8 4" />
        </>
      );
    case "hand-gem":
      return (
        <>
          <path d="m12.5 3 2-2h4l2 2-4 5-4-5Z" />
          <path d="M2.5 15.5h3l3.5-3a2 2 0 0 1 1.3-.5h3.2a1.75 1.75 0 0 1 0 3.5h-3" />
          <path d="m13.5 15.5 3.75-2.2a1.8 1.8 0 0 1 2.25.3 1.8 1.8 0 0 1-.25 2.7l-6 4.2a3 3 0 0 1-2.25.45L5.5 19.5h-3M14.5 1l2 7m2-7-2 7" />
        </>
      );
    case "passport":
      return (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <circle cx="10" cy="11" r="3" />
          <path d="M7 11h6M10 8c.8.8 1.2 1.8 1.2 3S10.8 13.2 10 14M10 8c-.8.8-1.2 1.8-1.2 3S9.2 13.2 10 14M7 17h6M15.5 9H17m-1.5 3H17m-1.5 3H17" />
        </>
      );
    case "cubes":
      return (
        <>
          <path d="m12 2.5 3.5 2v4L12 10.5l-3.5-2v-4l3.5-2Z" />
          <path d="m8.5 4.5 3.5 2 3.5-2M12 6.5v4" />
          <path d="m7 11.5 3.5 2v4L7 19.5l-3.5-2v-4l3.5-2Zm10 0 3.5 2v4L17 19.5l-3.5-2v-4l3.5-2Z" />
          <path d="m3.5 13.5 3.5 2 3.5-2M7 15.5v4m6.5-6 3.5 2 3.5-2M17 15.5v4" />
        </>
      );
    case "eye":
      return (
        <>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.75" />
        </>
      );
    case "users":
      return (
        <>
          <circle cx="12" cy="7" r="3" />
          <circle cx="5.5" cy="9" r="2" />
          <circle cx="18.5" cy="9" r="2" />
          <path d="M6.5 20v-1.5A4.5 4.5 0 0 1 11 14h2a4.5 4.5 0 0 1 4.5 4.5V20M2 19v-1a3 3 0 0 1 3-3h1m16 4v-1a3 3 0 0 0-3-3h-1" />
        </>
      );
    case "contract":
      return (
        <>
          <path d="M6 3h9l3 3v15H6V3ZM15 3v4h3M9 9h6m-6 3h6" />
          <path d="m9 17 1.5 1.5L15 14" />
        </>
      );
    case "network":
      return (
        <>
          <path d="m12 6-6 4m6-4 6 4M6 14l6 4 6-4M6 10v4m12-4v4M12 6v12" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
          <circle cx="12" cy="20" r="2" />
        </>
      );
    case "check":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m7.75 12 2.75 2.75 5.75-6" />
        </>
      );
    case "trade":
      return (
        <>
          <path d="M4 8h13M14 5l3 3-3 3M20 16H7M10 13l-3 3 3 3" />
          <circle cx="4" cy="8" r="1" />
          <circle cx="20" cy="16" r="1" />
        </>
      );
    case "source":
      return (
        <>
          <path d="M12 21s6-5.35 6-11a6 6 0 1 0-12 0c0 5.65 6 11 6 11Z" />
          <path d="m9 9 1.5-2h3L15 9l-3 4-3-4Zm0 0h6m-4.5-2 1.5 6L13.5 7" />
        </>
      );
    case "redeem":
      return (
        <>
          <path d="M19.25 8.25V4.5h-3.75M4.75 15.75v3.75H8.5" />
          <path d="M18.25 6.2A8 8 0 0 0 5.1 8.4M5.75 17.8a8 8 0 0 0 13.15-2.2" />
          <path d="m9 11 1.5-2h3L15 11l-3 4-3-4Zm0 0h6" />
        </>
      );
    case "mountain":
      return (
        <>
          <path d="M2.5 20 9 9l3 4 3-6 6.5 13h-19Z" />
          <path d="m6.75 12.8 2.25 1.7 1.65-1M13.6 9.8 15 12l1.4-1 2.35 4M4 20h16" />
          <circle cx="5" cy="5" r="2" />
        </>
      );
  }

  const exhaustiveName: never = name;
  return exhaustiveName;
}

export function LineIcon({ name, title, className, size = 24 }: LineIconProps) {
  const accessibleTitle = title?.trim() || undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={accessibleTitle ? "img" : undefined}
      aria-label={accessibleTitle}
      aria-hidden={accessibleTitle ? undefined : true}
      focusable="false"
    >
      {accessibleTitle ? <title>{accessibleTitle}</title> : null}
      <IconGlyph name={name} />
    </svg>
  );
}
