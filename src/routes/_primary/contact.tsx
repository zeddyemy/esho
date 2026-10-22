import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Contact from '@/components/pages/contact'
import { contactContentQuery, settingsQuery } from '@/hooks/api/site'
import { optionalString } from '@/lib/search'
import { breadcrumbJsonLd, jsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/contact')({
  validateSearch: (search: { type?: string } & SearchSchemaInput) => ({ type: optionalString(search.type, 80) }),
  loader: async ({ context: { queryClient } }) => {
    const [settings, content] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(contactContentQuery()),
    ])
    return { settings, content }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      ...seo({ settings: loaderData.settings, title: 'Contact', description: loaderData.content.body, path: '/contact' }),
      scripts: [jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]))],
    }
  },
  component: ContactRoute,
})

function ContactRoute() {
  const { type } = Route.useSearch()
  return <Contact type={type} />
}
