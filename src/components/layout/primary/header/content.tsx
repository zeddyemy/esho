import { Link } from '@tanstack/react-router'

import MobileMenu from './mobile-menu'
import { Logo } from '@/components/shared/logo'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { CONTACT_CTA, visibleNav } from '@/constants/navigation'
import type { SiteSettings } from '@/types'

export default function HeaderContent({ settings }: { settings: SiteSettings }) {
  return (
    <div className="container-site flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
      <Logo settings={settings} />

      <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
        <ul className="flex items-center gap-7">
          {visibleNav(settings).map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="link-underline py-1 text-sm text-mute transition-colors hover:text-ink"
                activeProps={{ className: 'text-ink! bg-[length:100%_1px]!' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="h-9 px-4">
            <Link to="/contact">{CONTACT_CTA}</Link>
          </Button>
        </div>
      </nav>

      <div className="flex items-center gap-1 md:hidden">
        <ThemeToggle />
        <MobileMenu settings={settings} />
      </div>
    </div>
  )
}
