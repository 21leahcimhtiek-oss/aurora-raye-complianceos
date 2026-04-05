create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  action text not null,
  created_at timestamptz not null default now()
);