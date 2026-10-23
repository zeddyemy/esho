import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import type { ProjectSummary } from '@/types'

export default function NextProject({ project }: { project: ProjectSummary }) {
  return (
    <section className="border-t border-line">
      <Link to="/work/$slug" params={{ slug: project.slug }} className="group container-site grid items-center gap-8 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="text-sm text-mute">Next project</p>
          <h2 className="mt-3 flex items-center gap-4 font-display text-5xl leading-none tracking-[-0.035em] transition-colors group-hover:text-cobalt md:text-7xl">
            {project.title}
            <ArrowRight className="size-8 shrink-0 md:size-12" strokeWidth={1.25} />
          </h2>
          <p className="mt-4 max-w-lg text-mute">{project.summary}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden md:col-span-4 md:col-start-9">
          <MediaImage image={project.cover} fill sizes="(min-width: 768px) 30vw, 100vw" imgClassName="group-hover:scale-[1.04]" />
        </div>
      </Link>
    </section>
  )
}
