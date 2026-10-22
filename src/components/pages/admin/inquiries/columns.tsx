import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
} from '@tanstack/react-table'

import { StatusPill } from './status'
import { BUSINESS_TIME_ZONE } from '@/lib/utils'
import type { Inquiry } from '@/types'

export const inquiryFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
  filterFns: { includesString: filterFn_includesString, equalsString: filterFn_equalsString },
})

const col = createColumnHelper<typeof inquiryFeatures, Inquiry>()

const timeFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: BUSINESS_TIME_ZONE })

export const formatReceived = (iso: string) => timeFmt.format(new Date(iso))

export const inquiryColumns = col.columns([
  col.accessor('name', {
    header: 'From',
    sortFn: 'alphanumeric',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className={row.original.status === 'new' ? 'truncate font-semibold' : 'truncate'}>{row.original.name}</p>
        <p className="truncate text-xs text-mute">{row.original.company || row.original.email}</p>
      </div>
    ),
  }),
  col.accessor((r) => r.projectType ?? '', {
    id: 'projectType',
    header: 'Project',
    sortFn: 'alphanumeric',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate">{row.original.projectType || 'Not specified'}</p>
        {row.original.budget ? <p className="truncate text-xs text-mute">{row.original.budget}</p> : null}
      </div>
    ),
  }),
  col.accessor('status', {
    header: 'Status',
    filterFn: 'equalsString',
    cell: ({ getValue }) => <StatusPill status={getValue()} />,
  }),
  col.accessor((r) => new Date(r.createdAt), {
    id: 'createdAt',
    header: 'Received',
    sortFn: 'datetime',
    cell: ({ row }) => <span className="whitespace-nowrap text-mute">{formatReceived(row.original.createdAt)}</span>,
  }),
  // Hidden column that feeds the search box.
  col.accessor((r) => [r.name, r.email, r.company, r.projectType, r.budget, r.timeline, r.message].filter(Boolean).join(' '), {
    id: 'search',
    filterFn: 'includesString',
  }),
])
