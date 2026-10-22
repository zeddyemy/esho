/**
 * Finds and deletes uploaded files that nothing on the site uses any more:
 * images in Cloudinary under `esho/` and résumé PDFs in Supabase Storage.
 * Server-only (uses the secret key and the Cloudinary API secret).
 *
 * A file counts as used if any row in any content table references it, either
 * as an ImageAsset/FileAsset `publicId` or as a Cloudinary URL inside text
 * (images inserted into markdown bodies). Files younger than the grace period
 * are always kept, so an upload that has not been saved yet is never removed.
 */
import { v2 as cloudinary } from 'cloudinary'

import { CLOUDINARY_ROOT, destroyImages } from '@/server/cloudinary'
import { requireServerEnv } from '@/server/env'
import { FILES_BUCKET, removeFiles } from '@/server/storage'
import { getServiceClient } from '@/server/supabase'

const GRACE_MS = 24 * 60 * 60 * 1000

/** Tables (all columns) whose rows can reference uploads. */
const CONTENT_TABLES = ['site_settings', 'page_content', 'projects', 'posts', 'testimonials'] as const

/** Matches the public id in a Cloudinary delivery URL, with or without transforms and version. */
const CLOUDINARY_URL = new RegExp(
  String.raw`res\.cloudinary\.com/[^/\s]+/image/upload/(?:[^\s"')]*?/)?(?:v\d+/)?(${CLOUDINARY_ROOT}/[^\s"')?#]+?)\.[a-z0-9]{2,5}`,
  'gi',
)

/** Walks any JSON value collecting referenced Cloudinary public ids and storage paths. */
export function collectReferences(value: unknown, out = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    for (const match of value.matchAll(CLOUDINARY_URL)) out.add(match[1])
  } else if (Array.isArray(value)) {
    for (const v of value) collectReferences(v, out)
  } else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) {
      if (key === 'publicId' && typeof v === 'string') out.add(v)
      else collectReferences(v, out)
    }
  }
  return out
}

interface StoredFile {
  id: string
  createdAt: number
}

async function listCloudinaryImages(): Promise<Array<StoredFile>> {
  cloudinary.config({
    cloud_name: requireServerEnv('VITE_CLOUDINARY_CLOUD_NAME'),
    api_key: requireServerEnv('CLOUDINARY_API_KEY'),
    api_secret: requireServerEnv('CLOUDINARY_API_SECRET'),
    secure: true,
  })
  const files: Array<StoredFile> = []
  let cursor: string | undefined
  do {
    const page = (await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: `${CLOUDINARY_ROOT}/`,
      max_results: 500,
      next_cursor: cursor,
    })) as { resources: Array<{ public_id: string; created_at: string }>; next_cursor?: string }
    for (const r of page.resources) files.push({ id: r.public_id, createdAt: Date.parse(r.created_at) })
    cursor = page.next_cursor
  } while (cursor)
  return files
}

async function listStoredResumes(): Promise<Array<StoredFile>> {
  const { data, error } = await getServiceClient().storage.from(FILES_BUCKET).list('resume', { limit: 1000 })
  if (error) throw new Error(error.message)
  return data
    .filter((f) => f.id) // folders have no id
    // A missing date parses to NaN, which never passes the age check: the file is kept.
    .map((f) => ({ id: `resume/${f.name}`, createdAt: Date.parse(f.created_at ?? '') }))
}

async function findReferences(): Promise<Set<string>> {
  const db = getServiceClient()
  const refs = new Set<string>()
  const results = await Promise.all(CONTENT_TABLES.map((table) => db.from(table).select('*')))
  for (const [i, { data, error }] of results.entries()) {
    if (error) throw new Error(`[cleanup:${CONTENT_TABLES[i]}] ${error.message}`)
    collectReferences(data, refs)
  }
  return refs
}

export interface MediaSweep {
  images: Array<string>
  files: Array<string>
  /** Unused but newer than the grace period, so kept for now. */
  recent: number
  checked: number
  deleted: boolean
}

/**
 * Lists unused uploads and, unless `dryRun`, deletes them. References are read
 * after listing, so a file saved while the sweep runs is still seen as used.
 */
export async function sweepMedia({ dryRun, graceMs = GRACE_MS }: { dryRun: boolean; graceMs?: number }): Promise<MediaSweep> {
  const [images, resumes] = await Promise.all([listCloudinaryImages(), listStoredResumes()])
  const refs = await findReferences()
  const cutoff = Date.now() - graceMs

  const unused = (files: Array<StoredFile>) => files.filter((f) => !refs.has(f.id))
  const old = (files: Array<StoredFile>) => files.filter((f) => f.createdAt < cutoff).map((f) => f.id)

  const unusedImages = unused(images)
  const unusedFiles = unused(resumes)
  const result: MediaSweep = {
    images: old(unusedImages),
    files: old(unusedFiles),
    recent: unusedImages.length + unusedFiles.length - old(unusedImages).length - old(unusedFiles).length,
    checked: images.length + resumes.length,
    deleted: false,
  }

  if (!dryRun && (result.images.length || result.files.length)) {
    // Cloudinary deletes at most 100 ids per call.
    for (let i = 0; i < result.images.length; i += 100) await destroyImages(result.images.slice(i, i + 100))
    await removeFiles(result.files)
    result.deleted = true
  }
  return result
}
