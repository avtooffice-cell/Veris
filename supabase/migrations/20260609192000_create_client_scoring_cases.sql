create extension if not exists pgcrypto;

create table if not exists public.client_scoring_cases (
  id uuid primary key default gen_random_uuid(),
  local_card_id text,
  client_name text,
  contact text,
  source text not null default 'Автозбережено',
  input_data jsonb not null default '{}'::jsonb,
  scoring_result jsonb not null default '{}'::jsonb,
  total_score integer not null,
  approved boolean not null,
  risk_level text not null,
  total_dti numeric,
  monthly_payment numeric,
  recommendation text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_scoring_cases_created_at_idx
  on public.client_scoring_cases (created_at desc);

create index if not exists client_scoring_cases_status_idx
  on public.client_scoring_cases (status);

alter table public.client_scoring_cases enable row level security;

drop policy if exists "Allow public scoring submissions" on public.client_scoring_cases;
create policy "Allow public scoring submissions"
  on public.client_scoring_cases
  for insert
  to anon
  with check (true);

drop policy if exists "Allow authenticated users to read scoring cases" on public.client_scoring_cases;
create policy "Allow authenticated users to read scoring cases"
  on public.client_scoring_cases
  for select
  to authenticated
  using (true);

drop policy if exists "Allow authenticated users to update scoring cases" on public.client_scoring_cases;
create policy "Allow authenticated users to update scoring cases"
  on public.client_scoring_cases
  for update
  to authenticated
  using (true)
  with check (true);
