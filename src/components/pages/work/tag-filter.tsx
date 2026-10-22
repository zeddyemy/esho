import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

/** Tag chips driving the `?tag=` search param (shareable, back-button friendly). */
export default function TagFilter({ tags, active }: { tags: Array<string>; active?: string }) {
  if (tags.length < 2) return null
  const chip = 'text-meta border px-3 py-1.5 transition-colors'
  return (
    <nav aria-label="Filter projects by tag" className="mt-10 flex flex-wrap gap-2">
      <Link
        to="/work"
        search={{}}
        resetScroll={false}
        className={cn(chip, !active ? 'border-ink bg-ink text-paper' : 'border-line-strong text-mute hover:border-ink hover:text-ink')}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          to="/work"
          search={{ tag }}
          resetScroll={false}
          className={cn(
            chip,
            active === tag ? 'border-ink bg-ink text-paper' : 'border-line-strong text-mute hover:border-ink hover:text-ink',
          )}
        >
          {tag}
        </Link>
      ))}
    </nav>
  )
}
