import { createFileRoute } from '@tanstack/react-router'

import { imageUrl } from '@/lib/media'
import { SITE_URL } from '@/lib/seo'
import { getPublicClient } from '@/server/supabase'

const xml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

interface Entry {
  path: string
  lastmod?: string
  changefreq: 'daily' | 'weekly' | 'monthly'
  priority: number
  images?: Array<{ src: string; title: string }>
}

/**
 * Dynamic sitemap: static pages, every published project and post (with their
 * images via the Google image-sitemap extension), so new work is discoverable
 * without a redeploy.
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const db = getPublicClient()
        const [{ data: projects }, { data: posts }, { data: settings }] = await Promise.all([
          db.from('projects').select('slug, title, updated_at, cover, gallery').eq('published', true).order('sort_order'),
          db.from('posts').select('slug, title, updated_at, published_at, cover').eq('published', true),
          db.from('site_settings').select('updated_at, show_writing').eq('id', 1).maybeSingle(),
        ])

        const showWriting = settings?.show_writing ?? true
        const latest = [settings?.updated_at, ...(projects ?? []).map((p) => p.updated_at)].filter(Boolean).sort().at(-1)
        const asImage = (value: unknown, title: string) => {
          const img = value as { src?: string; alt?: string } | null
          return img?.src ? [{ src: imageUrl(img.src, 1600), title: img.alt || title }] : []
        }

        const entries: Array<Entry> = [
          { path: '/', lastmod: latest, changefreq: 'weekly', priority: 1 },
          { path: '/work', lastmod: latest, changefreq: 'weekly', priority: 0.9 },
          { path: '/about', changefreq: 'monthly', priority: 0.8 },
          { path: '/contact', changefreq: 'monthly', priority: 0.7 },
          ...(showWriting ? [{ path: '/writing', changefreq: 'weekly' as const, priority: 0.7 }] : []),
          ...(projects ?? []).map((p) => ({
            path: `/work/${p.slug}`,
            lastmod: p.updated_at,
            changefreq: 'monthly' as const,
            priority: 0.8,
            images: [
              ...asImage(p.cover, p.title),
              ...(Array.isArray(p.gallery) ? p.gallery.flatMap((g) => asImage(g, p.title)) : []),
            ],
          })),
          ...(showWriting ? (posts ?? []) : []).map((p) => ({
            path: `/writing/${p.slug}`,
            lastmod: p.updated_at,
            changefreq: 'monthly' as const,
            priority: 0.6,
            images: asImage(p.cover, p.title),
          })),
        ]

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${xml(`${SITE_URL}${e.path}`)}</loc>${e.lastmod ? `\n    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>${(e.images ?? [])
      .map((img) => `\n    <image:image><image:loc>${xml(img.src)}</image:loc><image:title>${xml(img.title)}</image:title></image:image>`)
      .join('')}
  </url>`,
  )
  .join('\n')}
</urlset>
`
        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
