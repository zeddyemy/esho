import { createFileRoute } from '@tanstack/react-router'

import PostPage from '@/components/pages/post'
import { postQuery } from '@/hooks/api/content'
import { settingsQuery } from '@/hooks/api/site'
import { breadcrumbJsonLd, jsonLd, postJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/writing/$slug')({
  loader: async ({ context: { queryClient }, params }) => {
    const [settings, data] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(postQuery(params.slug)),
    ])
    return { settings, post: data.post }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const { post, settings } = loaderData
    const path = `/writing/${params.slug}`
    return {
      ...seo({
        settings,
        title: post.title,
        description: post.excerpt,
        ogPath: `/og/writing/${params.slug}`,
        path,
        type: 'article',
        publishedAt: post.publishedAt,
        modifiedAt: post.updatedAt,
        tags: post.tags,
      }),
      scripts: [
        jsonLd(postJsonLd(post, settings)),
        jsonLd(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: post.title, path },
          ]),
        ),
      ],
    }
  },
  component: PostRoute,
})

function PostRoute() {
  const { slug } = Route.useParams()
  return <PostPage slug={slug} />
}
