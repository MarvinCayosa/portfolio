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
  id: number;
  title: string;
  description: string;
  tags: string[];
  url: string | null;
  repoUrl: string | null;
  featured: boolean;
  image?: string | null;
  collaborators?: string | null;
}

export interface ExperienceRecord {
  id: number;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  bullets: string[];
  order: number;
}

export interface EducationRecord {
  id: number;
  degree: string;
  institution: string;
  year: number;
  notes: string | null;
}

export interface AwardRecord {
  id: number;
  title: string;
  issuer: string;
  year: number;
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

export interface PortfolioPageData {
  projects: ProjectRecord[];
  experiences: ExperienceRecord[];
  education: EducationRecord[];
  awards: AwardRecord[];
}
