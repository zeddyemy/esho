import { z } from 'zod'

import { HIDEABLE_SECTIONS } from '@/lib/sections'

export const sectionVisibilitySchema = z.object({
  hidden: z.array(z.enum(HIDEABLE_SECTIONS as [string, ...Array<string>])).max(HIDEABLE_SECTIONS.length),
  showTestimonials: z.boolean(),
})

export type SectionVisibilityInput = z.infer<typeof sectionVisibilitySchema>
