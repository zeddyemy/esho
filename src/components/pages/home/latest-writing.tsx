import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { formatDate } from '@/lib/format'
import type { PostSummary } from '@/types'

/**
 * Latest posts as image cards with the title set on the photo. The excerpt
 * slides up on hover or keyboard focus. Phones and tablets get a swipeable
 * row that ends in an "All articles" card; from 1024px all three sit side by
 * side. Title and excerpt are capped at three lines each so the longest
 * allowed text still fits inside the card.
 */
export default function LatestWriting({ posts }: { posts: Array<PostSummary> }) {
  if (posts.length === 0) return null

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl tracking-[-0.025em] md:text-6xl">Latest writing</h2>
          <Link to="/writing" className="link-underline group inline-flex items-center gap-1.5 text-sm">
            All articles
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <ul
          aria-label="Latest articles"
          className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mt-14 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {posts.map((post) => (
            <li key={post.id} className="w-[80%] shrink-0 snap-start sm:w-[55%] md:w-[42%] lg:w-auto">
              <Link
                to="/writing/$slug"
                params={{ slug: post.slug }}
                className="group relative block aspect-[4/5] overflow-hidden bg-paper-2"
              >
                {post.cover ? (
                  <MediaImage
                    image={post.cover}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 768px) 42vw, (min-width: 640px) 55vw, 80vw"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <img
                    src={`/og/writing/${post.slug}`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                  <p className="text-meta text-white/70">
                    {formatDate(post.publishedAt)} / {post.readingMinutes} min read
                  </p>
                  <h3 className="mt-2 line-clamp-3 font-display text-2xl leading-[1.1] tracking-[-0.02em] lg:text-[1.75rem]">
                    {post.title}
                  </h3>
                  {/* Collapsed until hover/focus; the row animates its height so nothing jumps. */}
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] motion-reduce:transition-none">
                    <p className="overflow-hidden text-sm leading-relaxed text-white/80">
                      <span className="line-clamp-3 pt-3">{post.excerpt}</span>
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}

          {/* End of the swipe row on phones: a clear way on to the rest. */}
          <li className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[24%] lg:hidden">
            <Link
              to="/writing"
              className="flex aspect-[4/5] h-full flex-col justify-end gap-3 border border-line-strong p-5 text-ink transition-colors hover:border-ink"
            >
              <ArrowRight className="size-5" />
              <span className="font-display text-xl leading-tight">All articles</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
