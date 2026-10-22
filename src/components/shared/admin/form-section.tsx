import { cn } from '@/lib/utils'

/** Two-column settings section: explanation on the left, fields on the right. */
export function FormSection({
  title,
  description,
  children,
  id,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  id?: string
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn('grid scroll-mt-20 gap-6 border-t border-line py-8 first:border-t-0 first:pt-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10', className)}
    >
      <div>
        <h3 className="font-medium">{title}</h3>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-mute">{description}</p> : null}
      </div>
      <div className="grid min-w-0 content-start gap-5">{children}</div>
    </section>
  )
}
