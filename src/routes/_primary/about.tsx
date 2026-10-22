import { createFileRoute } from '@tanstack/react-router'

import About from '@/components/pages/about'
import { aboutContentQuery, experiencesQuery, settingsQuery, stackGroupsQuery } from '@/hooks/api/site'
import { breadcrumbJsonLd, jsonLd, profilePageJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/about')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, about] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(aboutContentQuery()),
      queryClient.ensureQueryData(experiencesQuery()),
      queryClient.ensureQueryData(stackGroupsQuery()),
    ])
    return { settings, about }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { settings, about } = loaderData
    return {
      ...seo({ settings, title: 'About', description: about.lead, image: about.image, path: '/about', type: 'profile' }),
      scripts: [
        jsonLd(profilePageJsonLd()),
        jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])),
      ],
    }
  },
  component: About,
})
