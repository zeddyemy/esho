import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/projects')({
  head: () => adminHead('Projects'),
  component: () => <ComingSoon title="Projects" description="Add, reorder and publish projects and their case studies." />,
})
