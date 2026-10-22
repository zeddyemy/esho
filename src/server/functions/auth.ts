import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
} from '@/lib/schemas/auth'
import { getAdmin } from '@/server/auth'
import { serverEnv } from '@/server/env'
import { adminMiddleware } from '@/server/middleware'
import { getSessionClient } from '@/server/supabase'

/** Current admin, or null. Used by the /admin route guard. */
export const getAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  const admin = await getAdmin()
  return admin ? { email: admin.user.email } : null
})

export const signIn = createServerFn({ method: 'POST' })
  .validator(signInSchema)
  .handler(async ({ data }) => {
    const db = getSessionClient()
    const { error } = await db.auth.signInWithPassword({ email: data.email, password: data.password })
    // Same message for unknown email and wrong password.
    if (error) throw new Error('That email and password do not match.')

    const admin = await getAdmin(db)
    if (!admin) {
      await db.auth.signOut()
      throw new Error('This account does not have admin access.')
    }
    return { ok: true as const }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  await getSessionClient().auth.signOut()
  return { ok: true as const }
})

export const requestPasswordReset = createServerFn({ method: 'POST' })
  .validator(forgotPasswordSchema)
  .handler(async ({ data }) => {
    const site = serverEnv('VITE_SITE_URL') ?? 'http://localhost:3000'
    await getSessionClient().auth.resetPasswordForEmail(data.email, {
      redirectTo: `${site}/admin/reset-password`,
    })
    // Always succeed so the form cannot be used to discover accounts.
    return { ok: true as const }
  })

/**
 * Exchanges the code from the reset email for a session (PKCE) and reports
 * whether that session belongs to an admin, using the same client.
 */
export const exchangeResetCode = createServerFn({ method: 'POST' })
  .validator(z.object({ code: z.string().min(1).max(512) }))
  .handler(async ({ data }) => {
    const db = getSessionClient()
    const { error } = await db.auth.exchangeCodeForSession(data.code)
    if (error) return { ok: false }
    return { ok: Boolean(await getAdmin(db)) }
  })

export const setNewPassword = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(resetPasswordSchema)
  .handler(async ({ data, context }) => {
    const { error } = await context.db.auth.updateUser({ password: data.password })
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const changePassword = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(changePasswordSchema)
  .handler(async ({ data, context }) => {
    // Re-verify the current password before allowing a change.
    const { error: verifyError } = await context.db.auth.signInWithPassword({
      email: context.user.email,
      password: data.current,
    })
    if (verifyError) throw new Error('Your current password is incorrect.')

    const { error } = await context.db.auth.updateUser({ password: data.password })
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })
