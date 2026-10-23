/** Maps snake_case database rows to the app's camelCase domain types. */
import { normalizeAppearance } from '@/lib/appearance'
import { EXPERIENCE_KINDS } from '@/types'
import type { Tables } from '@/types/database'
import type {
  Experience,
  ExperienceKind,
  FileAsset,
  ImageAsset,
  Post,
  PostSummary,
  Project,
  ProjectLink,
  ProjectMetric,
  ProjectSummary,
  SiteSettings,
  SocialLinks,
  StackGroup,
  Testimonial,
} from '@/types'

const image = (value: unknown): ImageAsset | null =>
  value && typeof value === 'object' && 'src' in value ? (value as ImageAsset) : null

const images = (value: unknown): Array<ImageAsset> =>
  Array.isArray(value) ? value.map(image).filter((i): i is ImageAsset => i !== null) : []

const file = (value: unknown): FileAsset | null =>
  value && typeof value === 'object' && 'url' in value ? (value as FileAsset) : null

const list = <T>(value: unknown): Array<T> => (Array.isArray(value) ? (value as Array<T>) : [])

const PLACEHOLDER_COVER = (alt: string): ImageAsset => ({ src: '', width: 16, height: 10, alt })

export function toSettings(row: Tables<'site_settings'>): SiteSettings {
  const seo = (row.seo ?? {}) as {
    title?: string
    description?: string
    image?: unknown
    googleVerification?: string
    bingVerification?: string
  }
  return {
    brandName: row.brand_name,
    ownerName: row.owner_name,
    roleTitle: row.role_title,
    tagline: row.tagline,
    logo: image(row.logo),
    portrait: image(row.portrait),
    availability: row.availability,
    openToWork: row.open_to_work,
    email: row.email,
    phones: row.phones,
    whatsapp: row.whatsapp,
    location: row.location,
    socials: (row.socials ?? {}) as SocialLinks,
    resume: file(row.resume),
    footerNote: row.footer_note,
    showWriting: row.show_writing,
    showTestimonials: row.show_testimonials,
    showResume: row.show_resume,
    appearance: normalizeAppearance(row.appearance),
    seo: {
      title: seo.title || `${row.owner_name} | ${row.role_title}`,
      description: seo.description ?? '',
      image: image(seo.image),
      googleVerification: seo.googleVerification ?? '',
      bingVerification: seo.bingVerification ?? '',
    },
  }
}

export function toProjectSummary(row: Omit<Tables<'projects'>, 'body' | 'gallery'>): ProjectSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    role: row.role,
    client: row.client,
    year: row.year,
    tags: row.tags,
    stack: row.stack,
    links: list<ProjectLink>(row.links),
    metrics: list<ProjectMetric>(row.metrics),
    cover: image(row.cover) ?? PLACEHOLDER_COVER(row.title),
    featured: row.featured,
    published: row.published,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  }
}

export function toProject(row: Tables<'projects'>): Project {
  return { ...toProjectSummary(row), body: row.body, gallery: images(row.gallery) }
}

export function toPostSummary(row: Omit<Tables<'posts'>, 'body'>): PostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    cover: image(row.cover),
    tags: row.tags,
    published: row.published,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    readingMinutes: row.reading_minutes,
  }
}

export function toPost(row: Tables<'posts'>): Post {
  return { ...toPostSummary(row), body: row.body }
}

export function toExperience(row: Tables<'experiences'>): Experience {
  const kind = (EXPERIENCE_KINDS as ReadonlyArray<string>).includes(row.kind) ? (row.kind as ExperienceKind) : 'work'
  return {
    id: row.id,
    kind,
    organisation: row.organisation,
    title: row.title,
    location: row.location,
    url: row.url,
    startDate: row.start_date,
    endDate: row.end_date,
    summary: row.summary,
    highlights: row.highlights,
    stack: row.stack,
    visible: row.visible,
    sortOrder: row.sort_order,
  }
}

export function toStackGroup(row: Tables<'stack_groups'>): StackGroup {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    items: row.items,
    visible: row.visible,
    sortOrder: row.sort_order,
  }
}

export function toTestimonial(row: Tables<'testimonials'>): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    role: row.role,
    company: row.company,
    avatar: image(row.avatar),
    visible: row.visible,
    sortOrder: row.sort_order,
  }
}
