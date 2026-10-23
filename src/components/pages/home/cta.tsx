import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/custom/reveal'
import { CONTACT_CTA } from '@/constants/navigation'
import type { CtaContent } from '@/types'

export default function Cta({ content, email }: { content: CtaContent; email: string }) {
  return (
    <section className="border-t border-line py-24 md:py-36">
      <div className="container-site">
        <Reveal>
          <h2 className="max-w-5xl font-display text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[1.02] tracking-[-0.035em]">
            {content.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg text-mute">{content.body}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button asChild size="lg" variant="accent" className="group">
              <Link to="/contact">
                {CONTACT_CTA}
                <ArrowRight />
              </Link>
            </Button>
            <a href={`mailto:${email}`} className="link-static text-ink">
              {email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
