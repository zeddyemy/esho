import { createServerFn } from '@tanstack/react-start'

import { seoSettingsSchema } from '@/lib/schemas/seo'
import { normalizeSeo } from '@/lib/seo-pages'
import { destroyRemovedImages } from '@/server/cloudinary'
import { adminMiddleware } from '@/server/middleware'
import type { SeoSettingsInput } from '@/lib/schemas/seo'

/** Raw stored values: a blank title or description means "automatic" on the public site. */
export const getAdminSeo = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }): Promise<SeoSettingsInput> => {
    const { data, error } = await db.from('site_settings').select('seo').eq('id', 1).single()
    if (error) throw new Error(error.message)
    return normalizeSeo(data.seo)
  })

/** Writes only `site_settings.seo`; every other setting is untouched. */
export const updateSeo = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(seoSettingsSchema)
  .handler(async ({ data, context: { db } }) => {
    const { data: before } = await db.from('site_settings').select('seo').eq('id', 1).single()
    const { error } = await db.from('site_settings').update({ seo: data }).eq('id', 1)
    if (error) throw new Error(error.message)
    await destroyRemovedImages(before?.seo, data)
    return { ok: true as const }
  })
