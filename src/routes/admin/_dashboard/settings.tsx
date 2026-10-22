import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/settings')({
  head: () => adminHead('Settings'),
  component: () => <ComingSoon title="Settings" description="Brand, contact details, socials, résumé, visibility and password." />,
})
