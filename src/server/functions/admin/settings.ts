import { createServerFn } from '@tanstack/react-start'

import { settingsSchema } from '@/lib/schemas/settings'
import { destroyRemovedImages } from '@/server/cloudinary'
import { toSettings } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'
import { removeFiles } from '@/server/storage'
import type { SettingsInput } from '@/lib/schemas/settings'
import type { FileAsset } from '@/types'

/** Settings in the editable form shape (socials always have every key). */
export const getAdminSettings = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }): Promise<SettingsInput> => {
    const { data, error } = await db.from('site_settings').select('*').eq('id', 1).single()
    if (error) throw new Error(error.message)
    const s = toSettings(data)
    const seo = (data.seo ?? {}) as { title?: string; description?: string }
    return {
      brandName: s.brandName,
      ownerName: s.ownerName,
      roleTitle: s.roleTitle,
      tagline: s.tagline,
      logo: s.logo,
      portrait: s.portrait,
      availability: s.availability,
      openToWork: s.openToWork,
      email: s.email,
      phones: s.phones,
      whatsapp: s.whatsapp,
      location: s.location,
      socials: {
        github: s.socials.github ?? '',
        linkedin: s.socials.linkedin ?? '',
        x: s.socials.x ?? '',
        instagram: s.socials.instagram ?? '',
        youtube: s.socials.youtube ?? '',
        dribbble: s.socials.dribbble ?? '',
        medium: s.socials.medium ?? '',
      },
      resume: s.resume,
      footerNote: s.footerNote,
      showWriting: s.showWriting,
      showTestimonials: s.showTestimonials,
      showResume: s.showResume,
      // Raw values: an empty title means "use the default" on the public site.
      seo: { title: seo.title ?? '', description: seo.description ?? '', image: s.seo.image },
    }
  })

export const updateSettings = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(settingsSchema)
  .handler(async ({ data, context: { db } }) => {
    const { data: before } = await db.from('site_settings').select('logo, portrait, seo, resume').eq('id', 1).single()

    const socials = Object.fromEntries(Object.entries(data.socials).filter(([, v]) => v))
    const { error } = await db
      .from('site_settings')
      .update({
        brand_name: data.brandName,
        owner_name: data.ownerName,
        role_title: data.roleTitle,
        tagline: data.tagline,
        logo: data.logo,
        portrait: data.portrait,
        availability: data.availability,
        open_to_work: data.openToWork,
        email: data.email,
        phones: data.phones.map((p) => p.trim()).filter(Boolean),
        whatsapp: data.whatsapp,
        location: data.location,
        socials,
        resume: data.resume,
        footer_note: data.footerNote,
        show_writing: data.showWriting,
        show_testimonials: data.showTestimonials,
        show_resume: data.showResume,
        seo: data.seo,
      })
      .eq('id', 1)
    if (error) throw new Error(error.message)

    await destroyRemovedImages(
      { logo: before?.logo, portrait: before?.portrait, seo: before?.seo },
      { logo: data.logo, portrait: data.portrait, seo: data.seo },
    )
    const oldResume = before?.resume as FileAsset | null | undefined
    if (oldResume?.publicId && oldResume.publicId !== data.resume?.publicId) await removeFiles([oldResume.publicId])
    return { ok: true as const }
  })
