/**
 * studio/types.ts — shared types used across all studio components.
 * Keeping types in one place makes it easy to add new collections later.
 */

/** All Firestore collections the studio can manage */
export type CollectionName =
  | "projects"
  | "experiences"
  | "education"
  | "certifications"
  | "awards"
  | "gallery"
  | "messages";

/** Metadata for each collection tab */
export interface CollectionMeta {
  id: CollectionName;
  label: string;
  /** Short description shown in the tab header */
  description: string;
  /** Whether this collection is read-only in the studio (e.g. messages) */
  readOnly?: boolean;
}

export const COLLECTIONS: CollectionMeta[] = [
  { id: "projects",       label: "Projects",       description: "Portfolio projects shown in the gallery" },
  { id: "experiences",    label: "Experience",      description: "Work history shown in the timeline" },
  { id: "education",      label: "Education",       description: "Academic background" },
  { id: "certifications", label: "Certifications",  description: "Licenses and certifications" },
  { id: "awards",         label: "Awards",          description: "Recognition and achievements" },
  { id: "gallery",        label: "Gallery",         description: "Dome gallery photos (professional & academic)" },
  { id: "messages",       label: "Messages",        description: "Contact form submissions", readOnly: true },
];
