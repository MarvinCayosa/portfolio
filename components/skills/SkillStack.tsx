/**
 * SkillStack — horizontal tabs + masonry pills with per-skill highlight colors.
 */

"use client";

import { useMemo, useRef, useState } from "react";
import {
  Brain,
  Cloud,
  Code2,
  Database,
  Layers,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { TechIcon } from "@/components/skills/TechIcon";
import { getPillHighlightColor, getPillColorForIndex } from "@/lib/skill-pill-colors";
import type { PillColor } from "@/lib/skill-pill-colors";
import type { SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  cloud: Cloud,
  fullstack: Layers,
  databases: Database,
  languages: Code2,
  specializations: Sparkles,
};

const shortTabLabels: Record<string, string> = {
  cloud: "Cloud & DevOps",
  fullstack: "Full-Stack",
  databases: "Databases",
  languages: "Languages",
  specializations: "Specializations",
};

type SkillPillData = {
  skill: string;
  categoryId: string;
  key: string;
};

function SkillPillButton({
  pill,
  highlighted,
  dimmed,
  color,
}: {
  pill: SkillPillData;
  highlighted: boolean;
  dimmed: boolean;
  color: PillColor | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || dimmed) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "tech-glare-chip mb-3 inline-flex w-full break-inside-avoid items-center gap-2 rounded-full border px-3 py-2 transition-all duration-300",
        !color &&
          !dimmed &&
          "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[var(--foreground)]/25 hover:bg-[var(--surface-elevated)]",
        dimmed &&
          "border-[var(--border)]/30 bg-[var(--surface)]/20 text-[var(--muted)]/45 opacity-60",
      )}
      style={
        color && !dimmed
          ? { backgroundColor: color.bg, borderColor: color.border, color: color.text }
          : undefined
      }
    >
      <TechIcon skill={pill.skill} dimmed={dimmed} />
      <span className="font-body text-xs leading-tight sm:text-sm">{pill.skill}</span>
    </div>
  );
}

export function SkillStack({ categories }: { categories: SkillCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const pills = useMemo<SkillPillData[]>(() => {
    return categories.flatMap((cat) =>
      cat.skills.map((skill) => ({
        skill,
        categoryId: cat.id,
        key: `${cat.id}-${skill}`,
      })),
    );
  }, [categories]);

  const toggleCategory = (id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-8">
      <div className="-mx-5 sm:mx-0">
        <nav
          className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-5 pb-4 [-webkit-overflow-scrolling:touch] sm:flex-wrap sm:justify-start sm:overflow-visible sm:px-0"
          aria-label="Expertise categories"
        >
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 font-label text-[0.58rem] transition-colors",
            activeCategory === null
              ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]",
          )}
        >
          All
        </button>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.id] ?? Brain;
          const selected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 transition-colors",
                selected
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--foreground)]/20 hover:text-[var(--foreground)]",
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span className="font-label whitespace-nowrap text-[0.58rem]">
                {shortTabLabels[cat.id] ?? cat.name}
              </span>
            </button>
          );
        })}
        </nav>
      </div>

      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
        {pills.map((pill, globalIndex) => {
          const highlighted = activeCategory !== null && pill.categoryId === activeCategory;
          const dimmed      = activeCategory !== null && pill.categoryId !== activeCategory;

          // Only show colors when a category is selected (highlighted pills only)
          let color: PillColor | null = null;
          if (highlighted) {
            color = getPillHighlightColor(pill.skill);
          }

          return (
            <SkillPillButton
              key={pill.key}
              pill={pill}
              highlighted={highlighted}
              dimmed={dimmed}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
}
