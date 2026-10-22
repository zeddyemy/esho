import { z } from 'zod'

import { fileAssetSchema, imageAssetSchema, optionalText, optionalUrl, phoneSchema, text } from './common'

export const settingsSchema = z.object({
  brandName: text(30, 'Brand name'),
  ownerName: text(60, 'Your name'),
  roleTitle: text(80, 'Role'),
  tagline: optionalText(120),
  logo: imageAssetSchema.nullable(),
  portrait: imageAssetSchema.nullable(),
  availability: optionalText(100),
  openToWork: z.boolean(),
  email: z.email('That email address looks incomplete').max(120),
  phones: z.array(phoneSchema).max(3),
  whatsapp: phoneSchema,
  location: optionalText(80),
  socials: z.object({
    github: optionalUrl,
    linkedin: optionalUrl,
    x: optionalUrl,
    instagram: optionalUrl,
    youtube: optionalUrl,
    dribbble: optionalUrl,
    medium: optionalUrl,
  }),
  resume: fileAssetSchema.nullable(),
  footerNote: optionalText(160),
  showWriting: z.boolean(),
  showTestimonials: z.boolean(),
  showResume: z.boolean(),
  seo: z.object({
    title: optionalText(70),
    description: optionalText(170),
    image: imageAssetSchema.nullable(),
  }),
})

export type SettingsInput = z.infer<typeof settingsSchema>
