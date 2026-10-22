/**
 * Browser-side image upload to Cloudinary using a server-issued signature.
 * Files over Cloudinary's free-plan limit are downscaled first.
 */
import { getUploadSignature } from '@/server/functions/admin/uploads'
import type { ImageAsset } from '@/types'

const MAX_BYTES = 9.5 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif']

export const ACCEPT_ATTR = ACCEPTED.join(',')

export class UploadError extends Error {}

async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 4000 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  for (const quality of [0.9, 0.82, 0.75]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality))
    if (blob && blob.size <= MAX_BYTES) return blob
  }
  throw new UploadError('This photo is too large even after resizing. Try exporting a smaller copy.')
}

export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (fraction: number) => void,
): Promise<ImageAsset> {
  if (file.type && !ACCEPTED.includes(file.type)) {
    throw new UploadError(`${file.name} is not a supported image (use JPG, PNG, WebP or HEIC).`)
  }
  const body: Blob = file.size > MAX_BYTES ? await shrink(file) : file
  const sig = await getUploadSignature({ data: { folder } })

  const form = new FormData()
  form.append('file', body, file.name)
  form.append('api_key', sig.apiKey)
  form.append('timestamp', String(sig.timestamp))
  form.append('signature', sig.signature)
  form.append('folder', sig.folder)
  form.append('transformation', sig.transformation)

  const result = await new Promise<{
    secure_url: string
    public_id: string
    width: number
    height: number
  }>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText))
      else {
        let message = 'Upload failed. Please try again.'
        try {
          message = JSON.parse(xhr.responseText).error?.message ?? message
        } catch {
          /* keep default */
        }
        reject(new UploadError(message))
      }
    }
    xhr.onerror = () => reject(new UploadError('Network error while uploading. Check your connection.'))
    xhr.send(form)
  })

  return {
    src: result.secure_url,
    width: result.width,
    height: result.height,
    alt: '',
    publicId: result.public_id,
  }
}
