/**
 * SkillStack — side nav + scrollable all categories with fade masks & tech glare.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Cloud,
  Code2,
  Database,
  Layers,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { getTechSlug } from "@/lib/tech-slugs";
import type { SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  cloud: Cloud,
  fullstack: Layers,
  databases: Database,
  languages: Code2,
  specializations: Sparkles,
};

function TechLogo({ skill }: { skill: string }) {
  const slug = getTechSlug(skill);
  const [failed, setFailed] = useState(false);

  if (!slug || failed) {
    return (
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] font-label text-[0.5rem] text-[var(--muted)]"
        title={skill}
      >
        {skill.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/6b6b6b`}
        alt=""
        width={24}
        height={24}
        className="h-full w-full object-contain opacity-90 dark:invert"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function TechGlareChip({ skill }: { skill: string }) {
  const ref = useRef<HTMLLIElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <li
      ref={ref}
      onMouseMove={onMove}
      className="tech-glare-chip group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-[var(--border)]/80 bg-[var(--background)]/60 p-2 transition-transform hover:-translate-y-0.5 hover:border-[var(--foreground)]/20"
    >
      <TechLogo skill={skill} />
      <span className="relative z-[1] font-body text-xs leading-tight text-[var(--foreground)]">
        {skill}
      </span>
    </li>
  );
}

export function SkillStack({ categories }: { categories: SkillCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top?.target.id) setActiveId(top.target.id);
      },
      { root, rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    categories.forEach((cat) => {
      const el = sectionRefs.current[cat.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(180px,220px)_1fr] lg:gap-5">
      <nav
        className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        aria-label="Expertise categories"
      >
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.id] ?? Brain;
          const selected = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => scrollToCategory(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors lg:w-full",
                selected
                  ? "border-[var(--foreground)]/30 bg-[var(--surface-elevated)] text-[var(--foreground)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--foreground)]/15",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="font-body text-xs leading-tight sm:text-sm">
                {cat.name}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="relative min-h-[min(60vh,520px)] lg:min-h-[480px]">
        <div
          ref={scrollRef}
          className="no-scrollbar h-full max-h-[min(60vh,520px)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 lg:max-h-[520px]"
        >
          <div className="space-y-8">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.id] ?? Brain;
              return (
                <FadeIn key={cat.id} delay={i * 0.03}>
                  <section
                    id={cat.id}
                    ref={(el) => {
                      sectionRefs.current[cat.id] = el;
                    }}
                    className="scroll-mt-4"
                  >
                    <header className="mb-3 flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground)]">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-display text-lg text-[var(--foreground)]">
                          {cat.name}
                        </h3>
                        <p className="font-body text-xs text-[var(--muted)]">
                          {cat.description}
                        </p>
                      </div>
                    </header>
                    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                      {cat.skills.map((skill) => (
                        <TechGlareChip key={skill} skill={skill} />
                      ))}
                    </ul>
                  </section>
                </FadeIn>
              );
            })}
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 rounded-t-2xl bg-gradient-to-b from-[var(--surface)] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 rounded-b-2xl bg-gradient-to-t from-[var(--surface)] to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}
