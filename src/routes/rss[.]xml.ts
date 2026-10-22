import { createFileRoute } from '@tanstack/react-router'

import { SITE_URL } from '@/lib/seo'
import { findPosts, findSettings } from '@/server/repository'

const xml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => {
        const settings = await findSettings()
        const posts = settings.showWriting ? await findPosts({ limit: 30 }) : []
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${settings.brandName} | Writing`)}</title>
    <link>${SITE_URL}/writing</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xml(settings.seo.description)}</description>
    <language>en</language>
${posts
  .map(
    (p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${SITE_URL}/writing/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${p.slug}</guid>
      <description>${xml(p.excerpt)}</description>${p.publishedAt ? `\n      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`
        return new Response(body, {
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
