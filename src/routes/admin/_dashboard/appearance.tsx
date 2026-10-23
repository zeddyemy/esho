import { createFileRoute } from '@tanstack/react-router'

import AppearanceSettings from '@/components/pages/admin/appearance'
import { adminAppearanceQuery } from '@/hooks/api/admin/appearance'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/appearance')({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminAppearanceQuery()),
  head: () => adminHead('Appearance'),
  component: AppearanceSettings,
})
