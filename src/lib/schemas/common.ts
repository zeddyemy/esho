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
  .regex(/^[+\d\s()-]*$/, 'Use digits only, e.g. 0810 481 7424')
