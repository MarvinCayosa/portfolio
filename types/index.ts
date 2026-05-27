/**
 * Shared TypeScript types for portfolio data and component props.
 */

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
  ariaLabel: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
  icon: string;
  description: string;
}

export interface ProjectRecord {
  id?: string;
  title: string;
  description?: string | null;
  tags?: string[];
  url?: string | null;
  repoUrl?: string | null;
  avpVideoUrl?: string | null;
  featured?: boolean;
  image?: string | null;
  photos?: string[]; // image URLs
  collaborators?: string[] | null;
  order?: number;
}

export interface ExperienceRecord {
  id?: string;
  company: string;
  role: string;
  startDate: string | Date; // ISO date string or Date object
  endDate?: string | Date | null;
  current?: boolean;
  bullets?: string[];
  order?: number;
}

export interface EducationRecord {
  id?: string;
  degree: string;
  institution: string;
  year?: number;
  bullets?: string[];
  notes?: string | null;
  order?: number;
}

export interface AwardRecord {
  id?: string;
  title: string;
  issuer?: string;
  year?: number;
  /** Optional end year for ranges (e.g. 2022–2024) */
  yearEnd?: number | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AiRequestBody {
  prompt: string;
  context: string;
}

export interface GalleryImageRecord {
  id?: string;
  image: string;
  alt?: string | null;
  order?: number;
}

export interface PortfolioPageData {
  projects: ProjectRecord[];
  experiences: ExperienceRecord[];
  education: EducationRecord[];
  awards: AwardRecord[];
  skills?: SkillCategory[];
  certifications?: CertificationRecord[];
  gallery?: GalleryImageRecord[];
  hero?: HeroConfig | null;
  /** Public URL for resume PDF (Studio upload or static fallback). */
  resumeUrl?: string | null;
  sectionVisibility?: SectionVisibility;
}

export interface CertificationRecord {
  id?: string;
  title: string;
  issuer?: string;
  date?: string; // ISO date
  url?: string | null;
  notes?: string | null;
}

export type SectionVisibility = Record<string, boolean>;

/** Hero section config stored in Firestore siteConfig/hero */
export interface HeroConfig {
  firstName?: string;
  lastName?: string;
  bioRole?: string;
  bioHighlight?: string;
  bioBody?: string;
  bioClosing?: string;
  location?: string;
  availability?: string;
  rolePrefixes?: string[]; // e.g. ["Cloud", "Data", "Software"]
  stats?: Array<{ label: string; value: string }>;
}
