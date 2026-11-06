/**
 * Page sections the owner can show or hide from the admin (Sections screen).
 *
 * Hidden keys are stored as a list in the `site.visibility` row of
 * page_content, so a missing row or an unknown key simply means "visible".
 * Hiding only skips rendering: a section's content rows are never touched,
 * so showing it again restores it unchanged.
 */

export interface SectionInfo {
  key: string
  label: string
  description?: string
}

export const SECTION_GROUPS = [
  {
    title: 'Homepage',
    description: 'If every section is hidden, the homepage shows your name, role and a contact link.',
    sections: [
      { key: 'home.hero', label: 'Hero', description: 'Headline, portrait and buttons.' },
      { key: 'home.intro', label: 'Introduction' },
      { key: 'home.work', label: 'Selected work' },
      { key: 'home.capabilities', label: 'Capabilities' },
      { key: 'home.experience', label: 'Experience' },
      { key: 'home.testimonials', label: 'Testimonials', description: 'Same switch as Settings, On the website.' },
      { key: 'home.writing', label: 'Latest writing' },
      { key: 'home.cta', label: 'Closing call to action' },
    ],
  },
  {
    title: 'About page',
    description: 'The page heading and introduction always show.',
    sections: [
      { key: 'about.story', label: 'Your story' },
      { key: 'about.principles', label: 'How I work' },
      { key: 'about.experience', label: 'Experience' },
      { key: 'about.education', label: 'Education' },
      { key: 'about.stack', label: 'Tools' },
      { key: 'about.closing', label: 'Closing call to action', description: 'Includes the résumé download.' },
    ],
  },
  {
    title: 'Case studies',
    description: 'Applies to every project. The heading, cover and write-up always show.',
    sections: [
      { key: 'project.outcomes', label: 'Outcomes' },
      { key: 'project.gallery', label: 'Gallery' },
      { key: 'project.next', label: 'Next project' },
    ],
  },
  {
    title: 'Articles',
    description: 'Applies to every article. The article itself always shows.',
    sections: [{ key: 'post.more', label: 'Keep reading' }],
  },
  {
    title: 'Contact page',
    description: 'If both are hidden, the page still shows your email address.',
    sections: [
      { key: 'contact.form', label: 'Contact form' },
      { key: 'contact.details', label: 'Contact details', description: 'Availability, email, phone and social links.' },
    ],
  },
] as const

export type SectionKey = (typeof SECTION_GROUPS)[number]['sections'][number]['key']

/** Testimonials already has a site-wide switch, so it is not stored in the hidden list. */
export type HideableSectionKey = Exclude<SectionKey, 'home.testimonials'>

export const HIDEABLE_SECTIONS = SECTION_GROUPS.flatMap((g) => g.sections.map((s) => s.key)).filter(
  (key): key is HideableSectionKey => key !== 'home.testimonials',
)

/** Keeps known keys only, in registry order. */
export function normalizeHiddenSections(value: unknown): Array<HideableSectionKey> {
  const stored = (value && typeof value === 'object' ? (value as { hidden?: unknown }).hidden : null) ?? []
  return Array.isArray(stored) ? HIDEABLE_SECTIONS.filter((key) => stored.includes(key)) : []
}

export function isSectionVisible(
  settings: { hiddenSections: ReadonlyArray<string>; showTestimonials: boolean; showWriting: boolean },
  key: SectionKey,
): boolean {
  if (key === 'home.testimonials') return settings.showTestimonials
  if (key === 'home.writing' && !settings.showWriting) return false
  return !settings.hiddenSections.includes(key)
}
