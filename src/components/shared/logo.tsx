import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types'

/** Wordmark (brand name in the display serif) with the owner's name beneath. Uses the uploaded logo if there is one. */
export function Logo({
  settings,
  className,
}: {
  settings: Pick<SiteSettings, 'brandName' | 'ownerName' | 'logo'>
  className?: string
}) {
  return (
    <Link
      to="/"
      aria-label={`${settings.brandName}, ${settings.ownerName}. Home`}
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      {settings.logo ? (
        <img
          src={settings.logo.src}
          alt=""
          width={settings.logo.width}
          height={settings.logo.height}
          className="h-8 w-auto"
        />
      ) : null}
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.6rem] leading-[0.9] tracking-[-0.03em] transition-colors group-hover:text-cobalt">
          {settings.brandName}
        </span>
        <span className="text-meta mt-1 text-[0.6875rem] text-mute">{settings.ownerName}</span>
      </span>
    </Link>
  )
}
