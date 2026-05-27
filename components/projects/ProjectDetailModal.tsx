/**
 * ProjectDetailModal — compact project detail sheet.
 */

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Code2, Globe, PlayCircle, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getPillColorForIndex } from "@/lib/skill-pill-colors";
import type { ProjectEntry } from "@/types/project";

interface ProjectDetailModalProps {
  project: ProjectEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTO_MS = 3500;

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = images.length;

  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx((i) => (i + 1) % total);
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  const go = (dir: 1 | -1) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDir(dir);
    setIdx((i) => (i + dir + total) % total);
    if (total > 1) {
      timerRef.current = setInterval(() => {
        setDir(1);
        setIdx((i) => (i + 1) % total);
      }, AUTO_MS);
    }
  };

  const slideVariants = {
    enter: (dir: 1 | -1) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  } as const;

  return (
    <div className="relative w-full overflow-hidden rounded-t-2xl bg-[var(--surface)]" style={{ aspectRatio: "16/9" }}>
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.img
          key={`${images[idx]}-${idx}`}
          src={images[idx]}
          alt={`${title} screenshot ${idx + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: EASE }}
        />
      </AnimatePresence>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-1 text-white transition-opacity hover:opacity-90"
            style={{ filter: "drop-shadow(3px 0 10px rgba(0,0,0,0.55))" }}
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-1 text-white transition-opacity hover:opacity-90"
            style={{ filter: "drop-shadow(-3px 0 10px rgba(0,0,0,0.55))" }}
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2} />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setIdx(i);
                }}
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

      <Dialog.Close
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </Dialog.Close>
    </div>
  );
}

function TagPill({
  tag,
  index,
  prevColor,
}: {
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

export function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && project && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                role="dialog"
                aria-modal="true"
                className="fixed left-1/2 top-1/2 z-[61] w-[min(calc(100vw-32px),540px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl focus:outline-none"
                initial={{ opacity: 0, scale: 0.97, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <Dialog.Title className="sr-only">{project.title}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  {project.description?.trim() || `Details for ${project.title}.`}
                </Dialog.Description>

                {(() => {
                  const allImages = [
                    ...(project.photos?.length ? project.photos : []),
                    ...(project.image && !project.photos?.includes(project.image) ? [project.image] : []),
                  ].filter(Boolean);
                  const images = allImages.length ? allImages : [project.image];
                  return <ImageCarousel images={images} title={project.title} />;
                })()}

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-xl leading-tight text-[var(--foreground)] sm:text-2xl">
                      {project.title}
                    </h2>
                    <div className="flex shrink-0 items-center gap-2">
                      {project.website && (
                        <a
                          href={project.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live site"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                        >
                          <Globe className="h-4 w-4" />
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
                      {project.avpVideoUrl && (
                        <a
                          href={project.avpVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="AVP video"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 font-body text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
                    {project.description}
                  </p>

                  {project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => {
                        const prev =
                          i > 0 ? getPillColorForIndex(project.tags[i - 1]!, i - 1, null) : null;
                        return <TagPill key={tag} tag={tag} index={i} prevColor={prev} />;
                      })}
                    </div>
                  )}

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
