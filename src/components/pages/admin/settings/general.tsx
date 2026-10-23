import { useSuspenseQuery } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

import { FormSection } from '@/components/shared/admin/form-section'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { adminSettingsQuery, useUpdateSettings } from '@/hooks/api/admin/settings'
import { settingsSchema } from '@/lib/schemas/settings'

const SOCIALS = [
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourname' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/yourname' },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/yourname' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/yourname' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@yourname' },
  { key: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/yourname' },
  { key: 'medium', label: 'Medium', placeholder: 'https://medium.com/@yourname' },
] as const

export default function GeneralSettings() {
  const { data } = useSuspenseQuery(adminSettingsQuery())
  const update = useUpdateSettings()

  const form = useAppForm({
    defaultValues: data,
    validators: { onSubmit: settingsSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await update.mutateAsync(value)
        formApi.reset(value)
        toast.success('Settings saved. The website updates within a minute.')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not save settings')
      }
    },
  })

  return (
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

      <FormSection title="Identity" description="Your brand appears as the wordmark in the header and the large footer. Your name and role sit beside it.">
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="brandName">{(f) => <f.TextField label="Brand" maxLength={30} description='e.g. "Esho"' />}</form.AppField>
          <form.AppField name="ownerName">{(f) => <f.TextField label="Your name" maxLength={60} />}</form.AppField>
        </div>
        <form.AppField name="roleTitle">{(f) => <f.TextField label="Role" maxLength={80} description="Shown under your portrait and in search results." />}</form.AppField>
        <form.AppField name="tagline">{(f) => <f.TextField label="Tagline" maxLength={120} hint="Optional" />}</form.AppField>
        <div className="grid gap-5 lg:grid-cols-2">
          <form.AppField name="portrait">
            {(f) => <f.ImageField label="Portrait" folder="site" aspect="portrait" description="Homepage hero. A tall photo works best." />}
          </form.AppField>
          <form.AppField name="logo">
            {(f) => <f.ImageField label="Logo" folder="site" aspect="square" description="Optional. Shown before the wordmark. Transparent PNG or SVG-like artwork works best." />}
          </form.AppField>
        </div>
      </FormSection>

      <FormSection title="Availability" description="The line at the top of the homepage, in the footer and on the contact page.">
        <form.AppField name="availability">
          {(f) => <f.TextField label="Availability" maxLength={100} placeholder="e.g. Taking on new projects from March" />}
        </form.AppField>
        <form.AppField name="openToWork">
          {(f) => <f.SwitchField label="Open to new work" description="Shows a small pulsing dot next to your availability line." />}
        </form.AppField>
      </FormSection>

      <FormSection title="Contact" description="Shown on the contact page and in the footer. WhatsApp powers the floating chat button; leave it empty to hide the button.">
        <form.AppField name="email">{(f) => <f.TextField label="Email" type="email" inputMode="email" autoComplete="off" />}</form.AppField>
        <form.Field name="phones" mode="array">
          {(phones) => (
            <div className="grid gap-3">
              {phones.state.value.map((_, i) => (
                <div key={i} className="flex items-end gap-2">
                  <form.AppField name={`phones[${i}]`}>
                    {(f) => <f.TextField label={`Phone ${i + 1}`} type="tel" inputMode="tel" className="flex-1" />}
                  </form.AppField>
                  <Button type="button" variant="ghost" size="icon" className="mb-0.5 text-mute" onClick={() => phones.removeValue(i)} aria-label={`Remove phone ${i + 1}`}>
                    <X />
                  </Button>
                </div>
              ))}
              {phones.state.value.length < 3 ? (
                <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => phones.pushValue('')}>
                  <Plus /> Add phone number
                </Button>
              ) : null}
            </div>
          )}
        </form.Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="whatsapp">
            {(f) => <f.TextField label="WhatsApp number" type="tel" inputMode="tel" placeholder="e.g. 0810 000 0000" hint="Optional" />}
          </form.AppField>
          <form.AppField name="location">{(f) => <f.TextField label="Location" placeholder="Lagos, Nigeria" />}</form.AppField>
        </div>
      </FormSection>

      <FormSection title="Social links" description="Paste the full link to each profile. Leave blank to hide it.">
        <div className="grid gap-5 sm:grid-cols-2">
          {SOCIALS.map((s) => (
            <form.AppField key={s.key} name={`socials.${s.key}`}>
              {(f) => <f.TextField label={s.label} type="url" inputMode="url" placeholder={s.placeholder} />}
            </form.AppField>
          ))}
        </div>
      </FormSection>

      <FormSection title="Résumé" description="Visitors download it from the About page and the footer. The link /resume always points to the latest upload.">
        <form.AppField name="resume">{(f) => <f.FileField label="Résumé PDF" description="PDF, up to 10 MB." />}</form.AppField>
      </FormSection>

      <FormSection id="visibility" title="On the website" description="Switch whole sections on or off. Hidden sections disappear everywhere on the site.">
        <form.AppField name="showWriting">
          {(f) => <f.SwitchField label="Show writing" description="The Writing page, the nav link, the homepage articles and the RSS feed." />}
        </form.AppField>
        <form.AppField name="showTestimonials">
          {(f) => <f.SwitchField label="Show testimonials" description="The quotes section on the homepage." />}
        </form.AppField>
        <form.AppField name="showResume">
          {(f) => <f.SwitchField label="Show résumé download" description="Only appears once a PDF is uploaded." />}
        </form.AppField>
      </FormSection>

      <FormSection title="Footer" description="A short line at the very bottom of every page.">
        <form.AppField name="footerNote">{(f) => <f.TextField label="Footer note" maxLength={160} hint="Optional" />}</form.AppField>
      </FormSection>

      <FormSection title="Search and sharing" description="How the homepage appears in Google and in link previews on WhatsApp, LinkedIn and X, plus search engine ownership codes.">
        <form.AppField name="seo.title">
          {(f) => <f.TextField label="Page title" maxLength={70} description="Leave empty to use your brand and name." />}
        </form.AppField>
        <form.AppField name="seo.description">{(f) => <f.TextareaField label="Description" rows={3} maxLength={170} />}</form.AppField>
        <form.AppField name="seo.image">
          {(f) => (
            <f.ImageField
              label="Sharing image"
              folder="site"
              aspect="landscape"
              description="Optional. When empty, a branded card with your headline is generated automatically."
            />
          )}
        </form.AppField>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="seo.googleVerification">
            {(f) => (
              <f.TextField
                label="Google Search Console code"
                maxLength={120}
                hint="Optional"
                description='From the "HTML tag" method: paste only the content="..." value.'
              />
            )}
          </form.AppField>
          <form.AppField name="seo.bingVerification">
            {(f) => <f.TextField label="Bing Webmaster code" maxLength={120} hint="Optional" description="Same idea: only the content value." />}
          </form.AppField>
        </div>
      </FormSection>

      <form.AppForm>
        <form.SaveBar />
      </form.AppForm>
    </form>
  )
}
