import { createFileRoute } from '@tanstack/react-router'

import Home from '@/components/pages/home'
import { postsQuery, projectsQuery } from '@/hooks/api/content'
import {
  experiencesQuery,
  homeContentQuery,
  settingsQuery,
  stackGroupsQuery,
  testimonialsQuery,
} from '@/hooks/api/site'
import { jsonLd, personJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, , , experiences, , , stack] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(homeContentQuery()),
      queryClient.ensureQueryData(projectsQuery()),
      queryClient.ensureQueryData(experiencesQuery()),
      queryClient.ensureQueryData(testimonialsQuery()),
      queryClient.ensureQueryData(postsQuery({ limit: 3 })),
      queryClient.ensureQueryData(stackGroupsQuery()),
    ])
    return {
      settings,
      skills: stack.flatMap((g) => g.items).slice(0, 30),
      education: experiences.filter((e) => e.kind === 'education'),
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { settings, skills, education } = loaderData
    return {
      ...seo({ settings, path: '/', type: 'profile', image: settings.seo.image, ogPath: '/og' }),
      scripts: [jsonLd(personJsonLd(settings, { skills, education }))],
    }
  },
  component: Home,
})
