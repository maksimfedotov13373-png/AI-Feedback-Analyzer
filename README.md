# AI Feedback Analyzer

AI Feedback Analyzer is a B2B MVP that turns customer reviews into structured, evidence-backed business insights.

## MVP flow

1. Upload a CSV file with customer reviews.
2. Validate and normalize the input.
3. Analyze reviews through a replaceable AI provider.
4. Store a structured report.
5. Present themes, pain points, sentiment, and recommendations in a dashboard.

The current repository contains the project foundation. CSV ingestion, AI analysis, and the report dashboard will be added in separate stages.

CSV ingestion currently supports validation and preview. Persistence is enabled by setting a Neon PostgreSQL `DATABASE_URL` and applying the initial migration.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui conventions
- Prisma ORM
- PostgreSQL
- Zod

## Requirements

- Node.js 24+
- npm 11+
- A PostgreSQL connection string when database-backed features are enabled

## Local setup

Install dependencies:

```bash
npm install
```

Create the local environment file and set `DATABASE_URL` to a managed PostgreSQL database such as Neon or Supabase:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Generate the Prisma client:

```bash
npm run db:generate
```

The initial migration will be created when a development PostgreSQL database is connected during the CSV ingestion stage.

Start the application:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run db:migrate
npm run db:studio
```

The production build generates the Prisma client automatically before compiling Next.js, so generated database code is not committed to Git.

## Database strategy

The application targets PostgreSQL through Prisma, but the foundation does not require a local database or Docker. A managed PostgreSQL instance will be connected when the first persistence use case is implemented. This keeps local setup minimal and matches the future Vercel deployment model.

## Data model

- `Dataset`: an uploaded collection of reviews and its processing status.
- `Review`: a normalized customer review.
- `Analysis`: one AI analysis attempt, including provider, model, and prompt version.
- `Report`: the structured aggregate produced by an analysis.
- `Insight`: a theme, pain point, feature request, positive signal, or recommendation.

Flexible AI aggregates are stored as PostgreSQL JSON while core entities and lifecycle states remain relational.

## CSV format

The CSV must use UTF-8 encoding and include a `text` column. It may also include `rating`, `date`, and `source`.

- Maximum file size: 5 MB
- Maximum review count: 500
- Rating range: 0 to 5
- The original CSV is not stored

A test file is available at `public/sample-reviews.csv` and can be downloaded from the upload screen.

## Architecture

The MVP is a modular monolith. Next.js owns the UI and server entry points, application services coordinate use cases, Prisma persists data, and AI providers will implement a shared contract.

Authentication, payments, roles, external integrations, and microservices are intentionally outside the MVP foundation.
