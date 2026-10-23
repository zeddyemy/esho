import { imageUrl, ogImageUrl } from '@/lib/media'
import type { Experience, ImageAsset, Post, PostSummary, Project, ProjectSummary, SiteSettings } from '@/types'

/**
 * Last-resort production origin, used only when the build had no usable site
 * URL (see siteUrlFor in vite.config.ts). Update once a custom domain is live.
 */
const PRODUCTION_URL = 'https://esho-omega.vercel.app'

const configured = (import.meta.env.VITE_SITE_URL as string | undefined) ?? ''

/** Canonical origin. Never localhost in a production build. */
export const SITE_URL = (
  import.meta.env.PROD ? (configured && !/localhost|127\.0\.0\.1/.test(configured) ? configured : PRODUCTION_URL) : configured || 'http://localhost:3100'
).replace(/\/$/, '')

/** True on preview deployments: every page gets noindex so they never compete with production. */
export const NOINDEX = import.meta.env.VITE_NOINDEX === 'true'

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

interface SeoInput {
  title?: string
  description?: string
  /** Explicit share image; otherwise the generated card at `ogPath` is used. */
  image?: ImageAsset | null
  /** Path of the generated share card, e.g. `/og/work/my-project`. */
  ogPath?: string
  path?: string
  settings?: SiteSettings
  type?: 'website' | 'article' | 'profile'
  publishedAt?: string | null
  modifiedAt?: string | null
  tags?: Array<string>
  noindex?: boolean
}

/** Builds `head()` meta + links for a route. Inner pages are titled "{title} | {owner name}". */
export function seo({
  title,
  description,
  image,
  ogPath = '/og',
  path = '/',
  settings,
  type = 'website',
  publishedAt,
  modifiedAt,
  tags = [],
  noindex,
}: SeoInput) {
  const owner = settings?.ownerName ?? 'Emmanuel Olowu'
  const fullTitle = title ? `${title} | ${owner}` : (settings?.seo.title ?? owner)
  const desc = (description ?? settings?.seo.description ?? '').replace(/\s+/g, ' ').trim().slice(0, 300)
  const ogImage = image ? absoluteUrl(ogImageUrl(image.src)) : absoluteUrl(ogPath)
  const ogAlt = image?.alt || fullTitle
  const url = absoluteUrl(path)
  const xHandle = settings?.socials.x?.split('/').filter(Boolean).pop()
  const hidden = noindex || NOINDEX

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: desc },
      {
        name: 'robots',
        content: hidden ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'author', content: owner },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: settings?.brandName ?? 'Esho' },
      { property: 'og:locale', content: 'en_GB' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: url },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: ogAlt },
      ...(type === 'profile' && settings
        ? [
            { property: 'profile:first_name', content: owner.split(' ')[0] },
            { property: 'profile:last_name', content: owner.split(' ').slice(1).join(' ') },
          ]
        : []),
      ...(publishedAt ? [{ property: 'article:published_time', content: publishedAt }] : []),
      ...(modifiedAt ? [{ property: 'article:modified_time', content: modifiedAt }] : []),
      ...(type === 'article' ? [{ property: 'article:author', content: absoluteUrl('/about') }] : []),
      ...tags.map((tag) => ({ property: 'article:tag', content: tag })),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: ogImage },
      { name: 'twitter:image:alt', content: ogAlt },
      ...(xHandle ? [{ name: 'twitter:creator', content: `@${xHandle}` }] : []),
    ],
    links: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', type: 'application/rss+xml', title: `${settings?.brandName ?? 'Esho'} writing`, href: absoluteUrl('/rss.xml') },
    ],
  }
}

/** Serialises JSON-LD for a `scripts` entry in `head()`. */
export function jsonLd(data: unknown) {
  return { type: 'application/ld+json', children: JSON.stringify(data) }
}

export const personId = `${SITE_URL}/#person`
const websiteId = `${SITE_URL}/#website`

