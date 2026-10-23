import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { getAppearance, updateAppearance } from '@/server/functions/admin/appearance'
import type { Appearance } from '@/lib/appearance'

export const adminAppearanceQuery = () =>
  queryOptions({ queryKey: ['admin', 'appearance'], queryFn: () => getAppearance() })

export function useUpdateAppearance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Appearance) => updateAppearance({ data }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'appearance'] }),
        queryClient.invalidateQueries({ queryKey: ['settings'] }),
      ]),
  })
}
