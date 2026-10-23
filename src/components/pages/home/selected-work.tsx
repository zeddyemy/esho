import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { indexLabel } from '@/lib/format'
import type { ProjectSummary } from '@/types'

/**
 * Numbered project index. Every row shows its thumbnail up front; hovering
 * only changes colour, nothing moves.
 */
export default function SelectedWork({ projects, total }: { projects: Array<ProjectSummary>; total: number }) {
  if (projects.length === 0) return null

  return (
    <section id="work" className="scroll-mt-20 border-t border-line py-20 md:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl md:text-6xl">Selected work</h2>
          <Link to="/work" className="link-underline inline-flex items-center gap-1.5 text-sm text-ink">
            All projects ({total})
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <ol className="mt-12 border-t border-line md:mt-16">
          {projects.map((project, i) => (
            <li key={project.id} className="border-b border-line">
              <Link
                to="/work/$slug"
                params={{ slug: project.slug }}
                className="group grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 py-6 sm:grid-cols-[8rem_minmax(0,1fr)] md:grid-cols-12 md:items-center md:gap-x-6 md:py-7"
              >
                <span className="relative row-span-3 aspect-[4/3] self-start overflow-hidden bg-paper-2 md:col-span-2 md:row-span-1 md:self-center">
                  <MediaImage image={project.cover} fill sizes="(min-width: 768px) 14vw, 8rem" />
                </span>
                <span className="text-meta text-mute md:order-first md:col-span-1">{indexLabel(i)}</span>
                <span className="font-display text-2xl leading-tight transition-colors group-hover:text-cobalt md:col-span-3 md:text-3xl">
                  {project.title}
                </span>
                <span className="text-sm text-mute md:col-span-4 md:text-base">{project.summary}</span>
                <span className="text-meta hidden flex-col items-end gap-1 text-right text-mute md:col-span-2 md:flex">
                  <span>{project.year}</span>
                  <span>{project.tags.slice(0, 2).join(' / ')}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
