import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import { indexLabel } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ProjectSummary } from '@/types'

/**
 * Big project cards. The first project spans the full width; the rest pair
 * up. Hovering a card floods its caption bar with the accent colour.
 */
export default function SelectedWork({ projects, total }: { projects: Array<ProjectSummary>; total: number }) {
  if (projects.length === 0) return null
  return (
    <section id="work" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-5xl uppercase md:text-7xl">Selected work</h2>
          <Link to="/work" className="link-underline group inline-flex items-center gap-1.5 font-medium">
            All projects ({total})
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          {projects.map((project, i) => {
            const wide = i === 0 || (projects.length % 2 === 0 && i === projects.length - 1)
            return (
              <Reveal key={project.id} delay={(i % 2) * 0.06} className={cn(wide && 'md:col-span-2')}>
                <Link to="/work/$slug" params={{ slug: project.slug }} className="group block border border-ink">
                  <div className={cn('relative overflow-hidden', wide ? 'aspect-[16/10] md:aspect-[2.2/1]' : 'aspect-[4/3]')}>
                    <MediaImage
                      image={project.cover}
                      fill
                      sizes={wide ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                      imgClassName="group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-6 border-t border-ink p-5 transition-colors group-hover:bg-cobalt group-hover:text-cobalt-ink md:p-6">
                    <div className="min-w-0">
                      <p className="text-meta opacity-70">
                        {indexLabel(i)} / {project.year} / {project.tags.join(', ')}
                      </p>
                      <h3 className="mt-2 font-display text-3xl leading-none uppercase md:text-5xl">{project.title}</h3>
                      <p className="mt-3 max-w-xl opacity-80">{project.summary}</p>
                    </div>
                    <ArrowUpRight className="size-8 shrink-0" strokeWidth={1.5} />
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
