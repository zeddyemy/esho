import { Link } from '@tanstack/react-router'
import { ArrowDownRight, ArrowRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import { RevealWords } from '@/components/ui/custom/reveal'
import type { HeroContent, SiteSettings } from '@/types'

/**
 * Bold studio hero: a full-bleed accent block with poster type across the
 * whole width, then the pitch, actions and portrait in a row beneath.
 */
export default function Hero({ content, settings }: { content: HeroContent; settings: SiteSettings }) {
  return (
    <section className="bg-cobalt text-cobalt-ink">
      <div className="container-site pt-10 pb-12 md:pt-14 lg:pb-16">
        {settings.availability ? (
          <p className="animate-fade-up flex items-center gap-2.5 text-sm font-medium">
            {settings.openToWork ? <span className="inline-flex size-2 bg-cobalt-ink" aria-hidden /> : null}
            {settings.availability}
          </p>
        ) : null}

        <h1 className="font-poster mt-6 text-[clamp(2rem,8.4vw,5.75rem)] leading-[0.9]">
          <RevealWords text={content.headline} stagger={0.05} />
        </h1>

        <div className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="animate-fade-up max-w-xl text-lg leading-relaxed md:text-xl" style={{ animationDelay: '0.35s' }}>
              {content.subheadline}
            </p>
            <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '0.5s' }}>
              <Button asChild size="lg" className="group bg-cobalt-ink text-cobalt hover:bg-paper hover:text-ink">
                <Link to="/contact">
                  {content.primaryCta}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group border-cobalt-ink/40 text-cobalt-ink hover:border-cobalt-ink hover:bg-cobalt-ink/5">
                <a href="#work">
                  {content.secondaryCta}
                  <ArrowDownRight />
                </a>
              </Button>
            </div>
          </div>

          {settings.portrait ? (
            <figure className="flex items-end gap-4 lg:col-span-5 lg:col-start-8 lg:justify-end">
              <figcaption className="pb-1 text-sm lg:text-right">
                <span className="block font-semibold">{settings.ownerName}</span>
                <span className="block opacity-80">{settings.roleTitle}</span>
              </figcaption>
              <div className="animate-fade-up relative aspect-[4/5] w-40 shrink-0 md:w-52" style={{ animationDelay: '0.2s' }}>
                <MediaImage image={settings.portrait} fill priority sizes="208px" imgClassName="object-[50%_30%] grayscale" />
              </div>
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  )
}
