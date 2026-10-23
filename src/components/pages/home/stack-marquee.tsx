import { useMotionLevel } from '@/components/ui/custom/motion-level'

/**
 * The one kinetic band on the page: every tool from the Stack groups,
 * scrolling. Duplicated once so the loop is seamless; static (and wrapping)
 * for visitors who prefer reduced motion.
 */
export default function StackMarquee({ items }: { items: Array<string> }) {
  // Scrolls only at the "full" motion level; otherwise a static, wrapping band.
  const moving = useMotionLevel() === 'full'
  if (items.length === 0) return null
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 flex-wrap items-center gap-x-10 gap-y-3 pr-10">
      {items.map((item) => (
        <li key={item} className="font-display text-2xl whitespace-nowrap md:text-4xl">
          {item}
          <span className="ml-10 inline-block size-2 bg-cobalt align-middle" aria-hidden />
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label="Tools I work with" className="overflow-hidden border-y border-line bg-ink py-6 text-paper md:py-8">
      {moving ? (
        <div className="flex w-max animate-marquee">
          {row(false)}
          {row(true)}
        </div>
      ) : (
        <div className="container-site">{row(false)}</div>
      )}
    </section>
  )
}
