import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, MailCheck } from 'lucide-react'

import { useAppForm } from '@/components/ui/custom/form'
import { useRequestPasswordReset } from '@/hooks/api/admin/auth'
import { forgotPasswordSchema } from '@/lib/schemas/auth'

export default function ForgotPassword() {
  const request = useRequestPasswordReset()
  const [sentTo, setSentTo] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: { email: '' },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      await request.mutateAsync(value)
      setSentTo(value.email)
    },
  })

  if (sentTo) {
    return (
      <div role="status">
        <MailCheck className="size-8 text-cobalt" strokeWidth={1.5} />
        <h1 className="mt-6 font-display text-4xl">Check your email</h1>
        <p className="mt-3 text-mute">
          If <span className="text-ink">{sentTo}</span> has admin access, a link to set a new password is on its
          way. It expires in an hour.
        </p>
        <Link to="/admin/login" className="mt-10 inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-display text-4xl">Reset password</h1>
      <p className="mt-3 text-mute">Enter your admin email and we will send you a reset link.</p>
      <form
        noValidate
        className="mt-10 grid gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.AppField name="email">
          {(f) => <f.TextField label="Email" type="email" autoComplete="email" inputMode="email" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton pendingLabel="Sending…" className="h-11 w-full">
            Send reset link
          </form.SubmitButton>
        </form.AppForm>
        <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </form>
    </>
  )
}
