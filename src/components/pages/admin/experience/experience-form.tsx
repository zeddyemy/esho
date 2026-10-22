import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { experienceSchema } from '@/lib/schemas/catalog'
import type { ExperienceInput } from '@/lib/schemas/catalog'

export function ExperienceForm({
  initial,
  isNew,
  onSubmit,
}: {
  initial: ExperienceInput
  isNew: boolean
  onSubmit: (value: ExperienceInput) => Promise<unknown>
}) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: experienceSchema },
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
      <form.AppField name="kind">
        {(f) => (
          <f.SelectField
            label="Type"
            options={[
              { value: 'work', label: 'Work' },
              { value: 'education', label: 'Education' },
            ]}
          />
        )}
      </form.AppField>
      <form.Subscribe selector={(s) => s.values.kind}>
        {(kind) => (
          <>
            <form.AppField name="title">
              {(f) => <f.TextField label={kind === 'work' ? 'Role' : 'Qualification'} maxLength={120} placeholder={kind === 'work' ? 'e.g. Senior engineer' : 'e.g. BSc Computer Science'} />}
            </form.AppField>
            <form.AppField name="organisation">
              {(f) => <f.TextField label={kind === 'work' ? 'Company' : 'Institution'} maxLength={80} />}
            </form.AppField>
          </>
        )}
      </form.Subscribe>
      <div className="grid gap-5 sm:grid-cols-2">
        <form.AppField name="location">{(f) => <f.TextField label="Location" maxLength={80} hint="Optional" />}</form.AppField>
        <form.AppField name="url">{(f) => <f.TextField label="Website" type="url" inputMode="url" placeholder="https://" hint="Optional" />}</form.AppField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <form.AppField name="start">{(f) => <f.DateField label="Started" type="month" />}</form.AppField>
        <form.AppField name="end">{(f) => <f.DateField label="Ended" type="month" description="Leave empty if this is current." />}</form.AppField>
      </div>
      <form.AppField name="summary">{(f) => <f.TextareaField label="Summary" rows={3} maxLength={400} />}</form.AppField>

      <form.Field name="highlights" mode="array">
        {(list) => (
          <div className="grid gap-2">
            <p className="text-sm font-medium">Highlights</p>
            {list.state.value.map((_, i) => (
              <div key={i} className="flex items-end gap-2">
                <form.AppField name={`highlights[${i}]`}>{(f) => <f.TextField label={`Highlight ${i + 1}`} maxLength={200} className="flex-1" />}</form.AppField>
                <Button type="button" variant="ghost" size="icon" className="mb-0.5 text-mute" onClick={() => list.removeValue(i)} aria-label={`Remove highlight ${i + 1}`}>
                  <X />
                </Button>
              </div>
            ))}
            {list.state.value.length < 6 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => list.pushValue('')}>
                <Plus /> Add highlight
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.AppField name="stack">{(f) => <f.TagsField label="Tools used" max={12} />}</form.AppField>
      <form.AppField name="visible">{(f) => <f.SwitchField label="Show on website" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton className="w-fit">{isNew ? 'Add entry' : 'Save entry'}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
