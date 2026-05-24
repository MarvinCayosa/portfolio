/**
 * Project catalog — drop screenshots in /public/projects and add entries here.
 */

import type { ProjectEntry } from "@/types/project";
import type { ProjectRecord } from "@/types";

/** Template entries (merge with DB records in the showcase). */
export const PROJECT_CATALOG: ProjectEntry[] = [
  {
    id: "aurora-dashboard",
    title: "Aurora Dashboard",
    image: "/projects/aurora-dashboard.png",
    description:
      "Real-time analytics dashboard with sub-second refresh, designed for cloud metrics and operational visibility.",
    tags: ["GCP", "Next.js", "PostgreSQL", "D3"],
    website: "https://example.com",
    github: "https://github.com",
    collaborators: "Solo",
    featured: true,
  },
  {
    id: "verde-commerce",
    title: "Verde Commerce",
    image: "/projects/verde-commerce.png",
    description:
      "E-commerce prototype with inventory APIs, payment flow integration, and editorial product storytelling.",
    tags: ["React", "Node.js", "Stripe"],
    website: null,
    github: "https://github.com",
    collaborators: "Team of 3",
    featured: false,
  },
  {
    id: "haven-journal",
    title: "Haven Journal",
    image: "/projects/haven-journal.png",
    description:
      "Offline-first notes app with encrypted sync patterns and typography-focused reading mode.",
    tags: ["TypeScript", "PWA", "IndexedDB"],
    website: "https://example.com",
    github: null,
    collaborators: "Solo",
    featured: false,
  },
  {
    id: "signal-protocol-ui",
    title: "Signal Protocol UI",
    image: "/projects/signal-protocol.png",
    description:
      "Component library for secure messaging interfaces with accessibility-first interaction patterns.",
    tags: ["React", "Radix UI", "Storybook"],
    website: null,
    github: "https://github.com",
    collaborators: "Open-source contributors",
    featured: true,
  },
];

const PLACEHOLDER = (seed: string) =>
  `https://picsum.photos/seed/${seed}/1200/800`;

export function mergeProjectsWithCatalog(records: ProjectRecord[]): ProjectEntry[] {
  return records.map((record) => {
    const slug = record.title.toLowerCase().replace(/\s+/g, "-");
    const fromCatalog = PROJECT_CATALOG.find(
      (p) => p.title === record.title || p.id === slug,
    );

    return {
      id: fromCatalog?.id ?? slug,
      title: record.title,
      image:
        record.photos?.[0] ??
        record.image ??
        fromCatalog?.image ??
        PLACEHOLDER(String(record.id)),
      photos: record.photos?.length
        ? record.photos
        : fromCatalog?.image
          ? [fromCatalog.image]
          : [],
      description: record.description ?? "",
      tags: record.tags ?? [],
      website: record.url ?? fromCatalog?.website ?? null,
      github: record.repoUrl ?? fromCatalog?.github ?? null,
      collaborators: Array.isArray(record.collaborators)
        ? record.collaborators.join(", ")
        : record.collaborators ?? fromCatalog?.collaborators ?? "Solo",
      featured: record.featured,
    };
  });
}
