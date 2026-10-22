import { Link } from '@tanstack/react-router'
import { ArrowDownRight, ArrowRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import { RevealWords } from '@/components/ui/custom/reveal'
import type { HeroContent, SiteSettings } from '@/types'

/**
 * Asymmetric split hero: statement and actions on the left, portrait on the
 * right. Entrance motion is CSS-only so it plays from first paint.
 */
export default function Hero({ content, settings }: { content: HeroContent; settings: SiteSettings }) {
  return (
    <section className="container-site grid gap-10 pt-10 pb-16 md:pt-16 lg:grid-cols-12 lg:gap-12 lg:pt-20 lg:pb-24">
      <div className="flex flex-col justify-end lg:col-span-8">
        {settings.availability ? (
          <p className="animate-fade-up flex items-center gap-2.5 text-sm text-mute">
            {settings.openToWork ? (
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cobalt opacity-40 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-cobalt" />
              </span>
            ) : null}
            {settings.availability}
          </p>
        ) : null}

        <h1 className="mt-6 font-display text-[clamp(2.75rem,5.4vw,5rem)] leading-[1.04] tracking-[-0.035em]">
          <RevealWords text={content.headline} delay={0.05} />
        </h1>

        <p
          className="animate-fade-up mt-8 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl"
          style={{ animationDelay: '0.35s' }}
        >
          {content.subheadline}
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.5s' }}>
          <Button asChild size="lg" className="group">
            <Link to="/contact">
              {content.primaryCta}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="group">
            <a href="#work">
              {content.secondaryCta}
              <ArrowDownRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          </Button>
        </div>
      </div>

      {settings.portrait ? (
        <figure className="lg:col-span-4">
          <div
            className="animate-fade-up relative aspect-[4/5] max-h-[68dvh] w-full max-lg:max-w-sm"
            style={{ animationDelay: '0.15s' }}
          >
            <MediaImage
              image={settings.portrait}
              fill
              priority
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 90vw"
              imgClassName="object-[50%_30%]"
            />
          </div>
          <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm">
            <span className="text-ink">{settings.ownerName}</span>
            <span className="text-meta text-mute">{settings.roleTitle}</span>
          </figcaption>
        </figure>
      ) : null}
    </section>
  )
}
