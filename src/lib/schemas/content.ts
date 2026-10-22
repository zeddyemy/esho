import { z } from 'zod'

import { imageAssetSchema, optionalText, text } from './common'

export const heroSchema = z.object({
  headline: text(70, 'Headline'),
  subheadline: text(160, 'Subheadline'),
  primaryCta: text(24, 'Button text'),
  secondaryCta: text(24, 'Button text'),
})

export const introSchema = z.object({
  statement: text(260, 'Statement'),
  body: optionalText(400),
})

export const capabilitiesSchema = z.object({
  heading: text(60, 'Heading'),
  items: z
    .array(
      z.object({
        title: text(40, 'Title'),
        body: text(200, 'Text'),
        points: z.array(z.string().trim().min(1).max(40)).max(5),
        image: imageAssetSchema.nullable(),
      }),
    )
    .min(1, 'Keep at least one capability')
    .max(6),
})

export const ctaSchema = z.object({
  heading: text(60, 'Heading'),
  body: optionalText(200),
})

export const aboutSchema = z.object({
  heading: text(70, 'Heading'),
  lead: text(280, 'Introduction'),
  story: text(4000, 'Story'),
  image: imageAssetSchema.nullable(),
  facts: z.array(z.object({ label: text(30, 'Label'), value: text(80, 'Value') })).max(6),
  principles: z.array(z.object({ title: text(50, 'Title'), body: text(200, 'Text') })).max(6),
})

export const contactSchema = z.object({
  heading: text(40, 'Heading'),
  body: text(240, 'Text'),
  responseNote: optionalText(120),
  projectTypes: z.array(z.string().trim().min(1).max(40)).max(10),
  budgets: z.array(z.string().trim().min(1).max(40)).max(8),
})

export const pageHeaderSchema = z.object({
  heading: text(40, 'Heading'),
  body: optionalText(240),
})

export const updateContentSchema = z.discriminatedUnion('key', [
  z.object({ key: z.literal('home.hero'), data: heroSchema }),
  z.object({ key: z.literal('home.intro'), data: introSchema }),
  z.object({ key: z.literal('home.capabilities'), data: capabilitiesSchema }),
  z.object({ key: z.literal('home.cta'), data: ctaSchema }),
  z.object({ key: z.literal('about.main'), data: aboutSchema }),
  z.object({ key: z.literal('contact.main'), data: contactSchema }),
  z.object({ key: z.literal('work.header'), data: pageHeaderSchema }),
  z.object({ key: z.literal('writing.header'), data: pageHeaderSchema }),
])

export type UpdateContentInput = z.infer<typeof updateContentSchema>
export type ContentKey = UpdateContentInput['key']
