import { RevealWords } from '@/components/ui/custom/reveal'
import { cn } from '@/lib/utils'

/** Top-of-page heading block for inner pages. Heading animates from first paint. */
export function PageIntro({
  heading,
  body,
  className,
  children,
}: {
  heading: string
  body?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header className={cn('container-site pt-12 pb-12 md:pt-20 md:pb-16', className)}>
      <h1 className="max-w-5xl font-display text-[clamp(2.75rem,7vw,6rem)] leading-[1.02] tracking-[-0.035em]">
        <RevealWords text={heading} />
      </h1>
      {body ? (
        <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-mute md:text-xl" style={{ animationDelay: '0.25s' }}>
          {body}
        </p>
      ) : null}
      {children}
    </header>
  )
}
