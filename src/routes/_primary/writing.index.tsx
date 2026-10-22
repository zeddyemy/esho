import { createFileRoute, notFound } from '@tanstack/react-router'

import Writing from '@/components/pages/writing'
import { postsQuery } from '@/hooks/api/content'
import { pageHeaderQuery, settingsQuery } from '@/hooks/api/site'
import { breadcrumbJsonLd, jsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/writing/')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, header] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(pageHeaderQuery('writing')),
      queryClient.ensureQueryData(postsQuery()),
    ])
    if (!settings.showWriting) throw notFound()
    return { settings, header }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      ...seo({ settings: loaderData.settings, title: 'Writing', description: loaderData.header.body, path: '/writing' }),
      scripts: [jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Writing', path: '/writing' }]))],
    }
  },
  component: Writing,
})
