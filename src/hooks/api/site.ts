import { queryOptions } from '@tanstack/react-query'

import {
  getAboutContent,
  getContactContent,
  getExperiences,
  getHomeContent,
  getPageHeader,
  getSettings,
  getStackGroups,
  getTestimonials,
} from '@/server/functions/site'

const FIVE_MINUTES = 5 * 60 * 1000

export const settingsQuery = () =>
  queryOptions({ queryKey: ['settings'], queryFn: () => getSettings(), staleTime: FIVE_MINUTES })

export const homeContentQuery = () =>
  queryOptions({ queryKey: ['content', 'home'], queryFn: () => getHomeContent(), staleTime: FIVE_MINUTES })

export const aboutContentQuery = () =>
  queryOptions({ queryKey: ['content', 'about'], queryFn: () => getAboutContent(), staleTime: FIVE_MINUTES })

export const contactContentQuery = () =>
  queryOptions({ queryKey: ['content', 'contact'], queryFn: () => getContactContent(), staleTime: FIVE_MINUTES })

export const pageHeaderQuery = (page: 'work' | 'writing') =>
  queryOptions({
    queryKey: ['content', 'header', page],
    queryFn: () => getPageHeader({ data: { page } }),
    staleTime: FIVE_MINUTES,
  })

export const experiencesQuery = () =>
  queryOptions({ queryKey: ['experiences'], queryFn: () => getExperiences(), staleTime: FIVE_MINUTES })

export const stackGroupsQuery = () =>
  queryOptions({ queryKey: ['stack-groups'], queryFn: () => getStackGroups(), staleTime: FIVE_MINUTES })

export const testimonialsQuery = () =>
  queryOptions({ queryKey: ['testimonials'], queryFn: () => getTestimonials(), staleTime: FIVE_MINUTES })
