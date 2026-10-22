import { createFileRoute } from '@tanstack/react-router'

import { findSettings } from '@/server/repository'

/** Stable link to the latest uploaded résumé, so shared URLs never go stale. */
export const Route = createFileRoute('/resume')({
  server: {
    handlers: {
      GET: async () => {
        const settings = await findSettings()
        if (!settings.showResume || !settings.resume) {
          return new Response('No résumé is published right now.', { status: 404 })
        }
        return new Response(null, {
          status: 302,
          headers: { Location: settings.resume.url, 'Cache-Control': 'public, max-age=0, s-maxage=60' },
        })
      },
    },
  },
})
