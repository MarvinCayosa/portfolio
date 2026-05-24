/**
 * data.ts — Firestore data access layer.
 *
 * Each collection is fetched independently so a missing/empty collection
 * gracefully falls back to the static constants in lib/constants.ts.
 * All Firestore Timestamps are converted to plain numbers/strings before
 * being returned so they can be safely serialised by Next.js.
 */

import { getFirebaseServices } from "@/lib/db";
import {
  FALLBACK_AWARDS,
  FALLBACK_CERTIFICATIONS,
  FALLBACK_EDUCATION,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROJECTS,
  FALLBACK_GALLERY,
  DEFAULT_SECTION_VISIBILITY,
} from "@/lib/constants";
import type {
  AwardRecord,
  CertificationRecord,
  EducationRecord,
  ExperienceRecord,
  GalleryImageRecord,
  PortfolioPageData,
  ProjectRecord,
  SectionVisibility,
} from "@/types";

// ─── Firestore raw document shapes ───────────────────────────────────────────
// These mirror what is actually stored in Firestore (all fields optional
// because Firestore doesn't enforce a schema).

type FSTimestamp = { toMillis?: () => number };

type FSProject = {
  title?: string;
  description?: string;
  tags?: unknown[];
  url?: string | null;
  repoUrl?: string | null;
  featured?: boolean;
  collaborators?: string | null;
  image?: string | null;
  photos?: unknown[];
  createdAt?: FSTimestamp | Date | number | null;
  order?: number;
};

type FSExperience = {
  company?: string;
  role?: string;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean;
  bullets?: unknown[];
  order?: number;
};

type FSEducation = {
  degree?: string;
  institution?: string;
  year?: number;
  notes?: string | null;
  order?: number;
};

type FSAward = {
  title?: string;
  issuer?: string;
  year?: number;
  yearEnd?: number | null;
};

type FSCertification = {
  title?: string;
  issuer?: string;
  date?: string | null;
  url?: string | null;
  notes?: string | null;
};

type FSGallery = {
  image?: string;
  alt?: string | null;
  order?: number;
};

/** Generic Firestore document wrapper */
type FSDoc<T> = { id: string; data: () => T };

// ─── Helper utilities ─────────────────────────────────────────────────────────

/** Convert a Firestore Timestamp / Date / number to milliseconds */
function toMillis(value: FSProject["createdAt"]): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "object" && typeof (value as FSTimestamp).toMillis === "function") {
    return (value as FSTimestamp).toMillis!();
  }
  return 0;
}

