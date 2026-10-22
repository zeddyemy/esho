import { createFileRoute, redirect } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import AuthLayout from '@/components/layout/auth'
import Login from '@/components/pages/admin/auth/login'
import { adminSessionQuery } from '@/hooks/api/admin/auth'
import { optionalString } from '@/lib/search'
import { adminHead, adminHeaders } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/login')({
  validateSearch: (search: { redirect?: string } & SearchSchemaInput) => ({ redirect: optionalString(search.redirect, 300) }),
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.fetchQuery({ ...adminSessionQuery(), staleTime: 0 })
    if (session) throw redirect({ to: '/admin' })
  },
  head: () => adminHead('Sign in'),
  headers: adminHeaders,
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect: to } = Route.useSearch()
  return (
    <AuthLayout>
      <Login redirect={to} />
    </AuthLayout>
  )
}
