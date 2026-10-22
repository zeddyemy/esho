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
    const [settings, , , , , , stack] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(homeContentQuery()),
      queryClient.ensureQueryData(projectsQuery()),
      queryClient.ensureQueryData(experiencesQuery()),
      queryClient.ensureQueryData(testimonialsQuery()),
      queryClient.ensureQueryData(postsQuery({ limit: 3 })),
      queryClient.ensureQueryData(stackGroupsQuery()),
    ])
    return { settings, skills: stack.flatMap((g) => g.items).slice(0, 30) }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { settings, skills } = loaderData
    return {
      ...seo({ settings, path: '/', type: 'profile' }),
      scripts: [jsonLd(personJsonLd(settings, skills))],
    }
  },
  component: Home,
})
