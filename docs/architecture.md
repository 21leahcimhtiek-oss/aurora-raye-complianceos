# Aurora Rayes ComplianceOS — Architecture

> System design, data flow, and key engineering decisions.

---

## Overview

Aurora Rayes ComplianceOS is a multi-tenant SaaS compliance automation platform built on Next.js 14 (App Router), Supabase (PostgreSQL + Auth + Storage), and Stripe. It enables engineering teams to manage SOC 2, ISO 27001, HIPAA, GDPR, and other compliance frameworks in a single, AI-assisted workspace.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes (Edge + Node runtimes) |
| Database | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth (email/password, magic link, PKCE) |
| Storage | Supabase Storage (evidence files) |
| Billing | Stripe Subscriptions + Webhooks |
| AI | OpenAI GPT-4o (gap analysis, recommendations) |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`, sliding window) |
| Error Tracking | Sentry (client + server + edge) |
| Analytics | Vercel Analytics |
| Hosting | Vercel (Edge Network) |

---

## High-Level Architecture

```
Browser
  └── Next.js App (Vercel Edge)
        ├── /app (React Server Components + Client Components)
        │     ├── Landing, Auth, Dashboard, Frameworks, Controls, Evidence, Risk, Audit
        │     └── Stripe checkout redirect
        │
        ├── /app/api
        │     ├── /checkout         → Stripe checkout session creation
        │     ├── /webhooks/stripe  → Stripe event processing (subscription lifecycle)
        │     └── /ai/gap-analysis  → OpenAI gap analysis per framework
        │
        └── middleware.ts           → Auth guard + plan gating (Edge runtime)

Supabase (hosted PostgreSQL)
  ├── Auth (JWT, refresh tokens, email verification)
  ├── Database (organizations, profiles, frameworks, controls, evidence, risks, audits)
  ├── RLS Policies (every table — org-scoped isolation)
  └── Storage (evidence file uploads)

Stripe
  ├── Products: Starter ($99/mo), Professional ($299/mo), Enterprise (custom)
  ├── Webhooks → /api/webhooks/stripe
  └── Customer Portal (subscription management)

Upstash Redis
  └── Rate limiting (sliding window per IP/user)
```

---

## Data Model (Key Entities)

```
organizations (1)
  └── profiles (N)           — users with roles: admin, auditor, contributor, viewer
  └── frameworks (N)         — SOC2, ISO27001, HIPAA, GDPR, PCI_DSS, NIST
        └── controls (N)     — individual requirements per framework
              └── evidence (N) — documents, screenshots, policies linked to controls
  └── risks (N)              — risk register with likelihood × impact scoring
  └── audits (N)             — internal/external audit records
        └── audit_findings (N) — findings with severity and remediation tracking
  └── activity_logs (N)      — immutable audit trail of all actions
```

---

## Auth & Security

### Authentication Flow
1. User signs up → Supabase sends email verification
2. User verifies → JWT (1hr) + refresh token issued
3. `middleware.ts` validates session on every `/dashboard/**` and `/api/**` request
4. Server components use `createServerClient()` (cookie-based auth, no token exposure)

### Row-Level Security
Every table has RLS policies enforcing `organization_id = auth.jwt() ->> 'organization_id'`. No cross-tenant data leakage is possible at the DB layer.

### Rate Limiting
All API routes call `rateLimit(identifier, limit, window)` before processing. Uses Upstash Redis sliding window algorithm. Gracefully degrades to `success: true` if Redis is unavailable (fallback for local dev).

### Input Validation
All API request bodies validated with Zod schemas before processing. Invalid input returns `400` with field-level error messages.

---

## Billing Architecture

```
User clicks "Upgrade" → /api/checkout (POST)
  → Rate limit check (5 req / 10 min per IP)
  → Auth check (must be logged in)
  → Stripe Checkout Session created (14-day trial)
  → Redirect to Stripe hosted checkout
  → On success: Stripe sends webhook to /api/webhooks/stripe
  → Webhook updates organizations.plan + subscription_status
```

### Stripe Events Handled
- `checkout.session.completed` — activate subscription
- `customer.subscription.updated` — plan changes, trial conversions
- `customer.subscription.deleted` — cancellation, churn
- `invoice.payment_failed` — mark as `past_due`

---

## AI Gap Analysis

`POST /api/ai/gap-analysis`
1. Loads all controls for a framework from Supabase
2. Filters to `not_started` and `in_progress` controls
3. Sends structured prompt to GPT-4o with control list and org context
4. Returns prioritized recommendations with evidence suggestions
5. Rate limited: 10 requests / 1 hour per organization

---

## Compliance Score Engine

`lib/compliance-score.ts` — pure functions, zero side effects, fully unit-tested.

```
score = (implemented / applicable) × 100
applicable = total - not_applicable
```

Risk scoring: `risk_score = likelihood × impact` (1–5 scale each)
- Critical: score ≥ 20
- High: score ≥ 12
- Medium: score ≥ 6
- Low: score < 6

---

## Deployment

- **Staging**: Vercel Preview Deploy on every PR (automatic)
- **Production**: Vercel deploy on push to `main`
- **Database migrations**: `supabase/migrations/` — applied via `supabase db push`
- **Environment variables**: All in Vercel dashboard + GitHub Secrets for CI

---

## Key Decisions

| Decision | Rationale |
|---|---|
| Next.js App Router | RSC reduces client JS bundle; server actions simplify form handling |
| Supabase over Firebase | PostgreSQL + RLS gives true multi-tenant isolation at DB layer |
| Stripe Checkout (hosted) | PCI compliance delegated to Stripe; faster to ship |
| Upstash Redis (serverless) | No persistent connection; compatible with Vercel Edge runtime |
| OpenAI GPT-4o | Best-in-class structured output for compliance gap analysis |
| Sentry over Datadog | Lower cost at startup scale; Next.js SDK is best-in-class |

---

*Last updated: 2025 | Aurora Rayes LLC*