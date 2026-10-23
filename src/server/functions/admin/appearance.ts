import { createServerFn } from '@tanstack/react-start'

import { normalizeAppearance } from '@/lib/appearance'
import { appearanceSchema } from '@/lib/schemas/appearance'
import { adminMiddleware } from '@/server/middleware'
import type { Appearance } from '@/lib/appearance'

export const getAppearance = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }): Promise<Appearance> => {
    const { data, error } = await db.from('site_settings').select('appearance').eq('id', 1).single()
    if (error) throw new Error(error.message)
    return normalizeAppearance(data.appearance)
  })

export const updateAppearance = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(appearanceSchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('site_settings').update({ appearance: data }).eq('id', 1)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })
