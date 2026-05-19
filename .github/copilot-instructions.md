# Copilot Instructions

## Build, test, and lint commands

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm install` from `.github\workflows\ci.yml`
- `npm run lint --if-present || echo "Lint issues detected; continuing CI"` from `.github\workflows\ci.yml`
- `npm run type-check --if-present || echo "Type-check issues detected; continuing CI"` from `.github\workflows\ci.yml`
- `npm run test --if-present -- --passWithNoTests --ci` from `.github\workflows\ci.yml`

## High-level architecture

- The web surface is driven from the framework app entrypoints (`app/` or `pages/`) rather than a single static HTML file.
- Server behavior is colocated with the app code; check API route folders before changing integration flows.
- Supabase assets live in-repo, so schema or auth changes should be coordinated with the `supabase/` directory.
- Deployment is Vercel-oriented; keep repo instructions aligned with the files and commands used for Vercel builds.

## Key conventions

- Thank you for your interest in contributing! This project is maintained by **Aurora Rayes LLC** and follows the [Aurora Production Standards](https://github.com/AURORA-RAYE/.github/blob/main/PRODUCTION_STANDARDS.md).
- Copy the environment file: `cp .env.example .env.local`
- All PRs are reviewed against the [Aurora Production Standards](https://github.com/AURORA-RAYE/.github/blob/main/PRODUCTION_STANDARDS.md). Please read it before contributing.
- Use `.env.example` as the source of truth for configurable services; notable variables include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, ....

<!-- Generated from repo-local docs/config on 2026-05-18 for 21leahcimhtiek-oss/complianceos. -->
