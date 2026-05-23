/**
 * ProjectDetailModal — animated project details on gallery click.
 */

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, ExternalLink, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { ProjectEntry } from "@/types/project";

interface ProjectDetailModalProps {
  project: ProjectEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && project && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="no-scrollbar fixed left-1/2 top-1/2 z-[61] max-h-[90vh] w-[min(100%,42rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-0 shadow-2xl focus:outline-none"
                aria-describedby="project-detail-desc"
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-2xl bg-[var(--surface)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <Dialog.Close
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]/90 text-[var(--foreground)] backdrop-blur-sm hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>

                <div className="p-5 sm:p-6">
                  <Dialog.Title className="font-display text-2xl text-[var(--foreground)]">
                    {project.title}
                  </Dialog.Title>
                  <Dialog.Description
                    id="project-detail-desc"
                    className="mt-3 font-body text-sm leading-relaxed text-[var(--muted)] sm:text-base"
                  >
                    {project.description}
                  </Dialog.Description>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} label={tag} />
                    ))}
                  </div>

                  {project.collaborators && (
                    <p className="mt-4 flex items-center gap-2 font-body text-sm text-[var(--muted)]">
                      <Users className="h-4 w-4 shrink-0" aria-hidden />
                      {project.collaborators}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-4">
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline flex items-center gap-1.5 text-sm text-[var(--foreground)]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline flex items-center gap-1.5 text-sm text-[var(--muted)]"
                      >
                        <Code2 className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
