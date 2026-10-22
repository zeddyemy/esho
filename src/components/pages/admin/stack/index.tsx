import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Layers, Plus } from 'lucide-react'

import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { adminStackQuery, useStackMutations } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import { stackGroupSchema } from '@/lib/schemas/catalog'
import type { AdminStackGroup } from '@/hooks/api/admin/catalog'
import type { StackGroupInput } from '@/lib/schemas/catalog'

function StackGroupForm({ initial, isNew, onSubmit }: { initial: StackGroupInput; isNew: boolean; onSubmit: (v: StackGroupInput) => Promise<unknown> }) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: stackGroupSchema },
    onSubmit: ({ value }) => onSubmit(value),
  })
  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppField name="title">{(f) => <f.TextField label="Group name" maxLength={50} placeholder="e.g. Backend and APIs" />}</form.AppField>
      <form.AppField name="description">{(f) => <f.TextField label="One-line description" maxLength={140} hint="Optional" />}</form.AppField>
      <form.AppField name="items">{(f) => <f.TagsField label="Tools" max={24} description="Type a tool and press Enter. Commas also work." />}</form.AppField>
      <form.AppField name="visible">{(f) => <f.SwitchField label="Show on website" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton className="w-fit">{isNew ? 'Add group' : 'Save group'}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}

export default function StackPage() {
  const { data: groups } = useSuspenseQuery(adminStackQuery())
  const m = useStackMutations()
  const [editing, setEditing] = useState<AdminStackGroup | 'new' | null>(null)
  const isNew = editing === 'new'

  const addButton = (
    <Button onClick={() => setEditing('new')}>
      <Plus /> Add group
    </Button>
  )

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Stack" description='Tool groups in the "Tools I reach for" section on the About page.' actions={addButton} />

      <SortableRows
        items={groups}
        onReorder={(rows) => m.reorder.mutate(rows)}
        onEdit={setEditing}
        onDelete={(g) => void withToast(m.remove.mutateAsync({ data: { id: g.id } }), 'Group deleted')}
        deleteCopy={(g) => ({ title: `Delete "${g.title}"?`, description: 'This cannot be undone.' })}
        visibility={{
          isVisible: (g) => g.visible,
          onChange: (g, visible) => void withToast(m.setVisible.mutateAsync({ data: { id: g.id, visible } }), visible ? 'Group shown' : 'Group hidden'),
        }}
        renderMain={(g) => (
          <>
            <p className="truncate font-medium">{g.title}</p>
            <p className="truncate text-xs text-mute">{g.items.join(', ')}</p>
          </>
        )}
        empty={<EmptyState icon={Layers} title="No tool groups yet" body="Group the tools you work with, e.g. Frontend, Backend, Data." action={addButton} />}
      />

      <EditSheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={isNew ? 'New group' : 'Edit group'}>
        {editing ? (
          <StackGroupForm
            key={isNew ? 'new' : editing.id}
            isNew={isNew}
            initial={isNew ? { title: '', description: '', items: [], visible: true } : { title: editing.title, description: editing.description, items: editing.items, visible: editing.visible }}
            onSubmit={async (value) => {
              const done = await withToast(
                isNew ? m.create.mutateAsync({ data: value }) : m.update.mutateAsync({ data: { ...value, id: editing.id } }),
                isNew ? 'Group added' : 'Group saved',
              )
              if (done) setEditing(null)
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
