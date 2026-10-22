import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import { indexLabel } from '@/lib/format'
import type { ProjectSummary } from '@/types'

/**
 * Numbered project index. On pointer devices a preview of the hovered
 * project follows the cursor (motion values, no re-render per frame); on
 * touch screens each row shows its cover inline.
 */
export default function SelectedWork({ projects, total }: { projects: Array<ProjectSummary>; total: number }) {
  const listRef = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 })

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !listRef.current) return
    const rect = listRef.current.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  if (projects.length === 0) return null
  const preview = active !== null ? projects[active] : null

  return (
    <section id="work" className="scroll-mt-20 border-t border-line py-20 md:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl tracking-[-0.025em] md:text-6xl">Selected work</h2>
          <Link to="/work" className="link-underline group inline-flex items-center gap-1.5 text-sm text-ink">
            All projects ({total})
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <ol
          ref={listRef}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
          className="relative mt-12 border-t border-line md:mt-16"
        >
          {projects.map((project, i) => (
            <li key={project.id} className="border-b border-line">
              <Reveal delay={i * 0.05} y={16}>
                <Link
                  to="/work/$slug"
                  params={{ slug: project.slug }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                  onFocus={() => setActive(null)}
                  className="group grid gap-x-6 gap-y-3 py-7 transition-colors md:grid-cols-12 md:items-baseline md:py-9"
                >
                  <span className="text-meta text-mute md:col-span-1">{indexLabel(i)}</span>
                  <span className="font-display text-3xl leading-tight tracking-[-0.02em] transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-cobalt md:col-span-4 md:text-4xl">
                    {project.title}
                  </span>
                  <span className="text-mute md:col-span-4">{project.summary}</span>
                  <span className="text-meta flex flex-wrap gap-x-3 text-mute md:col-span-2">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                  <span className="text-meta text-mute md:col-span-1 md:text-right">{project.year}</span>
                  {/* Touch screens: inline cover instead of the cursor preview. */}
                  <span className="relative mt-2 block aspect-[16/10] md:hidden">
                    <MediaImage image={project.cover} fill sizes="90vw" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}

          {!reduce ? (
            <AnimatePresence>
              {preview ? (
                <m.div
                  key="preview"
                  aria-hidden
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ x: springX, y: springY }}
                  className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
                >
                  <div className="relative -mt-36 ml-8 aspect-[4/3] w-80 overflow-hidden shadow-[0_24px_60px_rgb(17_18_20/0.18)]">
                    {projects.map((p, i) => (
                      <MediaImage
                        key={p.id}
                        image={p.cover}
                        fill
                        sizes="320px"
                        className={i === active ? 'opacity-100' : 'opacity-0'}
                      />
                    ))}
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          ) : null}
        </ol>
      </div>
    </section>
  )
}
