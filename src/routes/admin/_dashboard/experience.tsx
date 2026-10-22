import { createFileRoute } from '@tanstack/react-router'

import ExperiencePage from '@/components/pages/admin/experience'
import { adminExperiencesQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/experience')({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminExperiencesQuery()),
  head: () => adminHead('Experience'),
  component: ExperiencePage,
})
