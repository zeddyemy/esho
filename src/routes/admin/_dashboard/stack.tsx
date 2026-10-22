import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/stack')({
  head: () => adminHead('Stack'),
  component: () => <ComingSoon title="Stack" description="Tool groups shown on the About page." />,
})
