import { imageUrl, ogImageUrl } from '@/lib/media'
import type { ImageAsset, Post, Project, SiteSettings } from '@/types'

/**
 * Fallback production origin, used only when VITE_SITE_URL is not set in the
 * hosting environment. Update once the domain is confirmed (see brain.md).
 */
const PRODUCTION_URL = 'https://eshomonu.com'

/** Canonical origin. Falls back to the production domain so a missing env var never leaks localhost. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || (import.meta.env.PROD ? PRODUCTION_URL : 'http://localhost:3000')
).replace(/\/$/, '')

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

interface SeoInput {
  title?: string
  description?: string
  image?: ImageAsset | null
  path?: string
  settings?: SiteSettings
  type?: 'website' | 'article' | 'profile'
  publishedAt?: string | null
  noindex?: boolean
}

/** Builds `head()` meta + links for a route. Titles get the brand appended. */
export function seo({
  title,
  description,
  image,
  path = '/',
  settings,
  type = 'website',
  publishedAt,
  noindex,
}: SeoInput) {
  const brand = settings?.brandName ?? 'Esho'
  const fullTitle = title ? `${title} | ${brand}` : (settings?.seo.title ?? brand)
  const desc = (description ?? settings?.seo.description ?? '').slice(0, 300)
  const img = image ?? settings?.seo.image ?? settings?.portrait ?? null
  const ogImage = img ? absoluteUrl(ogImageUrl(img.src)) : undefined
  const url = absoluteUrl(path)
  const xHandle = settings?.socials.x?.split('/').filter(Boolean).pop()

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: desc },
      ...(noindex
        ? [{ name: 'robots', content: 'noindex, follow' }]
        : [{ name: 'robots', content: 'index, follow, max-image-preview:large' }]),
      { name: 'author', content: settings?.ownerName },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: brand },
      { property: 'og:locale', content: 'en_GB' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: url },
      ...(publishedAt ? [{ property: 'article:published_time', content: publishedAt }] : []),
      ...(ogImage
        ? [
            { property: 'og:image', content: ogImage },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:alt', content: img?.alt ?? brand },
          ]
        : []),
      { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: desc },
      ...(ogImage ? [{ name: 'twitter:image', content: ogImage }] : []),
      ...(xHandle ? [{ name: 'twitter:creator', content: `@${xHandle}` }] : []),
    ],
    links: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', type: 'application/rss+xml', title: `${brand} writing`, href: absoluteUrl('/rss.xml') },
    ],
  }
}

/** Serialises JSON-LD for a `scripts` entry in `head()`. */
export function jsonLd(data: unknown) {
  return { type: 'application/ld+json', children: JSON.stringify(data) }
}

const personId = `${SITE_URL}/#person`
const websiteId = `${SITE_URL}/#website`

/** Person + website graph for the homepage (other pages reference the person by id). */
export function personJsonLd(settings: SiteSettings, knowsAbout: Array<string> = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: settings.ownerName,
        alternateName: settings.brandName,
        jobTitle: settings.roleTitle,
        description: settings.seo.description,
        url: SITE_URL,
        image: settings.portrait ? imageUrl(settings.portrait.src, 800) : undefined,
        email: settings.email ? `mailto:${settings.email}` : undefined,
        address: { '@type': 'PostalAddress', addressLocality: settings.location.split(',')[0]?.trim() },
        sameAs: Object.values(settings.socials).filter(Boolean),
        knowsAbout: knowsAbout.length ? knowsAbout : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: settings.brandName,
        author: { '@id': personId },
        inLanguage: 'en',
      },
    ],
  }
}

export function profilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl('/about'),
    mainEntity: { '@id': personId },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function projectJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    dateCreated: String(project.year),
    keywords: [...project.tags, ...project.stack].join(', '),
    image: project.cover.src ? imageUrl(project.cover.src, 1600) : undefined,
    creator: { '@id': personId },
  }
}

export function postJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/writing/${post.slug}`),
    datePublished: post.publishedAt ?? undefined,
    keywords: post.tags.join(', '),
    image: post.cover ? imageUrl(post.cover.src, 1600) : undefined,
    author: { '@id': personId },
    publisher: { '@id': personId },
  }
}
