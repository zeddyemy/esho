import { Link } from '@tanstack/react-router'
import { ArrowDownToLine, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CONTACT_CTA } from '@/constants/navigation'
import type { SiteSettings } from '@/types'

/** Closing row: résumé download (when uploaded and enabled) and the contact CTA. */
export default function ResumeCta({ settings }: { settings: SiteSettings }) {
  const resume = settings.showResume ? settings.resume : null
  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-site flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-[-0.025em] md:text-5xl">
          {resume ? 'Prefer the one-page version?' : 'Want to work together?'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {resume ? (
            <Button asChild size="lg" variant="outline">
              <a href="/resume" target="_blank" rel="noreferrer">
                <ArrowDownToLine />
                Download résumé
              </a>
            </Button>
          ) : null}
          <Button asChild size="lg" className="group">
            <Link to="/contact">
              {CONTACT_CTA}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
