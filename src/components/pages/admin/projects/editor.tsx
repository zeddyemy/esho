import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDelete } from '@/components/shared/admin/confirm-delete'
import { FormSection } from '@/components/shared/admin/form-section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { adminProjectQuery, adminProjectsQuery, useProjectMutations } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import { projectSchema } from '@/lib/schemas/catalog'
import type { ProjectInput } from '@/lib/schemas/catalog'

const TAG_SUGGESTIONS = ['Product', 'SaaS', 'Fintech', 'Commerce', 'Data', 'BI', 'AI', 'Open source', 'Mobile', 'Integrations']

export default function ProjectEditor({ projectId }: { projectId: string }) {
  const { data: project } = useSuspenseQuery(adminProjectQuery(projectId))
  const { data: all } = useSuspenseQuery(adminProjectsQuery())
  const m = useProjectMutations()
  const navigate = useNavigate()

  const knownStack = [...new Set(all.flatMap((p) => p.stack))].sort()
  const knownTags = [...new Set([...all.flatMap((p) => p.tags), ...TAG_SUGGESTIONS])]

  const initial: ProjectInput = {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    role: project.role,
    client: project.client,
    year: project.year,
    tags: project.tags,
    stack: project.stack,
    links: project.links,
    metrics: project.metrics,
    cover: project.cover,
    gallery: project.gallery,
    body: project.body,
    featured: project.featured,
    published: project.published,
  }

  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: projectSchema },
    onSubmit: async ({ value, formApi }) => {
      if (value.published && !value.cover) {
        toast.error('Add a cover image before publishing.')
        return
      }
      try {
        await m.update.mutateAsync({ data: { ...value, id: projectId } })
        formApi.reset(value)
        toast.success(value.published ? 'Project saved. The website updates within a minute.' : 'Draft saved')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not save the project')
      }
    },
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link to="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
            <ArrowLeft className="size-4" /> All projects
          </Link>
          <h2 className="mt-3 flex flex-wrap items-center gap-3 font-display text-3xl break-words md:text-4xl">
            {project.title}
            {!project.published ? (
              <Badge variant="outline" className="border-line-strong font-sans text-mute">
                Draft
              </Badge>
            ) : null}
          </h2>
        </div>
        <div className="flex gap-2">
          {project.published ? (
            <Button asChild variant="outline">
              <a href={`/work/${project.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink /> View on site
              </a>
            </Button>
          ) : null}
          <ConfirmDelete
            title={`Delete "${project.title}"?`}
            description="The project, its case study and its uploaded images are removed permanently."
            onConfirm={async () => {
              const ok = await withToast(m.remove.mutateAsync({ data: { id: projectId } }), 'Project deleted')
              if (ok) await navigate({ to: '/admin/projects' })
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

        <FormSection title="Visibility" description="Drafts are only visible here. Featured projects appear in Selected work on the homepage.">
          <form.AppField name="published">
            {(f) => <f.SwitchField label="Published" description="Show this project on the Work page and in search results." />}
          </form.AppField>
          <form.AppField name="featured">{(f) => <f.SwitchField label="Featured on homepage" />}</form.AppField>
        </FormSection>

        <FormSection title="Basics" description="The title and summary appear on project cards and at the top of the case study.">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <form.AppField name="title">{(f) => <f.TextField label="Title" maxLength={80} />}</form.AppField>
            <form.AppField name="slug">{(f) => <f.TextField label="Web address" maxLength={80} description="/work/…" />}</form.AppField>
          </div>
          <form.AppField name="summary">{(f) => <f.TextareaField label="Summary" rows={2} maxLength={240} description="One or two sentences on what it is and why it mattered." />}</form.AppField>
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem]">
            <form.AppField name="role">{(f) => <f.TextField label="Your role" maxLength={80} placeholder="e.g. Lead engineer" />}</form.AppField>
            <form.AppField name="client">{(f) => <f.TextField label="Client" maxLength={80} placeholder="e.g. Own product" />}</form.AppField>
            <form.AppField name="year">{(f) => <f.NumberField label="Year" min={1990} max={2100} />}</form.AppField>
          </div>
          <form.AppField name="tags">{(f) => <f.TagsField label="Tags" max={6} suggestions={knownTags} description="Used for the filter on the Work page." />}</form.AppField>
          <form.AppField name="stack">{(f) => <f.TagsField label="Built with" max={16} suggestions={knownStack} />}</form.AppField>
        </FormSection>

        <FormSection title="Images" description="The cover leads the case study and the project cards. Gallery images appear after the write-up.">
          <form.AppField name="cover">{(f) => <f.ImageField label="Cover" folder="projects" aspect="landscape" />}</form.AppField>
          <form.AppField name="gallery">{(f) => <f.ImageListField label="Gallery" folder="projects" aspect="landscape" max={16} />}</form.AppField>
        </FormSection>

        <FormSection title="Outcomes" description="Up to four headline results. Use real numbers or plain statements.">
          <form.Field name="metrics" mode="array">
            {(metrics) => (
              <div className="grid gap-3">
                {metrics.state.value.map((_, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <form.AppField name={`metrics[${i}].value`}>{(f) => <f.TextField label="Value" maxLength={16} className="w-32 shrink-0" placeholder="e.g. 3x" />}</form.AppField>
                    <form.AppField name={`metrics[${i}].label`}>{(f) => <f.TextField label="What it measures" maxLength={80} className="flex-1" />}</form.AppField>
                    <Button type="button" variant="ghost" size="icon" className="mb-0.5 text-mute" onClick={() => metrics.removeValue(i)} aria-label={`Remove outcome ${i + 1}`}>
                      <X />
                    </Button>
                  </div>
                ))}
                {metrics.state.value.length < 4 ? (
                  <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => metrics.pushValue({ value: '', label: '' })}>
                    <Plus /> Add outcome
                  </Button>
                ) : null}
              </div>
            )}
          </form.Field>
        </FormSection>

        <FormSection title="Links" description="Live site, source code, app store page, or a write-up elsewhere.">
          <form.Field name="links" mode="array">
            {(links) => (
              <div className="grid gap-3">
                {links.state.value.map((_, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <form.AppField name={`links[${i}].label`}>{(f) => <f.TextField label="Label" maxLength={30} className="w-36 shrink-0" placeholder="Live site" />}</form.AppField>
                    <form.AppField name={`links[${i}].url`}>{(f) => <f.TextField label="Link" type="url" inputMode="url" className="flex-1" placeholder="https://" />}</form.AppField>
                    <Button type="button" variant="ghost" size="icon" className="mb-0.5 text-mute" onClick={() => links.removeValue(i)} aria-label={`Remove link ${i + 1}`}>
                      <X />
                    </Button>
                  </div>
                ))}
                {links.state.value.length < 4 ? (
                  <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => links.pushValue({ label: '', url: '' })}>
                    <Plus /> Add link
                  </Button>
                ) : null}
              </div>
            )}
          </form.Field>
        </FormSection>

        <FormSection title="Case study" description="The story: the problem, what you built, the decisions behind it and the result.">
          <form.AppField name="body">{(f) => <f.MarkdownField label="Write-up" folder="projects" />}</form.AppField>
        </FormSection>

        <form.AppForm>
          <form.SaveBar label="Save project" />
        </form.AppForm>
      </form>
    </div>
  )
}
