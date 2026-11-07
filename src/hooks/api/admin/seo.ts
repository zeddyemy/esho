import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { getAdminSeo, updateSeo } from '@/server/functions/admin/seo'
import type { SeoSettingsInput } from '@/lib/schemas/seo'

export const adminSeoQuery = () => queryOptions({ queryKey: ['admin', 'seo'], queryFn: () => getAdminSeo() })

export function useUpdateSeo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SeoSettingsInput) => updateSeo({ data }),
    // Titles, descriptions and share images appear on every public page.
    onSuccess: () => queryClient.invalidateQueries(),
  })
}
