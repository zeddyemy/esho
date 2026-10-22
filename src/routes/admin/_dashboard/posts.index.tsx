import { createFileRoute } from '@tanstack/react-router'

import Posts from '@/components/pages/admin/posts'
import { adminPostsQuery } from '@/hooks/api/admin/catalog'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/posts/')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.ensureQueryData(adminPostsQuery()), queryClient.ensureQueryData(adminSettingsQuery())]),
  head: () => adminHead('Writing'),
  component: Posts,
})
