/**
 * PageWrapper — main scroll container with bottom padding for glass nav.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn("relative min-h-dvh pb-20 md:pb-24", className)}>
      {children}
    </main>
  );
}
