/**
 * Site-wide copy, navigation, and fallback data when the database is unavailable.
 */

import type {
  AwardRecord,
  CertificationRecord,
  EducationRecord,
  ExperienceRecord,
  GalleryImageRecord,
  NavItem,
  ProjectRecord,
  SkillCategory,
  SectionVisibility,
  SocialLink,
} from "@/types";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Marvin";
export const SITE_FULL_NAME = "Marvin Cayosa";
/** Public path — add `public/resume/marvin-cayosa-resume.pdf` (see public/resume/README.md). */
export const RESUME_PATH = "/resume/marvin-cayosa-resume.pdf";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://marvin.dev";

export const SECTION_IDS = {
  HOME: "home",
  SKILLS: "skills",
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  CERTIFICATIONS: "certifications",
  EDUCATION: "education",
  AWARDS: "awards",
  GALLERY: "gallery",
  CONTACT: "contact",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { id: SECTION_IDS.HOME, label: "Home", icon: "home" },
  { id: SECTION_IDS.SKILLS, label: "Skills", icon: "layers" },
  { id: SECTION_IDS.EXPERIENCE, label: "Experience", icon: "briefcase" },
  { id: SECTION_IDS.PROJECTS, label: "Projects", icon: "folder" },
  { id: SECTION_IDS.CERTIFICATIONS, label: "Certifications", icon: "certificate" },
  { id: SECTION_IDS.EDUCATION, label: "Education", icon: "graduation-cap" },
  { id: SECTION_IDS.AWARDS, label: "Awards", icon: "award" },
  { id: SECTION_IDS.GALLERY, label: "Gallery", icon: "images" },
  { id: SECTION_IDS.CONTACT, label: "Contact", icon: "mail" },
];

export const HERO_COPY = {
  firstName: "Marvin",
  lastName: "Cayosa",
  bioLead: "A ",
  bioRole: "Computer Engineer",
  bioMid: " graduated as ",
  bioHighlight: "Magna Cum Laude",
  bioBody:
    " — building production-grade systems across cloud, data, software, and embedded domains. Interfaces, APIs, and infrastructure with precision and intent.",
  bioClosing: "Designing the future one project at a time.",
  location: "Remote · Worldwide",
  availability: "Available for contract & full-time",
  ctaViewWork: "View Work",
  ctaContact: "Get in Touch",
};

export const PRIMARY_EDUCATION = {
  institution: "University of the East — Manila",
  degree: "Bachelor of Science in Computer Engineering",
  period: "2022 – 2026",
  details: [
    "Focus on systems engineering, cloud infrastructure, and software architecture.",
    "Active in technical projects spanning IoT, data pipelines, and full-stack development.",
  ],
} as const;

export const HERO_ROLE_PREFIXES = [
  "Cloud",
  "Data",
  "Software",
  "Embedded Systems",
] as const;

export const HERO_STATS = [
  { label: "Graduation", value: "2026" },
  { label: "GPA", value: "1.38" },
  { label: "Focus", value: "Cloud" },
  { label: "Domains", value: "Cloud · Data Analytics" },
] as const;

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Facebook",
    href: "https://www.facebook.com/marbeyn.11",
    icon: "facebook",
    ariaLabel: "Visit Facebook profile",
  },
  {
    platform: "GitHub",
    href: "https://github.com/MarvinCayosa",
    icon: "github",
    ariaLabel: "Visit GitHub profile",
  },
  {
    platform: "LinkedIn",
    href: "https://www.linkedin.com/in/marvin-cayosa/",
    icon: "linkedin",
    ariaLabel: "Visit LinkedIn profile",
  },
  {
    platform: "Email",
    href: "mailto:cayosa.marvin.official@gmail.com",
    icon: "mail",
    ariaLabel: "Send email",
  },
];

