import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
  findAboutContent,
  findContactContent,
  findExperiences,
  findHomeContent,
  findPageHeader,
  findSettings,
  findStackGroups,
  findTestimonials,
} from '@/server/repository'

export const getSettings = createServerFn({ method: 'GET' }).handler(() => findSettings())

export const getHomeContent = createServerFn({ method: 'GET' }).handler(() => findHomeContent())

export const getAboutContent = createServerFn({ method: 'GET' }).handler(() => findAboutContent())

export const getContactContent = createServerFn({ method: 'GET' }).handler(() => findContactContent())

export const getPageHeader = createServerFn({ method: 'GET' })
  .validator(z.object({ page: z.enum(['work', 'writing']) }))
  .handler(({ data }) => findPageHeader(data.page))

export const getExperiences = createServerFn({ method: 'GET' }).handler(() => findExperiences())

export const getStackGroups = createServerFn({ method: 'GET' }).handler(() => findStackGroups())

export const getTestimonials = createServerFn({ method: 'GET' }).handler(() => findTestimonials())
