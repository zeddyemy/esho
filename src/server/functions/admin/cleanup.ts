import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { sweepMedia } from '@/server/media-cleanup'
import { adminMiddleware } from '@/server/middleware'

/** Admin-triggered media cleanup. Run with `dryRun: true` first to show what would go. */
export const cleanupMedia = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(z.object({ dryRun: z.boolean() }))
  .handler(({ data }) => sweepMedia({ dryRun: data.dryRun }))
