# ComplianceOS

> Enterprise compliance automation platform for SOC 2, ISO 27001, HIPAA, and GDPR.

[![Build](https://github.com/AURORA-RAYE/beginings/actions/workflows/ci.yml/badge.svg)](https://github.com/AURORA-RAYE/beginings/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

ComplianceOS is a multi-tenant SaaS platform that automates compliance management for modern engineering teams. Replace expensive compliance consultants and clunky spreadsheets with AI-assisted evidence collection, automated control tracking, and real-time compliance dashboards.

**[Live Demo](https://complianceos.vercel.app)** | **[Marketplace](https://auroramarket.org/complianceos)** | **[Docs](https://docs.complianceos.app)**

## Features

### Core
- 🛡️ **Multi-Framework Support** — SOC 2, ISO 27001, HIPAA, GDPR out of the box
- 📋 **Control Library** — 200+ pre-built controls mapped to each framework
- 🗂️ **Evidence Collection** — Upload files, link documents, and track evidence per control
- ⚠️ **Risk Register** — Identify, score, and track organizational risks
- 📊 **Compliance Dashboard** — Real-time compliance score and progress tracking
- 🔍 **Audit Management** — Plan, execute, and track internal/external audits
- 📝 **Audit Trail** — Immutable activity log for every action
- 🤖 **AI Gap Analysis** — AI identifies missing controls and suggests evidence

### Access & Security
- 🔐 **Role-Based Access Control** — Admin, Auditor, Contributor, Viewer roles
- 🏢 **Multi-Tenant** — Full data isolation per organization via Row Level Security
- 🔑 **SSO Ready** — Supabase Auth with OAuth2 support
- 📧 **Email Invitations** — Invite team members with role assignments

### Billing
- 💳 **Stripe Billing** — Starter ($99/mo), Professional ($299/mo), Enterprise (custom)
- 🆓 **14-Day Free Trial** — No credit card required
- 📈 **Usage Analytics** — Track user seats and framework usage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes + Server Actions |
| Database | Supabase (PostgreSQL) + Row Level Security |
| Auth | Supabase Auth |
| Billing | Stripe Subscriptions |
| AI | OpenAI GPT-4 |
| Deployment | Vercel |

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account
- OpenAI API key

### Setup

```bash
git clone https://github.com/AURORA-RAYE/beginings.git
cd beginings
npm install
cp .env.example .env.local
npx supabase db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_STARTER_PRICE_ID` | Stripe Price ID for Starter plan |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Professional plan |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

## Pricing

| Feature | Starter | Professional | Enterprise |
|---------|---------|-------------|------------|
| Price | $99/mo | $299/mo | Custom |
| Frameworks | 1 | 3 | Unlimited |
| Users | 10 | 50 | Unlimited |
| AI Gap Analysis | ❌ | ✅ | ✅ |
| Audit Reports | Basic | Full | Custom |
| SSO | ❌ | ❌ | ✅ |

## Marketplace

🛒 **[ComplianceOS on Aurora Market](https://auroramarket.org/complianceos)**

## License

MIT — see [LICENSE](LICENSE)

---

Built by [Aurora Rayes LLC](https://auroramarket.org) | [auroramarket.org/complianceos](https://auroramarket.org/complianceos)
