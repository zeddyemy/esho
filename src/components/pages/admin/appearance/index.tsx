import { useSuspenseQuery } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-form'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

import { FormSection } from '@/components/shared/admin/form-section'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import {
  adminAppearanceQuery,
  useUpdateAppearance,
} from '@/hooks/api/admin/appearance'
import {
  ACCENTS,
  BODY_FONTS,
  DEFAULT_APPEARANCE,
  HEADING_FONTS,
  HEADING_WEIGHTS,
  HEADING_WIDTHS,
  MOTION_LEVELS,
  typeVars,
} from '@/lib/appearance'
import { appearanceSchema } from '@/lib/schemas/appearance'
import { cn } from '@/lib/utils'
import type { Appearance } from '@/lib/appearance'

const WEIGHT_NAMES: Record<number, string> = {
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semibold',
  700: 'Bold',
  800: 'Extra bold',
  900: 'Black',
}

/** Row of mutually exclusive choices rendered as buttons (a radio group). */
function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string; style?: React.CSSProperties }>
  onChange: (value: T) => void
}) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            style={o.style}
            className={cn(
              'border px-3 py-2 text-sm transition-colors',
              value === o.value
                ? 'border-ink bg-ink text-paper'
                : 'border-line-strong text-ink-2 hover:border-ink',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Sample of the public site using the values being edited. */
function Preview({ a }: { a: Appearance }) {
  const accent = ACCENTS[a.accent]
  const style = {
    ...typeVars(a),
    '--preview-accent': accent.light,
    '--preview-accent-ink': accent.lightInk,
  } as React.CSSProperties
  return (
    <div
      style={style}
      className="border border-line bg-[#f4f4f2] p-6 text-[#111214]"
      aria-label="Preview"
    >
      <p
        className="flex items-center gap-2 text-xs"
        style={{ fontFamily: 'var(--body-family)' }}
      >
        <span
          className="size-1.5 rounded-full"
          style={{ background: 'var(--preview-accent)' }}
        />
        Taking on new projects
      </p>
      <p
        className="mt-4 text-4xl leading-[1.05]"
        style={{
          fontFamily: 'var(--display-family)',
          fontWeight: 'var(--display-weight)' as unknown as number,
          fontStretch: 'var(--display-stretch)',
          textTransform:
            'var(--display-case)' as React.CSSProperties['textTransform'],
          letterSpacing: 'var(--display-tracking)',
        }}
      >
        Product engineering, from schema to screen.
      </p>
      <p
        className="mt-4 text-sm leading-relaxed text-[#33353a]"
        style={{ fontFamily: 'var(--body-family)' }}
      >
        I design, build and ship web products, data systems and AI-assisted
        tools for teams that need them to hold up.
      </p>
      <div
        className="mt-5 flex flex-wrap items-center gap-3"
        style={{ fontFamily: 'var(--body-family)' }}
      >
        <span
          className="inline-flex h-10 items-center gap-2 px-4 text-sm font-medium"
          style={{
            background: 'var(--preview-accent)',
            color: 'var(--preview-accent-ink)',
          }}
        >
          Start a project <ArrowRight className="size-4" />
        </span>
        <span
          className="text-sm underline decoration-1 underline-offset-4"
          style={{ textDecorationColor: 'var(--preview-accent)' }}
        >
          See the work
        </span>
      </div>
      <div className="mt-6 flex items-baseline gap-3 border-t-2 border-[#111214] pt-4">
        <span
          className="font-mono text-xs"
          style={{ color: 'var(--preview-accent)' }}
        >
          01
        </span>
        <span
          className="text-xl"
          style={{
            fontFamily: 'var(--display-family)',
            fontWeight: 'var(--display-weight)' as unknown as number,
            fontStretch: 'var(--display-stretch)',
            textTransform:
              'var(--display-case)' as React.CSSProperties['textTransform'],
            letterSpacing: 'var(--display-tracking)',
          }}
        >
          Selected work
        </span>
      </div>
      <p
        className="mt-4 text-xs text-[#5d6067]"
        style={{ fontFamily: 'var(--body-family)' }}
      >
        Preview in light mode. Dark mode uses a lighter shade of the same
        accent.
      </p>
    </div>
  )
}

export default function AppearanceSettings() {
  const { data } = useSuspenseQuery(adminAppearanceQuery())
  const update = useUpdateAppearance()

  const form = useAppForm({
    defaultValues: data,
    validators: { onSubmit: appearanceSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await update.mutateAsync(value)
        formApi.reset(value)
        toast.success('Appearance saved. The website updates within a minute.')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not save')
      }
    },
  })
  const values = useStore(form.store, (s) => s.values)

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        title="Appearance"
        description="Fonts, heading style, accent colour and how much moves on the website. Changes apply to every public page."
        actions={
          <Button
            type="button"
            variant="ghost"
            className="text-mute"
            onClick={() =>
              form.reset(DEFAULT_APPEARANCE, { keepDefaultValues: true })
            }
          >
            <RotateCcw /> Reset to defaults
          </Button>
        }
      />
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <form.AppForm>
          <form.UnsavedChangesGuard />
        </form.AppForm>
        <div className="min-w-0">
          <FormSection
            title="Headings"
            description="Page titles, section headings and the big footer wordmark."
          >
            <form.Field name="headingFont">
              {(f) => (
                <Segmented
                  label="Font"
                  value={f.state.value}
                  options={Object.entries(HEADING_FONTS).map(
                    ([value, font]) => ({
                      value: value as Appearance['headingFont'],
                      label: font.label,
                      style: { fontFamily: font.family },
                    }),
                  )}
                  onChange={(v) => f.handleChange(v)}
                />
              )}
            </form.Field>
            <form.Field name="headingWeight">
              {(f) => (
                <Segmented
                  label="Weight"
                  value={f.state.value}
                  options={HEADING_WEIGHTS.map((w) => ({
                    value: w,
                    label: WEIGHT_NAMES[w],
                    style: { fontWeight: w },
                  }))}
                  onChange={(v) => f.handleChange(v)}
                />
              )}
            </form.Field>
            <div
              className={cn(values.headingFont !== 'archivo' && 'opacity-50')}
            >
              <form.Field name="headingWidth">
                {(f) => (
                  <Segmented
                    label={
                      values.headingFont === 'archivo'
                        ? 'Width'
                        : 'Width (Archivo only)'
                    }
                    value={f.state.value}
                    options={Object.entries(HEADING_WIDTHS).map(
                      ([value, w]) => ({
                        value: value as Appearance['headingWidth'],
                        label: w.label,
                      }),
                    )}
                    onChange={(v) => f.handleChange(v)}
                  />
                )}
              </form.Field>
            </div>
            <form.AppField name="headingUppercase">
              {(f) => (
                <f.SwitchField
                  label="All capitals"
                  description="Sets every heading in capital letters. Works best with wide, heavy settings."
                />
              )}
            </form.AppField>
          </FormSection>

          <FormSection
            title="Body text"
            description="Paragraphs, navigation, buttons and forms."
          >
            <form.Field name="bodyFont">
              {(f) => (
                <Segmented
                  label="Font"
                  value={f.state.value}
                  options={Object.entries(BODY_FONTS).map(([value, font]) => ({
                    value: value as Appearance['bodyFont'],
                    label: font.label,
                    style: { fontFamily: font.family },
                  }))}
                  onChange={(v) => f.handleChange(v)}
                />
              )}
            </form.Field>
          </FormSection>

          <FormSection
            title="Accent colour"
            description="Buttons, links, numbers and the availability dot."
          >
            <form.Field name="accent">
              {(f) => (
                <div
                  role="radiogroup"
                  aria-label="Accent colour"
                  className="flex flex-wrap gap-3"
                >
                  {Object.entries(ACCENTS).map(([key, a]) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={f.state.value === key}
                      onClick={() =>
                        f.handleChange(key as Appearance['accent'])
                      }
                      className={cn(
                        'flex items-center gap-2.5 border py-2 pr-3.5 pl-2 text-sm transition-colors',
                        f.state.value === key
                          ? 'border-ink'
                          : 'border-line-strong hover:border-ink',
                      )}
                    >
                      <span
                        className="size-6"
                        style={{ background: a.light }}
                        aria-hidden
                      />
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </form.Field>
          </FormSection>

          <FormSection
            title="Motion"
            description="Visitors who ask their device for reduced motion always get none."
          >
            <form.Field name="motion">
              {(f) => (
                <div
                  role="radiogroup"
                  aria-label="Motion"
                  className="grid gap-2"
                >
                  {Object.entries(MOTION_LEVELS).map(([key, m]) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={f.state.value === key}
                      onClick={() =>
                        f.handleChange(key as Appearance['motion'])
                      }
                      className={cn(
                        'border p-3 text-left transition-colors',
                        f.state.value === key
                          ? 'border-ink bg-paper-2'
                          : 'border-line-strong hover:border-ink',
                      )}
                    >
                      <span className="block text-sm font-medium">
                        {m.label}
                      </span>
                      <span className="block text-xs text-mute">
                        {m.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form.Field>
          </FormSection>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-3 text-sm font-medium">Preview</p>
          <Preview a={values} />
        </aside>

        <div className="lg:col-span-2">
          <form.AppForm>
            <form.SaveBar label="Save appearance" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}
