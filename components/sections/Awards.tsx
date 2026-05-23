/**
 * Awards — spotlight achievement cards.
 */

"use client";

import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { CountUp } from "@/components/react-bits/CountUp";
import { FadeIn } from "@/components/animations/FadeIn";
import { TwoColumnSection } from "@/components/layout/TwoColumnSection";
import {
  AWARDS_STAT_LABEL,
  SECTION_IDS,
  SECTION_TITLES,
} from "@/lib/constants";
import type { AwardRecord } from "@/types";

interface AwardsProps {
  awards: AwardRecord[];
}

export function Awards({ awards }: AwardsProps) {
  return (
    <TwoColumnSection
      id={SECTION_IDS.AWARDS}
      title={SECTION_TITLES.awards}
    >
      <p className="font-label mb-6 text-[var(--muted)]">
        <CountUp end={awards.length} className="text-[var(--foreground)]" />{" "}
        {AWARDS_STAT_LABEL}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {awards.map((award, i) => (
          <li key={award.id}>
            <FadeIn delay={i * 0.05}>
              <SpotlightCard className="h-full border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="font-display text-lg text-[var(--foreground)]">
                  {award.title}
                </h3>
                <p className="mt-2 font-body text-sm text-[var(--muted)]">
                  {award.issuer}
                </p>
                <p className="font-label mt-4 text-[var(--foreground)]">
                  {award.year}
                </p>
              </SpotlightCard>
            </FadeIn>
          </li>
        ))}
      </ul>
    </TwoColumnSection>
  );
}
