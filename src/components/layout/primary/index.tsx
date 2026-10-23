import { preload } from 'react-dom'
import { LazyMotion } from 'motion/react'

import Footer from './footer'
import Header from './header'
import PageBody from './body'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { MotionLevelProvider } from '@/components/ui/custom/motion-level'
import { SmoothScroll } from '@/components/ui/custom/smooth-scroll'
import { typeVars } from '@/lib/appearance'
import { FONT_FILES } from '@/lib/fonts'
import type { SiteSettings } from '@/types'

const loadMotionFeatures = () => import('@/lib/motion-features').then((mod) => mod.default)

export default function PrimaryLayout({
  settings,
  children,
}: {
  settings: SiteSettings
  children: React.ReactNode
}) {
  const { appearance } = settings
  // Preload only the fonts this site actually uses (emitted into <head> during SSR).
  for (const font of new Set([appearance.headingFont, appearance.bodyFont])) {
    preload(FONT_FILES[font], { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  }

  return (
    // Lightweight `m` components render immediately; animation features load after.
    <LazyMotion features={loadMotionFeatures}>
      <MotionLevelProvider value={appearance.motion}>
        {/* Appearance type settings as CSS variables. Bold Studio keeps its own signal-orange
            accent, so the accent setting is not applied on this branch. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { ${Object.entries(typeVars(appearance))
              .map(([k, v]) => `${k}: ${v};`)
              .join(' ')} }`,
          }}
        />
        <div data-motion={appearance.motion}>
          <a
            href="#main"
            className="fixed top-2 left-2 z-[100] -translate-y-20 bg-ink px-4 py-2 text-sm text-paper focus:translate-y-0"
          >
            Skip to content
          </a>
          {appearance.motion === 'full' ? <SmoothScroll /> : null}
          <Header settings={settings} />
          <PageBody>{children}</PageBody>
          <Footer settings={settings} />
          <WhatsAppButton phone={settings.whatsapp} name={settings.ownerName} />
        </div>
      </MotionLevelProvider>
    </LazyMotion>
  )
}
