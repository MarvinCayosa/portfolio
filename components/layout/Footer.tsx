/**
 * Footer — minimal site footer; extra bottom padding clears the nav blur.
 */

import { FOOTER_COPY, SOCIAL_LINKS, SITE_FULL_NAME } from "@/lib/constants";
import { SocialBrandIcon } from "@/components/icons/SocialIcons";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--background)] pb-28 pt-10 sm:pb-32 sm:pt-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl text-[var(--foreground)]">
              {SITE_FULL_NAME}
            </p>
            <p className="mt-2 font-body text-sm text-[var(--muted)]">
              {FOOTER_COPY.tagline}
            </p>
          </div>

          <ul className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--foreground)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                >
                  <SocialBrandIcon name={link.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 font-label text-[var(--muted)]">{FOOTER_COPY.copyright}</p>
      </div>
    </footer>
  );
}
