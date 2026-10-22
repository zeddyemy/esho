import { cn } from '@/lib/utils'

/** Square monogram from the brand's first letter, used in admin chrome. */
export function BrandMark({ brand, className }: { brand: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('flex size-8 shrink-0 items-center justify-center bg-ink font-display text-lg leading-none text-paper', className)}
    >
      {brand.trim().charAt(0).toUpperCase() || 'E'}
    </span>
  )
}
