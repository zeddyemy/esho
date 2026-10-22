import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/experience')({
  head: () => adminHead('Experience'),
  component: () => <ComingSoon title="Experience" description="Roles and education shown on the About page." />,
})
