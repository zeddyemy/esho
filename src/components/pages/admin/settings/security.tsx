import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAppForm } from '@/components/ui/custom/form'
import { useChangePassword } from '@/hooks/api/admin/auth'
import { changePasswordSchema } from '@/lib/schemas/auth'

/** Change-password card. Requires the current password. */
export default function SecuritySettings({ email }: { email: string }) {
  const change = useChangePassword()

  const form = useAppForm({
    defaultValues: { current: '', password: '', confirm: '' },
    validators: { onSubmit: changePasswordSchema },
    onSubmit: async ({ value, formApi }) => {
      const ok = await change.mutateAsync(value).then(
        () => true,
        () => false,
      )
      if (!ok) return
      formApi.reset()
      toast.success('Password changed. Use the new one next time you sign in.')
    },
  })

  return (
    <section id="security" className="scroll-mt-20 border border-line bg-paper-2">
      <div className="border-b border-line px-5 py-4">
        <h3 className="font-medium">Password</h3>
        <p className="mt-1 text-sm text-mute">
          You sign in as <span className="text-ink">{email}</span>.
        </p>
      </div>
      <form
        noValidate
        className="grid gap-5 p-5 md:max-w-md"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        {change.isError ? (
          <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
            <AlertDescription>{change.error.message}</AlertDescription>
          </Alert>
        ) : null}
        {/* Hidden username helps password managers update the right entry. */}
        <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
        <form.AppField name="current">{(f) => <f.TextField label="Current password" type="password" autoComplete="current-password" />}</form.AppField>
        <form.AppField name="password">
          {(f) => <f.TextField label="New password" type="password" autoComplete="new-password" description="At least 10 characters, with a letter and a number." />}
        </form.AppField>
        <form.AppField name="confirm">{(f) => <f.TextField label="Confirm new password" type="password" autoComplete="new-password" />}</form.AppField>
        <form.AppForm>
          <form.SubmitButton className="w-fit">Change password</form.SubmitButton>
        </form.AppForm>
      </form>
    </section>
  )
}
