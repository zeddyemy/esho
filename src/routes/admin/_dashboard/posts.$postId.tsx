import { createFileRoute, notFound } from '@tanstack/react-router'

import PostEditor from '@/components/pages/admin/posts/editor'
import { adminPostQuery, adminPostsQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'
import { isUuid } from '@/lib/search'

export const Route = createFileRoute('/admin/_dashboard/posts/$postId')({
  loader: async ({ context: { queryClient }, params }) => {
    if (!isUuid(params.postId)) throw notFound()
    const [post] = await Promise.all([
      queryClient.ensureQueryData(adminPostQuery(params.postId)),
      queryClient.ensureQueryData(adminPostsQuery()),
    ])
    return { title: post.title }
  },
  head: ({ loaderData }) => adminHead(loaderData?.title ?? 'Article'),
  component: PostEditorRoute,
})

function PostEditorRoute() {
  const { postId } = Route.useParams()
  return <PostEditor key={postId} postId={postId} />
}
