# Portfolio Website

A single-page portfolio built with Next.js (App Router), React 18+, Tailwind CSS v4, Prisma, and PostgreSQL. Designed with an Apple-like aesthetic: generous whitespace, warm neutrals, glass surfaces, and subtle Framer Motion animations.

## Stack

- **Frontend:** Next.js, React, Tailwind CSS v4, Framer Motion, Radix UI, Lucide React
- **Backend:** PostgreSQL via Prisma ORM
- **Animations:** React Bits–style components (copy-paste implementations in `/components/react-bits`)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

### 3. Database setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |

## Project structure

- `/app` — Routes, API handlers, root layout
- `/components` — UI, sections, layout, animations, react-bits
- `/hooks` — Scroll spy, parallax, reveal, hide-on-scroll
- `/lib` — Prisma client, constants, data fetching
- `/prisma` — Schema and seed
- `/styles` — Global CSS and typography
- `/types` — Shared TypeScript interfaces

## API routes

- `POST /api/contact` — Save contact form submissions
- `POST /api/ai` — AI assistant stub (requires `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`)

## Customization

Edit copy and navigation in `lib/constants.ts`. Update seeded content in `prisma/seed.ts`. Set `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_SITE_URL` in `.env`.

## React Bits

Official components can be added via jsrepo:

```bash
npx jsrepo add https://reactbits.dev/ts/tailwind/BlurText
```

This project includes tailored implementations in `/components/react-bits` matching the design system.

## License

Private — customize for your personal portfolio.
