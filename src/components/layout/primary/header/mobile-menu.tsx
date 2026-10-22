import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { m } from 'motion/react'

import { SocialLinks } from '@/components/shared/social-links'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CONTACT_CTA, visibleNav } from '@/constants/navigation'
import type { SiteSettings } from '@/types'

export default function MobileMenu({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false)
  const links = [{ label: 'Home', to: '/' as const }, ...visibleNav(settings), { label: CONTACT_CTA, to: '/contact' as const }]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="-mr-2 flex h-10 items-center gap-3 px-2 text-sm text-ink" aria-label="Open menu">
        Menu
        <span className="flex w-5 flex-col gap-1.5" aria-hidden>
          <span className="h-px w-full bg-ink" />
          <span className="h-px w-3/5 self-end bg-ink" />
        </span>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="h-[100dvh] border-none bg-paper px-4 pt-20 pb-10 sm:px-6 [&>button]:top-5 [&>button]:right-4 [&>button>svg]:size-6"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav aria-label="Mobile" className="flex flex-1 flex-col">
          <ul className="flex flex-col">
            {links.map((item, i) => (
              <m.li
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={open ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-line"
              >
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === '/' }}
                  className="block py-3 font-display text-[2.6rem] leading-tight text-ink/80 transition-colors hover:text-cobalt"
                  activeProps={{ className: 'text-ink! italic' }}
                >
                  {item.label}
                </Link>
              </m.li>
            ))}
          </ul>
          <div className="mt-auto space-y-4 pt-8">
            <a href={`mailto:${settings.email}`} className="block text-lg break-all text-ink">
              {settings.email}
            </a>
            <SocialLinks socials={settings.socials} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
