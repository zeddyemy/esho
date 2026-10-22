import { Reveal } from '@/components/ui/custom/reveal'
import type { StackGroup } from '@/types'

/** Tools grouped by discipline. Chips, not progress bars. */
export default function Stack({ groups }: { groups: Array<StackGroup> }) {
  if (groups.length === 0) return null
  return (
    <section className="border-t border-line bg-paper-2 py-20 md:py-28">
      <div className="container-site">
        <h2 className="max-w-2xl font-display text-4xl tracking-[-0.025em] md:text-6xl">Tools I reach for</h2>
        <p className="mt-4 max-w-xl text-mute">Chosen per project. These are the ones I know deeply enough to ship with.</p>
        <div className="mt-12 grid gap-x-10 gap-y-12 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => (
            <Reveal key={group.id} delay={(i % 3) * 0.06} className="border-t border-ink pt-5">
              <h3 className="text-lg font-medium">{group.title}</h3>
              {group.description ? <p className="mt-1 text-sm text-mute">{group.description}</p> : null}
              <ul className="text-meta mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="border border-line-strong bg-paper px-2.5 py-1 text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
