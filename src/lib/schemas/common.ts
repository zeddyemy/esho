import { z } from 'zod'

/** jsonb image object stored in the database (see ImageAsset). */
export const imageAssetSchema = z.object({
  src: z.string().min(1).max(600),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().max(200),
  publicId: z.string().max(300).nullish(),
  color: z.string().max(20).nullish(),
  /** Photographer credit for seed/stock images. */
  credit: z.string().max(120).nullish(),
})

export const optionalUrl = z.union([z.literal(''), z.url('Enter a full link starting with https://').max(300)])

export const phoneSchema = z
  .string()
  .trim()
  .max(20)
  .regex(/^[+\d\s()-]*$/, 'Use digits, spaces and + only')

/** jsonb file object stored in the database (see FileAsset). */
export const fileAssetSchema = z.object({
  url: z.url().max(600),
  filename: z.string().min(1).max(200),
  bytes: z.number().int().nonnegative(),
  publicId: z.string().max(300).nullish(),
  uploadedAt: z.string().max(40),
})

export const slugSchema = z
  .string()
  .trim()
  .min(2, 'Enter a short web address')
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes only')

/** Required text with a friendly length message. */
export const text = (max: number, label = 'This field') =>
  z.string().trim().min(1, `${label} cannot be empty`).max(max, `Keep it under ${max} characters`)

export const optionalText = (max: number) => z.string().trim().max(max, `Keep it under ${max} characters`)

/** Short list of labels (tags, stack items). */
export const labelList = (max: number, itemMax = 40) =>
  z.array(z.string().trim().min(1).max(itemMax, `Keep each item under ${itemMax} characters`)).max(max, `Up to ${max} items`)

export const id = z.uuid()
export const idOnly = z.object({ id })
export const reorderSchema = z.object({ ids: z.array(id).min(1).max(200) })
export const visibilitySchema = z.object({ id, visible: z.boolean() })
