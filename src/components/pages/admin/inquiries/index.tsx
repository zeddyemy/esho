import { useEffect, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react'

import { inquiryColumns, inquiryFeatures } from './columns'
import { InquiryDetailSheet } from './detail-sheet'
import { STATUS_LABEL } from './status'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminInquiriesQuery, useInquiryMutations } from '@/hooks/api/admin/inquiries'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { withToast } from '@/hooks/use-crud-toast'
import { cn } from '@/lib/utils'
import { INQUIRY_STATUSES } from '@/types'
import type { InquiryStatus } from '@/types'

export type StatusTab = 'all' | InquiryStatus

/** Columns hidden on small screens to keep rows readable on a phone. */
const DESKTOP_ONLY = new Set(['projectType'])

export default function Inquiries({ tab, onTabChange }: { tab: StatusTab; onTabChange: (tab: StatusTab) => void }) {
  const { data: inquiries } = useSuspenseQuery(adminInquiriesQuery())
  const { data: settings } = useSuspenseQuery(adminSettingsQuery())
  const m = useInquiryMutations()
  const [openId, setOpenId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, { wait: 250 })

  const counts = useMemo(() => {
    const c: Record<StatusTab, number> = { all: inquiries.length, new: 0, read: 0, replied: 0, archived: 0 }
    for (const q of inquiries) c[q.status]++
    return c
  }, [inquiries])

  const table = useTable({
    features: inquiryFeatures,
    columns: inquiryColumns,
    data: inquiries,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      pagination: { pageIndex: 0, pageSize: 20 },
      columnVisibility: { search: false },
    },
  })

  // Drive the table's filters from the URL tab and the debounced search box.
  useEffect(() => {
    table.getColumn('status')?.setFilterValue(tab === 'all' ? undefined : tab)
    table.getColumn('search')?.setFilterValue(debouncedSearch.trim() || undefined)
    table.setPageIndex(0)
  }, [tab, debouncedSearch, table])

  const open = inquiries.find((q) => q.id === openId) ?? null

  const openInquiry = (id: string) => {
    setOpenId(id)
    const q = inquiries.find((x) => x.id === id)
    if (q?.status === 'new') m.setStatus.mutate({ id, status: 'read' })
  }

  const rows = table.getRowModel().rows
  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className="max-w-6xl">
      <AdminPageHeader title="Enquiries" description="Messages from the contact form. Opening a new enquiry marks it as read." />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 bg-paper-2 p-1" role="tablist" aria-label="Filter by status">
          {(['all', ...INQUIRY_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={tab === s}
              onClick={() => onTabChange(s)}
              className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors', tab === s ? 'bg-paper text-ink ring-1 ring-line-strong' : 'text-mute hover:text-ink')}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
              <span className={cn('text-xs tabular-nums', s === 'new' && counts.new > 0 ? 'text-cobalt' : 'text-mute')}>{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-mute" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or message" aria-label="Search enquiries" className="h-10 border-line-strong bg-paper-2 pl-9" />
        </div>
      </div>

      {inquiries.length === 0 ? (
        <EmptyState icon={Inbox} title="No enquiries yet" body="When someone sends the contact form, it will appear here." />
      ) : (
        <div className="overflow-hidden border border-line bg-paper-2">
          <table className="w-full table-fixed text-sm">
            <thead className="border-b border-line text-left text-xs text-mute">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => {
                    const sorted = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 font-normal',
                          DESKTOP_ONLY.has(header.column.id) && 'hidden lg:table-cell',
                          header.column.id === 'status' && 'w-28',
                          header.column.id === 'createdAt' && 'w-36 text-right',
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-ink">
                            <table.FlexRender header={header} />
                            {sorted === 'asc' ? <ArrowUp className="size-3" /> : sorted === 'desc' ? <ArrowDown className="size-3" /> : null}
                          </button>
                        ) : (
                          <table.FlexRender header={header} />
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-line">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-mute">
                    No enquiries match this filter.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    onClick={() => openInquiry(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openInquiry(row.id)
                      }
                    }}
                    className={cn('cursor-pointer transition-colors hover:bg-paper focus-visible:bg-paper focus-visible:outline-none', row.original.status === 'new' && 'bg-cobalt-soft')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={cn('px-4 py-3 align-middle', DESKTOP_ONLY.has(cell.column.id) && 'hidden lg:table-cell', cell.column.id === 'createdAt' && 'text-right')}>
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {table.getPageCount() > 1 ? (
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-mute">
              <span>
                {filteredCount} enquir{filteredCount === 1 ? 'y' : 'ies'}, page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
                  <ChevronLeft />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">
                  <ChevronRight />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <InquiryDetailSheet
        inquiry={open}
        ownerName={settings.ownerName}
        onClose={() => setOpenId(null)}
        onStatus={(status) => open && m.setStatus.mutate({ id: open.id, status })}
        onDelete={async () => {
          if (!open) return
          const ok = await withToast(m.remove.mutateAsync(open.id), 'Enquiry deleted')
          if (ok) setOpenId(null)
        }}
      />
    </div>
  )
}
