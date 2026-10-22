# Esho

Personal portfolio of Emmanuel Olowu, with a small admin for editing copy, projects, writing and contact details.

## Stack

- TanStack Start (SSR + server functions), Router, Query, Form, Table, Pacer
- Tailwind CSS v4 + shadcn/ui, Motion
- Supabase (Postgres, Auth, RLS) and Cloudinary (media)
- Deployed on Vercel via Nitro

## Develop

```bash
pnpm install
cp .env.example .env   # fill in Supabase and Cloudinary keys
pnpm dev               # http://localhost:3000 (or pass --port)
```

Checks: `pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Database

- Schema and RLS: `supabase/migrations/`
- Seed content lives in `src/lib/seed/`; `pnpm seed:sql` regenerates `supabase/seed.sql`.

## Structure

`src/routes` (thin: loaders, head, guards) → `src/components/layout` → `src/components/pages/<page>` (sections) → `src/components/shared` → `src/components/ui`.
Server code lives in `src/server` (repository, server functions, auth middleware).
