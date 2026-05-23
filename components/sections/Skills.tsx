/**
 * Skills — single-column expertise with interactive stacked cards.
 */

"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SkillStack } from "@/components/skills/SkillStack";
import { SECTION_IDS, SECTION_TITLES, SKILL_CATEGORIES } from "@/lib/constants";

export function Skills() {
  return (
    <SectionContainer id={SECTION_IDS.SKILLS} className="border-t border-[var(--border)]">
      <FadeIn>
        <h2 className="font-display heading-section text-[var(--foreground)]">
          {SECTION_TITLES.skills}
        </h2>
        <p className="prose-muted mt-2 max-w-2xl text-sm">
          Select a category to highlight related skills, or browse all pills below.
        </p>
      </FadeIn>
      <SkillStack categories={SKILL_CATEGORIES} />
    </SectionContainer>
  );
}
