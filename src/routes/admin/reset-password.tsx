import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import AuthLayout from '@/components/layout/auth'
import ResetPassword from '@/components/pages/admin/auth/reset-password'
import { optionalString } from '@/lib/search'
import { adminHead, adminHeaders } from '@/lib/admin-route'
import { exchangeResetCode, getAdminSession } from '@/server/functions/auth'

export const Route = createFileRoute('/admin/reset-password')({
  validateSearch: (search: { code?: string } & SearchSchemaInput) => ({ code: optionalString(search.code, 512) }),
  loaderDeps: ({ search }) => ({ code: search.code }),
  loader: async ({ deps }) => {
    // The email link carries a one-time code; exchanging it signs the admin in.
    if (deps.code) {
      const { ok } = await exchangeResetCode({ data: { code: deps.code } })
      return { linkValid: ok }
    }
    const session = await getAdminSession()
    return { linkValid: Boolean(session) }
  },
  head: () => adminHead('New password'),
  headers: adminHeaders,
  component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
  const { linkValid } = Route.useLoaderData()
  return (
    <AuthLayout>
      <ResetPassword linkValid={linkValid} />
    </AuthLayout>
  )
}
