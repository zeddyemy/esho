import { useSuspenseQuery } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-form'
import { toast } from 'sonner'

import { FormSection } from '@/components/shared/admin/form-section'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { useAppForm } from '@/components/ui/custom/form'
import { Switch } from '@/components/ui/switch'
import { adminSectionsQuery, useUpdateSections } from '@/hooks/api/admin/sections'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { sectionVisibilitySchema } from '@/lib/schemas/sections'
import { HIDEABLE_SECTIONS, SECTION_GROUPS } from '@/lib/sections'
import { cn } from '@/lib/utils'
import type { SectionInfo } from '@/lib/sections'

function SectionRow({
  section,
  checked,
  disabled,
  note,
  onChange,
}: {
  section: SectionInfo
  checked: boolean
  disabled?: boolean
  note?: string
  onChange: (visible: boolean) => void
}) {
  const description = note ?? ('description' in section ? section.description : undefined)
  return (
    <div className={cn('flex items-center justify-between gap-6 px-4 py-3', disabled && 'opacity-60')}>
      <div className="min-w-0">
        <p className="text-sm font-medium">{section.label}</p>
        {description ? <p className="text-xs text-mute">{description}</p> : null}
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} aria-label={`Show ${section.label}`} />
    </div>
  )
}

export default function Sections() {
  const { data } = useSuspenseQuery(adminSectionsQuery())
  const { data: settings } = useSuspenseQuery(adminSettingsQuery())
  const update = useUpdateSections()

  const form = useAppForm({
    defaultValues: data,
    validators: { onSubmit: sectionVisibilitySchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await update.mutateAsync(value)
        formApi.reset(value)
        toast.success('Sections saved. The website updates within a minute.')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not save')
      }
    },
  })
  const showTestimonials = useStore(form.store, (s) => s.values.showTestimonials)

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Sections"
        description="Choose which sections appear on each page. Hiding a section keeps its content safe, and showing it again brings it back unchanged."
      />
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.AppForm>
          <form.UnsavedChangesGuard />
        </form.AppForm>
        <form.Field name="hidden">
          {(field) =>
            SECTION_GROUPS.map((group) => (
              <FormSection key={group.title} title={group.title} description={group.description}>
                <div className="divide-y divide-line border border-line bg-paper-2">
                  {group.sections.map((section: SectionInfo) => {
                    if (section.key === 'home.testimonials') {
                      return (
                        <SectionRow
                          key={section.key}
                          section={section}
                          checked={showTestimonials}
                          onChange={(visible) => form.setFieldValue('showTestimonials', visible)}
                        />
                      )
                    }
                    const writingOff = section.key === 'home.writing' && !settings.showWriting
                    return (
                      <SectionRow
                        key={section.key}
                        section={section}
                        checked={!writingOff && !field.state.value.includes(section.key)}
                        disabled={writingOff}
                        note={writingOff ? 'Writing is switched off in Settings, On the website.' : undefined}
                        onChange={(visible) => {
                          const hidden = new Set(field.state.value)
                          if (visible) hidden.delete(section.key)
                          else hidden.add(section.key)
                          field.handleChange(HIDEABLE_SECTIONS.filter((key) => hidden.has(key)))
                        }}
                      />
                    )
                  })}
                </div>
              </FormSection>
            ))
          }
        </form.Field>
        {/* Registered so the switch above counts as an unsaved change. */}
        <form.Field name="showTestimonials">{() => null}</form.Field>
        <form.AppForm>
          <form.SaveBar label="Save sections" />
        </form.AppForm>
      </form>
    </div>
  )
}
