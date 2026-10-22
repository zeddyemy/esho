import { GripVertical, Pencil } from 'lucide-react'

import { ConfirmDelete } from './confirm-delete'
import { Button } from '@/components/ui/button'
import { SortableList } from '@/components/ui/custom/sortable-list'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface Row {
  id: string
}

interface SortableRowsProps<T extends Row> {
  items: Array<T>
  onReorder: (items: Array<T>) => void
  renderMain: (item: T) => React.ReactNode
  renderLeading?: (item: T) => React.ReactNode
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  deleteCopy: (item: T) => { title: string; description: string }
  visibility?: { isVisible: (item: T) => boolean; onChange: (item: T, visible: boolean) => void }
  /** Extra per-row controls rendered before the show/hide switch. */
  renderActions?: (item: T) => React.ReactNode
  empty: React.ReactNode
}

/** Drag-to-reorder admin list with edit, delete and optional show/hide switch per row. */
export function SortableRows<T extends Row>({
  items,
  onReorder,
  renderMain,
  renderLeading,
  onEdit,
  onDelete,
  deleteCopy,
  visibility,
  renderActions,
  empty,
}: SortableRowsProps<T>) {
  if (items.length === 0) return <>{empty}</>
  return (
    <SortableList
      items={items}
      getId={(i) => i.id}
      onReorder={onReorder}
      className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-paper-2"
      renderItem={(item, handle) => {
        const hidden = visibility ? !visibility.isVisible(item) : false
        const copy = deleteCopy(item)
        return (
          <div className={cn('flex items-center gap-3 px-3 py-3 sm:px-4', handle.isDragging && 'bg-paper-2')}>
            <button
              type="button"
              {...handle.attributes}
              {...handle.listeners}
              aria-label="Drag to reorder"
              className="flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded text-mute hover:text-ink active:cursor-grabbing"
            >
              <GripVertical className="size-4" />
            </button>
            {renderLeading ? <div className={cn('shrink-0', hidden && 'opacity-50')}>{renderLeading(item)}</div> : null}
            <button
              type="button"
              onClick={() => onEdit(item)}
              className={cn('min-w-0 flex-1 text-left', hidden && 'opacity-50')}
            >
              {renderMain(item)}
            </button>
            {renderActions?.(item)}
            {visibility ? (
              <Switch
                checked={!hidden}
                onCheckedChange={(v) => visibility.onChange(item, v)}
                aria-label={hidden ? 'Show on website' : 'Hide from website'}
              />
            ) : null}
            <Button type="button" variant="ghost" size="icon" className="text-mute" onClick={() => onEdit(item)} aria-label="Edit">
              <Pencil />
            </Button>
            <ConfirmDelete title={copy.title} description={copy.description} label={`Delete ${copy.title.replace(/^Delete\s*/, '').replace(/\?$/, '')}`} onConfirm={() => onDelete(item)} />
          </div>
        )
      }}
    />
  )
}

export function EmptyState({ icon: Icon, title, body, action }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start rounded-lg border border-dashed border-line-strong p-8">
      <Icon className="size-6 text-cobalt" strokeWidth={1.5} />
      <p className="mt-4 font-display text-2xl">{title}</p>
      <p className="mt-2 max-w-md text-sm text-mute">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
