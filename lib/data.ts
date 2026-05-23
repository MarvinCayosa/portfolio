/**
 * Data access layer — fetches portfolio content from PostgreSQL with static fallbacks.
 */

import { prisma } from "@/lib/db";
import {
  FALLBACK_AWARDS,
  FALLBACK_EDUCATION,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROJECTS,
} from "@/lib/constants";
import type { PortfolioPageData } from "@/types";

/**
 * Loads all portfolio page data from the database, or falls back to seed constants.
 */
export async function getPortfolioData(): Promise<PortfolioPageData> {
  try {
    const [projects, experiences, education, awards] = await Promise.all([
      prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { year: "desc" } }),
      prisma.award.findMany({ orderBy: { year: "desc" } }),
    ]);

    if (
      projects.length === 0 &&
      experiences.length === 0 &&
      education.length === 0 &&
      awards.length === 0
    ) {
      return {
        projects: FALLBACK_PROJECTS,
        experiences: FALLBACK_EXPERIENCES,
        education: FALLBACK_EDUCATION,
        awards: FALLBACK_AWARDS,
      };
    }

    return { projects, experiences, education, awards };
  } catch {
    return {
      projects: FALLBACK_PROJECTS,
      experiences: FALLBACK_EXPERIENCES,
      education: FALLBACK_EDUCATION,
      awards: FALLBACK_AWARDS,
    };
  }
}
