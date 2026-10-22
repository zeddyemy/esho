import { createFileRoute } from '@tanstack/react-router'

import { serverEnv } from '@/server/env'
import { getPublicClient } from '@/server/supabase'

/**
 * Called by a Vercel Cron Job every 3 days (see vite.config.ts). A tiny read
 * counts as database activity, so the free Supabase project is never paused
 * for 7 days of inactivity during quiet weeks.
 */
export const Route = createFileRoute('/api/keep-alive')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Vercel sends `Authorization: Bearer <CRON_SECRET>` when that env var is set.
        const secret = serverEnv('CRON_SECRET')
        if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
          return new Response('Unauthorized', { status: 401 })
        }

        const started = Date.now()
        const { error } = await getPublicClient().from('site_settings').select('id').eq('id', 1).maybeSingle()
        const body = JSON.stringify({ ok: !error, ms: Date.now() - started, at: new Date().toISOString() })
        if (error) console.error('[keep-alive] database ping failed', error.message)

        return new Response(body, {
          status: error ? 503 : 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        })
      },
    },
  },
})
