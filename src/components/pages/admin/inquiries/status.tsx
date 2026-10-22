import { cn } from '@/lib/utils'
import type { InquiryStatus } from '@/types'

export const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
}

export function StatusPill({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-xs',
        status === 'new' && 'border-cobalt bg-cobalt text-cobalt-ink',
        status === 'read' && 'border-line-strong text-ink-2',
        status === 'replied' && 'border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300',
        status === 'archived' && 'border-line text-mute',
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
