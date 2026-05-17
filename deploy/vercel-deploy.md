# Deploying Aurora Rayes ComplianceOS to Vercel

This guide walks you through deploying Aurora Rayes ComplianceOS to Vercel from scratch.

---

## Prerequisites

- Vercel account (free tier works for staging)
- Supabase project (create at [supabase.com](https://supabase.com))
- Stripe account with products configured
- OpenAI API key
- Sentry DSN (optional but recommended)

---

## Step 1: Fork / clone the repository

```bash
git clone https://github.com/21leahcimhtiek-oss/complianceos.git
cd complianceos
```

---

## Step 2: Set up Supabase

1. Create a new Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Run the initial migration:
   ```bash
   npx supabase db push
   ```
   Or copy `supabase/migrations/001_initial.sql` into the Supabase SQL Editor and run it.
3. Note your:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Service role key** (`SUPABASE_SERVICE_ROLE_KEY`)

---

## Step 3: Set up Stripe

1. Create products in the Stripe dashboard matching `stripe.json`
2. Note your:
   - **Publishable key** (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - **Secret key** (`STRIPE_SECRET_KEY`)
3. Set up a Webhook pointing to `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Note the **Webhook signing secret** (`STRIPE_WEBHOOK_SECRET`)

---

## Step 4: Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Option B: Vercel Dashboard

1. Import repository at [vercel.com/new](https://vercel.com/new)
2. Select the `complianceos` repo
3. Framework: **Next.js** (auto-detected)
4. Set all environment variables (see below)
5. Click **Deploy**

---

## Step 5: Environment variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `OPENAI_API_KEY` | OpenAI API key for gap analysis |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `SENTRY_DSN` | Sentry DSN (optional) |
| `NEXTAUTH_URL` | Your deployment URL (e.g. `https://aurorarayes.example/complianceos`) |

---

## Step 6: Verify deployment

1. Visit your Vercel URL
2. Sign up for an account
3. Add a framework
4. Run a gap analysis

---

## Custom domain

1. Vercel Dashboard → Domains → Add domain
2. Update your DNS records as instructed

---

## CI/CD

The `.github/workflows/ci.yml` pipeline runs on every push:
- Type checking
- Unit tests
- (Optional) E2E tests with `PLAYWRIGHT_BASE_URL` secret

Set repository secrets in **GitHub → Settings → Secrets**.