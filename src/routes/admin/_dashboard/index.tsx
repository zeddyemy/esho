import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/')({
  head: () => adminHead('Dashboard'),
  component: () => <ComingSoon title="Dashboard" description="Counts, recent enquiries and quick switches will live here." />,
})
