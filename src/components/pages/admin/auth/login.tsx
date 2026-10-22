import { Link, useRouter } from '@tanstack/react-router'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAppForm } from '@/components/ui/custom/form'
import { useSignIn } from '@/hooks/api/admin/auth'
import { signInSchema } from '@/lib/schemas/auth'

export default function Login({ redirect }: { redirect?: string }) {
  const router = useRouter()
  const signIn = useSignIn()

  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      // Errors are shown via signIn.isError; don't leave the rejection unhandled.
      const ok = await signIn.mutateAsync(value).then(() => true, () => false)
      if (!ok) return
      // Only follow same-site admin redirects.
      const target = redirect?.startsWith('/admin') ? redirect : '/admin'
      // Static admin pages (e.g. /admin/guide.html) are served by the server, not the router.
      if (target.endsWith('.html')) {
        window.location.assign(target)
        return
      }
      await router.invalidate()
      await router.navigate({ to: target })
    },
  })

  return (
    <>
      <h1 className="font-display text-4xl">Welcome back</h1>
      <p className="mt-3 text-mute">Sign in to update your website.</p>

      <form
        noValidate
        className="mt-10 grid gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        {signIn.isError ? (
          <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
            <AlertDescription>{signIn.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <form.AppField name="email">
          {(f) => <f.TextField label="Email" type="email" autoComplete="email" inputMode="email" />}
        </form.AppField>
        <form.AppField name="password">
          {(f) => <f.TextField label="Password" type="password" autoComplete="current-password" />}
        </form.AppField>

        <div className="flex justify-between gap-4">
          <a href="/admin/guide.html" target="_blank" rel="noreferrer" className="text-sm text-mute hover:text-ink">
            Read the guide
          </a>
          <Link to="/admin/forgot-password" className="text-sm text-mute hover:text-ink">
            Forgot password?
          </Link>
        </div>

        <form.AppForm>
          <form.SubmitButton pendingLabel="Signing in…" className="h-11 w-full">
            Sign in
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </>
  )
}
