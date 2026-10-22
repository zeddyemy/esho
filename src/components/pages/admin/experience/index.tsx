import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Briefcase, GraduationCap, Plus } from 'lucide-react'

import { ExperienceForm } from './experience-form'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { adminExperiencesQuery, useExperienceMutations } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import { formatYearRange } from '@/lib/format'
import type { AdminExperience } from '@/hooks/api/admin/catalog'
import type { ExperienceInput } from '@/lib/schemas/catalog'

const blank: ExperienceInput = {
  kind: 'work',
  organisation: '',
  title: '',
  location: '',
  url: '',
  start: '',
  end: '',
  summary: '',
  highlights: [],
  stack: [],
  visible: true,
}

const toInput = (e: AdminExperience): ExperienceInput => ({
  kind: e.kind,
  organisation: e.organisation,
  title: e.title,
  location: e.location,
  url: e.url,
  start: e.startDate.slice(0, 7),
  end: e.endDate ? e.endDate.slice(0, 7) : '',
  summary: e.summary,
  highlights: e.highlights,
  stack: e.stack,
  visible: e.visible,
})

export default function ExperiencePage() {
  const { data: items } = useSuspenseQuery(adminExperiencesQuery())
  const m = useExperienceMutations()
  const [editing, setEditing] = useState<AdminExperience | 'new' | null>(null)
  const isNew = editing === 'new'

  const addButton = (
    <Button onClick={() => setEditing('new')}>
      <Plus /> Add entry
    </Button>
  )

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Experience"
        description="Roles and education on the About page. Drag to set the order: most recent first reads best. The homepage shows the top three roles."
        actions={addButton}
      />

      <SortableRows
        items={items}
        onReorder={(rows) => m.reorder.mutate(rows)}
        onEdit={setEditing}
        onDelete={(e) => void withToast(m.remove.mutateAsync({ data: { id: e.id } }), 'Entry deleted')}
        deleteCopy={(e) => ({ title: `Delete "${e.title}"?`, description: 'This cannot be undone.' })}
        visibility={{
          isVisible: (e) => e.visible,
          onChange: (e, visible) => void withToast(m.setVisible.mutateAsync({ data: { id: e.id, visible } }), visible ? 'Entry shown' : 'Entry hidden'),
        }}
        renderLeading={(e) =>
          e.kind === 'work' ? <Briefcase className="size-4 text-mute" aria-label="Work" /> : <GraduationCap className="size-4 text-mute" aria-label="Education" />
        }
        renderMain={(e) => (
          <>
            <p className="truncate font-medium">{e.title}</p>
            <p className="truncate text-xs text-mute">
              {e.organisation} / {formatYearRange(e.startDate, e.endDate)}
            </p>
          </>
        )}
        empty={<EmptyState icon={Briefcase} title="No experience yet" body="Add your roles and education." action={addButton} />}
      />

      <EditSheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={isNew ? 'New entry' : 'Edit entry'}>
        {editing ? (
          <ExperienceForm
            key={isNew ? 'new' : editing.id}
            isNew={isNew}
            initial={isNew ? blank : toInput(editing)}
            onSubmit={async (value) => {
              const done = await withToast(
                isNew ? m.create.mutateAsync({ data: value }) : m.update.mutateAsync({ data: { id: editing.id, value } }),
                isNew ? 'Entry added' : 'Entry saved',
              )
              if (done) setEditing(null)
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
