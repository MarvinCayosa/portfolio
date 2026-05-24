/**
 * ProjectDetailModal — compact project detail sheet.
 *
 * Features:
 * - Auto/manual image carousel with dot indicators (when multiple photos)
 * - Colored tech tags (no two adjacent tags share the same color)
 * - Compact single-view layout — all details visible without scrolling
 * - Smooth Framer Motion entrance/exit
 */

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Code2, ExternalLink, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getPillColorForIndex } from "@/lib/skill-pill-colors";
import type { ProjectEntry } from "@/types/project";

interface ProjectDetailModalProps {
  project: ProjectEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
/** Auto-advance interval in ms */
const AUTO_MS = 3500;

// ─── Image Carousel ───────────────────────────────────────────────────────────

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = images.length;

  // Auto-advance when multiple images
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => setIdx((i) => (i + 1) % total), AUTO_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total]);

  const go = (dir: 1 | -1) => {
    // Reset timer on manual navigation
    if (timerRef.current) clearInterval(timerRef.current);
    setIdx((i) => (i + dir + total) % total);
    if (total > 1) {
      timerRef.current = setInterval(() => setIdx((i) => (i + 1) % total), AUTO_MS);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-t-2xl bg-[var(--surface)]" style={{ aspectRatio: "16/9" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={images[idx]}
          src={images[idx]}
          alt={`${title} screenshot ${idx + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </AnimatePresence>

      {/* Prev / Next buttons — only shown when multiple images */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setIdx(i); }}
                aria-label={`Go to image ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-200"
                style={{
                  width: i === idx ? 16 : 6,
                  background: i === idx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Close button */}
      <Dialog.Close
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </Dialog.Close>
    </div>
  );
}

// ─── Colored tag pill ─────────────────────────────────────────────────────────

function TagPill({ tag, index, prevColor }: {
  tag: string;
  index: number;
  prevColor: ReturnType<typeof getPillColorForIndex> | null;
}) {
  const color = getPillColorForIndex(tag, index, prevColor);
  return (
    <span
      className="font-label inline-flex items-center rounded-full px-3 py-1 text-xs"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
      }}
    >
      {tag}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && project && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
              />
            </Dialog.Overlay>

            {/* Modal panel — Content is not asChild so Radix can wire Title/Description a11y */}
            <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-[min(calc(100vw-32px),540px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-0 shadow-2xl focus:outline-none data-[state=open]:animate-none">
              <Dialog.Description className="sr-only">
                {project.description?.trim() || `Details for ${project.title}.`}
              </Dialog.Description>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {/* Image carousel — 16:9 */}
                {(() => {
                  const allImages = [
                    ...(project.photos?.length ? project.photos : []),
                    ...(project.image && !project.photos?.includes(project.image) ? [project.image] : []),
                  ].filter(Boolean);
                  const images = allImages.length ? allImages : [project.image];
                  return <ImageCarousel images={images} title={project.title} />;
                })()}

                {/* Content — more spacious layout */}
                <div className="p-5 sm:p-6">
                  {/* Title + links row */}
                  <div className="flex items-start justify-between gap-4">
                    <Dialog.Title className="font-display text-xl leading-tight text-[var(--foreground)] sm:text-2xl">
                      {project.title}
                    </Dialog.Title>
                    <div className="flex shrink-0 items-center gap-2">
                      {project.website && (
                        <a
                          href={project.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live site"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub repo"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                        >
                          <Code2 className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description (visible) */}
                  <p className="mt-3 font-body text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                    {project.description}
                  </p>

                  {/* Colored tech tags — no two adjacent share the same color */}
                  {project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => {
                        const prev = i > 0
                          ? getPillColorForIndex(project.tags[i - 1]!, i - 1, null)
                          : null;
                        return <TagPill key={tag} tag={tag} index={i} prevColor={prev} />;
                      })}
                    </div>
                  )}

                  {/* Collaborators */}
                  {project.collaborators && (
                    <p className="mt-4 flex items-center gap-2 font-body text-sm text-[var(--muted)]">
                      <Users className="h-4 w-4 shrink-0" aria-hidden />
                      {project.collaborators}
                    </p>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
