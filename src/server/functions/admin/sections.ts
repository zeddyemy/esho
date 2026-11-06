import { createServerFn } from '@tanstack/react-start'

import { sectionVisibilitySchema } from '@/lib/schemas/sections'
import { normalizeHiddenSections } from '@/lib/sections'
import { adminMiddleware } from '@/server/middleware'
import type { SectionVisibilityInput } from '@/lib/schemas/sections'

export const getSectionVisibility = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }): Promise<SectionVisibilityInput> => {
    const [row, settings] = await Promise.all([
      db.from('page_content').select('data').eq('page', 'site').eq('section', 'visibility').maybeSingle(),
      db.from('site_settings').select('show_testimonials').eq('id', 1).single(),
    ])
    if (row.error) throw new Error(row.error.message)
    if (settings.error) throw new Error(settings.error.message)
    return { hidden: normalizeHiddenSections(row.data?.data), showTestimonials: settings.data.show_testimonials }
  })

/** Writes only the hidden list and the testimonials switch; section content rows are untouched. */
export const updateSectionVisibility = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(sectionVisibilitySchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db
      .from('page_content')
      .upsert({ page: 'site', section: 'visibility', data: { hidden: data.hidden } }, { onConflict: 'page,section' })
    if (error) throw new Error(error.message)

    const { error: settingsError } = await db
      .from('site_settings')
      .update({ show_testimonials: data.showTestimonials })
      .eq('id', 1)
    if (settingsError) throw new Error(settingsError.message)
    return { ok: true as const }
  })
