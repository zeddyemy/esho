import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

import { friendlyDbError } from './helpers'
import { idOnly } from '@/lib/schemas/common'
import { postCreateSchema, postUpdateSchema, publishSchema } from '@/lib/schemas/catalog'
import { collectPublicIds, destroyImages, destroyRemovedImages } from '@/server/cloudinary'
import { readingMinutes } from '@/server/markdown'
import { toPost, toPostSummary } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'

const today = () => new Date().toISOString().slice(0, 10)

export const listAdminPosts = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db
      .from('posts')
      .select('id, slug, title, excerpt, cover, tags, reading_minutes, published, published_at, created_at, updated_at')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map((row) => ({ ...toPostSummary(row), updatedAt: row.updated_at }))
  })

export const getAdminPost = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: row, error } = await db.from('posts').select('*').eq('id', data.id).maybeSingle()
    if (error) throw new Error(error.message)
    if (!row) throw notFound()
    return toPost(row)
  })

export const createPost = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(postCreateSchema)
  .handler(async ({ data, context: { db } }) => {
    const { data: row, error } = await db
      .from('posts')
      .insert({ title: data.title, slug: data.slug })
      .select('id')
      .single()
    if (error) throw friendlyDbError(error, 'article')
    return { id: row.id }
  })

export const updatePost = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(postUpdateSchema)
  .handler(async ({ data: { id, ...p }, context: { db } }) => {
    const { data: before } = await db.from('posts').select('cover, published_at').eq('id', id).single()
    // A publish date is kept once set; publishing for the first time stamps today.
    const day = p.publishedOn || (p.published ? today() : '')
    const { error } = await db
      .from('posts')
      .update({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        cover: p.cover,
        body: p.body,
        tags: p.tags,
        reading_minutes: readingMinutes(p.body),
        published: p.published,
        published_at: day ? `${day}T09:00:00.000Z` : null,
      })
      .eq('id', id)
    if (error) throw friendlyDbError(error, 'article')
    await destroyRemovedImages({ cover: before?.cover }, { cover: p.cover })
    return { ok: true as const }
  })

export const setPostPublished = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(publishSchema)
  .handler(async ({ data, context: { db } }) => {
    const { data: row } = await db.from('posts').select('published_at').eq('id', data.id).single()
    const { error } = await db
      .from('posts')
      .update({
        published: data.published,
        published_at: row?.published_at ?? (data.published ? new Date().toISOString() : null),
      })
      .eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deletePost = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: row } = await db.from('posts').select('cover').eq('id', data.id).maybeSingle()
    const { error } = await db.from('posts').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'article')
    try {
      await destroyImages([...collectPublicIds(row)])
    } catch (err) {
      console.error('[cloudinary] post cleanup failed', err)
    }
    return { ok: true as const }
  })
