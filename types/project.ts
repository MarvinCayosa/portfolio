/**
 * Project showcase template — extend this when adding portfolio projects.
 */

export interface ProjectEntry {
  id: string;
  title: string;
  /** Path under /public, e.g. /projects/my-app.png */
  image: string;
  /** Additional photos for the carousel in the detail modal */
  photos?: string[];
  description: string;
  tags: string[];
  website?: string | null;
  github?: string | null;
  avpVideoUrl?: string | null;
  collaborators?: string | null;
  featured?: boolean;
}
