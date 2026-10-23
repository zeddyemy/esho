import { indexLabel } from '@/lib/format'
import type { CapabilitiesContent } from '@/types'

/**
 * What I do, as a typographic list: numbered entries under a strong rule,
 * two per row on wide screens. No imagery, boxes or chips, so the words
 * carry it.
 */
export default function Capabilities({ content }: { content: CapabilitiesContent }) {
  const items = content.items.slice(0, 6)
  if (items.length === 0) return null

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-site">
        <h2 className="max-w-3xl font-display text-4xl md:text-6xl">{content.heading}</h2>

        <ol className="mt-12 grid gap-x-16 gap-y-14 md:mt-16 md:grid-cols-2">
          {items.map((item, i) => (
            <li key={item.title} className="grid content-start gap-4 border-t-2 border-ink pt-6">
              <div className="flex items-baseline gap-4">
                <span className="text-meta text-cobalt">{indexLabel(i)}</span>
                <h3 className="font-display text-2xl leading-tight md:text-3xl">{item.title}</h3>
              </div>
              <p className="max-w-lg leading-relaxed text-ink-2">{item.body}</p>
              {item.points.length ? (
                <ul className="grid max-w-lg gap-1.5 border-t border-line pt-4 text-sm text-mute sm:grid-cols-2">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
