import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'

import { BrandMark } from '@/components/shared/admin/brand-mark'
import { MediaImage } from '@/components/shared/media-image'
import { settingsQuery } from '@/hooks/api/site'
import { img } from '@/lib/seed/images'

/** Split layout for admin sign-in screens: form on the left, an image on the right. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: settings } = useQuery(settingsQuery())
  const brand = settings?.brandName ?? 'Esho'
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-5 py-8 md:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark brand={brand} />
            <span className="font-display text-lg">{brand}</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
            <ArrowLeft className="size-4" /> Website
          </Link>
        </div>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">{children}</main>
        <p className="text-xs text-mute">Admin area for {settings?.ownerName ?? brand}.</p>
      </div>
      <div className="relative hidden lg:block">
        <MediaImage image={img.deskSetup} fill priority sizes="55vw" />
      </div>
    </div>
  )
}
