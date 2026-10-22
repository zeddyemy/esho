import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Inquiries from '@/components/pages/admin/inquiries'
import { adminInquiriesQuery } from '@/hooks/api/admin/inquiries'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'
import { oneOf } from '@/lib/search'
import { INQUIRY_STATUSES } from '@/types'

const TABS = ['all', ...INQUIRY_STATUSES] as const

export const Route = createFileRoute('/admin/_dashboard/inquiries')({
  validateSearch: (search: { status?: string } & SearchSchemaInput) => ({ status: oneOf(search.status, TABS, 'all') }),
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.ensureQueryData(adminInquiriesQuery()), queryClient.ensureQueryData(adminSettingsQuery())]),
  head: () => adminHead('Enquiries'),
  component: InquiriesRoute,
})

function InquiriesRoute() {
  const { status } = Route.useSearch()
  const navigate = Route.useNavigate()
  return <Inquiries tab={status} onTabChange={(next) => void navigate({ search: { status: next }, replace: true })} />
}
