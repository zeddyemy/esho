import { createHash } from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server'

import { inquirySchema } from '@/lib/schemas/inquiry'
import { getServiceClient } from '@/server/supabase'

const MIN_FILL_TIME_MS = 3000
const RATE_LIMIT = { max: 5, windowMinutes: 60 }

/** Anonymous, non-reversible fingerprint used only for rate limiting. */
function clientHash(): string {
  const ip = getRequestIP({ xForwardedFor: true }) ?? 'unknown'
  const ua = getRequestHeader('user-agent') ?? ''
  return createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 32)
}

export const submitInquiry = createServerFn({ method: 'POST' })
  .validator(inquirySchema)
  .handler(async ({ data }) => {
    // Spam checks: honeypot filled or form submitted implausibly fast.
    // Respond as if it succeeded so bots get no signal.
    if (data.website || data.elapsedMs < MIN_FILL_TIME_MS) {
      return { ok: true as const }
    }

    let db: ReturnType<typeof getServiceClient>
    try {
      db = getServiceClient()
    } catch (err) {
      console.error('[inquiry] service client unavailable', err)
      throw new Error('Could not send your enquiry. Please email me directly instead.')
    }
    const hash = clientHash()
    const since = new Date(Date.now() - RATE_LIMIT.windowMinutes * 60_000).toISOString()

    const { count, error: countError } = await db
      .from('inquiries')
      .select('id', { count: 'exact', head: true })
      .eq('client_hash', hash)
      .gte('created_at', since)
    if (countError) throw new Error('Could not send your enquiry. Please try again.')
    if ((count ?? 0) >= RATE_LIMIT.max) {
      throw new Error('You have sent several enquiries already. Please email me directly instead.')
    }

    const { error } = await db.from('inquiries').insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      project_type: data.projectType || null,
      budget: data.budget || null,
      timeline: data.timeline || null,
      message: data.message,
      client_hash: hash,
    })
    if (error) throw new Error('Could not send your enquiry. Please try again.')

    return { ok: true as const }
  })
