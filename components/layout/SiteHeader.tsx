"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { homeAnnouncement } from "@/content/home";
import { navigationGroups } from "@/content/navigation";

import { Logo } from "./Logo";

interface SiteHeaderProps {
  readonly showAnnouncement?: boolean;
}

export function SiteHeader({ showAnnouncement = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const mobileTrigger = mobileTriggerRef.current;
    document.body.style.overflow = "hidden";
    let focusTimer = 0;
    const focusFrame = requestAnimationFrame(() => {
      const focusWhenVisible = () => {
        const closeButton = closeButtonRef.current;
        if (
          closeButton &&
          window.getComputedStyle(closeButton).visibility === "visible"
        ) {
          closeButton.focus();
          return;
        }
        focusTimer = window.setTimeout(focusWhenVisible, 16);
      };
      focusWhenVisible();
    });

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = mobilePanelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (mobileTrigger?.offsetParent) {
        mobileTrigger.focus();
      }
    };
  }, [mobileOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1241px)");
    const closeAtDesktop = () => {
      if (desktopQuery.matches) setMobileOpen(false);
    };
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  const handleMenuKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    label: string,
  ) => {
    if (event.key === "Escape") {
      setOpenMenu(null);
      event.currentTarget.focus();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpenMenu(label);
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(`[data-menu="${label}"] a`)
          ?.focus();
      });
    }
  };

  return (
    <header className="site-header" ref={headerRef}>
      {showAnnouncement ? (
        <div className="announcement-bar">
          <span className="announcement-gem" aria-hidden="true">
            ◇
          </span>
          <p>{homeAnnouncement.message}</p>
          <div className="announcement-actions">
            <span aria-disabled="true" title="Participant login is coming soon">
              Login
            </span>
            <Link href="/#waitlist">Join Waitlist</Link>
          </div>
        </div>
      ) : null}

      <div className="site-nav-shell">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationGroups.map((group) => {
            const isActive =
              group.href === "/"
                ? pathname === "/"
                : group.href !== null && pathname.startsWith(group.href);
            const isOpen = openMenu === group.label;
            return (
              <div
                className="desktop-nav-group"
                key={group.label}
                onPointerEnter={() => setOpenMenu(group.label)}
                onPointerLeave={() => setOpenMenu(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenMenu(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Escape") return;
                  event.preventDefault();
                  event.currentTarget
                    .querySelector<HTMLButtonElement>("button")
                    ?.focus();
                  setOpenMenu(null);
                }}
              >
                <button
                  className={`desktop-nav-trigger${isActive ? " is-active" : ""}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${navId}-${group.label.replaceAll(" ", "-")}`}
                  onClick={() => setOpenMenu(isOpen ? null : group.label)}
                  onFocus={() => setOpenMenu(group.label)}
                  onKeyDown={(event) => handleMenuKeyDown(event, group.label)}
                >
                  {group.label}
                  <span aria-hidden="true">⌄</span>
                </button>
                <div
                  className={`desktop-dropdown${isOpen ? " is-open" : ""}`}
                  id={`${navId}-${group.label.replaceAll(" ", "-")}`}
                  data-menu={group.label}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <p>{group.label}</p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.label}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span
                            aria-disabled="true"
                            title="Coming in a future phase"
                          >
                            {item.label}
                            <small>Coming soon</small>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          <span className="desktop-nav-future" aria-disabled="true">
            Early Participation
          </span>
        </nav>

        <div className="header-actions">
          {!showAnnouncement ? (
            <span
              className="login-link"
              aria-disabled="true"
              title="Coming soon"
            >
              Login
            </span>
          ) : null}
          <Link
            className="button button--small button--outline"
            href="/#waitlist"
          >
            Join Waitlist
          </Link>
        </div>

        <button
          ref={mobileTriggerRef}
          className="mobile-menu-trigger"
          type="button"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`mobile-navigation${mobileOpen ? " is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <button
          className="mobile-navigation-backdrop"
          type="button"
          aria-label="Close navigation"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className="mobile-navigation-panel"
          ref={mobilePanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="mobile-navigation-header">
            <Logo compact />
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            >
              ×
            </button>
          </div>
          <nav aria-label="Mobile primary navigation">
            {navigationGroups.map((group) => (
              <details
                key={group.label}
                open={
                  group.href === "/"
                    ? pathname === "/"
                    : group.href === pathname
                }
              >
                <summary>{group.label}</summary>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span aria-disabled="true">
                          {item.label}
                          <small>Coming soon</small>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
          <Link
            className="button button--gold mobile-navigation-cta"
            href="/#waitlist"
            onClick={() => setMobileOpen(false)}
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
