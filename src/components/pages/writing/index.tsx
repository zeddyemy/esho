import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { MediaImage } from '@/components/shared/media-image'
import { PageIntro } from '@/components/shared/page-intro'
import { Reveal } from '@/components/ui/custom/reveal'
import { postsQuery } from '@/hooks/api/content'
import { pageHeaderQuery } from '@/hooks/api/site'
import { formatDate } from '@/lib/format'

export default function Writing() {
  const { data: header } = useSuspenseQuery(pageHeaderQuery('writing'))
  const { data: posts } = useSuspenseQuery(postsQuery())

  return (
    <>
      <PageIntro heading={header.heading} body={header.body} />
      <section className="container-site pb-24 md:pb-32">
        {posts.length === 0 ? (
          <p className="border-t border-line py-16 text-mute">Nothing published yet. Check back soon.</p>
        ) : (
          <ol className="border-t border-line">
            {posts.map((post, i) => (
              <li key={post.id} className="border-b border-line">
                <Reveal delay={Math.min(i, 4) * 0.05} y={16}>
                  <Link
                    to="/writing/$slug"
                    params={{ slug: post.slug }}
                    className="group grid gap-6 py-10 md:grid-cols-12 md:items-center md:gap-8"
                  >
                    <div className="md:col-span-2">
                      <p className="text-meta text-mute">{formatDate(post.publishedAt)}</p>
                      <p className="text-meta mt-1 text-mute">{post.readingMinutes} min read</p>
                    </div>
                    <div className="md:col-span-6">
                      <h2 className="font-display text-3xl leading-tight tracking-[-0.02em] transition-colors group-hover:text-cobalt md:text-4xl">
                        {post.title}
                      </h2>
                      <p className="mt-3 max-w-xl text-mute">{post.excerpt}</p>
                      {post.tags.length ? <p className="text-meta mt-4 text-ink-2">{post.tags.join(' / ')}</p> : null}
                    </div>
                    {post.cover ? (
                      <div className="relative aspect-[16/10] overflow-hidden md:col-span-3 md:col-start-10">
                        <MediaImage image={post.cover} fill sizes="(min-width: 768px) 25vw, 100vw" imgClassName="group-hover:scale-[1.04]" />
                      </div>
                    ) : null}
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  )
}
