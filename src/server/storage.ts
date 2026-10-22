/**
 * Supabase Storage for documents (résumé PDFs). Server-only.
 * Cloudinary's free plan blocks PDF delivery, so files live here instead.
 */
import { getServiceClient } from '@/server/supabase'

export const FILES_BUCKET = 'files'

/** Signed URL the admin's browser PUTs the file to. Valid for 2 hours. */
export async function signFileUpload(filename: string) {
  const safe = filename
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const path = `resume/${Date.now()}-${safe || 'resume'}.pdf`
  const storage = getServiceClient().storage.from(FILES_BUCKET)
  const { data, error } = await storage.createSignedUploadUrl(path)
  if (error) throw new Error(error.message)
  return { uploadUrl: data.signedUrl, path, publicUrl: storage.getPublicUrl(path).data.publicUrl }
}

/** Deletes stored files. Failures are logged, never thrown. */
export async function removeFiles(paths: Array<string | null | undefined>) {
  const valid = paths.filter((p): p is string => !!p && p.startsWith('resume/'))
  if (valid.length === 0) return
  const { error } = await getServiceClient().storage.from(FILES_BUCKET).remove(valid)
  if (error) console.error('[storage] cleanup failed', valid, error.message)
}
