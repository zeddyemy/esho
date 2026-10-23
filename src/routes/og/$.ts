import { createFileRoute } from '@tanstack/react-router'

import { SITE_URL } from '@/lib/seo'
import { renderOgImage } from '@/server/og'
import {
  findAboutContent,
  findContactContent,
  findHomeContent,
  findPageHeader,
  findPostBySlug,
  findProjectBySlug,
  findSettings,
} from '@/server/repository'

/** Kicker + title for a share image path, or null for unknown paths. */
async function cardFor(path: Array<string>): Promise<{ kicker: string; title: string } | null> {
  const [kind, slug] = path
  if (!kind) {
    const home = await findHomeContent()
    return { kicker: 'Portfolio', title: home.hero.headline }
  }
  if (kind === 'work' && slug) {
    const result = await findProjectBySlug(slug)
    return result ? { kicker: 'Case study', title: result.project.title } : null
  }
  if (kind === 'writing' && slug) {
    const result = await findPostBySlug(slug)
    return result ? { kicker: 'Article', title: result.post.title } : null
  }
  if (kind === 'page') {
    if (slug === 'about') return { kicker: 'About', title: (await findAboutContent()).heading }
    if (slug === 'contact') return { kicker: 'Contact', title: (await findContactContent()).heading }
    if (slug === 'work') return { kicker: 'Work', title: (await findPageHeader('work')).heading }
    if (slug === 'writing') return { kicker: 'Writing', title: (await findPageHeader('writing')).heading }
  }
  return null
}

/**
 * Generated share images: /og, /og/page/{about|contact|work|writing},
 * /og/work/{slug}, /og/writing/{slug}. Cached at the CDN for a day.
 */
export const Route = createFileRoute('/og/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params._splat ?? '').replace(/\.png$/, '').split('/').filter(Boolean)
        const [card, settings] = await Promise.all([cardFor(path), findSettings()])
        if (!card) return new Response('Not found', { status: 404 })

        const png = await renderOgImage({
          ...card,
          brand: settings.brandName,
          name: settings.ownerName,
          role: settings.roleTitle,
          domain: new URL(SITE_URL).host,
          appearance: settings.appearance,
        })
        return new Response(new Uint8Array(png), {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        })
      },
    },
  },
})
