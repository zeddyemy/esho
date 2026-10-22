/**
 * Cloudinary helpers. Server-only (uses the API secret).
 *
 * Uploads go straight from the admin's browser to Cloudinary using a short-
 * lived signature from `signUpload`, so large files never pass through our
 * server. Deletions happen here when media or albums are removed.
 */
import { v2 as cloudinary } from 'cloudinary'

import { requireServerEnv } from '@/server/env'

export const CLOUDINARY_ROOT = 'upc'

let configured = false

function client() {
  if (!configured) {
    cloudinary.config({
      cloud_name: requireServerEnv('VITE_CLOUDINARY_CLOUD_NAME'),
      api_key: requireServerEnv('CLOUDINARY_API_KEY'),
      api_secret: requireServerEnv('CLOUDINARY_API_SECRET'),
      secure: true,
    })
    configured = true
  }
  return cloudinary
}

/** Stored originals are capped at 3000px on the long edge to save storage. */
const INCOMING_TRANSFORMATION = 'c_limit,w_3000,h_3000'

export interface SignedUpload {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  transformation: string
}

/** Signs a direct browser upload into `upc/<folder>`. Valid for about an hour. */
export function signUpload(folder: string): SignedUpload {
  const c = client()
  const timestamp = Math.round(Date.now() / 1000)
  const target = `${CLOUDINARY_ROOT}/${folder.replace(/[^a-z0-9/_-]/gi, '')}`
  const signature = c.utils.api_sign_request(
    { timestamp, folder: target, transformation: INCOMING_TRANSFORMATION },
    requireServerEnv('CLOUDINARY_API_SECRET'),
  )
  return {
    cloudName: requireServerEnv('VITE_CLOUDINARY_CLOUD_NAME'),
    apiKey: requireServerEnv('CLOUDINARY_API_KEY'),
    timestamp,
    signature,
    folder: target,
    transformation: INCOMING_TRANSFORMATION,
  }
}

/** Deletes uploaded images. Ignores ids outside our folder or already gone. */
export async function destroyImages(publicIds: Array<string | null | undefined>) {
  const ids = publicIds.filter((id): id is string => !!id && id.startsWith(`${CLOUDINARY_ROOT}/`))
  if (ids.length === 0) return
  await client().api.delete_resources(ids, { resource_type: 'image', invalidate: true })
}

/** Recursively collects Cloudinary publicIds from any JSON-like value. */
export function collectPublicIds(value: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const v of value) collectPublicIds(v, out)
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'publicId' && typeof v === 'string') out.add(v)
      else collectPublicIds(v, out)
    }
  }
  return out
}

/**
 * Deletes images referenced by `before` but no longer by `after`. Failures are
 * logged, never thrown: a leftover file is better than a failed save.
 */
export async function destroyRemovedImages(before: unknown, after: unknown) {
  const kept = collectPublicIds(after)
  const removed = [...collectPublicIds(before)].filter((id) => !kept.has(id))
  if (removed.length === 0) return
  try {
    await destroyImages(removed)
  } catch (err) {
    console.error('[cloudinary] cleanup failed', removed, err)
  }
}

export async function pingCloudinary() {
  return client().api.ping()
}
