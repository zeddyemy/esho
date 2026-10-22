import { LazyMotion } from 'motion/react'

import Footer from './footer'
import Header from './header'
import PageBody from './body'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { SmoothScroll } from '@/components/ui/custom/smooth-scroll'
import type { SiteSettings } from '@/types'

const loadMotionFeatures = () => import('@/lib/motion-features').then((mod) => mod.default)

export default function PrimaryLayout({
  settings,
  children,
}: {
  settings: SiteSettings
  children: React.ReactNode
}) {
  return (
    // Lightweight `m` components render immediately; animation features load after.
    <LazyMotion features={loadMotionFeatures}>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[100] -translate-y-20 bg-ink px-4 py-2 text-sm text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Header settings={settings} />
      <PageBody>{children}</PageBody>
      <Footer settings={settings} />
      <WhatsAppButton phone={settings.whatsapp} name={settings.ownerName} />
    </LazyMotion>
  )
}
