import { Link } from '@tanstack/react-router'

import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import { cn } from '@/lib/utils'
import type { ProjectSummary } from '@/types'

/**
 * Two-column grid with a wide feature every third item, so the rhythm reads
 * wide, pair, wide, pair. Single column on mobile.
 */
export default function ProjectGrid({ projects }: { projects: Array<ProjectSummary> }) {
  if (projects.length === 0) {
    return (
      <p className="container-site py-24 text-mute">
        No projects with this tag yet.{' '}
        <Link to="/work" search={{}} className="link-static text-ink">
          Show all work
        </Link>
      </p>
    )
  }

  return (
    <div className="container-site grid gap-x-8 gap-y-16 pb-24 md:grid-cols-2 md:gap-y-20 md:pb-32">
      {projects.map((project, i) => {
        const wide = i % 3 === 0
        return (
          <Reveal key={project.id} delay={wide ? 0 : (i % 3) * 0.06} className={cn(wide && 'md:col-span-2')}>
            <Link to="/work/$slug" params={{ slug: project.slug }} className="group block">
              <div className={cn('relative overflow-hidden', wide ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[4/3]')}>
                <MediaImage
                  image={project.cover}
                  fill
                  sizes={wide ? '(min-width: 1360px) 1280px, 100vw' : '(min-width: 768px) 50vw, 100vw'}
                  imgClassName="group-hover:scale-[1.03]"
                />
              </div>
              <div className={cn('mt-6 grid gap-3', wide && 'md:grid-cols-12 md:gap-8')}>
                <div className={cn(wide && 'md:col-span-5')}>
                  <p className="text-meta text-mute">
                    {project.year} / {project.role}
                  </p>
                  <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.02em] transition-colors group-hover:text-cobalt md:text-4xl">
                    {project.title}
                  </h2>
                </div>
                <div className={cn(wide && 'md:col-span-6 md:col-start-7 md:pt-6')}>
                  <p className="max-w-xl text-mute">{project.summary}</p>
                  <p className="text-meta mt-4 text-ink-2">{project.stack.slice(0, 4).join(' / ')}</p>
                </div>
              </div>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
