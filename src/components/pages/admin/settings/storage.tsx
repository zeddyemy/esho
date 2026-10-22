import { useMutation } from '@tanstack/react-query'
import { HardDrive, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cleanupMedia } from '@/server/functions/admin/cleanup'
import type { MediaSweep } from '@/server/media-cleanup'

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * Unused-file cleanup. "Check" is a dry run; deleting asks for a second click.
 * The same sweep runs weekly on its own when CRON_SECRET is set on the host.
 */
export default function StorageCleanup() {
  const check = useMutation({ mutationFn: () => cleanupMedia({ data: { dryRun: true } }) })
  const remove = useMutation({
    mutationFn: () => cleanupMedia({ data: { dryRun: false } }),
    onSuccess: (r) => {
      toast.success(`Deleted ${plural(r.images.length + r.files.length, 'unused file')}.`)
      check.reset()
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Cleanup failed'),
  })

  const found: MediaSweep | undefined = check.data
  const count = found ? found.images.length + found.files.length : 0
  const busy = check.isPending || remove.isPending

  return (
    <section id="storage" className="scroll-mt-20 border border-line bg-paper-2">
      <div className="border-b border-line px-5 py-4">
        <h3 className="flex items-center gap-2 font-medium">
          <HardDrive className="size-4 text-mute" /> Unused files
        </h3>
        <p className="mt-1 text-sm text-mute">
          Images and PDFs that were replaced, removed or uploaded but never saved. Files from the last 24 hours are always kept.
        </p>
      </div>
      <div className="grid gap-4 p-5" aria-live="polite">
        {found ? (
          <p className="text-sm">
            {count === 0
              ? `Nothing to clean up. Checked ${plural(found.checked, 'file')}.`
              : `${plural(found.images.length, 'image')} and ${plural(found.files.length, 'PDF')} are not used anywhere on the site.`}
            {found.recent > 0 ? ` ${plural(found.recent, 'recent upload')} will be kept for now.` : ''}
          </p>
        ) : null}
        {check.isError ? <p className="text-sm text-destructive">{check.error.message}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={busy} onClick={() => check.mutate()}>
            {check.isPending ? <Loader2 className="animate-spin" /> : null}
            {found ? 'Check again' : 'Check for unused files'}
          </Button>
          {count > 0 ? (
            <Button type="button" variant="destructive" disabled={busy} onClick={() => remove.mutate()}>
              {remove.isPending ? <Loader2 className="animate-spin" /> : null}
              Delete {plural(count, 'file')}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
