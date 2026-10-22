import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { z } from 'zod'

import { findPostBySlug, findPosts, findProjectBySlug, findProjects } from '@/server/repository'

const slug = z.object({ slug: z.string().min(1).max(120) })

export const getProjects = createServerFn({ method: 'GET' })
  .validator(z.object({ featured: z.boolean().optional() }))
  .handler(({ data }) => findProjects(data))

export const getProject = createServerFn({ method: 'GET' })
  .validator(slug)
  .handler(async ({ data }) => {
    const result = await findProjectBySlug(data.slug)
    if (!result) throw notFound()
    return result
  })

export const getPosts = createServerFn({ method: 'GET' })
  .validator(z.object({ limit: z.number().int().min(1).max(50).optional() }))
  .handler(({ data }) => findPosts(data))

export const getPost = createServerFn({ method: 'GET' })
  .validator(slug)
  .handler(async ({ data }) => {
    const result = await findPostBySlug(data.slug)
    if (!result) throw notFound()
    return result
  })
