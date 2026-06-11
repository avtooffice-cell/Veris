alter table public.client_scoring_cases
  add column if not exists google_sheet_synced boolean not null default false,
  add column if not exists google_sheet_synced_at timestamptz,
  add column if not exists google_sheet_error text;

create index if not exists client_scoring_cases_google_sheet_sync_idx
  on public.client_scoring_cases (google_sheet_synced, created_at)
  where google_sheet_synced = false;
