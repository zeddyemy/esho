import { createFileRoute } from '@tanstack/react-router'

import { serverEnv } from '@/server/env'
import { sweepMedia } from '@/server/media-cleanup'

/**
 * Weekly Vercel Cron Job (see vite.config.ts): deletes uploads nothing uses
 * any more. Disabled unless CRON_SECRET is set, because it deletes files;
 * Vercel sends that secret as a Bearer token. `?dry=1` only reports.
 */
export const Route = createFileRoute('/api/cleanup-media')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = serverEnv('CRON_SECRET')
        const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        if (!secret) return new Response(JSON.stringify({ error: 'Set CRON_SECRET to enable media cleanup.' }), { status: 503, headers })
        if (request.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Unauthorized', { status: 401 })

        try {
          const dryRun = new URL(request.url).searchParams.get('dry') === '1'
          const result = await sweepMedia({ dryRun })
          return new Response(JSON.stringify({ ok: true, ...result }), { headers })
        } catch (err) {
          console.error('[cleanup-media] failed', err)
          return new Response(JSON.stringify({ ok: false }), { status: 500, headers })
        }
      },
    },
  },
})
