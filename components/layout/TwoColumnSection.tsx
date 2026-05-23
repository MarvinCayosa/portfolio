/**
 * TwoColumnSection — title + content split on large screens.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionContainer } from "@/components/layout/SectionContainer";

interface TwoColumnSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}

export function TwoColumnSection({
  id,
  title,
  children,
  className,
  reverse = false,
}: TwoColumnSectionProps) {
  return (
    <SectionContainer id={id} className={cn("border-t border-[var(--border)]", className)}>
      <div
        className={cn(
          "grid gap-6 md:grid-cols-12 md:gap-10",
          reverse && "md:[direction:rtl] md:*:[direction:ltr]",
        )}
      >
        <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
          <h2 className="font-display heading-section text-[var(--foreground)]">
            {title}
          </h2>
          <div className="chrome-line mt-5 hidden md:block" aria-hidden />
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </SectionContainer>
  );
}
