import { useEffect, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, BookOpenText, EyeOff, Plus, Search } from 'lucide-react'

import { postColumns, postFeatures } from './columns'
import { CreateWithSlug } from '@/components/shared/admin/create-with-slug'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminPostsQuery, usePostMutations } from '@/hooks/api/admin/catalog'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { withToast } from '@/hooks/use-crud-toast'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'published' | 'draft'

export default function Posts() {
  const { data: posts } = useSuspenseQuery(adminPostsQuery())
  const { data: settings } = useSuspenseQuery(adminSettingsQuery())
  const m = usePostMutations()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, { wait: 200 })

  const table = useTable({
    features: postFeatures,
    columns: postColumns,
    data: posts,
    getRowId: (row) => row.id,
    initialState: { sorting: [{ id: 'date', desc: true }], columnVisibility: { search: false } },
  })

  useEffect(() => {
    table.getColumn('status')?.setFilterValue(filter === 'all' ? undefined : filter)
    table.getColumn('search')?.setFilterValue(debouncedSearch.trim() || undefined)
  }, [filter, debouncedSearch, table])

  const counts = { all: posts.length, published: posts.filter((p) => p.published).length, draft: posts.filter((p) => !p.published).length }
  const rows = table.getRowModel().rows
  const open = (id: string) => void navigate({ to: '/admin/posts/$postId', params: { postId: id } })

  const addButton = (
    <Button onClick={() => setCreating(true)}>
      <Plus /> New article
    </Button>
  )

  return (
    <div className="max-w-5xl">
      <AdminPageHeader title="Writing" description="Articles for the Writing page. Drafts stay private until you publish them." actions={addButton} />

      {!settings.showWriting ? (
        <div className="mb-6 flex items-start gap-3 border border-cobalt/30 bg-cobalt-soft p-4 text-sm">
          <EyeOff className="mt-0.5 size-4 shrink-0 text-cobalt" />
          <p>
            Writing is hidden on the website.{' '}
            <Link to="/admin/settings" hash="visibility" className="text-cobalt underline-offset-4 hover:underline">
              Change in Settings
            </Link>
          </p>
        </div>
      ) : null}

      {posts.length === 0 ? (
        <EmptyState icon={BookOpenText} title="No articles yet" body="Write your first article. Markdown and code blocks are supported." action={addButton} />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 bg-paper-2 p-1" role="tablist" aria-label="Filter by status">
              {(['all', 'published', 'draft'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 text-sm capitalize', filter === f ? 'bg-paper text-ink ring-1 ring-line-strong' : 'text-mute hover:text-ink')}
                >
                  {f === 'draft' ? 'Drafts' : f}
                  <span className="text-xs text-mute tabular-nums">{counts[f]}</span>
                </button>
              ))}
            </div>
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-mute" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles" aria-label="Search articles" className="h-10 border-line-strong bg-paper-2 pl-9" />
            </div>
          </div>

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
                            header.column.id === 'status' && 'w-28',
                            header.column.id === 'date' && 'hidden w-44 md:table-cell',
                            header.column.id === 'readingMinutes' && 'hidden w-20 md:table-cell',
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
                      No articles match.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      tabIndex={0}
                      onClick={() => open(row.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') open(row.id)
                      }}
                      className="cursor-pointer transition-colors hover:bg-paper focus-visible:bg-paper focus-visible:outline-none"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={cn('px-4 py-3 align-middle', (cell.column.id === 'date' || cell.column.id === 'readingMinutes') && 'hidden md:table-cell')}
                        >
                          <table.FlexRender cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <EditSheet open={creating} onOpenChange={setCreating} title="New article">
        {creating ? (
          <CreateWithSlug
            noun="Article"
            basePath="/writing"
            placeholder="e.g. Why I never store a balance"
            note="You will write the article on the next screen. It stays a draft until you publish it."
            onSubmit={async (value) => {
              const result = await withToast(m.create.mutateAsync({ data: value }), 'Article created')
              if (result) {
                setCreating(false)
                await navigate({ to: '/admin/posts/$postId', params: { postId: result.id } })
              }
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