function personNode(settings: SiteSettings, opts: { skills?: Array<string>; education?: Array<Experience> } = {}) {
  const sameAs = Object.values(settings.socials).filter(Boolean)
  return {
    '@type': 'Person',
    '@id': personId,
    name: settings.ownerName,
    alternateName: settings.brandName,
    jobTitle: settings.roleTitle,
    description: settings.seo.description,
    url: SITE_URL,
    mainEntityOfPage: absoluteUrl('/about'),
    image: settings.portrait
      ? { '@type': 'ImageObject', url: imageUrl(settings.portrait.src, 800), caption: settings.ownerName }
      : undefined,
    email: settings.email ? `mailto:${settings.email}` : undefined,
    address: settings.location
      ? { '@type': 'PostalAddress', addressLocality: settings.location.split(',')[0]?.trim(), addressCountry: settings.location.split(',').at(-1)?.trim() }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: opts.skills?.length ? opts.skills : undefined,
    hasOccupation: { '@type': 'Occupation', name: settings.roleTitle, occupationLocation: { '@type': 'City', name: settings.location.split(',')[0]?.trim() } },
    alumniOf: opts.education?.length
      ? opts.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.organisation, url: e.url || undefined }))
      : undefined,
  }
}

/** Homepage graph: the person and the website, linked by id. */
export function personJsonLd(settings: SiteSettings, opts: { skills?: Array<string>; education?: Array<Experience> } = {}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(settings, opts),
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: settings.brandName,
        alternateName: settings.ownerName,
        description: settings.seo.description,
        author: { '@id': personId },
        publisher: { '@id': personId },
        inLanguage: 'en',
      },
    ],
  }
}

/** About page: Google's profile-page markup, with the full person inline. */
export function profilePageJsonLd(settings: SiteSettings, opts: { skills?: Array<string>; education?: Array<Experience> } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl('/about'),
    name: `About ${settings.ownerName}`,
    isPartOf: { '@id': websiteId },
    mainEntity: personNode(settings, opts),
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

/** Work index: a collection page listing every published project. */
export function workCollectionJsonLd(projects: Array<ProjectSummary>, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: absoluteUrl('/work'),
    name: 'Work',
    description,
    isPartOf: { '@id': websiteId },
    author: { '@id': personId },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/work/${p.slug}`),
        name: p.title,
      })),
    },
  }
}

/** Writing index: a Blog with its posts. */
export function blogJsonLd(posts: Array<PostSummary>, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: absoluteUrl('/writing'),
    name: 'Writing',
    description,
    author: { '@id': personId },
    publisher: { '@id': personId },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(`/writing/${p.slug}`),
      datePublished: p.publishedAt ?? undefined,
      dateModified: p.updatedAt,
    })),
  }
}

export function projectJsonLd(project: Project, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': absoluteUrl(`/work/${project.slug}#work`),
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    dateCreated: String(project.year),
    dateModified: project.updatedAt,
    keywords: [...project.tags, ...project.stack].join(', '),
    about: project.tags,
    image: project.cover.src ? imageUrl(project.cover.src, 1600) : absoluteUrl(`/og/work/${project.slug}`),
    creator: { '@type': 'Person', '@id': personId, name: settings.ownerName, url: SITE_URL },
    sameAs: project.links.map((l) => l.url),
  }
}

export function postJsonLd(post: Post, settings: SiteSettings) {
  const words = post.body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/writing/${post.slug}`),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/writing/${post.slug}`) },
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    wordCount: words,
    timeRequired: `PT${post.readingMinutes}M`,
    inLanguage: 'en',
    keywords: post.tags.join(', '),
    image: [post.cover ? imageUrl(post.cover.src, 1600) : undefined, absoluteUrl(`/og/writing/${post.slug}`)].filter(Boolean),
    author: { '@type': 'Person', '@id': personId, name: settings.ownerName, url: SITE_URL },
    publisher: { '@type': 'Person', '@id': personId, name: settings.ownerName },
  }
}
