/**
 * Experience — two-column timeline with accordion.
 */

"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Accordion } from "@/components/ui/Accordion";
import { TwoColumnSection } from "@/components/layout/TwoColumnSection";
import { SECTION_IDS, SECTION_TITLES } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils";
import type { ExperienceRecord } from "@/types";

interface ExperienceProps {
  experiences: ExperienceRecord[];
}

export function Experience({ experiences }: ExperienceProps) {
  const accordionItems = experiences.map((exp) => ({
    id: String(exp.id),
    trigger: (
      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-body font-medium text-[var(--foreground)]">
            {exp.company}
          </p>
          <p className="text-sm text-[var(--muted)]">{exp.role}</p>
        </div>
        <p className="font-label shrink-0 text-[var(--muted)]">
          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
        </p>
      </div>
    ),
    content: (
      <ul className="list-none space-y-2 pl-0">
        {(exp.bullets ?? []).map((bullet) => (
          <li key={bullet} className="flex gap-2 text-[var(--muted)]">
            <span className="text-[var(--foreground)]">—</span>
            {bullet}
          </li>
        ))}
      </ul>
    ),
  }));

  return (
    <TwoColumnSection
      id={SECTION_IDS.EXPERIENCE}
      title={SECTION_TITLES.experience}
    >
      <FadeIn>
        <Accordion items={accordionItems} />
      </FadeIn>
    </TwoColumnSection>
  );
}
