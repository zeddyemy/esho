import { createFileRoute } from '@tanstack/react-router'

import Settings from '@/components/pages/admin/settings'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/settings')({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminSettingsQuery()),
  head: () => adminHead('Settings'),
  component: SettingsRoute,
})

function SettingsRoute() {
  const { admin } = Route.useRouteContext()
  return <Settings email={admin.email} />
}
