/**
 * ProjectShowcase — borderless gallery with side fades; click only on gallery.
 */

"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { mergeProjectsWithCatalog } from "@/lib/project-catalog";
import type { ProjectEntry } from "@/types/project";
import type { ProjectRecord } from "@/types";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";

const CircularGallery = dynamic(
  () =>
    import("@/components/react-bits/CircularGallery").then((m) => m.CircularGallery),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(44vh,400px)] min-h-[260px] w-full animate-pulse bg-transparent sm:min-h-[300px] lg:min-h-[340px]" />
    ),
  },
);

interface ProjectShowcaseProps {
  projects: ProjectRecord[];
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const entries = useMemo(() => mergeProjectsWithCatalog(projects), [projects]);
  const [selected, setSelected] = useState<ProjectEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const galleryItems = useMemo(
    () => entries.map((p) => ({ image: p.image, text: p.title })),
    [entries],
  );

  const openProject = (index: number) => {
    const project = entries[index];
    if (!project) return;
    setSelected(project);
    setModalOpen(true);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mt-4 w-full text-center font-label text-[var(--muted)]">
        These are some of the projects I've worked on and applied my skills to.
      </p>

      <div className="relative mt-4 w-full max-w-[min(100vw,96rem)] px-0 sm:mt-6">
        <div className="h-[min(44vh,400px)] min-h-[260px] w-full overflow-hidden sm:h-[min(52vh,500px)] sm:min-h-[300px] lg:h-[min(58vh,560px)] lg:min-h-[340px]">
          <CircularGallery
            items={galleryItems}
            bend={2}
            textColor="#f2f0eb"
            borderRadius={0.06}
            scrollEase={0.035}
            scrollSpeed={1.6}
            autoPlay
            autoPlaySpeed={0.02}
            onSelect={openProject}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent sm:w-16"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--background)] via-[var(--background)]/80 to-transparent sm:w-16"
          aria-hidden
        />
      </div>

      <ProjectDetailModal
        project={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
