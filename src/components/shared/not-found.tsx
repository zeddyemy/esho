import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="text-meta text-mute">404</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[1.05] md:text-7xl">This page does not exist.</h1>
      <p className="mt-6 max-w-md text-mute">It may have moved, or the link may be mistyped.</p>
      <div className="mt-10">
        <Button asChild size="lg">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </section>
  )
}
