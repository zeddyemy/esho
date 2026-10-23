-- Owner-editable design choices (fonts, heading style, accent, motion).
-- Shape and defaults live in src/lib/appearance.ts; '{}' means "all defaults".
alter table public.site_settings
  add column if not exists appearance jsonb not null default '{}'::jsonb;
