import { z } from 'zod'

import { imageAssetSchema, optionalText } from './common'
import { SEO_PAGES, isHttpUrl } from '@/lib/seo-pages'
import type { SeoPageKey } from '@/lib/seo-pages'

/** Override for one page: blank title or description means "work it out from the page". */
export const seoPageSchema = z.object({
  title: optionalText(70),
  description: optionalText(170),
  image: imageAssetSchema.nullable(),
})

const pagesShape = Object.fromEntries(SEO_PAGES.map((p) => [p.key, seoPageSchema])) as Record<SeoPageKey, typeof seoPageSchema>

/** Everything stored in `site_settings.seo`. Saved on its own, never by the Settings form. */
export const seoSettingsSchema = z.object({
  title: optionalText(70),
  description: optionalText(170),
  image: imageAssetSchema.nullable(),
  keywords: z.array(z.string().trim().min(1).max(40)).max(20),
  alternateNames: z.array(z.string().trim().min(1).max(60)).max(6),
  profiles: z.array(z.string().trim().max(300).refine(isHttpUrl, 'Enter a full link starting with https://')).max(10),
  googleVerification: optionalText(120),
  bingVerification: optionalText(120),
  pages: z.object(pagesShape),
})

export type SeoPageInput = z.infer<typeof seoPageSchema>
export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>
