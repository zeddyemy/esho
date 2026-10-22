import { createFileRoute } from '@tanstack/react-router'

import Dashboard from '@/components/pages/admin/dashboard'
import { dashboardQuery } from '@/hooks/api/admin/dashboard'
import { settingsQuery } from '@/hooks/api/site'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.ensureQueryData(dashboardQuery()), queryClient.ensureQueryData(settingsQuery())]),
  head: () => adminHead('Dashboard'),
  component: Dashboard,
})
