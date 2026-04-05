-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Organizations (multi-tenant root)
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  plan text not null default 'trial' check (plan in ('trial', 'starter', 'professional', 'enterprise')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'trialing' check (subscription_status in ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  trial_ends_at timestamptz default now() + interval '14 days',
  max_users integer default 10,
  max_frameworks integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'viewer' check (role in ('admin', 'auditor', 'contributor', 'viewer')),
  is_active boolean default true,
  last_seen_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Compliance Frameworks
create table public.frameworks (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  framework_type text not null check (framework_type in ('SOC2', 'ISO27001', 'HIPAA', 'GDPR', 'PCI_DSS', 'NIST')),
  name text not null,
  version text,
  status text not null default 'in_progress' check (status in ('not_started', 'in_progress', 'under_review', 'certified')),
  target_date date,
  compliance_score integer default 0 check (compliance_score between 0 and 100),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(organization_id, framework_type)
);

-- Controls
create table public.controls (
  id uuid default uuid_generate_v4() primary key,
  framework_id uuid references public.frameworks(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  control_id text not null,
  title text not null,
  description text,
  category text,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'implemented', 'not_applicable')),
  owner_id uuid references public.profiles(id),
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Evidence
create table public.evidence (
  id uuid default uuid_generate_v4() primary key,
  control_id uuid references public.controls(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  evidence_type text not null check (evidence_type in ('document', 'screenshot', 'link', 'policy', 'procedure', 'test_result')),
  file_url text,
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved', 'rejected')),
  uploaded_by uuid references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  expires_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Risk Register
create table public.risks (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  category text,
  likelihood integer check (likelihood between 1 and 5),
  impact integer check (impact between 1 and 5),
  risk_score integer generated always as (likelihood * impact) stored,
  status text not null default 'open' check (status in ('open', 'mitigating', 'accepted', 'closed')),
  owner_id uuid references public.profiles(id),
  mitigation_plan text,
  due_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audits
create table public.audits (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  framework_id uuid references public.frameworks(id),
  title text not null,
  audit_type text not null check (audit_type in ('internal', 'external', 'gap_analysis')),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'archived')),
  start_date date,
  end_date date,
  auditor_id uuid references public.profiles(id),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audit Findings
create table public.audit_findings (
  id uuid default uuid_generate_v4() primary key,
  audit_id uuid references public.audits(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  control_id uuid references public.controls(id),
  title text not null,
  description text,
  severity text not null check (severity in ('critical', 'high', 'medium', 'low', 'informational')),
  status text not null default 'open' check (status in ('open', 'remediated', 'accepted', 'in_progress')),
  due_date date,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activity Log (audit trail)
create table public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id),
  action text not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.frameworks enable row level security;
alter table public.controls enable row level security;
alter table public.evidence enable row level security;
alter table public.risks enable row level security;
alter table public.audits enable row level security;
alter table public.audit_findings enable row level security;
alter table public.activity_log enable row level security;

-- RLS Policies
create policy "Users see own organization" on public.organizations
  for select using (
    id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Users see own org profiles" on public.profiles
  for select using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Org members see frameworks" on public.frameworks
  for all using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Org members see controls" on public.controls
  for all using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Org members see evidence" on public.evidence
  for all using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Org members see risks" on public.risks
  for all using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Org members see audits" on public.audits
  for all using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Org members see audit findings" on public.audit_findings
  for all using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

create policy "Org members see activity log" on public.activity_log
  for select using (
    organization_id in (select organization_id from public.profiles where id = auth.uid())
  );

-- Indexes
create index idx_profiles_org on public.profiles(organization_id);
create index idx_frameworks_org on public.frameworks(organization_id);
create index idx_controls_framework on public.controls(framework_id);
create index idx_evidence_control on public.evidence(control_id);
create index idx_risks_org on public.risks(organization_id);
create index idx_activity_log_org on public.activity_log(organization_id);
create index idx_activity_log_created on public.activity_log(created_at desc);
