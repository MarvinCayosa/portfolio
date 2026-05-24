/**
 * Firestore seeder — writes all portfolio collections for initial setup.
 * Run: npm run db:seed
 */

import dotenv from "dotenv";
dotenv.config({ override: true });

import { getFirebaseServices } from "../lib/db";
import {
  FALLBACK_AWARDS,
  FALLBACK_CERTIFICATIONS,
  FALLBACK_EDUCATION,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROJECTS,
} from "../lib/constants";
import { PROJECT_CATALOG } from "../lib/project-catalog";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function buildProjectPhotos(title: string, id: string | number): string[] {
  const slug = slugify(title);
  const fromCatalog = PROJECT_CATALOG.find(
    (p) => p.title === title || p.id === slug,
  );
  const storageBase = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BASE_URL?.trim();
  if (storageBase) {
    return [`${storageBase.replace(/\/$/, "")}/projects/${slug}.png`];
  }
  return [
    fromCatalog?.image ?? `/projects/${slug}.png`,
    `/projects/${String(id)}.png`,
  ].filter((p, i, arr) => Boolean(p) && arr.indexOf(p) === i);
}

async function clearCollection(name: string): Promise<void> {
  const { firestore } = getFirebaseServices();
  const snap = await firestore.collection(name).get();
  if (snap.empty) return;
  const batch = firestore.batch();
  for (const doc of snap.docs) batch.delete(doc.ref);
  await batch.commit();
  console.log(`  Cleared ${name}`);
}

async function seedProjects(): Promise<void> {
  const { firestore } = getFirebaseServices();
  const batch = firestore.batch();
  for (const [i, project] of FALLBACK_PROJECTS.entries()) {
    const id = project.id || i + 1;
    const photos =
      project.photos?.length
        ? project.photos
        : buildProjectPhotos(project.title, id);
    batch.set(firestore.collection("projects").doc(String(id)), {
      id,
      title: project.title,
      description: project.description ?? "",
      tags: project.tags ?? [],
      url: project.url ?? null,
      repoUrl: project.repoUrl ?? null,
      featured: project.featured ?? false,
      collaborators: project.collaborators ?? null,
      image: project.image ?? photos[0] ?? null,
      photos,
      createdAt: Date.now() - i,
    });
  }
  await batch.commit();
  console.log(`  Seeded ${FALLBACK_PROJECTS.length} projects`);
}

async function seedExperiences(): Promise<void> {
  const { firestore } = getFirebaseServices();
  const batch = firestore.batch();
  for (const [i, exp] of FALLBACK_EXPERIENCES.entries()) {
    const id = exp.id || i + 1;
    const startDate =
      exp.startDate instanceof Date
        ? exp.startDate.toISOString()
        : String(exp.startDate);
    const endDate =
      exp.endDate instanceof Date
        ? exp.endDate.toISOString()
        : exp.endDate ?? null;
    batch.set(firestore.collection("experiences").doc(String(id)), {
      id,
      company: exp.company,
      role: exp.role,
      startDate,
      endDate,
      current: exp.current ?? false,
      bullets: exp.bullets ?? [],
      order: exp.order ?? i + 1,
    });
  }
  await batch.commit();
  console.log(`  Seeded ${FALLBACK_EXPERIENCES.length} experiences`);
}

async function seedEducation(): Promise<void> {
  const { firestore } = getFirebaseServices();
  const batch = firestore.batch();
  for (const [i, edu] of FALLBACK_EDUCATION.entries()) {
    const id = edu.id || i + 1;
    batch.set(firestore.collection("education").doc(String(id)), {
      id,
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year ?? null,
      notes: edu.notes ?? null,
      order: i + 1,
    });
  }
  await batch.commit();
  console.log(`  Seeded ${FALLBACK_EDUCATION.length} education records`);
}

async function seedAwards(): Promise<void> {
  const { firestore } = getFirebaseServices();
  const batch = firestore.batch();
  for (const [i, award] of FALLBACK_AWARDS.entries()) {
    const id = award.id || i + 1;
    batch.set(firestore.collection("awards").doc(String(id)), {
      id,
      title: award.title,
      issuer: award.issuer ?? "",
      year: award.year ?? 0,
      createdAt: Date.now() - i,
    });
  }
  await batch.commit();
  console.log(`  Seeded ${FALLBACK_AWARDS.length} awards`);
}

async function seedCertifications(): Promise<void> {
  const { firestore } = getFirebaseServices();
  const batch = firestore.batch();
  for (const [i, cert] of FALLBACK_CERTIFICATIONS.entries()) {
    const id = cert.id || i + 1;
    batch.set(firestore.collection("certifications").doc(String(id)), {
      id,
      title: cert.title,
      issuer: cert.issuer ?? "",
      date: cert.date ?? null,
      url: cert.url ?? null,
      notes: cert.notes ?? null,
    });
  }
  await batch.commit();
  console.log(`  Seeded ${FALLBACK_CERTIFICATIONS.length} certifications`);
}

async function seedHero(): Promise<void> {
  const { firestore } = getFirebaseServices();
  await firestore.collection("siteConfig").doc("hero").set({
    firstName: "Marvin",
    lastName: "Cayosa",
    bioRole: "Computer Engineer",
    bioHighlight: "Magna Cum Laude",
    bioBody: " — building production-grade systems across cloud, data, software, and embedded domains. Interfaces, APIs, and infrastructure with precision and intent.",
    bioClosing: "Designing the future one project at a time.",
    location: "Remote · Worldwide",
    availability: "Available for contract & full-time",
    rolePrefixes: ["Cloud", "Data", "Software", "Embedded Systems"],
    stats: [
      { label: "Graduation", value: "2026" },
      { label: "GPA", value: "1.38" },
      { label: "Focus", value: "Cloud" },
      { label: "Domains", value: "Cloud · Data Analytics" },
    ],
  });
  console.log("  Seeded hero config");
}

async function seedVisibility(): Promise<void> {
  const { firestore } = getFirebaseServices();
  await firestore.collection("siteConfig").doc("visibility").set({
    home: true,
    skills: true,
    experience: true,
    projects: true,
    certifications: true,
    education: true,
    awards: true,
    contact: true,
  });
  console.log("  Seeded section visibility");
}

async function main() {
  console.log("Clearing collections…");
  await clearCollection("projects");
  await clearCollection("experiences");
  await clearCollection("education");
  await clearCollection("awards");
  await clearCollection("certifications");

  console.log("Seeding collections…");
  await seedProjects();
  await seedExperiences();
  await seedEducation();
  await seedAwards();
  await seedCertifications();
  await seedHero();
  await seedVisibility();

  console.log("\nFirestore seed completed successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
