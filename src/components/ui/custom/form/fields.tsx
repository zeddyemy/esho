import { useStore } from '@tanstack/react-form'

import { useFieldContext, useFormContext } from './context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

/** Reads a field's validation messages once it has been blurred or the form submitted. */
export function useFieldErrors() {
  const field = useFieldContext<unknown>()
  const errors = useStore(field.store, (s) => s.meta.errors)
  const blurred = useStore(field.store, (s) => s.meta.isBlurred)
  const attempts = useStore(field.form.store, (s) => s.submissionAttempts)
  if (!blurred && attempts === 0) return []
  return (errors as Array<unknown>)
    .map((e) => (typeof e === 'string' ? e : (e as { message?: string } | undefined)?.message))
    .filter((m): m is string => Boolean(m))
}

interface FieldShellProps {
  label: string
  description?: string
  className?: string
  children: React.ReactNode
  errors: Array<string>
  htmlFor: string
  hint?: string
}

export function FieldShell({ label, description, className, children, errors, htmlFor, hint }: FieldShellProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
        </Label>
        {hint ? <span className="text-xs text-mute">{hint}</span> : null}
      </div>
      {children}
      {description && errors.length === 0 ? <p className="text-xs text-mute">{description}</p> : null}
      {errors[0] ? (
        <p className="text-xs text-destructive" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  )
}

const inputClass = 'h-11 border-line-strong bg-paper-2 px-3 text-base md:text-sm focus-visible:border-cobalt focus-visible:ring-cobalt/30'

export function TextField({
  label,
  description,
  hint,
  className,
  ...props
}: { label: string; description?: string; hint?: string; className?: string } & Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'className'
>) {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  return (
    <FieldShell label={label} description={description} hint={hint} errors={errors} htmlFor={field.name} className={className}>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={errors.length > 0}
        className={inputClass}
        {...props}
      />
    </FieldShell>
  )
}

export function TextareaField({
  label,
  description,
  hint,
  className,
  rows = 4,
  maxLength,
  placeholder,
}: {
  label: string
  description?: string
  hint?: string
  className?: string
  rows?: number
  maxLength?: number
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  const length = field.state.value.length
  return (
    <FieldShell
      label={label}
      description={description}
      hint={maxLength ? `${length}/${maxLength}` : hint}
      errors={errors}
      htmlFor={field.name}
      className={className}
    >
      <Textarea
        id={field.name}
        name={field.name}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={errors.length > 0}
        className={cn(inputClass, 'h-auto min-h-24 py-2.5 leading-relaxed')}
      />
    </FieldShell>
  )
}

export function SwitchField({ label, description, className }: { label: string; description?: string; className?: string }) {
  const field = useFieldContext<boolean>()
  return (
    <div className={cn('flex items-start justify-between gap-6 border border-line bg-paper-2 p-4', className)}>
      <div className="grid gap-1">
        <Label htmlFor={field.name} className="text-sm font-medium text-ink">
          {label}
        </Label>
        {description ? <p className="text-xs leading-relaxed text-mute">{description}</p> : null}
      </div>
      <Switch
        id={field.name}
        checked={field.state.value}
        onCheckedChange={(v) => field.handleChange(v)}
        onBlur={field.handleBlur}
      />
    </div>
  )
}

export function SubmitButton({
  children,
  pendingLabel = 'Saving',
  className,
  disableWhenPristine = false,
}: {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
  disableWhenPristine?: boolean
}) {
  const form = useFormContext()
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)
  const isDirty = useStore(form.store, (s) => s.isDirty)
  return (
    <Button type="submit" disabled={isSubmitting || (disableWhenPristine && !isDirty)} className={className}>
      {isSubmitting ? pendingLabel : children}
    </Button>
  )
}
