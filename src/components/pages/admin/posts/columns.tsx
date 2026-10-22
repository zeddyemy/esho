import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
} from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import type { AdminPost } from '@/hooks/api/admin/catalog'

export const postFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
  filterFns: { includesString: filterFn_includesString, equalsString: filterFn_equalsString },
})

const col = createColumnHelper<typeof postFeatures, AdminPost>()

export const postColumns = col.columns([
  col.accessor('title', {
    header: 'Title',
    sortFn: 'alphanumeric',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{row.original.title}</p>
        <p className="truncate text-xs text-mute">{row.original.tags.join(', ') || 'No tags'}</p>
      </div>
    ),
  }),
  col.accessor((p) => (p.published ? 'published' : 'draft'), {
    id: 'status',
    header: 'Status',
    filterFn: 'equalsString',
    cell: ({ getValue }) =>
      getValue() === 'published' ? (
        <Badge className="bg-cobalt text-cobalt-ink">Published</Badge>
      ) : (
        <Badge variant="outline" className="border-line-strong text-mute">
          Draft
        </Badge>
      ),
  }),
  col.accessor((p) => new Date(p.publishedAt ?? p.updatedAt), {
    id: 'date',
    header: 'Date',
    sortFn: 'datetime',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-mute">
        {row.original.publishedAt ? formatDate(row.original.publishedAt) : `Edited ${formatDate(row.original.updatedAt)}`}
      </span>
    ),
  }),
  col.accessor('readingMinutes', {
    header: 'Read',
    cell: ({ getValue }) => <span className="text-mute">{getValue()} min</span>,
  }),
  // Hidden column that feeds the search box.
  col.accessor((p) => [p.title, p.excerpt, ...p.tags].join(' '), { id: 'search', filterFn: 'includesString' }),
])
