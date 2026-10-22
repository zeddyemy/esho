import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { renderMarkdown } from '@/server/markdown'
import { adminMiddleware } from '@/server/middleware'

/** Renders markdown exactly as the public site will (same parser, highlighter, sanitiser). */
export const previewMarkdown = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(z.object({ markdown: z.string().max(60000) }))
  .handler(async ({ data }) => ({ html: await renderMarkdown(data.markdown) }))
