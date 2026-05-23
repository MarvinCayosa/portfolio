/**
 * Maps display names to simple-icons CDN slugs or custom Lucide icon keys.
 */

export type CustomTechIcon = "brain" | "bot" | "cog";

export const TECH_SLUGS: Record<string, string> = {
  "Google Cloud Platform": "googlecloud",
  Azure: "microsoft",
  Git: "git",
  React: "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  FastAPI: "fastapi",
  TypeScript: "typescript",
  MySQL: "mysql",
  PostgreSQL: "postgresql",
  "NoSQL (Firestore)": "firebase",
  Python: "python",
  "C++": "cplusplus",
  IoT: "arduino",
  "Data Analytics": "googleanalytics",
};

/** Skills that use a Lucide icon instead of simple-icons CDN. */
export const CUSTOM_TECH_ICONS: Record<string, CustomTechIcon> = {
  "Machine Learning": "brain",
  "Artificial Intelligence": "bot",
  "ELT Pipelines": "cog",
};

export function getTechSlug(skill: string): string | null {
  if (CUSTOM_TECH_ICONS[skill]) return null;
  return TECH_SLUGS[skill] ?? null;
}

export function usesCustomIcon(skill: string): CustomTechIcon | null {
  return CUSTOM_TECH_ICONS[skill] ?? null;
}
