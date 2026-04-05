# Contributing to ComplianceOS

Thank you for your interest in contributing! This project is maintained by **Aurora Rayes LLC** and follows the [Aurora Production Standards](https://github.com/AURORA-RAYE/.github/blob/main/PRODUCTION_STANDARDS.md).

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-handle>/beginings`
3. Copy the environment file: `cp .env.example .env.local`
4. Install dependencies: `npm install`
5. Start the dev server: `npm run dev`

## Development Workflow

- **Branch naming**: `feat/`, `fix/`, `chore/`, `docs/` prefixes
- **Commit style**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat(scope): description`
- **Tests**: Run `npm test` before pushing. All tests must pass.
- **Type check**: Run `npm run type-check` — zero errors required.
- **Lint**: Run `npm run lint` — zero warnings in new code.

## Pull Request Requirements

Before opening a PR, verify:

- [ ] Zero `TODO`, `FIXME`, or stub implementations in your changes
- [ ] All new utilities have unit tests (`__tests__/`)
- [ ] All new API routes have error handling via `AppError` + `errorResponse`
- [ ] All new API routes have rate limiting via `rateLimit()`
- [ ] Input validated with Zod schemas
- [ ] TypeScript strict mode — no `any` without justification comment

## Standards Reference

All PRs are reviewed against the [Aurora Production Standards](https://github.com/AURORA-RAYE/.github/blob/main/PRODUCTION_STANDARDS.md). Please read it before contributing.

## Code of Conduct

Be respectful. Aurora operates a zero-tolerance policy for harassment.

---

*Aurora Rayes LLC — [auroramarket.org](https://auroramarket.org)*