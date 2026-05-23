/**
 * Database seeder — populates portfolio tables with realistic sample data.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contact.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.award.deleteMany();

  await prisma.project.createMany({
    data: [
      {
        title: "Aurora Dashboard",
        description:
          "A real-time analytics dashboard with glassmorphic UI and sub-second data refresh for enterprise clients.",
        tags: ["Next.js", "PostgreSQL", "D3"],
        url: "https://example.com",
        repoUrl: "https://github.com",
        featured: true,
      },
      {
        title: "Verde Commerce",
        description:
          "Sustainable e-commerce platform with carbon-offset checkout and editorial product storytelling.",
        tags: ["React", "Stripe", "Prisma"],
        url: null,
        repoUrl: "https://github.com",
        featured: false,
      },
      {
        title: "Haven Journal",
        description:
          "Minimal writing app with offline-first sync, typography-focused reading mode, and end-to-end encryption.",
        tags: ["TypeScript", "IndexedDB", "PWA"],
        url: "https://example.com",
        repoUrl: null,
        featured: false,
      },
      {
        title: "Signal Protocol UI",
        description:
          "Open-source component library for secure messaging interfaces with accessibility-first patterns.",
        tags: ["React", "Radix UI", "Storybook"],
        url: null,
        repoUrl: "https://github.com",
        featured: true,
      },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
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
    ],
  });

  await prisma.education.createMany({
    data: [
      {
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: 2016,
        notes: "Focus on human-computer interaction",
      },
      {
        degree: "B.S. Computer Science",
        institution: "UC Berkeley",
        year: 2014,
        notes: null,
      },
    ],
  });

  await prisma.award.createMany({
    data: [
      { title: "Webby Award — Best Visual Design", issuer: "The Webby Awards", year: 2023 },
      { title: "Awwwards Site of the Day", issuer: "Awwwards", year: 2022 },
      { title: "Dean's List", issuer: "Stanford University", year: 2016 },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
