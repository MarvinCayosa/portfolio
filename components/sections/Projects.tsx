/**
 * Projects — circular image gallery with detail modal.
 */

"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { TwoColumnSection } from "@/components/layout/TwoColumnSection";
import { SECTION_IDS, SECTION_TITLES } from "@/lib/constants";
import type { ProjectRecord } from "@/types";

interface ProjectsProps {
  projects: ProjectRecord[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <TwoColumnSection id={SECTION_IDS.PROJECTS} title={SECTION_TITLES.projects}>
      <FadeIn>
        <ProjectShowcase projects={projects} />
      </FadeIn>
    </TwoColumnSection>
  );
}