export const SECTION_TITLES = {
  skills: "Expertise",
  experience: "Experience",
  projects: "Projects",
  certifications: "Certifications and Licenses",
  education: "Education",
  awards: "Recognition",
  gallery: "Gallery",
  contact: "Get in Touch",
} as const;

export const GALLERY_INTRO =
  "These are some of the pictures of my professional and academic life.";

export const FALLBACK_GALLERY: GalleryImageRecord[] = [];

export const FALLBACK_CERTIFICATIONS: CertificationRecord[] = [
  {
    id: "cert-1",
    title: "Example Certification",
    issuer: "Acme Institute",
    date: "2024-01-01",
    url: null,
    notes: "Sample certification used as fallback.",
  },
];

/** Default section visibility saved under siteConfig/visibility */
export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  [SECTION_IDS.HOME]: true,
  [SECTION_IDS.SKILLS]: true,
  [SECTION_IDS.EXPERIENCE]: true,
  [SECTION_IDS.PROJECTS]: true,
  [SECTION_IDS.CERTIFICATIONS]: true,
  [SECTION_IDS.EDUCATION]: true,
  [SECTION_IDS.AWARDS]: true,
  [SECTION_IDS.GALLERY]: true,
  [SECTION_IDS.CONTACT]: true,
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "cloud",
    name: "Cloud Infrastructure & DevOps",
    icon: "cloud",
    description: "Platforms, pipelines, and infrastructure automation.",
    skills: ["Google Cloud Platform", "Azure", "Git"],
  },
  {
    id: "fullstack",
    name: "Full-Stack Frameworks",
    icon: "layers",
    description: "Modern web and API frameworks across the stack.",
    skills: ["React", "Next.js", "Node.js", "FastAPI", "TypeScript"],
  },
  {
    id: "databases",
    name: "Databases",
    icon: "database",
    description: "Relational, document, and managed data stores.",
    skills: ["MySQL", "PostgreSQL", "NoSQL (Firestore)"],
  },
  {
    id: "languages",
    name: "Programming Languages",
    icon: "code",
    description: "Core languages across systems and application layers.",
    skills: ["Python", "C++"],
  },
  {
    id: "specializations",
    name: "Specializations",
    icon: "sparkles",
    description: "Domains where depth meets delivery.",
    skills: [
      "Machine Learning",
      "Artificial Intelligence",
      "IoT",
      "ELT Pipelines",
      "Data Analytics",
    ],
  },
];

export const CONTACT_COPY = {
  title: "Work together",
  subtitle:
    "Collaborate, request freelance work, or connect — choose a path below.",
  directEmail: "cayosa.marvin.official@gmail.com",
  paths: [
    {
      id: "collaborate",
      title: "Collaborate",
      description: "Co-build products, research, or long-term technical partnerships.",
      cta: "Start a collaboration",
      mailSubject: "Collaboration inquiry",
    },
    {
      id: "services",
      title: "Request my services",
      description: "Freelance engineering for cloud, data, software, or embedded work.",
      cta: "Request services",
      mailSubject: "Freelance services request",
    },
    {
      id: "connect",
      title: "Connect",
      description: "Networking, mentorship, speaking, or a friendly introduction.",
      cta: "Say hello",
      mailSubject: "Let's connect",
    },
  ],
  formName: "Name",
  formEmail: "Email",
  formMessage: "Message",
  submit: "Send Message",
  success: "Thank you — your message has been received.",
  error: "Something went wrong. Please try again.",
};

export const FOOTER_COPY = {
  tagline: "Designing the future one project at a time.",
  copyright: `© ${new Date().getFullYear()} ${SITE_FULL_NAME}. All rights reserved.`,
};

export const LOADING_COPY = {
  initials: "MC",
  role: "Computer Engineer",
};

export const AI_SYSTEM_PROMPT = `You are an assistant for ${SITE_NAME}'s portfolio website.
You help visitors learn about ${SITE_NAME}'s work, skills, and experience.
Answer concisely and professionally. Context: `;

