import { Mail, MessageCircle, Trash2 } from 'lucide-react'

import { formatReceived } from './columns'
import { STATUS_LABEL } from './status'
import { ConfirmDelete } from '@/components/shared/admin/confirm-delete'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { INQUIRY_STATUSES } from '@/types'
import type { Inquiry, InquiryStatus } from '@/types'

export function InquiryDetailSheet({
  inquiry,
  ownerName,
  onClose,
  onStatus,
  onDelete,
}: {
  inquiry: Inquiry | null
  ownerName: string
  onClose: () => void
  onStatus: (status: InquiryStatus) => void
  onDelete: () => void
}) {
  const firstName = inquiry?.name.split(' ')[0] ?? ''
  const subject = inquiry ? `Re: ${inquiry.projectType || 'your project'}` : ''
  const body = inquiry ? `Hi ${firstName},\n\nThanks for getting in touch about ${inquiry.projectType ? inquiry.projectType.toLowerCase() : 'your project'}.\n\n\n${ownerName.split(' ')[0]}` : ''

  return (
    <EditSheet open={inquiry !== null} onOpenChange={(o) => !o && onClose()} title={inquiry?.name ?? ''} description={inquiry ? `Received ${formatReceived(inquiry.createdAt)}` : undefined}>
      {inquiry ? (
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-2">
            <Button asChild onClick={() => inquiry.status !== 'replied' && onStatus('replied')}>
              <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
                <Mail /> Reply by email
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`https://wa.me/?text=${encodeURIComponent(`Hi ${firstName}, `)}`} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border border-line bg-paper-2 p-4 text-sm">
            {[
              ['Email', inquiry.email],
              ['Company', inquiry.company || 'Not given'],
              ['Project', inquiry.projectType || 'Not specified'],
              ['Budget', inquiry.budget || 'Not specified'],
              ['Timeline', inquiry.timeline || 'Not specified'],
            ].map(([label, value]) => (
              <div key={label} className={label === 'Email' ? 'col-span-2 min-w-0' : 'min-w-0'}>
                <dt className="text-xs text-mute">{label}</dt>
                <dd className="mt-1 break-words">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-xs text-mute">Message</p>
            <p className="mt-2 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          <div>
            <p className="text-xs text-mute">Status</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Status">
              {INQUIRY_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={inquiry.status === s}
                  onClick={() => onStatus(s)}
                  className={cn(
                    'border px-3 py-1.5 text-sm transition-colors',
                    inquiry.status === s ? 'border-ink bg-ink text-paper' : 'border-line-strong text-mute hover:text-ink',
                  )}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-line pt-5">
            <ConfirmDelete
              title="Delete this enquiry?"
              description="It will be removed permanently. Archive it instead if you might need it later."
              onConfirm={onDelete}
              trigger={
                <Button type="button" variant="ghost" className="text-mute hover:text-destructive">
                  <Trash2 /> Delete enquiry
                </Button>
              }
            />
          </div>
        </div>
      ) : null}
    </EditSheet>
  )
}
