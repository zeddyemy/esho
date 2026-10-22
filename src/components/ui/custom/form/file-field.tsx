import { useRef, useState } from 'react'
import { FileText, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react'

import { useFieldContext } from './context'
import { FieldShell } from './fields'
import { Button } from '@/components/ui/button'
import { uploadPdf } from '@/lib/file-upload'
import type { FileAsset } from '@/types'

const size = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)

/** Single PDF upload (the résumé). The previous file is deleted on save. */
export function FileField({ label, description, className }: { label: string; description?: string; className?: string }) {
  const field = useFieldContext<FileAsset | null>()
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const value = field.state.value

  const pick = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setError(null)
    setProgress(0)
    try {
      field.handleChange(await uploadPdf(file, setProgress))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setProgress(null)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <FieldShell label={label} description={description} errors={error ? [error] : []} htmlFor={`${field.name}-upload`} className={className}>
      <input ref={input} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => void pick(e.target.files)} />
      {value ? (
        <div className="flex flex-wrap items-center gap-3 border border-line-strong bg-paper-2 p-3">
          <FileText className="size-8 shrink-0 text-cobalt" strokeWidth={1.25} />
          <div className="min-w-0 flex-1">
            <a href={value.url} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium hover:underline">
              {value.filename}
            </a>
            <p className="text-xs text-mute">
              {size(value.bytes)}, uploaded {new Date(value.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-1">
            <Button id={`${field.name}-upload`} type="button" variant="outline" size="sm" onClick={() => input.current?.click()} disabled={progress !== null}>
              {progress !== null ? <Loader2 className="animate-spin" /> : <RefreshCw />} Replace
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-mute" onClick={() => field.handleChange(null)}>
              <Trash2 /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button id={`${field.name}-upload`} type="button" variant="outline" className="w-fit" onClick={() => input.current?.click()} disabled={progress !== null}>
          {progress !== null ? (
            <>
              <Loader2 className="animate-spin" /> Uploading {Math.round(progress * 100)}%
            </>
          ) : (
            <>
              <Upload /> Upload PDF
            </>
          )}
        </Button>
      )}
    </FieldShell>
  )
}
