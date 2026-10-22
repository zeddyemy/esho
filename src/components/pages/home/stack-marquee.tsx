/**
 * The one kinetic band on the page: every tool from the Stack groups,
 * scrolling. Duplicated once so the loop is seamless; static (and wrapping)
 * for visitors who prefer reduced motion.
 */
export default function StackMarquee({ items }: { items: Array<string> }) {
  if (items.length === 0) return null
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
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
      <div className="flex w-max motion-safe:animate-marquee motion-reduce:w-full motion-reduce:flex-wrap">
        {row(false)}
        <div className="motion-reduce:hidden">{row(true)}</div>
      </div>
    </section>
  )
}
