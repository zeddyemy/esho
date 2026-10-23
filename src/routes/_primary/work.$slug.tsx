import { createFileRoute } from '@tanstack/react-router'

import WorkDetail from '@/components/pages/work-detail'
import { projectQuery } from '@/hooks/api/content'
import { settingsQuery } from '@/hooks/api/site'
import { breadcrumbJsonLd, jsonLd, projectJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/work/$slug')({
  loader: async ({ context: { queryClient }, params }) => {
    const [settings, data] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(projectQuery(params.slug)),
    ])
    return { settings, project: data.project }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const { project, settings } = loaderData
    const path = `/work/${params.slug}`
    return {
      ...seo({
        settings,
        title: project.title,
        description: project.summary,
        ogPath: `/og/work/${params.slug}`,
        path,
        type: 'article',
        modifiedAt: project.updatedAt,
        tags: [...project.tags, ...project.stack],
      }),
      scripts: [
        jsonLd(projectJsonLd(project, settings)),
        jsonLd(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.title, path },
          ]),
        ),
      ],
    }
  },
  component: WorkDetailRoute,
})

function WorkDetailRoute() {
  const { slug } = Route.useParams()
  return <WorkDetail slug={slug} />
}
