import { Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAppForm } from '@/components/ui/custom/form'
import { useSetNewPassword } from '@/hooks/api/admin/auth'
import { resetPasswordSchema } from '@/lib/schemas/auth'

export default function ResetPassword({ linkValid }: { linkValid: boolean }) {
  const router = useRouter()
  const setPassword = useSetNewPassword()

  const form = useAppForm({
    defaultValues: { password: '', confirm: '' },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      const ok = await setPassword.mutateAsync(value).then(() => true, () => false)
      if (!ok) return
      toast.success('Password updated')
      await router.navigate({ to: '/admin' })
    },
  })

  if (!linkValid) {
    return (
      <>
        <h1 className="font-display text-4xl">Link expired</h1>
        <p className="mt-3 text-mute">This reset link is invalid or has already been used. Request a new one.</p>
        <Link to="/admin/forgot-password" className="mt-8 text-sm text-cobalt hover:text-cobalt">
          Request a new link
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="font-display text-4xl">Choose a new password</h1>
      <p className="mt-3 text-mute">At least 10 characters, with a letter and a number.</p>
      <form
        noValidate
        className="mt-10 grid gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        {setPassword.isError ? (
          <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
            <AlertDescription>{setPassword.error.message}</AlertDescription>
          </Alert>
        ) : null}
        <form.AppField name="password">
          {(f) => <f.TextField label="New password" type="password" autoComplete="new-password" />}
        </form.AppField>
        <form.AppField name="confirm">
          {(f) => <f.TextField label="Confirm password" type="password" autoComplete="new-password" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="h-11 w-full">Save password</form.SubmitButton>
        </form.AppForm>
      </form>
    </>
  )
}
