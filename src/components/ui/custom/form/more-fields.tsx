import { useState } from 'react'
import { X } from 'lucide-react'

import { useFieldContext } from './context'
import { FieldShell, useFieldErrors } from './fields'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const inputClass = 'h-11 border-line-strong bg-paper-2 px-3 text-base md:text-sm focus-visible:border-cobalt focus-visible:ring-cobalt/30'

/**
 * Free-form list of short labels (tags, tools). Enter or comma adds, Backspace
 * on an empty input removes the last one, chips can be removed individually.
 */
export function TagsField({
  label,
  description,
  placeholder = 'Type and press Enter',
  max = 16,
  suggestions = [],
  className,
}: {
  label: string
  description?: string
  placeholder?: string
  max?: number
  suggestions?: Array<string>
  className?: string
}) {
  const field = useFieldContext<Array<string>>()
  const errors = useFieldErrors()
  const [draft, setDraft] = useState('')
  const values = field.state.value

  const add = (raw: string) => {
    const next = raw
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .filter((v) => !values.some((x) => x.toLowerCase() === v.toLowerCase()))
    if (next.length) field.handleChange([...values, ...next].slice(0, max))
    setDraft('')
  }

  const unused = suggestions.filter((s) => !values.includes(s)).slice(0, 8)

  return (
    <FieldShell label={label} description={description} hint={`${values.length}/${max}`} errors={errors} htmlFor={field.name} className={className}>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 border border-line-strong bg-paper-2 px-2 py-1.5 focus-within:border-cobalt">
        {values.map((value) => (
          <span key={value} className="inline-flex items-center gap-1 bg-paper px-2 py-1 text-sm ring-1 ring-line-strong">
            {value}
            <button
              type="button"
              onClick={() => field.handleChange(values.filter((v) => v !== value))}
              aria-label={`Remove ${value}`}
              className="text-mute hover:text-destructive"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        {values.length < max ? (
          <input
            id={field.name}
            value={draft}
            onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value) : setDraft(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add(draft)
              } else if (e.key === 'Backspace' && !draft && values.length) {
                field.handleChange(values.slice(0, -1))
              }
            }}
            onBlur={() => {
              if (draft.trim()) add(draft)
              field.handleBlur()
            }}
            placeholder={values.length ? '' : placeholder}
            className="min-w-32 flex-1 bg-transparent px-1 py-1 text-base outline-none placeholder:text-mute md:text-sm"
          />
        ) : null}
      </div>
      {unused.length ? (
        <div className="flex flex-wrap gap-1.5">
          {unused.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="border border-dashed border-line-strong px-2 py-0.5 text-xs text-mute hover:border-ink hover:text-ink"
            >
              + {s}
            </button>
          ))}
        </div>
      ) : null}
    </FieldShell>
  )
}

export function NumberField({
  label,
  description,
  min,
  max,
  className,
}: {
  label: string
  description?: string
  min?: number
  max?: number
  className?: string
}) {
  const field = useFieldContext<number>()
  const errors = useFieldErrors()
  return (
    <FieldShell label={label} description={description} errors={errors} htmlFor={field.name} className={className}>
      <Input
        id={field.name}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={Number.isFinite(field.state.value) ? field.state.value : ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value === '' ? Number.NaN : Number(e.target.value))}
        aria-invalid={errors.length > 0}
        className={inputClass}
      />
    </FieldShell>
  )
}

/** Native month or date picker bound to a YYYY-MM / YYYY-MM-DD string ('' = empty). */
export function DateField({
  label,
  description,
  type = 'date',
  hint,
  className,
}: {
  label: string
  description?: string
  type?: 'date' | 'month'
  hint?: string
  className?: string
}) {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  return (
    <FieldShell label={label} description={description} hint={hint} errors={errors} htmlFor={field.name} className={className}>
      <Input
        id={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={errors.length > 0}
        className={cn(inputClass, 'w-full sm:w-56')}
      />
    </FieldShell>
  )
}

export function SelectField({
  label,
  description,
  options,
  className,
}: {
  label: string
  description?: string
  options: Array<{ value: string; label: string }>
  className?: string
}) {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  return (
    <FieldShell label={label} description={description} errors={errors} htmlFor={field.name} className={className}>
      <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
        <SelectTrigger id={field.name} onBlur={field.handleBlur} className={cn(inputClass, 'w-full data-[size=default]:h-11')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  )
}
