import type { ImageAsset } from '@/types'

/** Pages with their own search and sharing override. The homepage uses the top-level SEO fields. */
export const SEO_PAGES = [
  { key: 'about', label: 'About', path: '/about' },
  { key: 'work', label: 'Work', path: '/work' },
  { key: 'writing', label: 'Writing', path: '/writing' },
  { key: 'contact', label: 'Contact', path: '/contact' },
] as const

export type SeoPageKey = (typeof SEO_PAGES)[number]['key']

export interface SeoPageOverride {
  title: string
  description: string
  image: ImageAsset | null
}

/** True for an absolute http(s) link, whatever the scheme's case. Shared by the save schema and the reader. */
export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const strList = (v: unknown, max: number, len: number) =>
  Array.isArray(v) ? [...new Set(v.map((x) => str(x, len)).filter(Boolean))].slice(0, max) : []
const imageOrNull = (v: unknown): ImageAsset | null => {
  const img = v as Partial<ImageAsset> | null
  return img && typeof img === 'object' && typeof img.src === 'string' && img.src ? (img as ImageAsset) : null
}

/**
 * Reads the stored `seo` JSON, filling anything missing. Rows saved before the
 * SEO page existed only have title, description, image and verification codes.
 */
export function normalizeSeo(raw: unknown) {
  const seo = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const pagesRaw = (seo.pages && typeof seo.pages === 'object' ? seo.pages : {}) as Record<string, unknown>
  const pages = Object.fromEntries(
    SEO_PAGES.map(({ key }) => {
      const p = (pagesRaw[key] && typeof pagesRaw[key] === 'object' ? pagesRaw[key] : {}) as Record<string, unknown>
      return [key, { title: str(p.title, 70), description: str(p.description, 170), image: imageOrNull(p.image) }]
    }),
  ) as Record<SeoPageKey, SeoPageOverride>

  return {
    title: str(seo.title, 70),
    description: str(seo.description, 170),
    image: imageOrNull(seo.image),
    keywords: strList(seo.keywords, 20, 40),
    alternateNames: strList(seo.alternateNames, 6, 60),
    profiles: strList(seo.profiles, 10, 300).filter(isHttpUrl),
    googleVerification: str(seo.googleVerification, 120),
    bingVerification: str(seo.bingVerification, 120),
    pages,
  }
}

export type SeoSettings = ReturnType<typeof normalizeSeo>
