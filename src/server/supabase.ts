/**
 * Supabase clients. Server-only.
 *
 * - `getPublicClient`: cookie-less, publishable key. Public content reads;
 *   RLS limits it to published/visible rows.
 * - `getSessionClient`: publishable key + the visitor's auth cookies. Used for
 *   admin reads/writes so RLS evaluates `private.is_admin()` for that user.
 * - `getServiceClient`: secret key, bypasses RLS. Only for trusted server
 *   tasks (e.g. inserting inquiries after validation).
 */
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'

import { requireServerEnv } from '@/server/env'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export type Db = SupabaseClient<Database>

const url = () => requireServerEnv('VITE_SUPABASE_URL')
const publishableKey = () => requireServerEnv('VITE_SUPABASE_PUBLISHABLE_KEY')

let publicClient: Db | undefined

export function getPublicClient(): Db {
  publicClient ??= createClient<Database>(url(), publishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return publicClient
}

export function getSessionClient(): Db {
  return createServerClient<Database>(url(), publishableKey(), {
    cookies: {
      getAll: () => Object.entries(getCookies()).map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies) setCookie(name, value, options)
      },
    },
  })
}

let serviceClient: Db | undefined

export function getServiceClient(): Db {
  serviceClient ??= createClient<Database>(url(), requireServerEnv('SUPABASE_SECRET_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return serviceClient
}
