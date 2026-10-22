import { createFileRoute } from '@tanstack/react-router'

import guide from '@/content/owner-guide.html?raw'

// The guide file is authored without a document shell (it is also published
// as a shareable page), so split its head and body parts here.
const bodyStart = guide.indexOf('<div class="wrap">')
const headPart = guide.slice(0, bodyStart)
const bodyPart = guide.slice(bodyStart)

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.ico" sizes="48x48">
${headPart}
</head>
<body>
${bodyPart}
</body>
</html>`

/**
 * Owner's guide. Public on purpose so it can be read while locked out (e.g. to
 * find the password-reset steps); `noindex` and robots.txt keep it out of search.
 */
export const Route = createFileRoute('/admin/guide.html')({
  server: {
    handlers: {
      GET: () =>
        new Response(page, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        }),
    },
  },
})
