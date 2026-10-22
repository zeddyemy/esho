import type { LinkProps } from '@tanstack/react-router'

export interface NavItem {
  label: string
  to: LinkProps['to']
}

/** Primary navigation. "Start a project" is the single contact CTA, so Contact is not repeated here. */
export const primaryNav: Array<NavItem> = [
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Writing', to: '/writing' },
]

export const CONTACT_CTA = 'Start a project'

/** Hides nav items for sections switched off in settings. */
export function visibleNav(settings: { showWriting: boolean }): Array<NavItem> {
  return primaryNav.filter((item) => item.to !== '/writing' || settings.showWriting)
}
