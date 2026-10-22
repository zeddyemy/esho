import { useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export default function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter()
  return (
    <section className="container-site flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="text-meta text-mute">Something went wrong</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.1] md:text-6xl">This page could not load.</h1>
      <p className="mt-6 max-w-md text-mute">Please try again. If it keeps happening, the email in the footer still works.</p>
      {import.meta.env.DEV ? (
        <pre className="mt-6 max-w-2xl overflow-auto bg-paper-2 p-4 text-xs text-mute">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      ) : null}
      <div className="mt-10">
        <Button
          size="lg"
          onClick={() => {
            reset()
            void router.invalidate()
          }}
        >
          Try again
        </Button>
      </div>
    </section>
  )
}
