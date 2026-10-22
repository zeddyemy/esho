import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Work from '@/components/pages/work'
import { projectsQuery } from '@/hooks/api/content'
import { pageHeaderQuery, settingsQuery } from '@/hooks/api/site'
import { optionalString } from '@/lib/search'
import { breadcrumbJsonLd, jsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/work/')({
  validateSearch: (search: { tag?: string } & SearchSchemaInput) => ({ tag: optionalString(search.tag, 60) }),
  loader: async ({ context: { queryClient } }) => {
    const [settings, header] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(pageHeaderQuery('work')),
      queryClient.ensureQueryData(projectsQuery()),
    ])
    return { settings, header }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      ...seo({ settings: loaderData.settings, title: 'Work', description: loaderData.header.body, path: '/work' }),
      scripts: [jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }]))],
    }
  },
  component: WorkRoute,
})

function WorkRoute() {
  const { tag } = Route.useSearch()
  return <Work tag={tag} />
}
