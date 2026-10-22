import { createServerFn } from '@tanstack/react-start'

import { toInquiry } from './inquiries'
import { adminMiddleware } from '@/server/middleware'

export const getDashboard = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const head = { count: 'exact' as const, head: true }
    const results = await Promise.all([
      db.from('projects').select('id', head),
      db.from('projects').select('id', head).eq('published', true),
      db.from('posts').select('id', head),
      db.from('posts').select('id', head).eq('published', true),
      db.from('inquiries').select('id', head).eq('status', 'new'),
      db.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
      db.from('site_settings').select('show_writing, show_testimonials, show_resume, open_to_work, resume').eq('id', 1).maybeSingle(),
    ])
    const firstError = results.find((r) => r.error)?.error
    if (firstError) throw new Error(firstError.message)
    const [projects, publishedProjects, posts, publishedPosts, newInquiries, recent, settings] = results

    return {
      counts: {
        projects: projects.count ?? 0,
        publishedProjects: publishedProjects.count ?? 0,
        posts: posts.count ?? 0,
        publishedPosts: publishedPosts.count ?? 0,
        newInquiries: newInquiries.count ?? 0,
      },
      status: {
        showWriting: settings.data?.show_writing ?? true,
        showTestimonials: settings.data?.show_testimonials ?? true,
        showResume: settings.data?.show_resume ?? true,
        openToWork: settings.data?.open_to_work ?? true,
        hasResume: Boolean(settings.data?.resume),
      },
      recentInquiries: (recent.data ?? []).map(toInquiry),
    }
  })
