import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKey } from '@tanstack/react-query'

import {
  createExperience,
  deleteExperience,
  listAdminExperiences,
  reorderExperiences,
  setExperienceVisibility,
  updateExperience,
} from '@/server/functions/admin/experiences'
import {
  createPost,
  deletePost,
  getAdminPost,
  listAdminPosts,
  setPostPublished,
  updatePost,
} from '@/server/functions/admin/posts'
import {
  createProject,
  deleteProject,
  getAdminProject,
  listAdminProjects,
  reorderProjects,
  setProjectFeatured,
  setProjectPublished,
  updateProject,
} from '@/server/functions/admin/projects'
import {
  createStackGroup,
  deleteStackGroup,
  listAdminStackGroups,
  reorderStackGroups,
  setStackGroupVisibility,
  updateStackGroup,
} from '@/server/functions/admin/stack'
import {
  createTestimonial,
  deleteTestimonial,
  listAdminTestimonials,
  reorderTestimonials,
  setTestimonialVisibility,
  updateTestimonial,
} from '@/server/functions/admin/testimonials'

/** Invalidates the admin list plus the matching public queries after a change. */
function useInvalidate(keys: Array<QueryKey>) {
  const queryClient = useQueryClient()
  return () => Promise.all([...keys, ['admin', 'dashboard']].map((queryKey) => queryClient.invalidateQueries({ queryKey })))
}

/** Reorder with an optimistic update so drag-and-drop feels instant. */
function useReorder<TItem extends { id: string }>(
  queryKey: QueryKey,
  mutate: (ids: Array<string>) => Promise<unknown>,
  invalidate: () => Promise<unknown>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: Array<TItem>) => mutate(items.map((i) => i.id)),
    onMutate: async (items) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Array<TItem>>(queryKey)
      queryClient.setQueryData(queryKey, items)
      return { previous }
    },
    onError: (_err, _items, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
    },
    onSettled: invalidate,
  })
}

/* ---------- Projects ---------- */

const projectsKey = ['admin', 'projects']
export const adminProjectsQuery = () => queryOptions({ queryKey: projectsKey, queryFn: () => listAdminProjects() })
export const adminProjectQuery = (id: string) =>
  queryOptions({ queryKey: [...projectsKey, id], queryFn: () => getAdminProject({ data: { id } }) })
export type AdminProject = Awaited<ReturnType<typeof listAdminProjects>>[number]

export function useProjectMutations() {
  const invalidate = useInvalidate([projectsKey, ['projects'], ['project']])
  return {
    create: useMutation({ mutationFn: createProject, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateProject, onSuccess: invalidate }),
    setPublished: useMutation({ mutationFn: setProjectPublished, onSuccess: invalidate }),
    setFeatured: useMutation({ mutationFn: setProjectFeatured, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteProject, onSuccess: invalidate }),
    reorder: useReorder<AdminProject>(projectsKey, (ids) => reorderProjects({ data: { ids } }), invalidate),
  }
}

/* ---------- Posts ---------- */

const postsKey = ['admin', 'posts']
export const adminPostsQuery = () => queryOptions({ queryKey: postsKey, queryFn: () => listAdminPosts() })
export const adminPostQuery = (id: string) =>
  queryOptions({ queryKey: [...postsKey, id], queryFn: () => getAdminPost({ data: { id } }) })
export type AdminPost = Awaited<ReturnType<typeof listAdminPosts>>[number]

export function usePostMutations() {
  const invalidate = useInvalidate([postsKey, ['posts'], ['post']])
  return {
    create: useMutation({ mutationFn: createPost, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updatePost, onSuccess: invalidate }),
    setPublished: useMutation({ mutationFn: setPostPublished, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deletePost, onSuccess: invalidate }),
  }
}

/* ---------- Experience ---------- */

const experiencesKey = ['admin', 'experiences']
export const adminExperiencesQuery = () => queryOptions({ queryKey: experiencesKey, queryFn: () => listAdminExperiences() })
export type AdminExperience = Awaited<ReturnType<typeof listAdminExperiences>>[number]

export function useExperienceMutations() {
  const invalidate = useInvalidate([experiencesKey, ['experiences']])
  return {
    create: useMutation({ mutationFn: createExperience, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateExperience, onSuccess: invalidate }),
    setVisible: useMutation({ mutationFn: setExperienceVisibility, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteExperience, onSuccess: invalidate }),
    reorder: useReorder<AdminExperience>(experiencesKey, (ids) => reorderExperiences({ data: { ids } }), invalidate),
  }
}

/* ---------- Stack ---------- */

const stackKey = ['admin', 'stack']
export const adminStackQuery = () => queryOptions({ queryKey: stackKey, queryFn: () => listAdminStackGroups() })
export type AdminStackGroup = Awaited<ReturnType<typeof listAdminStackGroups>>[number]

export function useStackMutations() {
  const invalidate = useInvalidate([stackKey, ['stack-groups']])
  return {
    create: useMutation({ mutationFn: createStackGroup, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateStackGroup, onSuccess: invalidate }),
    setVisible: useMutation({ mutationFn: setStackGroupVisibility, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteStackGroup, onSuccess: invalidate }),
    reorder: useReorder<AdminStackGroup>(stackKey, (ids) => reorderStackGroups({ data: { ids } }), invalidate),
  }
}

/* ---------- Testimonials ---------- */

const testimonialsKey = ['admin', 'testimonials']
export const adminTestimonialsQuery = () => queryOptions({ queryKey: testimonialsKey, queryFn: () => listAdminTestimonials() })
export type AdminTestimonial = Awaited<ReturnType<typeof listAdminTestimonials>>[number]

export function useTestimonialMutations() {
  const invalidate = useInvalidate([testimonialsKey, ['testimonials']])
  return {
    create: useMutation({ mutationFn: createTestimonial, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateTestimonial, onSuccess: invalidate }),
    setVisible: useMutation({ mutationFn: setTestimonialVisibility, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteTestimonial, onSuccess: invalidate }),
    reorder: useReorder<AdminTestimonial>(testimonialsKey, (ids) => reorderTestimonials({ data: { ids } }), invalidate),
  }
}
