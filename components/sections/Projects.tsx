/**
 * Projects — centered circular gallery with detail modal.
 */

"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SECTION_IDS, SECTION_TITLES } from "@/lib/constants";
import type { ProjectRecord } from "@/types";

interface ProjectsProps {
  projects: ProjectRecord[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <SectionContainer
      id={SECTION_IDS.PROJECTS}
      className="overflow-x-hidden border-t border-[var(--border)]"
    >
      <div className="mx-auto flex w-full max-w-full flex-col items-center overflow-hidden px-0 text-center sm:max-w-[96rem] sm:px-2">
        <FadeIn>
          <h2 className="font-display heading-section text-[var(--foreground)]">
            {SECTION_TITLES.projects}
          </h2>
        </FadeIn>
        <FadeIn delay={0.06}>
          <ProjectShowcase projects={projects} />
        </FadeIn>
      </div>
    </SectionContainer>
  );
}
