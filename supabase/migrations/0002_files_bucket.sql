-- Public bucket for documents (the résumé PDF).
-- Cloudinary's free plan blocks PDF delivery, so files live in Supabase Storage.
-- Reads: public URL (bucket is public). Writes: only via signed upload URLs
-- issued by an admin-only server function (service key), so no insert policy
-- is granted to anon/authenticated.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('files', 'files', true, 10485760, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