export const COMPANY_TOOLTIPS: Record<string, string> = {
  "Lumina Labs": "AI-native product studio building tools for creative teams.",
  "Meridian Health": "Digital health platform focused on patient-centered care.",
  "Atlas Studio": "Boutique agency specializing in brand and web experiences.",
};

export const FALLBACK_PROJECTS: ProjectRecord[] = [
  {
    id: "1",
    title: "Aurora Dashboard",
    description:
      "A real-time analytics dashboard with glassmorphic UI and sub-second data refresh for enterprise clients.",
    tags: ["Next.js", "PostgreSQL", "D3"],
    url: "https://example.com",
    repoUrl: "https://github.com",
    featured: true,
  },
  {
    id: "2",
    title: "Verde Commerce",
    description:
      "Sustainable e-commerce platform with carbon-offset checkout and editorial product storytelling.",
    tags: ["React", "Stripe", "Prisma"],
    url: null,
    repoUrl: "https://github.com",
    featured: false,
  },
  {
    id: "3",
    title: "Haven Journal",
    description:
      "Minimal writing app with offline-first sync, typography-focused reading mode, and end-to-end encryption.",
    tags: ["TypeScript", "IndexedDB", "PWA"],
    url: "https://example.com",
    repoUrl: null,
    featured: false,
  },
  {
    id: "4",
    title: "Signal Protocol UI",
    description:
      "Open-source component library for secure messaging interfaces with accessibility-first patterns.",
    tags: ["React", "Radix UI", "Storybook"],
    url: null,
    repoUrl: "https://github.com",
    featured: true,
  },
];

export const FALLBACK_EXPERIENCES: ExperienceRecord[] = [
  {
    id: "1",
    company: "Lumina Labs",
    role: "Senior Product Engineer",
    startDate: new Date("2022-03-01"),
    endDate: null,
    current: true,
    bullets: [
      "Led frontend architecture for a design-system-driven product suite serving 50k+ users.",
      "Reduced Time to Interactive by 40% through code splitting and edge caching strategies.",
      "Mentored three engineers on React performance patterns and accessibility audits.",
    ],
    order: 1,
  },
  {
    id: "2",
    company: "Meridian Health",
    role: "Full Stack Developer",
    startDate: new Date("2019-06-01"),
    endDate: new Date("2022-02-28"),
    current: false,
    bullets: [
      "Built patient portal features used by 200+ clinics across North America.",
      "Implemented HIPAA-compliant data flows with audit logging and role-based access.",
      "Collaborated with clinical staff to refine UX for high-stress workflows.",
    ],
    order: 2,
  },
  {
    id: "3",
    company: "Atlas Studio",
    role: "Frontend Developer",
    startDate: new Date("2017-01-01"),
    endDate: new Date("2019-05-31"),
    current: false,
    bullets: [
      "Delivered award-winning marketing sites for luxury and lifestyle brands.",
      "Introduced component libraries that cut build time by 30% across projects.",
      "Partnered with designers to translate Figma specs into pixel-perfect implementations.",
    ],
    order: 3,
  },
];

export const FALLBACK_EDUCATION: EducationRecord[] = [
  {
    id: "1",
    degree: PRIMARY_EDUCATION.degree,
    institution: PRIMARY_EDUCATION.institution,
    year: 2026,
    bullets: [PRIMARY_EDUCATION.period, ...PRIMARY_EDUCATION.details],
  },
];

export const FALLBACK_AWARDS: AwardRecord[] = [
  { id: "1", title: "Webby Award — Best Visual Design", issuer: "The Webby Awards", year: 2023 },
  { id: "2", title: "Awwwards Site of the Day", issuer: "Awwwards", year: 2022 },
  { id: "3", title: "Dean's List", issuer: "Stanford University", year: 2016 },
];

export const AWARDS_STAT_LABEL = "awards";
