import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { Reveal } from '@/components/ui/custom/reveal'
import { formatYearRange } from '@/lib/format'
import type { Experience as ExperienceItem } from '@/types'

/** Sticky heading on the left, recent roles on the right. Full history lives on /about. */
export default function Experience({ items }: { items: Array<ExperienceItem> }) {
  const roles = items.filter((e) => e.kind === 'work').slice(0, 3)
  if (roles.length === 0) return null

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-site grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <h2 className="font-display text-4xl tracking-[-0.025em] md:text-5xl">Experience</h2>
            <Link to="/about" hash="experience" className="link-underline group mt-6 inline-flex items-center gap-1.5 text-sm">
              Full background
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <ol className="md:col-span-8">
          {roles.map((role, i) => (
            <li key={role.id} className="border-t border-line py-8 first:border-t-0 first:pt-0 md:py-10">
              <Reveal delay={i * 0.06} y={16} className="grid gap-4 sm:grid-cols-8">
                <p className="text-meta pt-1.5 text-mute sm:col-span-2">{formatYearRange(role.startDate, role.endDate)}</p>
                <div className="sm:col-span-6">
                  <h3 className="text-xl font-medium">{role.title}</h3>
                  <p className="mt-1 text-mute">
                    {role.organisation}
                    {role.location ? `, ${role.location}` : ''}
                  </p>
                  <p className="mt-4 max-w-xl leading-relaxed text-ink-2">{role.summary}</p>
                  {role.stack.length ? (
                    <p className="text-meta mt-5 text-mute">{role.stack.join(' / ')}</p>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
