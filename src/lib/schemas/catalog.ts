import { z } from 'zod'

import { id, imageAssetSchema, labelList, optionalText, slugSchema, text } from './common'

const urlOrPath = z
  .string()
  .trim()
  .max(300)
  .refine((v) => /^https?:\/\//.test(v), 'Enter a full link starting with https://')

/* ---------- Projects ---------- */

export const projectSchema = z.object({
  title: text(80, 'Title'),
  slug: slugSchema,
  summary: text(240, 'Summary'),
  role: optionalText(80),
  client: optionalText(80),
  year: z.number({ error: 'Enter a year' }).int().min(1990, 'Enter a real year').max(2100, 'Enter a real year'),
  tags: labelList(6, 30),
  stack: labelList(16, 40),
  links: z.array(z.object({ label: text(30, 'Label'), url: urlOrPath })).max(4),
  metrics: z.array(z.object({ value: text(16, 'Value'), label: text(80, 'Label') })).max(4),
  cover: imageAssetSchema.nullable(),
  gallery: z.array(imageAssetSchema).max(16),
  body: optionalText(30000),
  featured: z.boolean(),
  published: z.boolean(),
})

export const projectUpdateSchema = projectSchema.extend({ id }).refine((p) => !p.published || p.cover, {
  message: 'Add a cover image before publishing',
  path: ['cover'],
})

export const projectCreateSchema = z.object({ title: text(80, 'Title'), slug: slugSchema })

export const publishSchema = z.object({ id, published: z.boolean() })
export const featureSchema = z.object({ id, featured: z.boolean() })

export type ProjectInput = z.infer<typeof projectSchema>

/* ---------- Posts ---------- */

export const postSchema = z.object({
  title: text(120, 'Title'),
  slug: slugSchema,
  excerpt: text(260, 'Excerpt'),
  cover: imageAssetSchema.nullable(),
  body: optionalText(60000),
  tags: labelList(6, 30),
  published: z.boolean(),
  /** YYYY-MM-DD; defaults to today when publishing. */
  publishedOn: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Pick a date'),
})

export const postUpdateSchema = postSchema.extend({ id })
export const postCreateSchema = z.object({ title: text(120, 'Title'), slug: slugSchema })

export type PostInput = z.infer<typeof postSchema>

/* ---------- Experience ---------- */

const monthDate = z.string().regex(/^\d{4}-\d{2}$/, 'Pick a month')

export const experienceSchema = z
  .object({
    kind: z.enum(['work', 'education']),
    organisation: text(80, 'Organisation'),
    title: text(120, 'Title'),
    location: optionalText(80),
    url: z.union([z.literal(''), urlOrPath]),
    /** YYYY-MM */
    start: monthDate,
    /** YYYY-MM, or '' for present */
    end: z.union([z.literal(''), monthDate]),
    summary: optionalText(400),
    highlights: z.array(z.string().trim().min(1, 'Remove empty lines').max(200)).max(6),
    stack: labelList(12, 40),
    visible: z.boolean(),
  })
  .refine((e) => !e.end || e.end >= e.start, { message: 'End must be after start', path: ['end'] })

export const experienceUpdateSchema = z.object({ id, value: experienceSchema })

export type ExperienceInput = z.infer<typeof experienceSchema>

/* ---------- Stack groups ---------- */

export const stackGroupSchema = z.object({
  title: text(50, 'Title'),
  description: optionalText(140),
  items: labelList(24, 40).min(1, 'Add at least one tool'),
  visible: z.boolean(),
})

export const stackGroupUpdateSchema = stackGroupSchema.extend({ id })

export type StackGroupInput = z.infer<typeof stackGroupSchema>

/* ---------- Testimonials ---------- */

export const testimonialSchema = z.object({
  quote: text(320, 'Quote'),
  name: text(60, 'Name'),
  role: optionalText(60),
  company: optionalText(60),
  avatar: imageAssetSchema.nullable(),
  visible: z.boolean(),
})

export const testimonialUpdateSchema = testimonialSchema.extend({ id })

export type TestimonialInput = z.infer<typeof testimonialSchema>
