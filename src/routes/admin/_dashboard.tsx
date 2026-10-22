import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import AdminLayout from '@/components/layout/admin'
import { adminSessionQuery } from '@/hooks/api/admin/auth'
import { dashboardQuery } from '@/hooks/api/admin/dashboard'
import { settingsQuery } from '@/hooks/api/site'
import { adminHead, adminHeaders } from '@/lib/admin-route'

/**
 * Guarded admin shell. The guard improves UX (no flash of admin UI when signed
 * out); every admin server function independently re-checks the session.
 */
export const Route = createFileRoute('/admin/_dashboard')({
  beforeLoad: async ({ context, location }) => {
    const session = await context.queryClient.fetchQuery(adminSessionQuery())
    if (!session) {
      throw redirect({ to: '/admin/login', search: { redirect: location.href } })
    }
    return { admin: session }
  },
  head: () => adminHead('Admin'),
  headers: adminHeaders,
  component: DashboardShell,
})

function DashboardShell() {
  const { admin } = Route.useRouteContext()
  const { data: settings } = useQuery(settingsQuery())
  // Badge counts load in the background; the shell never waits on them.
  const { data: dashboard } = useQuery(dashboardQuery())
  return (
    <AdminLayout brand={settings?.brandName ?? 'Esho'} email={admin.email} badges={{ newInquiries: dashboard?.counts.newInquiries ?? 0 }}>
      <Outlet />
    </AdminLayout>
  )
}
