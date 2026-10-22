import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/posts')({
  head: () => adminHead('Writing'),
  component: () => <ComingSoon title="Writing" description="Write and publish articles in markdown." />,
})
