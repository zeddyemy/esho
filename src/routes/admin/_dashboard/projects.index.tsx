import { createFileRoute } from '@tanstack/react-router'

import Projects from '@/components/pages/admin/projects'
import { adminProjectsQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/projects/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminProjectsQuery()),
  head: () => adminHead('Projects'),
  component: Projects,
})
