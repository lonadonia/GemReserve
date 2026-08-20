import Link from "next/link";

import {
  earlyParticipationItems,
  navigationGroups,
  socialLinks,
} from "@/content/navigation";

import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid container-wide">
        <div className="footer-brand">
          <Logo compact />
          <p>
            GemReserve.io is a Swiss company building the bridge between the
            world of precious gemstones and the future of digital assets.
          </p>
          <p className="footer-location">
            <span aria-hidden="true">🇨🇭</span> Zurich, Switzerland
          </p>
          <div
            className="footer-socials"
            aria-label="Social channels coming soon"
          >
            {socialLinks.map((social) => (
              <span key={social} aria-disabled="true" title="Coming soon">
                {social === "Instagram"
                  ? "◎"
                  : social === "Telegram"
                    ? "↗"
                    : social === "YouTube"
                      ? "▶"
                      : social}
              </span>
            ))}
          </div>
        </div>

        {navigationGroups.map((group) => (
          <div className="footer-column" key={group.label}>
            <h2>{group.label}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    <span aria-disabled="true">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-column">
          <h2>Early Participation</h2>
          <ul>
            {earlyParticipationItems.map((item) => (
              <li key={item.label}>
                <span aria-disabled="true">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom container-wide">
        <p>© 2026 GemReserve.io. All rights reserved.</p>
        <p className="footer-motto">
          <span aria-hidden="true">◇</span> Built on Trust. Backed by Gems.
        </p>
        <p className="footer-tagline">OWN. TRADE. REDEEM.</p>
      </div>
    </footer>
  );
}
