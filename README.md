# Portfolio Website

A single-page portfolio built with Next.js (App Router), React 18+, Tailwind CSS v4, and Firebase (Firestore + Firebase Storage). Designed with an Apple-like aesthetic: generous whitespace, warm neutrals, glass surfaces, and subtle Framer Motion animations.

## Stack

- **Frontend:** Next.js, React, Tailwind CSS v4, Framer Motion, Radix UI, Lucide React
- **Backend data:** Firestore (awards, projects, photos metadata)
- **Asset storage:** Firebase Storage (project photos)
- **Animations:** React Bits style components in `/components/react-bits`

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

PowerShell:

```powershell
Copy-Item .env.example .env
```

Then set Firebase Admin credentials in `.env`:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (escaped with `\n` for line breaks)
- `FIREBASE_STORAGE_BUCKET`

Optional:

- `NEXT_PUBLIC_FIREBASE_STORAGE_BASE_URL`

### 3. Seed Firestore

```bash
npm run db:seed
```

This seeds only `projects` and `awards` (including project photo paths/URLs).

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
| `npm run db:seed` | Seed Firestore sample data |

## Firestore collections

- `projects`
- `awards`

`experience` and `education` currently use static fallback constants.

## Project structure

- `/app` — Routes, API handlers, root layout
- `/components` — UI, sections, layout, animations, react-bits
- `/hooks` — Scroll spy, parallax, reveal, hide-on-scroll
- `/lib` — Firebase client setup, constants, data fetching
- `/scripts` — Firestore seed script
- `/styles` — Global CSS and typography
- `/types` — Shared TypeScript interfaces

## API routes

- `POST /api/contact` — Validates and accepts contact form submissions
- `POST /api/ai` — AI assistant stub (requires `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`)

## Vercel deployment notes

Add the same Firebase env vars to your Vercel project settings. Do not commit service account secrets.

## License

Private - customize for your personal portfolio.
