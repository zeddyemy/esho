import { useState } from 'react'

import { imagePlaceholder, imageSrcSet, imageUrl, isResizable } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { ImageAsset } from '@/types'

interface MediaImageProps {
  image: ImageAsset
  /** `sizes` attribute, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes?: string
  /** Fill the nearest positioned parent (object-cover) instead of intrinsic sizing. */
  fill?: boolean
  /** Above-the-fold LCP image: eager load + high fetch priority. */
  priority?: boolean
  className?: string
  imgClassName?: string
  maxWidth?: number
}

/**
 * Responsive image for Cloudinary/Unsplash sources: srcset, explicit
 * dimensions (no layout shift) and a blurred placeholder until it loads.
 */
export function MediaImage({
  image,
  sizes = '100vw',
  fill = false,
  priority = false,
  className,
  imgClassName,
  maxWidth,
}: MediaImageProps) {
  const [loaded, setLoaded] = useState(false)
  const resizable = isResizable(image.src)
  const fallbackWidth = Math.min(image.width || 1080, 1080)

  return (
    <div
      className={cn('relative overflow-hidden bg-paper-2', fill && 'absolute inset-0', className)}
      style={{
        aspectRatio: fill ? undefined : `${image.width} / ${image.height}`,
        backgroundColor: image.color ?? undefined,
      }}
    >
      {resizable && !loaded ? (
        <img
          src={imagePlaceholder(image.src)}
          alt=""
          aria-hidden
          // Lazy so React does not emit a <link rel="preload"> for every placeholder.
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="absolute inset-0 size-full scale-110 object-cover blur-xl"
        />
      ) : null}
      <img
        src={resizable ? imageUrl(image.src, fallbackWidth) : image.src}
        srcSet={resizable ? imageSrcSet(image, maxWidth) : undefined}
        sizes={resizable ? sizes : undefined}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          // Cached images can finish before hydration attaches onLoad.
          if (el?.complete && el.naturalWidth > 0) setLoaded(true)
        }}
        // Always visible: hiding it until hydration delayed LCP by ~1 s. The blur
        // placeholder underneath shows until the photo paints over it.
        className={cn('relative size-full object-cover duration-700', imgClassName)}
      />
    </div>
  )
}
