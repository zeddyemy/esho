import { z } from 'zod'

import { ACCENTS, BODY_FONTS, HEADING_FONTS, HEADING_WEIGHTS, HEADING_WIDTHS, MOTION_LEVELS } from '@/lib/appearance'

const keys = <T extends Record<string, unknown>>(o: T) => Object.keys(o) as [keyof T & string, ...Array<keyof T & string>]

export const appearanceSchema = z.object({
  headingFont: z.enum(keys(HEADING_FONTS)),
  headingWeight: z.number().refine((w) => (HEADING_WEIGHTS as ReadonlyArray<number>).includes(w), 'Pick a weight'),
  headingWidth: z.enum(keys(HEADING_WIDTHS)),
  headingUppercase: z.boolean(),
  bodyFont: z.enum(keys(BODY_FONTS)),
  accent: z.enum(keys(ACCENTS)),
  motion: z.enum(keys(MOTION_LEVELS)),
})
