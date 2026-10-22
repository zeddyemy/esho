import { useRef } from 'react'

import { useAppForm } from '@/components/ui/custom/form'
import { slugify } from '@/lib/utils'
import { projectCreateSchema } from '@/lib/schemas/catalog'

/**
 * Quick-create form for projects and articles: a title plus a web address
 * that follows the title until it is edited by hand.
 */
export function CreateWithSlug({
  noun,
  basePath,
  placeholder,
  note,
  onSubmit,
}: {
  noun: string
  basePath: string
  placeholder: string
  note: string
  onSubmit: (value: { title: string; slug: string }) => Promise<unknown>
}) {
  const slugEdited = useRef(false)
  const form = useAppForm({
    defaultValues: { title: '', slug: '' },
    validators: { onSubmit: projectCreateSchema },
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
      <form.AppField
        name="title"
        listeners={{
          onChange: ({ value }) => {
            if (!slugEdited.current) form.setFieldValue('slug', slugify(value).slice(0, 80))
          },
        }}
      >
        {(f) => <f.TextField label={`${noun} title`} maxLength={120} placeholder={placeholder} autoFocus />}
      </form.AppField>
      <form.AppField name="slug" listeners={{ onChange: () => (slugEdited.current = true) }}>
        {(f) => <f.TextField label="Web address" maxLength={80} description={`Appears as ${basePath}/your-address`} />}
      </form.AppField>
      <p className="text-sm text-mute">{note}</p>
      <form.AppForm>
        <form.SubmitButton className="w-fit" pendingLabel="Creating">
          Create {noun.toLowerCase()}
        </form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
