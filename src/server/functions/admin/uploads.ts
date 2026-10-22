import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { signUpload } from '@/server/cloudinary'
import { adminMiddleware } from '@/server/middleware'

/** Short-lived signature for a direct browser upload into `upc/<folder>`. */
export const getUploadSignature = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(z.object({ folder: z.string().regex(/^[a-z0-9/_-]{1,80}$/i) }))
  .handler(({ data }) => signUpload(data.folder))
