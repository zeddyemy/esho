import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { idOnly } from '@/lib/schemas/common'
import { adminMiddleware } from '@/server/middleware'
import { INQUIRY_STATUSES } from '@/types'
import type { Tables } from '@/types/database'
import type { Inquiry, InquiryStatus } from '@/types'

export function toInquiry(r: Tables<'inquiries'>): Inquiry {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    company: r.company,
    projectType: r.project_type,
    budget: r.budget,
    timeline: r.timeline,
    message: r.message,
    status: r.status as InquiryStatus,
    createdAt: r.created_at,
  }
}

export const listInquiries = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db.from('inquiries').select('*').order('created_at', { ascending: false }).limit(1000)
    if (error) throw new Error(error.message)
    return data.map(toInquiry)
  })

export const setInquiryStatus = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(z.object({ id: z.uuid(), status: z.enum(INQUIRY_STATUSES) }))
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('inquiries').update({ status: data.status }).eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deleteInquiry = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('inquiries').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })
