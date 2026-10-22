/**
 * Browser-side PDF upload to Supabase Storage using a server-issued signed URL.
 */
import { getFileUploadUrl } from '@/server/functions/admin/uploads'
import type { FileAsset } from '@/types'

const MAX_BYTES = 10 * 1024 * 1024

export class FileUploadError extends Error {}

export async function uploadPdf(file: File, onProgress?: (fraction: number) => void): Promise<FileAsset> {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new FileUploadError('Upload a PDF file.')
  }
  if (file.size > MAX_BYTES) throw new FileUploadError('Keep the PDF under 10 MB.')

  const target = await getFileUploadUrl({ data: { filename: file.name } })

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', target.uploadUrl)
    xhr.setRequestHeader('content-type', 'application/pdf')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total)
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new FileUploadError('Upload failed. Please try again.'))
    xhr.onerror = () => reject(new FileUploadError('Network error while uploading. Check your connection.'))
    xhr.send(file)
  })

  return {
    url: target.publicUrl,
    filename: file.name,
    bytes: file.size,
    publicId: target.path,
    uploadedAt: new Date().toISOString(),
  }
}
