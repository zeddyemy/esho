import { queryOptions } from '@tanstack/react-query'

import { getDashboard } from '@/server/functions/admin/dashboard'

export const dashboardQuery = () =>
  queryOptions({ queryKey: ['admin', 'dashboard'], queryFn: () => getDashboard(), staleTime: 30 * 1000 })
