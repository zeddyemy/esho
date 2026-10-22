import { ArrowUpRight } from 'lucide-react'

import { Reveal } from '@/components/ui/custom/reveal'
import { formatMonthYear } from '@/lib/format'
import type { Experience } from '@/types'

function period(item: Experience) {
  return `${formatMonthYear(item.startDate)} - ${item.endDate ? formatMonthYear(item.endDate) : 'Present'}`
}

/** Work history as a full timeline, education as a compact list beneath. */
export default function Timeline({ items }: { items: Array<Experience> }) {
  const work = items.filter((e) => e.kind === 'work')
  const education = items.filter((e) => e.kind === 'education')
  if (items.length === 0) return null

  return (
    <section id="experience" className="scroll-mt-20 border-t border-line py-20 md:py-28">
      <div className="container-site">
        <h2 className="font-display text-4xl tracking-[-0.025em] md:text-6xl">Experience</h2>

        <ol className="mt-12 md:mt-16">
          {work.map((role, i) => (
            <li key={role.id} className="border-t border-line py-10">
              <Reveal delay={0.04 * i} y={16} className="grid gap-6 md:grid-cols-12">
                <p className="text-meta text-mute md:col-span-3 md:pt-1.5">{period(role)}</p>
                <div className="md:col-span-4">
                  <h3 className="text-xl font-medium">{role.title}</h3>
                  <p className="mt-1 text-mute">
                    {role.url ? (
                      <a href={role.url} target="_blank" rel="noreferrer" className="link-static">
                        {role.organisation}
                      </a>
                    ) : (
                      role.organisation
                    )}
                    {role.location ? `, ${role.location}` : ''}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <p className="leading-relaxed text-ink-2">{role.summary}</p>
                  {role.highlights.length ? (
                    <ul className="prose-editorial mt-4 text-base">
                      {role.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                  {role.stack.length ? <p className="text-meta mt-5 text-mute">{role.stack.join(' / ')}</p> : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {education.length ? (
          <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-12">
            <h3 className="font-display text-3xl tracking-[-0.02em] md:col-span-3">Education</h3>
            <ul className="grid gap-px bg-line md:col-span-9 md:grid-cols-2">
              {education.map((edu) => (
                <li key={edu.id} className="bg-paper py-6 md:pr-8 md:even:pl-8">
                  <p className="text-meta text-mute">{period(edu)}</p>
                  <p className="mt-3 text-lg font-medium">{edu.title}</p>
                  <p className="mt-1 text-mute">
                    {edu.url ? (
                      <a href={edu.url} target="_blank" rel="noreferrer" className="link-static inline-flex items-center gap-1">
                        {edu.organisation}
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    ) : (
                      edu.organisation
                    )}
                  </p>
                  {edu.summary ? <p className="mt-3 text-sm leading-relaxed text-mute">{edu.summary}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
