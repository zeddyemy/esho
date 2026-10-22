import { Plus } from 'lucide-react'

import { ItemFrame, SectionCard, useSaveSection } from './section-card'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { capabilitiesSchema, ctaSchema, heroSchema, introSchema } from '@/lib/schemas/content'
import type { CapabilitiesContent, CtaContent, HeroContent, IntroContent } from '@/types'

export function HeroSection({ value }: { value: HeroContent }) {
  const save = useSaveSection('home.hero')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: heroSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Hero"
      description="The first thing visitors see, beside your portrait (set the portrait in Settings)."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save hero</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="headline">
        {(f) => <f.TextField label="Headline" maxLength={70} description="Keep it to two lines: roughly 6 to 8 words." />}
      </form.AppField>
      <form.AppField name="subheadline">{(f) => <f.TextareaField label="Subheadline" rows={2} maxLength={160} />}</form.AppField>
      <div className="grid gap-5 sm:grid-cols-2">
        <form.AppField name="primaryCta">{(f) => <f.TextField label="Main button" maxLength={24} description="Goes to the contact page." />}</form.AppField>
        <form.AppField name="secondaryCta">{(f) => <f.TextField label="Second button" maxLength={24} description="Scrolls to Selected work." />}</form.AppField>
      </div>
    </SectionCard>
  )
}

export function IntroSection({ value }: { value: IntroContent }) {
  const save = useSaveSection('home.intro')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: introSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard title="Introduction" description="The large statement under the hero." onSubmit={() => void form.handleSubmit()} footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save introduction</form.SubmitButton>
        </form.AppForm>
      }>
      <form.AppField name="statement">{(f) => <f.TextareaField label="Statement" rows={3} maxLength={260} />}</form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Supporting text" rows={3} maxLength={400} />}</form.AppField>
    </SectionCard>
  )
}

export function CapabilitiesSection({ value }: { value: CapabilitiesContent }) {
  const save = useSaveSection('home.capabilities')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: capabilitiesSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Capabilities"
      description="The grid of what you do. A capability without a photo becomes a dark highlight block."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save capabilities</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={60} />}</form.AppField>
      <form.Field name="items" mode="array">
        {(items) => (
          <div className="grid gap-4">
            {items.state.value.map((_, i) => (
              <ItemFrame key={i} legend={`Capability ${i + 1}`} onRemove={items.state.value.length > 1 ? () => items.removeValue(i) : undefined}>
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
                  <div className="grid content-start gap-4">
                    <form.AppField name={`items[${i}].title`}>{(f) => <f.TextField label="Title" maxLength={40} />}</form.AppField>
                    <form.AppField name={`items[${i}].body`}>{(f) => <f.TextareaField label="Text" rows={3} maxLength={200} />}</form.AppField>
                    <form.AppField name={`items[${i}].points`}>{(f) => <f.TagsField label="Key points" max={5} />}</form.AppField>
                  </div>
                  <form.AppField name={`items[${i}].image`}>{(f) => <f.ImageField label="Photo" folder="site/home" aspect="landscape" />}</form.AppField>
                </div>
              </ItemFrame>
            ))}
            {items.state.value.length < 6 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => items.pushValue({ title: 'New capability', body: 'Describe what you do here.', points: [], image: null })}>
                <Plus /> Add capability
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>
    </SectionCard>
  )
}

export function CtaSection({ value }: { value: CtaContent }) {
  const save = useSaveSection('home.cta')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: ctaSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard title="Closing call to action" description="The last block on the homepage." onSubmit={() => void form.handleSubmit()} footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save section</form.SubmitButton>
        </form.AppForm>
      }>
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={60} />}</form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Text" rows={2} maxLength={200} />}</form.AppField>
    </SectionCard>
  )
}
