import { createFileRoute } from '@tanstack/react-router'

import Seo from '@/components/pages/admin/seo'
import { adminContentQuery } from '@/hooks/api/admin/content'
import { adminSeoQuery } from '@/hooks/api/admin/seo'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/seo')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(adminSeoQuery()),
      queryClient.ensureQueryData(adminSettingsQuery()),
      queryClient.ensureQueryData(adminContentQuery()),
    ]),
  head: () => adminHead('SEO'),
  component: Seo,
})
