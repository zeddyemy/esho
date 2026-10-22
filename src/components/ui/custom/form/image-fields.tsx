import { useRef, useState } from 'react'
import { GripVertical, ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react'

import { useFieldContext } from './context'
import { FieldShell } from './fields'
import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SortableList } from '@/components/ui/custom/sortable-list'
import { ACCEPT_ATTR, uploadImage } from '@/lib/cloudinary-upload'
import { cn } from '@/lib/utils'
import type { ImageAsset } from '@/types'

const aspectClass = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[16/10]',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
}

type Aspect = keyof typeof aspectClass

/** Uploads files sequentially, reporting overall progress. */
function useUploader(folder: string) {
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const upload = async (files: Array<File>): Promise<Array<ImageAsset>> => {
    setError(null)
    const done: Array<ImageAsset> = []
    try {
      for (const [i, file] of files.entries()) {
        setProgress(i / files.length)
        const asset = await uploadImage(file, folder, (f) => setProgress((i + f) / files.length))
        done.push({ ...asset, alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setProgress(null)
    }
    return done
  }

  return { upload, progress, error }
}

function ProgressOverlay({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper/75 text-sm">
      <Loader2 className="size-5 animate-spin text-cobalt" />
      <span>Uploading {Math.round(progress * 100)}%</span>
      <span className="h-1 w-32 overflow-hidden rounded-full bg-ink/15">
        <span className="block h-full bg-cobalt transition-[width]" style={{ width: `${progress * 100}%` }} />
      </span>
    </div>
  )
}

/** Single image with preview, replace/remove and alt text. */
export function ImageField({
  label,
  description,
  folder,
  aspect = 'landscape',
  removable = true,
  className,
}: {
  label: string
  description?: string
  folder: string
  aspect?: Aspect
  removable?: boolean
  className?: string
}) {
  const field = useFieldContext<ImageAsset | null>()
  const input = useRef<HTMLInputElement>(null)
  const { upload, progress, error } = useUploader(folder)
  const value = field.state.value

  const pick = async (files: FileList | null) => {
    if (!files?.length) return
    const asset = (await upload([files[0]])).at(0)
    if (asset) field.handleChange({ ...asset, alt: value?.alt || asset.alt })
  }

  return (
    <FieldShell label={label} description={description} errors={error ? [error] : []} htmlFor={`${field.name}-alt`} className={className}>
      <input ref={input} type="file" accept={ACCEPT_ATTR} hidden onChange={(e) => void pick(e.target.files)} />
      <div className={cn('relative max-w-md overflow-hidden rounded-md border border-line bg-paper-2', aspectClass[aspect])}>
        {value?.src ? (
          <MediaImage image={value} fill sizes="448px" />
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex size-full flex-col items-center justify-center gap-2 text-sm text-mute transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <ImagePlus className="size-6" strokeWidth={1.5} />
            Upload photo
          </button>
        )}
        {progress !== null ? <ProgressOverlay progress={progress} /> : null}
      </div>
      {value?.src ? (
        <div className="flex max-w-md flex-col gap-2">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()} disabled={progress !== null}>
              <RefreshCw /> Replace
            </Button>
            {removable ? (
              <Button type="button" variant="ghost" size="sm" className="text-mute" onClick={() => field.handleChange(null)}>
                <Trash2 /> Remove
              </Button>
            ) : null}
          </div>
          <Input
            id={`${field.name}-alt`}
            value={value.alt}
            onChange={(e) => field.handleChange({ ...value, alt: e.target.value })}
            placeholder="Describe the photo (helps Google and screen readers)"
            className="h-9 border-line-strong bg-paper-2 text-sm"
            maxLength={200}
          />
        </div>
      ) : null}
    </FieldShell>
  )
}

/** Ordered set of images: upload several at once, drag to reorder, remove. */
export function ImageListField({
  label,
  description,
  folder,
  aspect = 'portrait',
  max = 12,
}: {
  label: string
  description?: string
  folder: string
  aspect?: Aspect
  max?: number
}) {
  const field = useFieldContext<Array<ImageAsset>>()
  const input = useRef<HTMLInputElement>(null)
  const { upload, progress, error } = useUploader(folder)
  const images = field.state.value

  const pick = async (files: FileList | null) => {
    if (!files?.length) return
    const room = Math.max(0, max - images.length)
    const added = await upload(Array.from(files).slice(0, room))
    if (added.length) field.handleChange([...field.state.value, ...added])
  }

  return (
    <FieldShell
      label={label}
      description={description}
      hint={`${images.length}/${max}`}
      errors={error ? [error] : []}
      htmlFor={`${field.name}-add`}
    >
      <input ref={input} type="file" accept={ACCEPT_ATTR} multiple hidden onChange={(e) => void pick(e.target.files)} />
      <SortableList
        items={images}
        getId={(img) => img.src}
        onReorder={(next) => field.handleChange(next)}
        layout="grid"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        renderItem={(img, handle, index) => (
          <div className="group">
            <div className={cn('relative overflow-hidden rounded-md border border-line bg-paper-2', aspectClass[aspect])}>
              <MediaImage image={img} fill sizes="200px" />
              <button
                type="button"
                {...handle.attributes}
                {...handle.listeners}
                aria-label={`Drag to reorder photo ${index + 1}`}
                className="absolute top-1.5 left-1.5 flex size-8 cursor-grab touch-none items-center justify-center rounded-md bg-paper/70 text-ink active:cursor-grabbing"
              >
                <GripVertical className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => field.handleChange(images.filter((i) => i.src !== img.src))}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute top-1.5 right-1.5 flex size-8 items-center justify-center rounded-md bg-paper/70 text-ink hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
              {index === 0 ? (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-cobalt px-1.5 py-0.5 text-[0.65rem] text-cobalt-ink">First</span>
              ) : null}
            </div>
            <Input
              value={img.alt}
              onChange={(e) =>
                field.handleChange(images.map((i) => (i.src === img.src ? { ...i, alt: e.target.value } : i)))
              }
              placeholder="Describe photo"
              aria-label={`Description for photo ${index + 1}`}
              className="mt-1.5 h-8 border-line bg-paper-2 px-2 text-xs"
              maxLength={200}
            />
          </div>
        )}
      />
      {images.length < max ? (
        <Button
          id={`${field.name}-add`}
          type="button"
          variant="outline"
          className="relative w-fit"
          onClick={() => input.current?.click()}
          disabled={progress !== null}
        >
          {progress !== null ? (
            <>
              <Loader2 className="animate-spin" /> Uploading {Math.round(progress * 100)}%
            </>
          ) : (
            <>
              <ImagePlus /> Add photos
            </>
          )}
        </Button>
      ) : null}
    </FieldShell>
  )
}
