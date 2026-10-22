/**
 * Admin authentication helpers. Server-only.
 *
 * A request is "admin" when Supabase verifies the session cookie (getUser hits
 * the Auth server, so a forged cookie fails) AND the user has a row in
 * public.admins. RLS enforces the same rule at the database level.
 */
import { getSessionClient } from '@/server/supabase'
import type { Db } from '@/server/supabase'

export interface AdminContext {
  db: Db
  user: { id: string; email: string }
}

/**
 * Pass `db` when the session was created earlier in this same request (e.g.
 * right after sign-in): the new auth cookie is only on the response, so a
 * fresh client reading request cookies would not see it yet.
 */
export async function getAdmin(db: Db = getSessionClient()): Promise<AdminContext | null> {
  const { data, error } = await db.auth.getUser()
  if (error) return null

  const { data: row } = await db.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle()
  if (!row) return null

  return { db, user: { id: data.user.id, email: data.user.email ?? '' } }
}
