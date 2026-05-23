/**
 * PortfolioShell — cinematic page shell with loading, chrome header, bottom nav.
 */

"use client";

import { useEffect, useState } from "react";
import { useReducedEffects } from "@/hooks/useReducedEffects";
import { AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/layout/BottomNav";
import { ResumeFab } from "@/components/layout/ResumeFab";
import { GradualBlur } from "@/components/react-bits/GradualBlur";
import { TopChrome } from "@/components/layout/TopChrome";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingScreen } from "@/components/sections/LoadingScreen";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { TooltipProvider } from "@/components/ui/Tooltip";
import type { PortfolioPageData } from "@/types";

const MIN_LOADING_MS = 700;

interface PortfolioShellProps extends PortfolioPageData {}

export function PortfolioShell({
  projects,
  experiences,
  education: _education,
  awards,
}: PortfolioShellProps) {
  const [loading, setLoading] = useState(true);
  const reducedEffects = useReducedEffects();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!loading && (
        <TooltipProvider>
          <TopChrome />
          <PageWrapper>
            <Hero />
            <Skills />
            <Experience experiences={experiences} />
            <Projects projects={projects} />
            <Education />
            <Awards awards={awards} />
            <Contact />
          </PageWrapper>
          <GradualBlur
            target="page"
            position="bottom"
            height={reducedEffects ? "7rem" : "11rem"}
            strength={reducedEffects ? 2.5 : 3.25}
            lite
            curve="bezier"
            exponential
            opacity={1}
            zIndex={40}
          />
          <ResumeFab />
          <BottomNav />
        </TooltipProvider>
      )}
    </>
  );
}
