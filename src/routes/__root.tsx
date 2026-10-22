import { Suspense, lazy } from 'react'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '@/styles.css?url'
import displayFont from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url'
import bodyFont from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import { themeInitScript } from '@/components/shared/theme-toggle'

// Toasts are only used after user actions, so the library loads lazily.
const Toaster = lazy(() => import('@/components/ui/sonner').then((m) => ({ default: m.Toaster })))

const GOOGLE_VERIFICATION = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined

interface RouterContext {
  queryClient: QueryClient
}

// Opt-in (VITE_DEVTOOLS=true): the overlay interferes with in-app browser screenshots.
const Devtools =
  import.meta.env.DEV && import.meta.env.VITE_DEVTOOLS === 'true'
    ? lazy(() => import('@/lib/devtools'))
    : () => null

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#f1f1ef', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#0c0c0c', media: '(prefers-color-scheme: dark)' },
      { name: 'format-detection', content: 'telephone=no' },
      { title: 'Esho' },
      // Google Search Console ownership (optional; DNS verification also works).
      ...(GOOGLE_VERIFICATION ? [{ name: 'google-site-verification', content: GOOGLE_VERIFICATION }] : []),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // Headline + body fonts: preloading avoids late swaps that shift the layout.
      { rel: 'preload', href: displayFont, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: bodyFont, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'preconnect', href: 'https://images.unsplash.com' },
      { rel: 'preconnect', href: 'https://res.cloudinary.com' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // The theme script sets data-theme before paint, so React sees a mismatch it can ignore.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Suspense>
          <Toaster position="bottom-center" />
        </Suspense>
        <Suspense>
          <Devtools />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}
