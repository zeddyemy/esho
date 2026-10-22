import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import { formatDate } from '@/lib/format'
import type { PostSummary } from '@/types'

/** Newest post as a feature with image, the next two as text rows beside it. */
export default function LatestWriting({ posts }: { posts: Array<PostSummary> }) {
  if (posts.length === 0) return null
  const [lead, ...rest] = posts

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl tracking-[-0.025em] md:text-6xl">Latest writing</h2>
          <Link to="/writing" className="link-underline group inline-flex items-center gap-1.5 text-sm">
            All articles
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <Link to="/writing/$slug" params={{ slug: lead.slug }} className="group block">
              {lead.cover ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <MediaImage
                    image={lead.cover}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    imgClassName="group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}
              <p className="text-meta mt-6 text-mute">
                {formatDate(lead.publishedAt)} / {lead.readingMinutes} min read
              </p>
              <h3 className="mt-3 font-display text-3xl leading-tight tracking-[-0.02em] transition-colors group-hover:text-cobalt md:text-4xl">
                {lead.title}
              </h3>
              <p className="mt-3 max-w-xl text-mute">{lead.excerpt}</p>
            </Link>
          </Reveal>

          {rest.length ? (
            <ul className="lg:col-span-5">
              {rest.map((post, i) => (
                <li key={post.id} className="border-b border-line first:border-t">
                  <Reveal delay={0.08 * (i + 1)} y={16}>
                    <Link to="/writing/$slug" params={{ slug: post.slug }} className="group block py-7">
                      <p className="text-meta text-mute">{formatDate(post.publishedAt)}</p>
                      <h3 className="mt-2 font-display text-2xl leading-snug tracking-[-0.015em] transition-colors group-hover:text-cobalt">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-mute">{post.excerpt}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
