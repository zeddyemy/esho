import { cn } from '@/lib/utils'

interface PageSectionProps extends React.ComponentProps<'section'> {
  /** Vertical rhythm. Gallery-airy by default. */
  spacing?: 'sm' | 'md' | 'lg' | 'none'
  contained?: boolean
}

const spacingClass = {
  none: '',
  sm: 'py-16 md:py-20',
  md: 'py-24 md:py-32',
  lg: 'py-28 md:py-44',
}

export function PageSection({
  spacing = 'md',
  contained = true,
  className,
  children,
  ...props
}: PageSectionProps) {
  return (
    <section className={cn(spacingClass[spacing], className)} {...props}>
      {contained ? <div className="container-site">{children}</div> : children}
    </section>
  )
}
