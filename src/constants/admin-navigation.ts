import {
  BookOpenText,
  Briefcase,
  FileText,
  FolderKanban,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquareQuote,
  Palette,
  Settings,
} from 'lucide-react'
import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

export interface AdminNavItem {
  label: string
  to: LinkProps['to']
  icon: LucideIcon
  /** Exact match for the dashboard so it isn't "active" on every admin page. */
  exact?: boolean
  badge?: 'newInquiries'
}

export interface AdminNavGroup {
  label: string
  items: Array<AdminNavItem>
}

export const adminNav: Array<AdminNavGroup> = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
      { label: 'Enquiries', to: '/admin/inquiries', icon: Inbox, badge: 'newInquiries' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
      { label: 'Writing', to: '/admin/posts', icon: BookOpenText },
      { label: 'Experience', to: '/admin/experience', icon: Briefcase },
      { label: 'Stack', to: '/admin/stack', icon: Layers },
      { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote },
    ],
  },
  {
    label: 'Website',
    items: [
      { label: 'Page content', to: '/admin/content', icon: FileText },
      { label: 'Appearance', to: '/admin/appearance', icon: Palette },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
    ],
  },
]

/** Tabs on the Page content screen (kept here so the route file stays tiny). */
export const CONTENT_TABS = ['home', 'about', 'contact', 'work', 'writing'] as const
export type ContentTab = (typeof CONTENT_TABS)[number]
