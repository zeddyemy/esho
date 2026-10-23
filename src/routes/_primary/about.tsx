import { createFileRoute } from '@tanstack/react-router'

import About from '@/components/pages/about'
import { aboutContentQuery, experiencesQuery, settingsQuery, stackGroupsQuery } from '@/hooks/api/site'
import { breadcrumbJsonLd, jsonLd, profilePageJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/about')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, about, experiences, stack] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(aboutContentQuery()),
      queryClient.ensureQueryData(experiencesQuery()),
      queryClient.ensureQueryData(stackGroupsQuery()),
    ])
    return {
      settings,
      about,
      skills: stack.flatMap((g) => g.items).slice(0, 30),
      education: experiences.filter((e) => e.kind === 'education'),
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { settings, about, skills, education } = loaderData
    return {
      ...seo({ settings, title: 'About', description: about.lead, ogPath: '/og/page/about', path: '/about', type: 'profile' }),
      scripts: [
        jsonLd(profilePageJsonLd(settings, { skills, education })),
        jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])),
      ],
    }
  },
  component: About,
})
