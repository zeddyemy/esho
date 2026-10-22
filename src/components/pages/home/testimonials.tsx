import { useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'

import { indexLabel } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/types'

/** One large quote at a time with numbered switches. */
export default function Testimonials({ items }: { items: Array<Testimonial> }) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  if (items.length === 0) return null
  const current = items[Math.min(index, items.length - 1)]

  return (
    <section className="border-t border-line bg-paper-2 py-20 md:py-28" aria-roledescription="carousel" aria-label="Testimonials">
      <div className="container-site grid gap-10 md:grid-cols-12">
        <h2 className="text-sm text-mute md:col-span-3">What people say</h2>

        <div className="md:col-span-9">
          <div className="relative min-h-[16rem] md:min-h-[14rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <m.figure
                key={current.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.2] tracking-[-0.02em] text-ink">
                  <p>“{current.quote}”</p>
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium">{current.name}</span>
                  <span className="text-mute">
                    {[current.role, current.company].filter(Boolean).join(', ')}
                  </span>
                </figcaption>
              </m.figure>
            </AnimatePresence>
          </div>

          {items.length > 1 ? (
            <div className="mt-10 flex gap-2" role="group" aria-label="Choose a testimonial">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  aria-label={`${indexLabel(i)}, testimonial from ${item.name}`}
                  className={cn(
                    'text-meta flex h-9 min-w-12 items-center justify-center border px-3 transition-colors',
                    i === index ? 'border-ink bg-ink text-paper' : 'border-line-strong text-mute hover:border-ink hover:text-ink',
                  )}
                >
                  {indexLabel(i)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
