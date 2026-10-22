import type { ImageAsset } from '@/types'

/** Widths we generate for responsive images. Capped at 2400 to protect bandwidth. */
export const IMAGE_WIDTHS = [320, 480, 640, 828, 1080, 1440, 1920, 2400] as const

const CLOUDINARY_UPLOAD = '/image/upload/'

/**
 * Returns a resized URL for any supported image host.
 * - Cloudinary: injects `f_auto,q_auto,c_limit,w_{width}` transforms.
 * - Unsplash: uses imgix params (`w`, `q`, `auto=format`).
 * - Anything else is returned untouched.
 */
export function imageUrl(src: string, width: number, quality = 75): string {
  if (src.includes('res.cloudinary.com') && src.includes(CLOUDINARY_UPLOAD)) {
    const [base, rest] = src.split(CLOUDINARY_UPLOAD)
    return `${base}${CLOUDINARY_UPLOAD}f_auto,q_auto,c_limit,w_${width}/${rest}`
  }
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', String(quality))
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'max')
    return url.toString()
  }
  return src
}

export function isResizable(src: string) {
  return (
    src.includes('images.unsplash.com') ||
    (src.includes('res.cloudinary.com') && src.includes(CLOUDINARY_UPLOAD))
  )
}

/** Builds a srcset limited to the image's intrinsic width (no upscaling). */
export function imageSrcSet(image: ImageAsset, maxWidth = 2400): string {
  const limit = Math.min(image.width || maxWidth, maxWidth)
  const widths = IMAGE_WIDTHS.filter((w) => w <= limit)
  if (widths.length === 0) widths.push(IMAGE_WIDTHS[0])
  return widths.map((w) => `${imageUrl(image.src, w)} ${w}w`).join(', ')
}

/** 1200x630 social-preview crop (Open Graph / WhatsApp / X cards). */
export function ogImageUrl(src: string): string {
  if (src.includes('res.cloudinary.com') && src.includes(CLOUDINARY_UPLOAD)) {
    const [base, rest] = src.split(CLOUDINARY_UPLOAD)
    return `${base}${CLOUDINARY_UPLOAD}f_jpg,q_auto,c_fill,g_auto,w_1200,h_630/${rest}`
  }
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    for (const [k, v] of Object.entries({ w: '1200', h: '630', fit: 'crop', crop: 'faces,entropy', fm: 'jpg', q: '80' })) {
      url.searchParams.set(k, v)
    }
    return url.toString()
  }
  return src
}

/** A tiny, heavily blurred version of the image used as a placeholder. */
export function imagePlaceholder(src: string): string {
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    url.searchParams.set('w', '24')
    url.searchParams.set('q', '30')
    url.searchParams.set('blur', '40')
    url.searchParams.set('auto', 'format')
    return url.toString()
  }
  if (src.includes('res.cloudinary.com') && src.includes(CLOUDINARY_UPLOAD)) {
    const [base, rest] = src.split(CLOUDINARY_UPLOAD)
    return `${base}${CLOUDINARY_UPLOAD}f_auto,q_30,w_24,e_blur:1000/${rest}`
  }
  return src
}

/* ---------- Video ---------- */

export type VideoSource =
  | { provider: 'youtube'; id: string }
  | { provider: 'vimeo'; id: string }

export function parseVideoUrl(url: string): VideoSource | null {
  try {
    const u = new URL(url.trim())
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0]
      return id ? { provider: 'youtube', id } : null
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v')
      if (v) return { provider: 'youtube', id: v }
      const match = u.pathname.match(/\/(embed|shorts|live)\/([\w-]+)/)
      return match ? { provider: 'youtube', id: match[2] } : null
    }
    if (host.endsWith('vimeo.com')) {
      const match = u.pathname.match(/(\d{6,})/)
      return match ? { provider: 'vimeo', id: match[1] } : null
    }
  } catch {
    return null
  }
  return null
}

export function videoEmbedUrl(source: VideoSource): string {
  if (source.provider === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
  }
  return `https://player.vimeo.com/video/${source.id}?autoplay=1&dnt=1`
}

export function videoThumbnail(source: VideoSource): string | null {
  if (source.provider === 'youtube') {
    return `https://i.ytimg.com/vi/${source.id}/maxresdefault.jpg`
  }
  return null
}
