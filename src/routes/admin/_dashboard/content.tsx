import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/content')({
  head: () => adminHead('Page content'),
  component: () => <ComingSoon title="Page content" description="Hero, intro, capabilities and other page copy." />,
})
