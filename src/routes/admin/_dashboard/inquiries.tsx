import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/inquiries')({
  head: () => adminHead('Enquiries'),
  component: () => <ComingSoon title="Enquiries" description="Messages from the contact form, with status and replies." />,
})
