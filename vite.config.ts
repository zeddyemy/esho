import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

/**
 * Canonical site URL for SEO, fixed at build time. A localhost value (e.g.
 * copied from .env into the host's settings) is ignored in production builds;
 * on Vercel the project's production domain is used instead.
 */
function siteUrlFor(mode: string, env: Record<string, string | undefined>) {
  const configured = env.VITE_SITE_URL
  const isLocal = !configured || /localhost|127\.0\.0\.1/.test(configured)
  if (mode !== 'production' || !isLocal) return configured ?? ''
  return env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : ''
}

const config = defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  return {
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrlFor(mode, env)),
      // Vercel preview deployments (e.g. design branches) must not be indexed.
      'import.meta.env.VITE_NOINDEX': JSON.stringify(
        env.VERCEL_ENV && env.VERCEL_ENV !== 'production' ? 'true' : '',
      ),
    },
    resolve: { tsconfigPaths: true },
    // Share-image rendering is server-only; resvg ships a native binary that
    // must never be pre-bundled for the browser or inlined into the SSR bundle.
    optimizeDeps: { exclude: ['@resvg/resvg-js', 'satori'] },
    ssr: { external: ['@resvg/resvg-js', 'satori'] },
    // ANALYZE=1 pnpm build emits source maps for bundle inspection.
    build: { sourcemap: process.env.ANALYZE ? true : false },
    plugins: [
      devtools(),
      nitro({
        // Pre-compressed (gzip + brotli) static assets for Node hosts such as Render or Railway.
        compressPublicAssets: true,
        // Ship the share-image renderer unbundled: Satori loads its wasm
        // via __dirname and resvg is a native module.
        traceDeps: ['satori*', 'harfbuzzjs*', '@resvg/resvg-js*'],
        vercel: {
          config: {
            version: 3,
            // Keeps the free Supabase project active (it pauses after 7 idle days).
            crons: [
              { path: '/api/keep-alive', schedule: '0 6 */3 * *' },
              // Weekly: delete uploads nothing uses any more (needs CRON_SECRET).
              { path: '/api/cleanup-media', schedule: '0 4 * * 1' },
            ],
          },
        },
      }),
      tailwindcss(),
      tanstackStart({
        router: {
          // Load each route's loader with its component: keeps admin loaders
          // (and their schemas) out of the public bundle without an extra request.
          codeSplittingOptions: {
            defaultBehavior: [
              ['loader', 'component'],
              ['pendingComponent'],
              ['errorComponent'],
              ['notFoundComponent'],
            ],
          },
        },
      }),
      viteReact(),
    ],
  }
})

export default config
