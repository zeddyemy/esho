import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Content from '@/components/pages/admin/content'
import { CONTENT_TABS } from '@/constants/admin-navigation'
import { adminContentQuery } from '@/hooks/api/admin/content'
import { adminHead } from '@/lib/admin-route'
import { oneOf } from '@/lib/search'

export const Route = createFileRoute('/admin/_dashboard/content')({
  validateSearch: (search: { tab?: string } & SearchSchemaInput) => ({ tab: oneOf(search.tab, CONTENT_TABS, 'home') }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminContentQuery()),
  head: () => adminHead('Page content'),
  component: ContentRoute,
})

function ContentRoute() {
  const { tab } = Route.useSearch()
  const navigate = Route.useNavigate()
  return <Content tab={tab} onTabChange={(next) => void navigate({ search: { tab: next }, replace: true })} />
}
