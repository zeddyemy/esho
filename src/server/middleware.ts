import { createMiddleware } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

import { getAdmin } from '@/server/auth'

export const UNAUTHORIZED = 'UNAUTHORIZED'

/**
 * Guards admin server functions. Handlers receive `context.db` (a Supabase
 * client acting as the signed-in admin, so RLS still applies) and
 * `context.user`. The route guard is UX only; this is the security boundary.
 */
export const adminMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const admin = await getAdmin()
  if (!admin) throw new Error(UNAUTHORIZED)
  setResponseHeader('Cache-Control', 'private, no-store')
  return next({ context: admin })
})
