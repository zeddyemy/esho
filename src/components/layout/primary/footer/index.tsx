import { Link } from '@tanstack/react-router'

import { SocialLinks } from '@/components/shared/social-links'
import { CONTACT_CTA, visibleNav } from '@/constants/navigation'
import { formatPhone, telLink, whatsappLink } from '@/lib/utils'
import type { SiteSettings } from '@/types'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()
  const links = [...visibleNav(settings), { label: CONTACT_CTA, to: '/contact' as const }]
  const showResume = settings.showResume && settings.resume

  return (
    <footer className="border-t border-line">
      <div className="container-site grid gap-12 pt-16 pb-12 md:grid-cols-12 md:gap-8 md:pt-24">
        <div className="md:col-span-6">
          <a
            href={`mailto:${settings.email}`}
            className="font-display text-3xl leading-tight break-all text-ink underline decoration-cobalt decoration-4 underline-offset-8 transition-colors hover:text-cobalt sm:text-4xl md:break-normal"
          >
            {settings.email}
          </a>
          {settings.availability ? <p className="mt-4 max-w-sm text-mute">{settings.availability}</p> : null}
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="text-sm text-mute">Pages</h2>
          <ul className="mt-4 space-y-2.5">
            {links.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="link-underline text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="text-sm text-mute">Elsewhere</h2>
          <SocialLinks socials={settings.socials} className="mt-4 flex-col gap-y-2.5" linkClassName="text-base text-ink" />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm text-mute">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-ink">
            {settings.phones.map((phone) => (
              <li key={phone}>
                <a href={telLink(phone)} className="link-underline">
                  {formatPhone(phone)}
                </a>
              </li>
            ))}
            {settings.whatsapp ? (
              <li>
                <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="link-underline">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {showResume ? (
              <li>
                <a href="/resume" target="_blank" rel="noreferrer" className="link-underline">
                  Résumé (PDF)
                </a>
              </li>
            ) : null}
            <li className="text-mute">{settings.location}</li>
          </ul>
        </div>
      </div>

      <div className="overflow-x-clip bg-cobalt text-cobalt-ink" aria-hidden>
        <p className="container-site font-poster py-4 text-[24vw] leading-[0.82] select-none md:text-[19vw]">{settings.brandName}</p>
      </div>

      <div className="container-site flex flex-col gap-1 py-6 text-sm text-mute md:flex-row md:justify-between">
        <p>
          © {year} {settings.ownerName}
        </p>
        {settings.footerNote ? <p>{settings.footerNote}</p> : null}
      </div>
    </footer>
  )
}
