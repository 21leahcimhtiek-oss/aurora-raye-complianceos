# Changelog

All notable changes to Aurora Rayes ComplianceOS are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Aurora Rayes ComplianceOS uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2024-01-15

### Added
- **Core compliance engine** — control management, evidence tracking, and status workflows for SOC 2, ISO 27001, HIPAA, GDPR, and PCI-DSS
- **AI Gap Analysis** — GPT-4-powered gap analysis that identifies missing controls and generates remediation suggestions
- **Dashboard** — real-time compliance score gauge, framework overview, recent findings, and upcoming audit timeline
- **Frameworks module** — add/remove compliance frameworks, view control completion percentages, drill into individual controls
- **Controls management** — mark controls as Compliant / Partial / Non-Compliant, attach evidence, add notes
- **Findings tracker** — create and manage findings with severity (Critical / High / Medium / Low), status (Open / In Progress / Resolved), and assignee
- **Audit scheduler** — schedule audits, track upcoming/active/completed audits
- **Reports** — generate PDF and CSV compliance reports; schedule recurring reports
- **Billing** — Stripe-powered subscriptions: Starter ($69/mo), Pro ($179/mo), Enterprise ($449/mo)
- **Team management** — invite team members via email, role-based access (Owner, Admin, Member)
- **Authentication** — Supabase Auth with email/password and magic link
- **Row-Level Security** — all data is tenant-isolated at the database level
- **Rate limiting** — sliding-window rate limiter on all API routes
- **Sentry integration** — error monitoring for client, server, and edge runtimes
- **CI/CD** — GitHub Actions pipeline with lint, typecheck, unit tests, and E2E tests
- **Vercel deployment** — zero-config deployment with environment variable management

### Security
- Stripe webhook signature verification
- Input validation with Zod on all API routes
- No PII captured in error logs
- All secrets stored as environment variables

---

## [Unreleased]

### Planned
- Custom framework builder
- AWS / GCP / Azure evidence connectors
- Jira integration for findings → tickets
- SOC 2 Type II audit pack export
- White-label reports (Enterprise)
- SAML/SSO (Enterprise)