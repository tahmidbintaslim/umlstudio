create table if not exists diagrams (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null,
  title      text not null default 'Untitled',
  source     text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists diagrams_user_idx on diagrams (user_id, updated_at desc);

-- Community gallery: owners publish (pending), an admin approves. Editing an approved diagram re-queues it.
alter table diagrams add column if not exists status text check (status in ('pending','approved'));
alter table diagrams add column if not exists published_at timestamptz;
create index if not exists diagrams_gallery_idx on diagrams (status, published_at desc);

-- One row per AI request: powers the per-user daily limit and the /admin stats.
create table if not exists ai_usage (
  id         bigserial primary key,
  user_id    text not null,
  mode       text not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_user_idx on ai_usage (user_id, created_at desc);

-- First-party, cookieless analytics (see src/app/api/track).
create table if not exists page_views (
  id         bigserial primary key,
  path       text not null,
  referrer   text,
  country    text,
  device     text,
  visitor    text not null,
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_idx on page_views (created_at desc);
