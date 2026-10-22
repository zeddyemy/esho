import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import { cn } from '@/lib/utils'
import type { CapabilitiesContent, Capability } from '@/types'

/**
 * Bento of capabilities. Spans follow the item count so the grid never has
 * empty cells: wide/narrow cells alternate row by row, and an item without an
 * image becomes a solid ink cell for contrast.
 */
const SPANS: Record<number, Array<string>> = {
  1: ['md:col-span-6'],
  2: ['md:col-span-3', 'md:col-span-3'],
  3: ['md:col-span-4', 'md:col-span-2', 'md:col-span-6'],
  4: ['md:col-span-4', 'md:col-span-2', 'md:col-span-2', 'md:col-span-4'],
  5: ['md:col-span-4', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2'],
  6: ['md:col-span-4', 'md:col-span-2', 'md:col-span-2', 'md:col-span-4', 'md:col-span-3', 'md:col-span-3'],
}

export default function Capabilities({ content }: { content: CapabilitiesContent }) {
  const items = content.items.slice(0, 6)
  if (items.length === 0) return null
  const spans = SPANS[items.length]

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-site">
        <h2 className="max-w-3xl font-display text-4xl tracking-[-0.025em] md:text-6xl">{content.heading}</h2>
        <div className="mt-12 grid gap-px bg-line md:mt-16 md:grid-cols-6">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.08} className={cn('bg-paper', spans[i])}>
              <CapabilityCell item={item} wide={spans[i].includes('span-4') || spans[i].includes('span-6')} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CapabilityCell({ item, wide }: { item: Capability; wide: boolean }) {
  const inverted = !item.image
  return (
    <article
      className={cn(
        'flex h-full flex-col',
        inverted ? 'bg-ink text-paper' : 'bg-paper',
        wide && item.image ? 'md:grid md:grid-cols-2' : '',
      )}
    >
      {item.image ? (
        <div className={cn('relative aspect-[16/10] overflow-hidden', wide ? 'md:order-2 md:aspect-auto' : '')}>
          <MediaImage image={item.image} fill sizes="(min-width: 768px) 33vw, 100vw" />
        </div>
      ) : null}
      <div className={cn('flex flex-1 flex-col p-6 md:p-8', inverted && 'min-h-72 justify-between')}>
        <div>
          <h3
            className={cn(
              'font-display tracking-[-0.015em]',
              inverted ? 'text-3xl md:text-5xl md:leading-[1.05]' : 'text-2xl md:text-[1.75rem]',
            )}
          >
            {item.title}
          </h3>
          <p className={cn('mt-3 leading-relaxed', inverted ? 'max-w-lg text-lg text-paper/75 md:mt-5' : 'text-mute')}>
            {item.body}
          </p>
        </div>
        {item.points.length ? (
          <ul className={cn('text-meta mt-6 flex flex-wrap gap-2', inverted ? 'text-paper/80' : 'text-ink-2')}>
            {item.points.map((point) => (
              <li key={point} className={cn('border px-2.5 py-1', inverted ? 'border-paper/25' : 'border-line-strong')}>
                {point}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
