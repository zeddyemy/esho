import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { RevealWords } from '@/components/ui/custom/reveal'
import { postQuery } from '@/hooks/api/content'
import { settingsQuery } from '@/hooks/api/site'
import { formatDate } from '@/lib/format'

export default function PostPage({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(postQuery(slug))
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { post, bodyHtml, more } = data

  return (
    <article>
      <header className="container-site pt-10 md:pt-14">
        <Link to="/writing" className="group inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink">
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Writing
        </Link>
        <div className="mx-auto mt-10 max-w-3xl md:mt-14">
          <p className="text-meta animate-fade-up text-mute">
            {formatDate(post.publishedAt)} / {post.readingMinutes} min read
            {post.tags.length ? ` / ${post.tags.join(', ')}` : ''}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.03em]">
            <RevealWords text={post.title} />
          </h1>
          <p className="animate-fade-up mt-6 text-xl leading-relaxed text-ink-2" style={{ animationDelay: '0.2s' }}>
            {post.excerpt}
          </p>
          <p className="animate-fade-up mt-8 text-sm text-mute" style={{ animationDelay: '0.3s' }}>
            By {settings.ownerName}
          </p>
        </div>
      </header>

      {post.cover ? (
        <div className="container-site mt-12 md:mt-16">
          <div className="animate-clip-reveal relative mx-auto aspect-[16/9] max-w-5xl" style={{ animationDelay: '0.15s' }}>
            <MediaImage image={post.cover} fill priority sizes="(min-width: 1024px) 1024px, 100vw" />
          </div>
        </div>
      ) : null}

      <div className="container-site py-16 md:py-24">
        <div className="prose-editorial mx-auto max-w-[68ch]" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>

      {more.length ? (
        <aside className="border-t border-line py-16 md:py-24">
          <div className="container-site">
            <h2 className="font-display text-3xl tracking-[-0.02em] md:text-4xl">Keep reading</h2>
            <ul className="mt-10 grid gap-px bg-line md:grid-cols-2">
              {more.map((p) => (
                <li key={p.id} className="bg-paper md:pr-8 md:even:pl-8">
                  <Link to="/writing/$slug" params={{ slug: p.slug }} className="group block py-6">
                    <p className="text-meta text-mute">{formatDate(p.publishedAt)}</p>
                    <h3 className="mt-2 font-display text-2xl leading-snug transition-colors group-hover:text-cobalt">{p.title}</h3>
                    <p className="mt-2 text-mute">{p.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </article>
  )
}
