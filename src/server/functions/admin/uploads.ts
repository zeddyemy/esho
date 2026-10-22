import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { signUpload } from '@/server/cloudinary'
import { adminMiddleware } from '@/server/middleware'
import { signFileUpload } from '@/server/storage'

/** Short-lived signature for a direct browser image upload into `esho/<folder>`. */
export const getUploadSignature = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(z.object({ folder: z.string().regex(/^[a-z0-9/_-]{1,80}$/i) }))
  .handler(({ data }) => signUpload(data.folder))

/** Signed Supabase Storage URL for a PDF upload (the résumé). */
export const getFileUploadUrl = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(z.object({ filename: z.string().min(1).max(200) }))
  .handler(({ data }) => signFileUpload(data.filename))
