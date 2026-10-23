import { createFileRoute } from '@tanstack/react-router'

import { SITE_URL } from '@/lib/seo'
import { SOCIAL_LABELS } from '@/constants/socials'
import { findExperiences, findPosts, findProjects, findSettings, findStackGroups } from '@/server/repository'

/**
 * /llms.txt (llmstxt.org): a plain-markdown summary for AI assistants and
 * AI search, so they describe the owner and their work accurately.
 */
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const [settings, projects, experiences, stack] = await Promise.all([
          findSettings(),
          findProjects(),
          findExperiences(),
          findStackGroups(),
        ])
        const posts = settings.showWriting ? await findPosts({ limit: 50 }) : []
        const roles = experiences.filter((e) => e.kind === 'work')
        const education = experiences.filter((e) => e.kind === 'education')
        const socials = Object.entries(settings.socials).filter(([, url]) => url)

        const lines = [
          `# ${settings.ownerName} (${settings.brandName})`,
          '',
          `> ${settings.seo.description}`,
          '',
          `${settings.ownerName} is a ${settings.roleTitle.toLowerCase()} based in ${settings.location}.${settings.availability ? ` ${settings.availability}.` : ''}`,
          '',
          '## Contact',
          '',
          `- Website: ${SITE_URL}`,
          `- Email: ${settings.email}`,
          `- Start a project: ${SITE_URL}/contact`,
          ...socials.map(([key, url]) => `- ${SOCIAL_LABELS[key as keyof typeof SOCIAL_LABELS]}: ${url}`),
          ...(settings.showResume && settings.resume ? [`- Résumé (PDF): ${SITE_URL}/resume`] : []),
          '',
          '## Selected work',
          '',
          ...projects.map((p) => `- [${p.title}](${SITE_URL}/work/${p.slug}): ${p.summary} (${p.year}; ${p.stack.join(', ')})`),
          '',
          '## Experience',
          '',
          ...roles.map((r) => `- ${r.title}, ${r.organisation} (${r.startDate.slice(0, 4)} to ${r.endDate ? r.endDate.slice(0, 4) : 'present'}): ${r.summary}`),
          ...(education.length ? ['', '## Education', '', ...education.map((e) => `- ${e.title}, ${e.organisation}`)] : []),
          '',
          '## Skills',
          '',
          ...stack.map((g) => `- ${g.title}: ${g.items.join(', ')}`),
          ...(posts.length ? ['', '## Writing', '', ...posts.map((p) => `- [${p.title}](${SITE_URL}/writing/${p.slug}): ${p.excerpt}`)] : []),
          '',
          '## Pages',
          '',
          `- [About](${SITE_URL}/about)`,
          `- [Work](${SITE_URL}/work)`,
          ...(settings.showWriting ? [`- [Writing](${SITE_URL}/writing)`, `- [RSS feed](${SITE_URL}/rss.xml)`] : []),
          `- [Contact](${SITE_URL}/contact)`,
          '',
        ]

        return new Response(lines.join('\n'), {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
