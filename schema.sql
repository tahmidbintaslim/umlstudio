create table if not exists diagrams (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null,
  title      text not null default 'Untitled',
  source     text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists diagrams_user_idx on diagrams (user_id, updated_at desc);
