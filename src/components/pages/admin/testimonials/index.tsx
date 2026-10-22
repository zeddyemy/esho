import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { EyeOff, MessageSquareQuote, Plus } from 'lucide-react'

import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { adminTestimonialsQuery, useTestimonialMutations } from '@/hooks/api/admin/catalog'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { withToast } from '@/hooks/use-crud-toast'
import { testimonialSchema } from '@/lib/schemas/catalog'
import type { AdminTestimonial } from '@/hooks/api/admin/catalog'
import type { TestimonialInput } from '@/lib/schemas/catalog'

function TestimonialForm({ initial, isNew, onSubmit }: { initial: TestimonialInput; isNew: boolean; onSubmit: (v: TestimonialInput) => Promise<unknown> }) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: testimonialSchema },
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
      <form.AppField name="quote">
        {(f) => <f.TextareaField label="Quote" rows={4} maxLength={320} description="Short quotes read best: two or three sentences." />}
      </form.AppField>
      <form.AppField name="name">{(f) => <f.TextField label="Name" maxLength={60} />}</form.AppField>
      <div className="grid gap-5 sm:grid-cols-2">
        <form.AppField name="role">{(f) => <f.TextField label="Role" maxLength={60} placeholder="e.g. Founder" hint="Optional" />}</form.AppField>
        <form.AppField name="company">{(f) => <f.TextField label="Company" maxLength={60} hint="Optional" />}</form.AppField>
      </div>
      <form.AppField name="avatar">{(f) => <f.ImageField label="Photo" folder="testimonials" aspect="square" description="Optional." />}</form.AppField>
      <form.AppField name="visible">{(f) => <f.SwitchField label="Show on website" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton className="w-fit">{isNew ? 'Add testimonial' : 'Save testimonial'}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}

export default function Testimonials() {
  const { data: testimonials } = useSuspenseQuery(adminTestimonialsQuery())
  const { data: settings } = useSuspenseQuery(adminSettingsQuery())
  const m = useTestimonialMutations()
  const [editing, setEditing] = useState<AdminTestimonial | 'new' | null>(null)
  const isNew = editing === 'new'

  const addButton = (
    <Button onClick={() => setEditing('new')}>
      <Plus /> Add testimonial
    </Button>
  )

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Testimonials" description="Quotes on the homepage. Drag to choose which shows first." actions={addButton} />

      {!settings.showTestimonials ? (
        <div className="mb-6 flex items-start gap-3 border border-cobalt/30 bg-cobalt-soft p-4 text-sm">
          <EyeOff className="mt-0.5 size-4 shrink-0 text-cobalt" />
          <p>
            Testimonials are hidden on the website.{' '}
            <Link to="/admin/settings" hash="visibility" className="text-cobalt underline-offset-4 hover:underline">
              Change in Settings
            </Link>
          </p>
        </div>
      ) : null}

      <SortableRows
        items={testimonials}
        onReorder={(items) => m.reorder.mutate(items)}
        onEdit={setEditing}
        onDelete={(t) => void withToast(m.remove.mutateAsync({ data: { id: t.id } }), 'Testimonial deleted')}
        deleteCopy={(t) => ({ title: `Delete the quote from ${t.name}?`, description: 'This cannot be undone.' })}
        visibility={{
          isVisible: (t) => t.visible,
          onChange: (t, visible) => void withToast(m.setVisible.mutateAsync({ data: { id: t.id, visible } }), visible ? 'Testimonial shown' : 'Testimonial hidden'),
        }}
        renderMain={(t) => (
          <>
            <p className="truncate font-medium">{t.name}</p>
            <p className="line-clamp-1 text-xs text-mute">“{t.quote}”</p>
          </>
        )}
        empty={<EmptyState icon={MessageSquareQuote} title="No testimonials yet" body="Add a quote from a client or colleague." action={addButton} />}
      />

      <EditSheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={isNew ? 'New testimonial' : 'Edit testimonial'}>
        {editing ? (
          <TestimonialForm
            key={isNew ? 'new' : editing.id}
            isNew={isNew}
            initial={
              isNew
                ? { quote: '', name: '', role: '', company: '', avatar: null, visible: true }
                : { quote: editing.quote, name: editing.name, role: editing.role, company: editing.company, avatar: editing.avatar, visible: editing.visible }
            }
            onSubmit={async (value) => {
              const done = await withToast(
                isNew ? m.create.mutateAsync({ data: value }) : m.update.mutateAsync({ data: { ...value, id: editing.id } }),
                isNew ? 'Testimonial added' : 'Testimonial saved',
              )
              if (done) setEditing(null)
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
