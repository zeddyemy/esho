import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

import { applyOrder, friendlyDbError } from './helpers'
import { idOnly, reorderSchema } from '@/lib/schemas/common'
import { featureSchema, projectCreateSchema, projectUpdateSchema, publishSchema } from '@/lib/schemas/catalog'
import { collectPublicIds, destroyImages, destroyRemovedImages } from '@/server/cloudinary'
import { toProject, toProjectSummary } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'

export const listAdminProjects = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db
      .from('projects')
      .select('id, slug, title, summary, role, client, year, tags, stack, links, metrics, cover, featured, published, sort_order, created_at, updated_at')
      .order('sort_order')
    if (error) throw new Error(error.message)
    return data.map((row) => ({ ...toProjectSummary(row), hasCover: row.cover !== null, updatedAt: row.updated_at }))
  })

export const getAdminProject = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: row, error } = await db.from('projects').select('*').eq('id', data.id).maybeSingle()
    if (error) throw new Error(error.message)
    if (!row) throw notFound()
    const project = toProject(row)
    // The editor works with a nullable cover; the mapper fills a placeholder for the public site.
    return { ...project, cover: row.cover ? project.cover : null }
  })

export const createProject = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(projectCreateSchema)
  .handler(async ({ data, context: { db } }) => {
    const { count } = await db.from('projects').select('id', { count: 'exact', head: true })
    const { data: row, error } = await db
      .from('projects')
      .insert({ title: data.title, slug: data.slug, year: new Date().getFullYear(), sort_order: (count ?? 0) + 1 })
      .select('id')
      .single()
    if (error) throw friendlyDbError(error, 'project')
    return { id: row.id }
  })

export const updateProject = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(projectUpdateSchema)
  .handler(async ({ data: { id, ...p }, context: { db } }) => {
    const { data: before } = await db.from('projects').select('cover, gallery').eq('id', id).single()
    const { error } = await db
      .from('projects')
      .update({
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        role: p.role,
        client: p.client,
        year: p.year,
        tags: p.tags,
        stack: p.stack,
        links: p.links,
        metrics: p.metrics,
        cover: p.cover,
        gallery: p.gallery,
        body: p.body,
        featured: p.featured,
        published: p.published,
      })
      .eq('id', id)
    if (error) throw friendlyDbError(error, 'project')
    await destroyRemovedImages(before, { cover: p.cover, gallery: p.gallery })
    return { ok: true as const }
  })

export const setProjectPublished = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(publishSchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('projects').update({ published: data.published }).eq('id', data.id)
    if (error?.code === '23514') throw new Error('Add a cover image before publishing this project.')
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const setProjectFeatured = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(featureSchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('projects').update({ featured: data.featured }).eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: row } = await db.from('projects').select('cover, gallery').eq('id', data.id).maybeSingle()
    const { error } = await db.from('projects').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'project')
    try {
      await destroyImages([...collectPublicIds(row)])
    } catch (err) {
      console.error('[cloudinary] project cleanup failed', err)
    }
    return { ok: true as const }
  })

export const reorderProjects = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('projects').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })
