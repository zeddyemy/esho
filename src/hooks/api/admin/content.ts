import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { getAdminContent, updateContent } from '@/server/functions/admin/content'
import type { UpdateContentInput } from '@/lib/schemas/content'

export const adminContentQuery = () =>
  queryOptions({ queryKey: ['admin', 'content'], queryFn: () => getAdminContent() })

export function useUpdateContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateContentInput) => updateContent({ data }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'content'] }),
        queryClient.invalidateQueries({ queryKey: ['content'] }),
      ]),
  })
}
