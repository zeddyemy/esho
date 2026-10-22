import { Reveal } from '@/components/ui/custom/reveal'
import type { AboutContent } from '@/types'

/** Story (markdown) followed by numbered working principles in a 2x2 grid. */
export default function Story({ storyHtml, principles }: { storyHtml: string; principles: AboutContent['principles'] }) {
  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-site grid gap-12 md:grid-cols-12">
        <h2 className="font-display text-3xl tracking-[-0.02em] md:col-span-4 md:text-4xl">The longer version</h2>
        <Reveal className="md:col-span-7 md:col-start-6">
          <div className="prose-editorial text-lg" dangerouslySetInnerHTML={{ __html: storyHtml }} />
        </Reveal>
      </div>

      {principles.length ? (
        <div className="container-site mt-20 md:mt-28">
          <h2 className="font-display text-3xl tracking-[-0.02em] md:text-4xl">How I work</h2>
          <ol className="mt-10 grid gap-px bg-line sm:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} className="bg-paper sm:pr-10 sm:even:pl-10">
                <Reveal delay={(i % 2) * 0.08} className="h-full py-8">
                  <span className="font-display text-5xl text-cobalt">{i + 1}</span>
                  <h3 className="mt-4 text-xl font-medium">{p.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-mute">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  )
}
