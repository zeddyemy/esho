import { queryOptions } from '@tanstack/react-query'

import { getPost, getPosts, getProject, getProjects } from '@/server/functions/content'

const FIVE_MINUTES = 5 * 60 * 1000

export const projectsQuery = (filter: { featured?: boolean } = {}) =>
  queryOptions({
    queryKey: ['projects', filter],
    queryFn: () => getProjects({ data: filter }),
    staleTime: FIVE_MINUTES,
  })

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ['project', slug],
    queryFn: () => getProject({ data: { slug } }),
    staleTime: FIVE_MINUTES,
  })

export const postsQuery = (filter: { limit?: number } = {}) =>
  queryOptions({
    queryKey: ['posts', filter],
    queryFn: () => getPosts({ data: filter }),
    staleTime: FIVE_MINUTES,
  })

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ['post', slug],
    queryFn: () => getPost({ data: { slug } }),
    staleTime: FIVE_MINUTES,
  })
