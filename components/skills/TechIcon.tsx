/**
 * TechIcon — monochrome logo or Lucide fallback per skill name.
 */

"use client";

import { useState } from "react";
import { Bot, Brain, Cog } from "lucide-react";
import { getTechSlug, usesCustomIcon } from "@/lib/tech-slugs";
import { cn } from "@/lib/utils";

const ICON_SLUG_COLOR = "8a8a8a";

interface TechIconProps {
  skill: string;
  dimmed?: boolean;
  className?: string;
}

export function TechIcon({ skill, dimmed = false, className }: TechIconProps) {
  const custom = usesCustomIcon(skill);
  const slug = getTechSlug(skill);
  const [imgFailed, setImgFailed] = useState(false);

  const boxClass = cn(
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border p-1",
    dimmed
      ? "border-[var(--border)]/40 bg-[var(--surface)]/30 opacity-50"
      : "border-[var(--border)] bg-[var(--surface-elevated)]",
    className,
  );

  const lucideClass = cn(
    "h-4 w-4",
    dimmed ? "text-[var(--muted)]/50" : "text-[var(--muted)]",
  );

  if (custom === "brain") {
    return (
      <span className={boxClass} title={skill}>
        <Brain className={lucideClass} aria-hidden />
      </span>
    );
  }

  if (custom === "bot") {
    return (
      <span className={boxClass} title={skill}>
        <Bot className={lucideClass} aria-hidden />
      </span>
    );
  }

  if (custom === "cog") {
    return (
      <span className={boxClass} title={skill}>
        <Cog className={lucideClass} aria-hidden />
      </span>
    );
  }

  if (!slug || imgFailed) {
    return (
      <span
        className={cn(
          boxClass,
          "font-label text-[0.5rem]",
          dimmed ? "text-[var(--muted)]/60" : "text-[var(--muted)]",
        )}
        title={skill}
      >
        {skill.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className={boxClass} title={skill}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/${ICON_SLUG_COLOR}`}
        alt=""
        width={22}
        height={22}
        className={cn(
          "h-full w-full object-contain dark:invert",
          dimmed && "opacity-40",
        )}
        loading="lazy"
        onError={() => setImgFailed(true)}
      />
    </span>
  );
}