/** Safely coerce an unknown value to a finite number, or return fallback */
function toNum(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Filter an unknown array down to strings only */
function toStrings(arr: unknown): string[] {
  return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
}

// ─── Per-collection mappers ───────────────────────────────────────────────────

function mapProjects(docs: FSDoc<FSProject>[]): ProjectRecord[] {
  return docs
    .map((doc, i) => {
      const p = doc.data();
      const photos = toStrings(p.photos);
      const image = (typeof p.image === "string" && p.image) || photos[0] || null;
      return {
        _ms: toMillis(p.createdAt), // used for sort only, stripped below
        id: doc.id || String(i + 1),
        title: p.title ?? "Untitled Project",
        description: p.description ?? "",
        tags: toStrings(p.tags),
        url: typeof p.url === "string" ? p.url : null,
        repoUrl: typeof p.repoUrl === "string" ? p.repoUrl : null,
        featured: Boolean(p.featured),
        image,
        photos,
        // Firestore stores collaborators as a comma-separated string
        collaborators:
          typeof p.collaborators === "string"
            ? p.collaborators.split(",").map((s) => s.trim()).filter(Boolean)
            : null,
        order: typeof p.order === "number" ? p.order : undefined,
      };
    })
    .sort((a, b) => b._ms - a._ms)
    .map(({ _ms: _drop, ...rest }) => rest); // remove sort key before returning
}

function mapExperiences(docs: FSDoc<FSExperience>[]): ExperienceRecord[] {
  return docs
    .map((doc, i) => {
      const e = doc.data();
      return {
        id: doc.id || String(i + 1),
        company: e.company ?? "Unknown Company",
        role: e.role ?? "Unknown Role",
        startDate: e.startDate ?? new Date().toISOString(),
        endDate: e.endDate ?? null,
        current: Boolean(e.current),
        bullets: toStrings(e.bullets),
        order: toNum(e.order, i),
      };
    })
    .sort((a, b) => toNum(a.order, 0) - toNum(b.order, 0));
}

function mapEducation(docs: FSDoc<FSEducation>[]): EducationRecord[] {
  return docs
    .map((doc, i) => {
      const e = doc.data();
      return {
        id: doc.id || String(i + 1),
        degree: e.degree ?? "Unknown Degree",
        institution: e.institution ?? "Unknown Institution",
        year: toNum(e.year, 0) || undefined,
        notes: typeof e.notes === "string" ? e.notes : null,
        order: toNum(e.order, i),
      };
    })
    .sort((a, b) => toNum(a.order, 0) - toNum(b.order, 0));
}

function mapAwards(docs: FSDoc<FSAward>[]): AwardRecord[] {
  return docs
    .map((doc, i) => {
      const d = doc.data();
      const year = toNum(d.year, 0) || undefined;
      const yearEnd =
        d.yearEnd != null ? toNum(d.yearEnd, 0) || undefined : undefined;
      return {
        id: doc.id || String(i + 1),
        title: d.title ?? "Untitled Award",
        issuer: d.issuer ?? "",
        year,
        yearEnd: yearEnd ?? null,
      };
    })
    .sort((a, b) => (b.yearEnd ?? b.year ?? 0) - (a.yearEnd ?? a.year ?? 0));
}

function mapGallery(docs: FSDoc<FSGallery>[]): GalleryImageRecord[] {
  return docs
    .map((doc, i) => {
      const g = doc.data();
      return {
        id: doc.id || String(i + 1),
        image: typeof g.image === "string" ? g.image : "",
        alt: typeof g.alt === "string" ? g.alt : null,
        order: toNum(g.order, i),
      };
    })
    .filter((g) => g.image)
    .sort((a, b) => toNum(a.order, 0) - toNum(b.order, 0));
}

function mapCertifications(docs: FSDoc<FSCertification>[]): CertificationRecord[] {
  return docs.map((doc, i) => {
    const c = doc.data();
    return {
      id: doc.id || String(i + 1),
      title: c.title ?? "Untitled Certification",
      issuer: c.issuer ?? "",
      date: typeof c.date === "string" ? c.date : undefined,
      url: typeof c.url === "string" ? c.url : undefined,
      notes: typeof c.notes === "string" ? c.notes : undefined,
    };
  });
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetches all portfolio data from Firestore in parallel.
 * Any collection that is empty or throws falls back to the static constants.
 * Also loads sectionVisibility from siteConfig/visibility.
 */
export async function getPortfolioData(): Promise<PortfolioPageData> {
  try {
    const { firestore } = getFirebaseServices();

    // Fetch all collections in parallel for speed
    const [projSnap, expSnap, eduSnap, awardSnap, certSnap, gallerySnap, visSnap, resumeSnap] =
      await Promise.all([
        firestore.collection("projects").get(),
        firestore.collection("experiences").get(),
        firestore.collection("education").get(),
        firestore.collection("awards").get(),
        firestore.collection("certifications").get(),
        firestore.collection("gallery").get(),
        firestore.collection("siteConfig").doc("visibility").get(),
        firestore.collection("siteConfig").doc("resume").get(),
      ]);

    // Map each snapshot — fall back to constants when empty
    const projects = projSnap.empty
      ? FALLBACK_PROJECTS
      : mapProjects(projSnap.docs as FSDoc<FSProject>[]);

    const experiences = expSnap.empty
      ? FALLBACK_EXPERIENCES
      : mapExperiences(expSnap.docs as FSDoc<FSExperience>[]);

    const education = eduSnap.empty
      ? FALLBACK_EDUCATION
      : mapEducation(eduSnap.docs as FSDoc<FSEducation>[]);

    const awards = awardSnap.empty
      ? FALLBACK_AWARDS
      : mapAwards(awardSnap.docs as FSDoc<FSAward>[]);

    const certifications = certSnap.empty
      ? FALLBACK_CERTIFICATIONS
      : mapCertifications(certSnap.docs as FSDoc<FSCertification>[]);

    const gallery = gallerySnap.empty
      ? FALLBACK_GALLERY
      : mapGallery(gallerySnap.docs as FSDoc<FSGallery>[]);

    // sectionVisibility — merge stored values with defaults so new sections
    // are always visible until explicitly hidden
    const storedVis = visSnap.exists
      ? (visSnap.data() as SectionVisibility)
      : {};
    const sectionVisibility: SectionVisibility = {
      ...DEFAULT_SECTION_VISIBILITY,
      ...storedVis,
    };

    const resumeData = resumeSnap.exists ? resumeSnap.data() : null;
    const resumeUrl =
      typeof resumeData?.url === "string" && resumeData.url.length > 0
        ? resumeData.url
        : null;

    return {
      projects,
      experiences,
      education,
      awards,
      certifications,
      gallery,
      resumeUrl,
      sectionVisibility,
    };
  } catch {
    // Firebase not configured or unreachable — serve static content
    return {
      projects: FALLBACK_PROJECTS,
      experiences: FALLBACK_EXPERIENCES,
      education: FALLBACK_EDUCATION,
      awards: FALLBACK_AWARDS,
      certifications: FALLBACK_CERTIFICATIONS,
      gallery: FALLBACK_GALLERY,
      sectionVisibility: DEFAULT_SECTION_VISIBILITY,
    };
  }
}
