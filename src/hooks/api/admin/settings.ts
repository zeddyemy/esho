import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { getAdminSettings, updateSettings } from '@/server/functions/admin/settings'
import type { SettingsInput } from '@/lib/schemas/settings'

export const adminSettingsQuery = () =>
  queryOptions({ queryKey: ['admin', 'settings'], queryFn: () => getAdminSettings() })

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SettingsInput) => updateSettings({ data }),
    // Settings touch every public page (brand, footer, visibility switches).
    onSuccess: () => queryClient.invalidateQueries(),
  })
}
