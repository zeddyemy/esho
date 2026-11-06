import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { getSectionVisibility, updateSectionVisibility } from '@/server/functions/admin/sections'
import type { SectionVisibilityInput } from '@/lib/schemas/sections'

export const adminSectionsQuery = () =>
  queryOptions({ queryKey: ['admin', 'sections'], queryFn: () => getSectionVisibility() })

export function useUpdateSections() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SectionVisibilityInput) => updateSectionVisibility({ data }),
    // Touches public pages and the Settings testimonials switch.
    onSuccess: () => queryClient.invalidateQueries(),
  })
}
