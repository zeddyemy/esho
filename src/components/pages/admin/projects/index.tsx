import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { FolderKanban, Plus, Star } from 'lucide-react'

import { CreateWithSlug } from '@/components/shared/admin/create-with-slug'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { MediaImage } from '@/components/shared/media-image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { adminProjectsQuery, useProjectMutations } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import { cn } from '@/lib/utils'

export default function Projects() {
  const { data: projects } = useSuspenseQuery(adminProjectsQuery())
  const m = useProjectMutations()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const addButton = (
    <Button onClick={() => setCreating(true)}>
      <Plus /> New project
    </Button>
  )

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title="Projects"
        description="Drag to set the order on the Work page. Starred projects appear in Selected work on the homepage."
        actions={addButton}
      />

      <SortableRows
        items={projects}
        onReorder={(rows) => m.reorder.mutate(rows)}
        onEdit={(p) => void navigate({ to: '/admin/projects/$projectId', params: { projectId: p.id } })}
        onDelete={(p) => void withToast(m.remove.mutateAsync({ data: { id: p.id } }), 'Project deleted')}
        deleteCopy={(p) => ({ title: `Delete "${p.title}"?`, description: 'The project, its case study and its uploaded images are removed permanently.' })}
        visibility={{
          isVisible: (p) => p.published,
          onChange: (p, published) =>
            void withToast(m.setPublished.mutateAsync({ data: { id: p.id, published } }), published ? 'Project published' : 'Project hidden'),
        }}
        renderActions={(p) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-pressed={p.featured}
            aria-label={p.featured ? 'Remove from homepage' : 'Feature on homepage'}
            title={p.featured ? 'Featured on homepage' : 'Feature on homepage'}
            onClick={() =>
              void withToast(
                m.setFeatured.mutateAsync({ data: { id: p.id, featured: !p.featured } }),
                p.featured ? 'Removed from homepage' : 'Featured on homepage',
              )
            }
            className={p.featured ? 'text-cobalt' : 'text-mute'}
          >
            <Star className={cn(p.featured && 'fill-cobalt')} />
          </Button>
        )}
        renderLeading={(p) => (
          <div className="relative h-11 w-16 overflow-hidden bg-paper">
            {p.hasCover ? <MediaImage image={p.cover} fill sizes="64px" /> : <FolderKanban className="m-auto mt-3 size-5 text-mute" />}
          </div>
        )}
        renderMain={(p) => (
          <>
            <p className="flex items-center gap-2 truncate font-medium">
              {p.title}
              {!p.published ? (
                <Badge variant="outline" className="border-line-strong text-mute">
                  Draft
                </Badge>
              ) : null}
            </p>
            <p className="truncate text-xs text-mute">{[p.year, p.role, p.tags.join(', ')].filter(Boolean).join(' / ')}</p>
          </>
        )}
        empty={<EmptyState icon={FolderKanban} title="No projects yet" body="Create your first project and write its case study." action={addButton} />}
      />

      <EditSheet open={creating} onOpenChange={setCreating} title="New project">
        {creating ? (
          <CreateWithSlug
            noun="Project"
            basePath="/work"
            placeholder="e.g. Payments dashboard"
            note="You will add the cover, details and case study on the next screen. New projects stay as drafts until you publish them."
            onSubmit={async (value) => {
              const result = await withToast(m.create.mutateAsync({ data: value }), 'Project created')
              if (result) {
                setCreating(false)
                await navigate({ to: '/admin/projects/$projectId', params: { projectId: result.id } })
              }
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
