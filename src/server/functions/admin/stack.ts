import { createServerFn } from '@tanstack/react-start'

import { applyOrder, friendlyDbError } from './helpers'
import { idOnly, reorderSchema, visibilitySchema } from '@/lib/schemas/common'
import { stackGroupSchema, stackGroupUpdateSchema } from '@/lib/schemas/catalog'
import { toStackGroup } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'

export const listAdminStackGroups = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db.from('stack_groups').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data.map(toStackGroup)
  })

export const createStackGroup = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(stackGroupSchema)
  .handler(async ({ data, context: { db } }) => {
    const { count } = await db.from('stack_groups').select('id', { count: 'exact', head: true })
    const { error } = await db.from('stack_groups').insert({ ...data, sort_order: (count ?? 0) + 1 })
    if (error) throw friendlyDbError(error, 'group')
    return { ok: true as const }
  })

export const updateStackGroup = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(stackGroupUpdateSchema)
  .handler(async ({ data: { id, ...data }, context: { db } }) => {
    const { error } = await db.from('stack_groups').update(data).eq('id', id)
    if (error) throw friendlyDbError(error, 'group')
    return { ok: true as const }
  })

export const setStackGroupVisibility = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(visibilitySchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('stack_groups').update({ visible: data.visible }).eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deleteStackGroup = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('stack_groups').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'group')
    return { ok: true as const }
  })

export const reorderStackGroups = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('stack_groups').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })
