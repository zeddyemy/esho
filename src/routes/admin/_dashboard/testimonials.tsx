import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/testimonials')({
  head: () => adminHead('Testimonials'),
  component: () => <ComingSoon title="Testimonials" description="Quotes from clients and colleagues." />,
})
