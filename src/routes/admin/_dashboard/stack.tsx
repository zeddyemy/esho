import { createFileRoute } from '@tanstack/react-router'

import StackPage from '@/components/pages/admin/stack'
import { adminStackQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/stack')({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminStackQuery()),
  head: () => adminHead('Stack'),
  component: StackPage,
})
