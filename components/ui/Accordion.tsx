/**
 * Accordion — minimal chrome accordion.
 */

"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AccordionItemData {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  className?: string;
}

export function Accordion({
  items,
  type = "single",
  className,
}: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      type={type}
      collapsible={type === "single" ? true : undefined}
      className={cn("space-y-2", className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="border border-[var(--border)] bg-[var(--surface)]"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left",
                "transition-colors hover:bg-[var(--surface-elevated)]",
                "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
              )}
            >
              {item.trigger}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="accordion-content overflow-hidden">
            <div className="accordion-content-inner border-t border-[var(--border)] px-4 py-3 text-sm">
              {item.content}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
