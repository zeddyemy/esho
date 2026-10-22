import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDelete } from '@/components/shared/admin/confirm-delete'
import { FormSection } from '@/components/shared/admin/form-section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { adminPostQuery, adminPostsQuery, usePostMutations } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import { postSchema } from '@/lib/schemas/catalog'
import type { PostInput } from '@/lib/schemas/catalog'

export default function PostEditor({ postId }: { postId: string }) {
  const { data: post } = useSuspenseQuery(adminPostQuery(postId))
  const { data: all } = useSuspenseQuery(adminPostsQuery())
  const m = usePostMutations()
  const navigate = useNavigate()
  const knownTags = [...new Set(all.flatMap((p) => p.tags))].sort()

  const initial: PostInput = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover: post.cover,
    body: post.body,
    tags: post.tags,
    published: post.published,
    publishedOn: post.publishedAt ? post.publishedAt.slice(0, 10) : '',
  }

  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: postSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await m.update.mutateAsync({ data: { ...value, id: postId } })
        formApi.reset(value)
        toast.success(value.published ? 'Article saved. The website updates within a minute.' : 'Draft saved')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not save the article')
      }
    },
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link to="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
            <ArrowLeft className="size-4" /> All articles
          </Link>
          <h2 className="mt-3 flex flex-wrap items-center gap-3 font-display text-3xl break-words md:text-4xl">
            {post.title}
            {!post.published ? (
              <Badge variant="outline" className="border-line-strong font-sans text-mute">
                Draft
              </Badge>
            ) : null}
          </h2>
        </div>
        <div className="flex gap-2">
          {post.published ? (
            <Button asChild variant="outline">
              <a href={`/writing/${post.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink /> View on site
              </a>
            </Button>
          ) : null}
          <ConfirmDelete
            title={`Delete "${post.title}"?`}
            description="The article is removed permanently."
            onConfirm={async () => {
              const ok = await withToast(m.remove.mutateAsync({ data: { id: postId } }), 'Article deleted')
              if (ok) await navigate({ to: '/admin/posts' })
            }}
            trigger={
              <Button variant="ghost" className="text-mute hover:text-destructive">
                <Trash2 /> Delete
              </Button>
            }
          />
        </div>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.AppForm>
          <form.UnsavedChangesGuard />
        </form.AppForm>

        <FormSection title="Publishing" description="Publishing for the first time stamps today's date. A future date keeps it hidden until that day.">
          <form.AppField name="published">{(f) => <f.SwitchField label="Published" description="Show on the Writing page and in the RSS feed." />}</form.AppField>
          <form.AppField name="publishedOn">{(f) => <f.DateField label="Publish date" hint="Optional" />}</form.AppField>
        </FormSection>

        <FormSection title="Basics" description="The title and excerpt appear in lists, link previews and search results.">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <form.AppField name="title">{(f) => <f.TextField label="Title" maxLength={120} />}</form.AppField>
            <form.AppField name="slug">{(f) => <f.TextField label="Web address" maxLength={80} description="/writing/…" />}</form.AppField>
          </div>
          <form.AppField name="excerpt">{(f) => <f.TextareaField label="Excerpt" rows={2} maxLength={260} />}</form.AppField>
          <form.AppField name="tags">{(f) => <f.TagsField label="Tags" max={6} suggestions={knownTags} />}</form.AppField>
          <form.AppField name="cover">{(f) => <f.ImageField label="Cover image" folder="posts" aspect="landscape" description="Optional. Shown at the top and in link previews." />}</form.AppField>
        </FormSection>

        <FormSection title="Article" description="Reading time is calculated when you save.">
          <form.AppField name="body">{(f) => <f.MarkdownField label="Body" folder="posts" rows={24} />}</form.AppField>
        </FormSection>

        <form.AppForm>
          <form.SaveBar label="Save article" />
        </form.AppForm>
      </form>
    </div>
  )
}
