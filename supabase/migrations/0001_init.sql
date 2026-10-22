-- Esho portfolio: initial schema
--
-- Images are jsonb "ImageAsset" objects so Cloudinary uploads and external
-- URLs are handled the same way:
--   { "src": text, "width": int, "height": int, "alt": text,
--     "publicId": text|null, "color": text|null }
-- Files (résumé) are jsonb "FileAsset": { "url", "filename", "bytes", "publicId", "uploadedAt" }
--
-- Access model
--   * anon/authenticated visitors: read published / visible content only
--   * admin (row in public.admins): full read/write, checked by private.is_admin()
--   * inquiries: inserted only by the server with the secret key (bypasses RLS)

create schema if not exists private;

-- ---------------------------------------------------------------- helpers

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- admins

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create policy "admins can see own row" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------- site settings (singleton)

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  brand_name text not null,
  owner_name text not null,
  role_title text not null default '',
  tagline text not null default '',
  logo jsonb,
  portrait jsonb,
  availability text not null default '',
  open_to_work boolean not null default true,
  email text not null default '',
  phones text[] not null default '{}',
  whatsapp text not null default '',
  location text not null default '',
  socials jsonb not null default '{}'::jsonb,
  resume jsonb,
  footer_note text not null default '',
  show_writing boolean not null default true,
  show_testimonials boolean not null default true,
  show_resume boolean not null default true,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- editable page sections

create table public.page_content (
  page text not null,
  section text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (page, section)
);

-- ---------------------------------------------------------------- projects

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  role text not null default '',
  client text not null default '',
  year integer not null check (year between 1990 and 2100),
  tags text[] not null default '{}',
  stack text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  cover jsonb,
  gallery jsonb not null default '[]'::jsonb,
  body text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_published_needs_cover check (not published or cover is not null)
);

create index projects_published_sort_idx on public.projects (published, sort_order);

-- ---------------------------------------------------------------- writing

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  cover jsonb,
  body text not null default '',
  tags text[] not null default '{}',
  reading_minutes integer not null default 1,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_published_at_idx on public.posts (published, published_at desc);

-- ---------------------------------------------------------------- experience & stack

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'work' check (kind in ('work', 'education')),
  organisation text not null,
  title text not null,
  location text not null default '',
  url text not null default '',
  start_date date not null,
  end_date date,
  summary text not null default '',
  highlights text[] not null default '{}',
  stack text[] not null default '{}',
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.stack_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  items text[] not null default '{}',
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- testimonials

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null default '',
  company text not null default '',
  avatar jsonb,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- inquiries

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 80),
  email text not null check (char_length(email) <= 120),
  company text check (char_length(company) <= 120),
  project_type text check (char_length(project_type) <= 80),
  budget text check (char_length(budget) <= 80),
  timeline text check (char_length(timeline) <= 80),
  message text not null check (char_length(message) <= 4000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  client_hash text,
  created_at timestamptz not null default now()
);

create index inquiries_created_at_idx on public.inquiries (created_at desc);
create index inquiries_client_hash_created_idx on public.inquiries (client_hash, created_at desc);

-- ---------------------------------------------------------------- updated_at triggers

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function private.set_updated_at();
create trigger page_content_updated_at before update on public.page_content
  for each row execute function private.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function private.set_updated_at();
create trigger posts_updated_at before update on public.posts
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------- row level security

alter table public.site_settings enable row level security;
alter table public.page_content enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.experiences enable row level security;
alter table public.stack_groups enable row level security;
alter table public.testimonials enable row level security;
alter table public.inquiries enable row level security;

-- Public reads
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

create policy "public read page content" on public.page_content
  for select to anon, authenticated using (true);

create policy "read published projects" on public.projects
  for select to anon, authenticated
  using (published or (select private.is_admin()));

create policy "read published posts when enabled" on public.posts
  for select to anon, authenticated
  using (
    (published and published_at <= now()
      and coalesce((select s.show_writing from public.site_settings s where s.id = 1), false))
    or (select private.is_admin())
  );

create policy "read visible experiences" on public.experiences
  for select to anon, authenticated
  using (visible or (select private.is_admin()));

create policy "read visible stack groups" on public.stack_groups
  for select to anon, authenticated
  using (visible or (select private.is_admin()));

create policy "read visible testimonials when enabled" on public.testimonials
  for select to anon, authenticated
  using (
    (visible and coalesce((select s.show_testimonials from public.site_settings s where s.id = 1), false))
    or (select private.is_admin())
  );

create policy "admin read inquiries" on public.inquiries
  for select to authenticated using ((select private.is_admin()));

-- Admin writes (one policy per command keeps intent explicit)
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'page_content', 'projects', 'posts',
    'experiences', 'stack_groups', 'testimonials'
  ] loop
    execute format(
      'create policy "admin insert %1$s" on public.%1$I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format(
      'create policy "admin update %1$s" on public.%1$I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format(
      'create policy "admin delete %1$s" on public.%1$I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end;
$$;

create policy "admin update inquiries" on public.inquiries
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin delete inquiries" on public.inquiries
  for delete to authenticated using ((select private.is_admin()));
