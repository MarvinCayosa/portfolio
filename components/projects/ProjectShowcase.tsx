/**
 * ProjectShowcase — CircularGallery + detail modal (scalable via project-catalog).
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
  { ssr: false, loading: () => <div className="h-[420px] animate-pulse rounded-2xl bg-[var(--surface)]" /> },
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
    <>
      <p className="mb-3 font-label text-[var(--muted)]">
        Auto-rotating gallery — hover to pause, click a card for details
      </p>
      <div className="h-[min(52vh,520px)] min-h-[320px] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#f2f0eb"
          borderRadius={0.06}
          scrollEase={0.04}
          autoPlay
          autoPlaySpeed={0.022}
          onSelect={openProject}
        />
      </div>

      <ProjectDetailModal
        project={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
