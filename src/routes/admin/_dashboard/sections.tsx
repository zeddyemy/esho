import { createFileRoute } from '@tanstack/react-router'

import Sections from '@/components/pages/admin/sections'
import { adminSectionsQuery } from '@/hooks/api/admin/sections'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/sections')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.ensureQueryData(adminSectionsQuery()), queryClient.ensureQueryData(adminSettingsQuery())]),
  head: () => adminHead('Sections'),
  component: Sections,
})
