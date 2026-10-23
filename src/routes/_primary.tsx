import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import PrimaryLayout from '@/components/layout/primary'
import { settingsQuery } from '@/hooks/api/site'

export const Route = createFileRoute('/_primary')({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery()),
  // Site-wide identity signals: rel="me" ties the social profiles to this site,
  // and the verification codes prove ownership to Google and Bing.
  head: ({ loaderData: settings }) => {
    if (!settings) return {}
    const { googleVerification, bingVerification } = settings.seo
    return {
      meta: [
        ...(googleVerification ? [{ name: 'google-site-verification', content: googleVerification }] : []),
        ...(bingVerification ? [{ name: 'msvalidate.01', content: bingVerification }] : []),
      ],
      links: Object.values(settings.socials)
        .filter((href): href is string => Boolean(href))
        .map((href) => ({ rel: 'me', href })),
    }
  },
  // Public pages are CDN-cacheable; admin edits show up within about a minute.
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400' }),
  component: PrimaryRoute,
})

function PrimaryRoute() {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  return (
    <PrimaryLayout settings={settings}>
      <Outlet />
    </PrimaryLayout>
  )
}
