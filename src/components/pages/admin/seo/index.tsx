import { useStore } from '@tanstack/react-form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { FormSection } from '@/components/shared/admin/form-section'
import { useAppForm } from '@/components/ui/custom/form'
import { adminContentQuery } from '@/hooks/api/admin/content'
import { adminSeoQuery, useUpdateSeo } from '@/hooks/api/admin/seo'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { imageUrl } from '@/lib/media'
import { seoSettingsSchema } from '@/lib/schemas/seo'
import { SITE_URL } from '@/lib/seo'
import { SEO_PAGES } from '@/lib/seo-pages'
import type { SeoPageKey } from '@/lib/seo-pages'
import type { ImageAsset } from '@/types'

const host = new URL(SITE_URL).host

/** How a link to this page looks in search results and in a chat preview. */
function Preview({ title, description, path, image, ogPath }: { title: string; description: string; path: string; image: ImageAsset | null; ogPath: string }) {
  return (
    <div className="grid gap-4 border border-line bg-paper-2 p-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
      <div className="min-w-0">
        <p className="text-label text-mute">Search result</p>
        <p className="mt-2 truncate text-xs text-mute">
          {host}
          {path === '/' ? '' : path}
        </p>
        <p className="mt-0.5 line-clamp-2 text-lg leading-snug text-cobalt">{title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink-2">{description || <span className="text-mute">No description yet.</span>}</p>
      </div>
      <div>
        <p className="text-label text-mute">Share card</p>
        <img
          src={image ? imageUrl(image.src, 480) : ogPath}
          alt=""
          loading="lazy"
          className="mt-2 aspect-[1200/630] w-full border border-line object-cover"
        />
      </div>
    </div>
  )
}

export default function Seo() {
  const { data } = useSuspenseQuery(adminSeoQuery())
  const { data: settings } = useSuspenseQuery(adminSettingsQuery())
  const { data: content } = useSuspenseQuery(adminContentQuery())
  const update = useUpdateSeo()

  const form = useAppForm({
    defaultValues: data,
    validators: { onSubmit: seoSettingsSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await update.mutateAsync(value)
        formApi.reset(value)
        toast.success('SEO saved. The website updates within a minute; search engines pick it up on their next visit.')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not save')
      }
    },
  })
  const values = useStore(form.store, (s) => s.values)

  // What each page uses when its override is blank (same rules as the public pages).
  const automatic: Record<SeoPageKey, { title: string; description: string }> = {
    about: { title: `About | ${settings.ownerName}`, description: content['about.main'].lead },
    work: { title: `Work | ${settings.ownerName}`, description: content['work.header'].body },
    writing: { title: `Writing | ${settings.ownerName}`, description: content['writing.header'].body },
    contact: { title: `Contact | ${settings.ownerName}`, description: content['contact.main'].body },
  }
  const homeTitle = values.title || `${settings.ownerName} | ${settings.roleTitle}`

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="SEO"
        description="How your site appears in Google and Bing, and in link previews on WhatsApp, LinkedIn and X. Leave a field blank to let the site work it out from the page."
      />
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

        <FormSection title="Homepage" description="Also the default when someone shares the bare domain.">
          <form.AppField name="title">
            {(f) => <f.TextField label="Title" maxLength={70} description={`Leave blank for "${settings.ownerName} | ${settings.roleTitle}".`} />}
          </form.AppField>
          <form.AppField name="description">
            {(f) => <f.TextareaField label="Description" rows={3} maxLength={170} description="One or two sentences on who you are and what you do. Around 150 characters reads best." />}
          </form.AppField>
          <form.AppField name="image">
            {(f) => <f.ImageField label="Share image" folder="site" aspect="landscape" description="Optional, ideally 1200 × 630. When empty, a branded card with your headline is generated." />}
          </form.AppField>
          <Preview title={homeTitle} description={values.description} path="/" image={values.image} ogPath="/og" />
        </FormSection>

        <FormSection
          title="How search engines know you"
          description="Helps Google connect your name, other names and profiles into one person. Used in the site's structured data on every page."
        >
          <form.AppField name="alternateNames">
            {(f) => <f.TagsField label="Other names" max={6} description={`Names people might search for besides "${settings.ownerName}", for example a nickname or handle. Your brand "${settings.brandName}" is included automatically.`} />}
          </form.AppField>
          <form.AppField name="keywords">
            {(f) => <f.TagsField label="Topics" max={20} description="What you want to be found for, for example Full-stack engineer or React Native. Tools from the Stack page are added automatically." />}
          </form.AppField>
          <form.AppField name="profiles">
            {(f) => <f.TagsField label="Other profiles" max={10} placeholder="https://… then Enter" description="Full links to profiles not in Settings' social links, for example Upwork, Stack Overflow or a company page." />}
          </form.AppField>
        </FormSection>

        {SEO_PAGES.map((page) => (
          <FormSection key={page.key} title={`${page.label} page`} description="Blank fields use the page's own heading and introduction.">
            <form.AppField name={`pages.${page.key}.title`}>
              {(f) => <f.TextField label="Title" maxLength={70} description={`Blank uses "${automatic[page.key].title}".`} />}
            </form.AppField>
            <form.AppField name={`pages.${page.key}.description`}>
              {(f) => (
                <f.TextareaField
                  label="Description"
                  rows={2}
                  maxLength={170}
                  description={automatic[page.key].description ? `Blank uses the page introduction: "${automatic[page.key].description}"` : 'Blank uses the page introduction.'}
                />
              )}
            </form.AppField>
            <form.AppField name={`pages.${page.key}.image`}>
              {(f) => <f.ImageField label="Share image" folder="site" aspect="landscape" description="Optional. When empty, a branded card for this page is generated." />}
            </form.AppField>
            <Preview
              title={values.pages[page.key].title || automatic[page.key].title}
              description={values.pages[page.key].description || automatic[page.key].description}
              path={page.path}
              image={values.pages[page.key].image}
              ogPath={`/og/page/${page.key}`}
            />
          </FormSection>
        ))}

        <FormSection title="Projects and articles" description="Set automatically from each item, so there is nothing to fill in here.">
          <p className="text-sm text-ink-2">
            A case study uses its title, summary and cover image. An article uses its title, excerpt, cover image, tags and publish date. Without a cover, a branded card is generated. Edit those on the Projects and Writing pages.
          </p>
        </FormSection>

        <FormSection title="Search engine ownership" description="Proves to Google and Bing that the site is yours, so you can see search data and submit the sitemap.">
          <div className="grid gap-5 sm:grid-cols-2">
            <form.AppField name="googleVerification">
              {(f) => <f.TextField label="Google Search Console code" maxLength={120} hint="Optional" description='From the "HTML tag" method: paste only the content="..." value.' />}
            </form.AppField>
            <form.AppField name="bingVerification">
              {(f) => <f.TextField label="Bing Webmaster code" maxLength={120} hint="Optional" description="Same idea: only the content value." />}
            </form.AppField>
          </div>
          <p className="text-sm text-mute">
            Sitemap to submit: <span className="text-ink">{SITE_URL}/sitemap.xml</span>
          </p>
        </FormSection>

        <form.AppForm>
          <form.SaveBar label="Save SEO" />
        </form.AppForm>
      </form>
    </div>
  )
}
