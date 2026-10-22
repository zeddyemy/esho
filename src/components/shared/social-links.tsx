import { SOCIAL_KEYS } from '@/types'
import { cn } from '@/lib/utils'
import type { SocialKey, SocialLinks as Socials } from '@/types'

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  x: 'X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  dribbble: 'Dribbble',
  medium: 'Medium',
}

/** Text links keep the editorial tone and avoid brand-icon licensing issues. */
export function SocialLinks({
  socials,
  className,
  linkClassName,
}: {
  socials: Socials
  className?: string
  linkClassName?: string
}) {
  const entries = SOCIAL_KEYS.filter((key) => socials[key])
  if (entries.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap gap-x-6 gap-y-2', className)}>
      {entries.map((key) => (
        <li key={key}>
          <a
            href={socials[key]}
            target="_blank"
            rel="noreferrer"
            className={cn('link-underline text-sm text-mute transition-colors hover:text-ink', linkClassName)}
          >
            {SOCIAL_LABELS[key]}
          </a>
        </li>
      ))}
    </ul>
  )
}
