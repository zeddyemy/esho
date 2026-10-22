import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpenText, ExternalLink, FileText, FolderKanban, Inbox, Settings } from 'lucide-react'

import { StatusPill } from '@/components/pages/admin/inquiries/status'
import { formatReceived } from '@/components/pages/admin/inquiries/columns'
import { Button } from '@/components/ui/button'
import { dashboardQuery } from '@/hooks/api/admin/dashboard'
import { settingsQuery } from '@/hooks/api/site'
import { lagosHour } from '@/lib/utils'

function greeting() {
  const h = lagosHour()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { data } = useSuspenseQuery(dashboardQuery())
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { counts, status, recentInquiries } = data

  const stats = [
    { label: 'New enquiries', value: counts.newInquiries, to: '/admin/inquiries' as const, icon: Inbox, accent: counts.newInquiries > 0 },
    { label: 'Projects', value: counts.publishedProjects, total: counts.projects, to: '/admin/projects' as const, icon: FolderKanban },
    { label: 'Articles', value: counts.publishedPosts, total: counts.posts, to: '/admin/posts' as const, icon: BookOpenText },
  ]

  const checks = [
    { ok: status.openToWork, label: status.openToWork ? 'Showing as open to new work' : 'Not showing as open to work' },
    { ok: status.showWriting, label: status.showWriting ? 'Writing is visible' : 'Writing is hidden' },
    { ok: status.showTestimonials, label: status.showTestimonials ? 'Testimonials are visible' : 'Testimonials are hidden' },
    { ok: status.hasResume && status.showResume, label: !status.hasResume ? 'No résumé uploaded yet' : status.showResume ? 'Résumé download is live' : 'Résumé download is hidden' },
  ]

  return (
    <div className="max-w-5xl">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-mute" suppressHydrationWarning>
            {greeting()}, {settings.ownerName.split(' ')[0]}.
          </p>
          <h2 className="mt-1 font-display text-4xl">Your website</h2>
        </div>
        <Button asChild variant="outline">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink /> View site
          </a>
        </Button>
      </div>

      <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group flex flex-col gap-6 bg-paper p-5 transition-colors hover:bg-paper-2">
            <span className="flex items-center justify-between text-sm text-mute">
              {s.label}
              <s.icon className="size-4" />
            </span>
            <span className="flex items-baseline gap-2">
              <span className={`font-display text-5xl ${s.accent ? 'text-cobalt' : ''}`}>{s.value}</span>
              {'total' in s && s.total !== s.value ? <span className="text-sm text-mute">of {s.total} published</span> : null}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Latest enquiries</h3>
            <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-sm text-mute hover:text-ink">
              All enquiries <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="mt-4 border border-dashed border-line-strong p-6 text-sm text-mute">No enquiries yet. They arrive here when someone sends the contact form.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line border border-line">
              {recentInquiries.map((q) => (
                <li key={q.id}>
                  <Link to="/admin/inquiries" className="flex items-center gap-4 px-4 py-3 hover:bg-paper-2">
                    <div className="min-w-0 flex-1">
                      <p className={q.status === 'new' ? 'truncate font-semibold' : 'truncate'}>{q.name}</p>
                      <p className="truncate text-xs text-mute">{q.message}</p>
                    </div>
                    <StatusPill status={q.status} />
                    <span className="hidden text-xs whitespace-nowrap text-mute sm:block">{formatReceived(q.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="grid content-start gap-8">
          <section>
            <h3 className="font-medium">On the website</h3>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2.5">
                  <span className={`mt-1.5 size-2 shrink-0 ${c.ok ? 'bg-cobalt' : 'bg-line-strong'}`} aria-hidden />
                  {c.label}
                </li>
              ))}
            </ul>
            <Link to="/admin/settings" hash="visibility" className="mt-4 inline-flex items-center gap-1 text-sm text-mute hover:text-ink">
              Change in Settings <ArrowRight className="size-3.5" />
            </Link>
          </section>
          <section>
            <h3 className="font-medium">Quick actions</h3>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/projects">
                  <FolderKanban /> Add or edit a project
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/posts">
                  <BookOpenText /> Write an article
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/content">
                  <FileText /> Edit page text
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/settings">
                  <Settings /> Settings and résumé
                </Link>
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
