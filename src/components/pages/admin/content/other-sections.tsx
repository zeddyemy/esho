import { Plus } from 'lucide-react'

import { ItemFrame, SectionCard, useSaveSection } from './section-card'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { aboutSchema, contactSchema, pageHeaderSchema } from '@/lib/schemas/content'
import type { AboutContent, ContactContent, PageHeaderContent } from '@/types'

export function AboutSection({ value }: { value: AboutContent }) {
  const save = useSaveSection('about.main')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: aboutSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="About page"
      description="Experience, education and tools are edited on their own pages in the sidebar."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save about page</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={70} />}</form.AppField>
      <form.AppField name="lead">{(f) => <f.TextareaField label="Introduction" rows={3} maxLength={280} />}</form.AppField>
      <form.AppField name="image">{(f) => <f.ImageField label="Photo" folder="site/about" aspect="portrait" />}</form.AppField>
      <form.AppField name="story">{(f) => <f.MarkdownField label="Your story" folder="site/about" rows={10} />}</form.AppField>

      <form.Field name="facts" mode="array">
        {(facts) => (
          <div className="grid gap-3">
            <p className="text-sm font-medium">Quick facts</p>
            {facts.state.value.map((_, i) => (
              <ItemFrame key={i} legend={`Fact ${i + 1}`} onRemove={() => facts.removeValue(i)}>
                <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <form.AppField name={`facts[${i}].label`}>{(f) => <f.TextField label="Label" maxLength={30} />}</form.AppField>
                  <form.AppField name={`facts[${i}].value`}>{(f) => <f.TextField label="Value" maxLength={80} />}</form.AppField>
                </div>
              </ItemFrame>
            ))}
            {facts.state.value.length < 6 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => facts.pushValue({ label: 'Label', value: 'Value' })}>
                <Plus /> Add fact
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="principles" mode="array">
        {(principles) => (
          <div className="grid gap-3">
            <p className="text-sm font-medium">How I work</p>
            {principles.state.value.map((_, i) => (
              <ItemFrame key={i} legend={`Principle ${i + 1}`} onRemove={() => principles.removeValue(i)}>
                <form.AppField name={`principles[${i}].title`}>{(f) => <f.TextField label="Title" maxLength={50} />}</form.AppField>
                <form.AppField name={`principles[${i}].body`}>{(f) => <f.TextareaField label="Text" rows={2} maxLength={200} />}</form.AppField>
              </ItemFrame>
            ))}
            {principles.state.value.length < 6 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => principles.pushValue({ title: 'New principle', body: 'Describe it.' })}>
                <Plus /> Add principle
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>
    </SectionCard>
  )
}

export function ContactSection({ value }: { value: ContactContent }) {
  const save = useSaveSection('contact.main')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: contactSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Contact page"
      description="Email, phone and socials come from Settings."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save contact page</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={40} />}</form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Text" rows={2} maxLength={240} />}</form.AppField>
      <form.AppField name="responseNote">{(f) => <f.TextField label="Response time note" maxLength={120} placeholder="I reply within two working days." />}</form.AppField>
      <form.AppField name="projectTypes">{(f) => <f.TagsField label='"What do you need?" options' max={10} />}</form.AppField>
      <form.AppField name="budgets">{(f) => <f.TagsField label="Budget options" max={8} />}</form.AppField>
    </SectionCard>
  )
}

export function PageHeaderSection({
  value,
  contentKey,
  title,
}: {
  value: PageHeaderContent
  contentKey: 'work.header' | 'writing.header'
  title: string
}) {
  const save = useSaveSection(contentKey)
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: pageHeaderSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title={title}
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save header</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={40} />}</form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Introduction" rows={2} maxLength={240} />}</form.AppField>
    </SectionCard>
  )
}
