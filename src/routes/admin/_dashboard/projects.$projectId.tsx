import { createFileRoute, notFound } from '@tanstack/react-router'

import ProjectEditor from '@/components/pages/admin/projects/editor'
import { adminProjectQuery, adminProjectsQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'
import { isUuid } from '@/lib/search'

export const Route = createFileRoute('/admin/_dashboard/projects/$projectId')({
  loader: async ({ context: { queryClient }, params }) => {
    if (!isUuid(params.projectId)) throw notFound()
    const [project] = await Promise.all([
      queryClient.ensureQueryData(adminProjectQuery(params.projectId)),
      queryClient.ensureQueryData(adminProjectsQuery()),
    ])
    return { title: project.title }
  },
  head: ({ loaderData }) => adminHead(loaderData?.title ?? 'Project'),
  component: ProjectEditorRoute,
})

function ProjectEditorRoute() {
  const { projectId } = Route.useParams()
  // Keyed so switching projects remounts the form with fresh defaults.
  return <ProjectEditor key={projectId} projectId={projectId} />
}
