/**
 * SectionContainer — section padding and max-width.
 */

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id: string;
  as?: "section" | "article";
}

export function SectionContainer({
  children,
  id,
  className,
  as: Tag = "section",
  ...props
}: SectionContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "scroll-mt-20 px-5 py-14 sm:px-8 md:py-16 lg:px-12",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </Tag>
  );
}
