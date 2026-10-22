import { createServerFn } from '@tanstack/react-start'

import { applyOrder, friendlyDbError } from './helpers'
import { idOnly, reorderSchema, visibilitySchema } from '@/lib/schemas/common'
import { experienceSchema, experienceUpdateSchema } from '@/lib/schemas/catalog'
import { toExperience } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'
import type { ExperienceInput } from '@/lib/schemas/catalog'

const toRow = (e: ExperienceInput) => ({
  kind: e.kind,
  organisation: e.organisation,
  title: e.title,
  location: e.location,
  url: e.url,
  start_date: `${e.start}-01`,
  end_date: e.end ? `${e.end}-01` : null,
  summary: e.summary,
  highlights: e.highlights,
  stack: e.stack,
  visible: e.visible,
})

export const listAdminExperiences = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db.from('experiences').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data.map(toExperience)
  })

export const createExperience = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(experienceSchema)
  .handler(async ({ data, context: { db } }) => {
    // New roles go to the top: most recent first is the usual reading order.
    const { data: first } = await db.from('experiences').select('sort_order').order('sort_order').limit(1).maybeSingle()
    const { error } = await db.from('experiences').insert({ ...toRow(data), sort_order: (first?.sort_order ?? 1) - 1 })
    if (error) throw friendlyDbError(error, 'entry')
    return { ok: true as const }
  })

export const updateExperience = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(experienceUpdateSchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('experiences').update(toRow(data.value)).eq('id', data.id)
    if (error) throw friendlyDbError(error, 'entry')
    return { ok: true as const }
  })

export const setExperienceVisibility = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(visibilitySchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('experiences').update({ visible: data.visible }).eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('experiences').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'entry')
    return { ok: true as const }
  })

export const reorderExperiences = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('experiences').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })
