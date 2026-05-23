/**
 * Maps display names to simple-icons CDN slugs (cdn.simpleicons.org).
 */

export const TECH_SLUGS: Record<string, string> = {
  "Google Cloud Platform": "googlecloud",
  Azure: "microsoftazure",
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
  "Machine Learning": "tensorflow",
  "Artificial Intelligence": "openai",
  IoT: "arduino",
  "ELT Pipelines": "apacheairflow",
  "Data Analytics": "googleanalytics",
};

export function getTechSlug(skill: string): string | null {
  return TECH_SLUGS[skill] ?? null;
}
