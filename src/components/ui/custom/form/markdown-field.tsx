import { useRef, useState } from 'react'
import { Bold, Code, Heading2, ImagePlus, Italic, Link2, List, Loader2, Quote } from 'lucide-react'

import { useFieldContext } from './context'
import { FieldShell, useFieldErrors } from './fields'
import { Textarea } from '@/components/ui/textarea'
import { ACCEPT_ATTR, uploadImage } from '@/lib/cloudinary-upload'
import { cn } from '@/lib/utils'
import { previewMarkdown } from '@/server/functions/admin/preview'

type Edit = { before: string; after?: string; placeholder?: string; line?: boolean }

const TOOLS: Array<{ label: string; icon: React.ComponentType<{ className?: string }>; edit: Edit }> = [
  { label: 'Heading', icon: Heading2, edit: { before: '## ', placeholder: 'Heading', line: true } },
  { label: 'Bold', icon: Bold, edit: { before: '**', after: '**', placeholder: 'bold text' } },
  { label: 'Italic', icon: Italic, edit: { before: '_', after: '_', placeholder: 'italic text' } },
  { label: 'Link', icon: Link2, edit: { before: '[', after: '](https://)', placeholder: 'link text' } },
  { label: 'List', icon: List, edit: { before: '- ', placeholder: 'List item', line: true } },
  { label: 'Quote', icon: Quote, edit: { before: '> ', placeholder: 'Quote', line: true } },
  { label: 'Code block', icon: Code, edit: { before: '```ts\n', after: '\n```', placeholder: 'code' } },
]

/**
 * Markdown editor: textarea with formatting shortcuts, inline image upload,
 * and a Preview tab rendered by the same server pipeline as the public site.
 */
export function MarkdownField({
  label,
  description,
  folder,
  rows = 18,
  className,
}: {
  label: string
  description?: string
  folder: string
  rows?: number
  className?: string
}) {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  const area = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [preview, setPreview] = useState<{ html: string; source: string } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const apply = ({ before, after = '', placeholder = '', line }: Edit) => {
    const el = area.current
    if (!el) return
    const value = field.state.value
    let start = el.selectionStart
    const end = el.selectionEnd
    if (line) start = value.lastIndexOf('\n', start - 1) + 1
    const selected = value.slice(start, end) || placeholder
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    field.handleChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  const showPreview = async () => {
    setTab('preview')
    const source = field.state.value
    if (preview?.source === source) return
    setBusy('Rendering preview')
    try {
      const { html } = await previewMarkdown({ data: { markdown: source } })
      setPreview({ html, source })
    } finally {
      setBusy(null)
    }
  }

  const insertImage = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setBusy('Uploading image')
    try {
      const img = await uploadImage(file, folder)
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
      apply({ before: `\n![${alt}](${img.src})\n`, line: false })
    } catch (err) {
      setBusy(err instanceof Error ? err.message : 'Upload failed')
      setTimeout(() => setBusy(null), 3000)
      return
    }
    setBusy(null)
  }

  return (
    <FieldShell label={label} description={description} hint={`${field.state.value.length} characters`} errors={errors} htmlFor={field.name} className={className}>
      <div className="border border-line-strong bg-paper-2 focus-within:border-cobalt">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-2 py-1.5">
          <div className="flex gap-1" role="tablist" aria-label="Editor mode">
            {(['write', 'preview'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => (t === 'preview' ? void showPreview() : setTab('write'))}
                className={cn('px-2.5 py-1 text-sm capitalize', tab === t ? 'bg-paper text-ink ring-1 ring-line-strong' : 'text-mute hover:text-ink')}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === 'write' ? (
            <div className="flex flex-wrap gap-0.5">
              {TOOLS.map(({ label: l, icon: Icon, edit }) => (
                <button key={l} type="button" title={l} aria-label={l} onClick={() => apply(edit)} className="flex size-8 items-center justify-center text-mute hover:bg-paper hover:text-ink">
                  <Icon className="size-4" />
                </button>
              ))}
              <button type="button" title="Insert image" aria-label="Insert image" onClick={() => fileInput.current?.click()} className="flex size-8 items-center justify-center text-mute hover:bg-paper hover:text-ink">
                <ImagePlus className="size-4" />
              </button>
              <input ref={fileInput} type="file" accept={ACCEPT_ATTR} hidden onChange={(e) => void insertImage(e.target.files)} />
            </div>
          ) : null}
        </div>

        {tab === 'write' ? (
          <Textarea
            ref={area}
            id={field.name}
            rows={rows}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            aria-invalid={errors.length > 0}
            spellCheck
            className="min-h-80 resize-y border-0 bg-transparent px-4 py-3 font-mono text-sm leading-relaxed shadow-none focus-visible:ring-0"
          />
        ) : (
          <div className="min-h-80 bg-paper px-5 py-4">
            {preview && preview.source === field.state.value ? (
              preview.html ? (
                <div className="prose-editorial max-w-[68ch]" dangerouslySetInnerHTML={{ __html: preview.html }} />
              ) : (
                <p className="text-sm text-mute">Nothing to preview yet.</p>
              )
            ) : null}
          </div>
        )}

        {busy ? (
          <p className="flex items-center gap-2 border-t border-line px-3 py-2 text-xs text-mute" role="status">
            <Loader2 className="size-3.5 animate-spin" /> {busy}
          </p>
        ) : null}
      </div>
      <p className="text-xs text-mute">
        Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>- list</code>, <code>[link](https://…)</code>, and code blocks with three backticks.
      </p>
    </FieldShell>
  )
}
