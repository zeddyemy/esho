import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

/** Outcomes, the markdown body (with a sticky stack list beside it) and the gallery. */
export default function CaseStudy({ project, bodyHtml }: { project: Project; bodyHtml: string }) {
  return (
    <>
      {project.metrics.length ? (
        <section className="container-site py-16 md:py-24">
          <h2 className="sr-only">Outcomes</h2>
          <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((metric, i) => (
              <Reveal key={metric.label} delay={i * 0.06} className="border-t border-ink pt-5">
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="block font-display text-5xl tracking-[-0.03em] md:text-6xl">{metric.value}</span>
                  <span className="mt-2 block text-mute">{metric.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </section>
      ) : null}

      <section className={cn('container-site grid gap-12 pb-16 md:grid-cols-12 md:pb-24', !project.metrics.length && 'pt-16 md:pt-24')}>
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <h2 className="text-sm text-mute">Built with</h2>
            <ul className="text-meta mt-4 flex flex-wrap gap-2 md:flex-col md:gap-1.5">
              {project.stack.map((item) => (
                <li key={item} className="border border-line-strong px-2.5 py-1 md:border-0 md:p-0 md:text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="prose-editorial max-w-[68ch] md:col-span-8 md:col-start-5" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </section>

      {project.gallery.length ? (
        <section className="container-site grid gap-6 pb-20 md:grid-cols-2 md:pb-28">
          <h2 className="sr-only">Gallery</h2>
          {project.gallery.map((image, i) => {
            const wide = project.gallery.length % 2 === 1 && i === 0
            return (
              <Reveal key={image.src + i} className={cn(wide && 'md:col-span-2')}>
                <figure>
                  <MediaImage image={image} sizes={wide ? '100vw' : '(min-width: 768px) 50vw, 100vw'} />
                  {image.alt ? <figcaption className="mt-3 text-sm text-mute">{image.alt}</figcaption> : null}
                </figure>
              </Reveal>
            )
          })}
        </section>
      ) : null}
    </>
  )
}
