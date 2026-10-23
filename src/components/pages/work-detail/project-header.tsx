import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { RevealWords } from '@/components/ui/custom/reveal'
import type { Project } from '@/types'

export default function ProjectHeader({ project }: { project: Project }) {
  const facts = [
    { label: 'Role', value: project.role },
    { label: 'Client', value: project.client },
    { label: 'Year', value: String(project.year) },
    { label: 'Focus', value: project.tags.join(', ') },
  ].filter((f) => f.value)

  return (
    <header>
      <div className="container-site pt-10 md:pt-14">
        <Link to="/work" className="group inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink">
          <ArrowLeft className="size-4" />
          All work
        </Link>

        <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[1] tracking-[-0.04em]">
          <RevealWords text={project.title} />
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-3xl font-display text-2xl leading-snug tracking-[-0.01em] text-ink-2 md:text-3xl"
          style={{ animationDelay: '0.2s' }}
        >
          {project.summary}
        </p>

        <dl className="animate-fade-up mt-12 grid grid-cols-2 gap-px border-y border-line bg-line md:grid-cols-4" style={{ animationDelay: '0.3s' }}>
          {facts.map((fact) => (
            <div key={fact.label} className="bg-paper py-5 pr-4 md:py-6">
              <dt className="text-sm text-mute">{fact.label}</dt>
              <dd className="mt-1">{fact.value}</dd>
            </div>
          ))}
        </dl>

        {project.links.length ? (
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {project.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer" className="link-underline group inline-flex items-center gap-1">
                  {link.label}
                  <ArrowUpRight className="size-4 text-mute" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {project.cover.src ? (
        <div className="container-site mt-12 md:mt-16">
          <div className="animate-clip-reveal relative aspect-[16/10] md:aspect-[2/1]" style={{ animationDelay: '0.2s' }}>
            <MediaImage image={project.cover} fill priority sizes="(min-width: 1360px) 1280px, 100vw" />
          </div>
        </div>
      ) : null}
    </header>
  )
}
