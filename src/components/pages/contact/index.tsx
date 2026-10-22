import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowUpRight } from 'lucide-react'

import { InquiryForm } from '@/components/shared/inquiry-form'
import { PageIntro } from '@/components/shared/page-intro'
import { SocialLinks } from '@/components/shared/social-links'
import { contactContentQuery, settingsQuery } from '@/hooks/api/site'
import { formatPhone, telLink, whatsappLink } from '@/lib/utils'

export default function Contact({ type }: { type?: string }) {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { data: content } = useSuspenseQuery(contactContentQuery())

  return (
    <>
      <PageIntro heading={content.heading} body={content.body} />
      <section className="container-site grid gap-16 pb-24 md:pb-32 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <InquiryForm
            projectTypes={content.projectTypes}
            budgets={content.budgets}
            defaultType={type}
            responseNote={content.responseNote}
            email={settings.email}
          />
        </div>

        <aside className="space-y-10 lg:col-span-3 lg:col-start-10">
          {settings.availability ? (
            <div className="border-l-2 border-cobalt pl-4">
              <p className="text-sm text-mute">Availability</p>
              <p className="mt-1">{settings.availability}</p>
            </div>
          ) : null}

          <div>
            <h2 className="text-sm text-mute">Email</h2>
            <a href={`mailto:${settings.email}`} className="link-static mt-1 block text-lg break-all">
              {settings.email}
            </a>
          </div>

          {settings.whatsapp ? (
            <div>
              <h2 className="text-sm text-mute">WhatsApp</h2>
              <a
                href={whatsappLink(settings.whatsapp, `Hello ${settings.ownerName.split(' ')[0]}, I found you through your website.`)}
                target="_blank"
                rel="noreferrer"
                className="link-static mt-1 inline-flex items-center gap-1 text-lg"
              >
                Message me
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          ) : null}

          {settings.phones.length ? (
            <div>
              <h2 className="text-sm text-mute">Phone</h2>
              <ul className="mt-1 space-y-1">
                {settings.phones.map((phone) => (
                  <li key={phone}>
                    <a href={telLink(phone)} className="link-static text-lg">
                      {formatPhone(phone)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="text-sm text-mute">Elsewhere</h2>
            <SocialLinks socials={settings.socials} className="mt-2 flex-col gap-y-1.5" linkClassName="text-base text-ink" />
          </div>

          <p className="text-sm text-mute">{settings.location}</p>
        </aside>
      </section>
    </>
  )
}
