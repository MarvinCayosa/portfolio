/**
 * Hero — cinematic full-viewport with Silk, role cycler, and social links.
 */

"use client";

import dynamic from "next/dynamic";
import { FadeIn } from "@/components/animations/FadeIn";
import { RoleCycler } from "@/components/hero/RoleCycler";
import { SocialBrandIcon } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/Button";
import {
  HERO_COPY,
  HERO_STATS,
  SECTION_IDS,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { useTheme } from "@/components/providers/ThemeProvider";
import { scrollToSection } from "@/lib/utils";

const Silk = dynamic(
  () => import("@/components/react-bits/Silk").then((m) => m.Silk),
  { ssr: false },
);

export function Hero() {
  const { theme } = useTheme();
  const silkColor = theme === "dark" ? "#3a3a3a" : "#b0aea8";

  return (
    <section
      id={SECTION_IDS.HOME}
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden"
      aria-label="Introduction"
    >
      <Silk
        speed={2.2}
        scale={0.5}
        color={silkColor}
        noiseIntensity={1}
        rotation={0.35}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]"
        aria-hidden
      />

      <div className="relative z-10 w-full px-4 pb-24 pt-24 sm:px-8 sm:pb-28 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h1 className="heading-hero mt-0 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 leading-[0.95] sm:gap-x-2 md:gap-x-2.5">
              <span className="font-body text-[clamp(2.75rem,9vw,5.5rem)] font-semibold tracking-tight text-[var(--foreground)]">
                {HERO_COPY.firstName}
              </span>
              <span className="font-display text-[clamp(2.75rem,9vw,5.5rem)] italic text-[var(--foreground)]">
                {HERO_COPY.lastName}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.08}>
            <RoleCycler className="mt-6" />
          </FadeIn>

          <FadeIn delay={0.14}>
            <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {HERO_COPY.bioLead}
              <span className="font-semibold text-[var(--foreground)]">
                {HERO_COPY.bioRole}
              </span>
              {HERO_COPY.bioMid}
              <span className="font-display font-semibold italic text-[var(--foreground)]">
                {HERO_COPY.bioHighlight}
              </span>
              {HERO_COPY.bioBody}
            </p>
            <p className="mt-3 max-w-xl font-body text-sm font-medium text-[var(--foreground)] sm:text-base">
              {HERO_COPY.bioClosing}
            </p>
          </FadeIn>

          <FadeIn delay={0.18}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]/40 text-[var(--muted)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--foreground)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                  >
                    <SocialBrandIcon name={link.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button onClick={() => scrollToSection(SECTION_IDS.PROJECTS)}>
                {HERO_COPY.ctaViewWork}
              </Button>
              <Button
                variant="secondary"
                onClick={() => scrollToSection(SECTION_IDS.CONTACT)}
              >
                {HERO_COPY.ctaContact}
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.28}>
            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-6 sm:mt-12 sm:grid-cols-4 sm:gap-5 sm:pt-8">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-label text-[0.55rem] text-[var(--muted)]">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-body text-sm font-medium text-[var(--foreground)] sm:text-base">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
