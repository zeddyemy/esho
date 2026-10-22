import { useRef, useState } from 'react'
import { revalidateLogic, useForm } from '@tanstack/react-form'
import { ArrowRight, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSubmitInquiry } from '@/hooks/api/inquiries'
import { emptyInquiry, inquirySchema } from '@/lib/schemas/inquiry'
import { cn } from '@/lib/utils'
import type { AnyFieldApi } from '@tanstack/react-form'

const fieldClass =
  'h-12 rounded-none border-0 border-b border-line-strong bg-transparent px-0 text-base shadow-none md:text-base dark:bg-transparent placeholder:text-mute/80 focus-visible:border-cobalt focus-visible:ring-0'

interface InquiryFormProps {
  projectTypes: Array<string>
  budgets: Array<string>
  defaultType?: string
  responseNote: string
  email: string
}

export function InquiryForm({ projectTypes, budgets, defaultType, responseNote, email }: InquiryFormProps) {
  const openedAt = useRef(Date.now())
  const [submittedName, setSubmittedName] = useState<string | null>(null)
  const mutation = useSubmitInquiry()

  const form = useForm({
    defaultValues: {
      ...emptyInquiry,
      projectType: defaultType && projectTypes.includes(defaultType) ? defaultType : '',
    },
    // Validate on the first submit, then live while the visitor fixes fields.
    // (A form-level onBlur validator left stale errors that blocked resubmits.)
    validationLogic: revalidateLogic({ mode: 'submit', modeAfterSubmission: 'change' }),
    validators: { onDynamic: inquirySchema },
    onSubmit: async ({ value }) => {
      // Errors are shown via mutation.isError; don't leave the rejection unhandled.
      const ok = await mutation
        .mutateAsync({ ...value, elapsedMs: Date.now() - openedAt.current })
        .then(
          () => true,
          () => false,
        )
      if (ok) setSubmittedName(value.name.split(' ')[0])
    },
  })

  if (submittedName) {
    return (
      <div className="border border-line bg-paper-2 p-8 md:p-12" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-cobalt text-cobalt-ink">
          <Check className="size-5" />
        </span>
        <h2 className="mt-8 font-display text-4xl tracking-[-0.02em]">Thank you, {submittedName}.</h2>
        <p className="mt-4 max-w-md text-mute">Your message has arrived. {responseNote}</p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            form.reset()
            openedAt.current = Date.now()
            setSubmittedName(null)
          }}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="relative grid gap-x-8 gap-y-8 md:grid-cols-2"
    >
      <form.Field name="name">
        {(field) => (
          <FormField field={field} label="Your name">
            <TextInput field={field} autoComplete="name" />
          </FormField>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <FormField field={field} label="Email">
            <TextInput field={field} type="email" autoComplete="email" />
          </FormField>
        )}
      </form.Field>

      <form.Field name="company">
        {(field) => (
          <FormField field={field} label="Company" hint="Optional">
            <TextInput field={field} autoComplete="organization" />
          </FormField>
        )}
      </form.Field>

      <form.Field name="projectType">
        {(field) => (
          <FormField field={field} label="What do you need?" hint="Optional">
            <ChoiceInput field={field} options={projectTypes} placeholder="Choose one" />
          </FormField>
        )}
      </form.Field>

      <form.Field name="budget">
        {(field) => (
          <FormField field={field} label="Budget" hint="Optional">
            <ChoiceInput field={field} options={budgets} placeholder="Choose a range" />
          </FormField>
        )}
      </form.Field>

      <form.Field name="timeline">
        {(field) => (
          <FormField field={field} label="Timeline" hint="Optional">
            <TextInput field={field} placeholder="e.g. launch by March" />
          </FormField>
        )}
      </form.Field>

      <form.Field name="message">
        {(field) => (
          <FormField field={field} label="About the project" className="md:col-span-2">
            <Textarea
              id={field.name}
              rows={5}
              placeholder="What are you building, who is it for, and where are you stuck?"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={hasError(field)}
              className={cn(fieldClass, 'min-h-32 resize-none py-3')}
            />
          </FormField>
        )}
      </form.Field>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <form.Field name="website">
        {(field) => (
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-mute">{responseNote}</p>
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" size="lg" disabled={isSubmitting} className="group">
              {isSubmitting ? 'Sending' : 'Send message'}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          )}
        </form.Subscribe>
      </div>

      {mutation.isError ? (
        <p role="alert" className="text-sm text-destructive md:col-span-2">
          {mutation.error.message || 'That did not send.'} You can also email{' '}
          <a href={`mailto:${email}`} className="link-static">
            {email}
          </a>
          .
        </p>
      ) : null}
    </form>
  )
}

function TextInput({
  field,
  ...props
}: { field: AnyFieldApi } & Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'onBlur' | 'id'>) {
  return (
    <Input
      id={field.name}
      value={field.state.value as string}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={hasError(field)}
      className={fieldClass}
      {...props}
    />
  )
}

function ChoiceInput({ field, options, placeholder }: { field: AnyFieldApi; options: Array<string>; placeholder: string }) {
  return (
    <Select value={field.state.value as string} onValueChange={(v) => field.handleChange(v)}>
      <SelectTrigger
        id={field.name}
        onBlur={field.handleBlur}
        className={cn(fieldClass, 'w-full data-[size=default]:h-12 data-[placeholder]:text-mute/80 [&_svg]:opacity-60')}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function fieldErrors(field: AnyFieldApi): Array<string> {
  return (field.state.meta.errors as Array<unknown>)
    .map((e) => (typeof e === 'string' ? e : (e as { message?: string } | undefined)?.message))
    .filter((m): m is string => Boolean(m))
}

function hasError(field: AnyFieldApi) {
  return fieldErrors(field).length > 0
}

function FormField({
  field,
  label,
  hint,
  className,
  children,
}: {
  field: AnyFieldApi
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  const errors = hasError(field) ? fieldErrors(field) : []
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={field.name} className="flex justify-between text-sm font-normal text-ink-2">
        <span>{label}</span>
        {hint ? <span className="text-mute">{hint}</span> : null}
      </Label>
      {children}
      {errors[0] ? (
        <p className="text-sm text-destructive" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  )
}
