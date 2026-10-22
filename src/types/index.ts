/**
 * Domain types. These mirror the Supabase tables in `supabase/migrations`
 * (snake_case columns are mapped to camelCase in `server/mappers.ts`) so seed
 * data and live data share one shape.
 */

/**
 * An image reference. `src` is an absolute URL (Cloudinary secure_url or any
 * external CDN) and is resized at render time by `lib/media.ts`.
 * `publicId` is set for Cloudinary uploads so they can be destroyed later.
 */
export interface ImageAsset {
  src: string
  width: number
  height: number
  alt: string
  publicId?: string | null
  color?: string | null
  /** Photographer credit for stock/seed images. */
  credit?: string | null
}

/** A non-image upload (the résumé PDF). */
export interface FileAsset {
  url: string
  filename: string
  bytes: number
  publicId?: string | null
  uploadedAt: string
}

export const SOCIAL_KEYS = ['github', 'linkedin', 'x', 'instagram', 'youtube', 'dribbble', 'medium'] as const

export type SocialKey = (typeof SOCIAL_KEYS)[number]

export type SocialLinks = Partial<Record<SocialKey, string>>

export interface SiteSettings {
  /** Wordmark shown in the header and footer ("Esho"). */
  brandName: string
  ownerName: string
  roleTitle: string
  tagline: string
  logo: ImageAsset | null
  portrait: ImageAsset | null
  /** Short availability line, e.g. "Taking on new projects from January". */
  availability: string
  openToWork: boolean
  email: string
  phones: Array<string>
  whatsapp: string
  location: string
  socials: SocialLinks
  resume: FileAsset | null
  footerNote: string
  showWriting: boolean
  showTestimonials: boolean
  showResume: boolean
  seo: {
    title: string
    description: string
    image: ImageAsset | null
  }
}

/* ---------- Projects ---------- */

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectMetric {
  value: string
  label: string
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  role: string
  client: string
  year: number
  tags: Array<string>
  stack: Array<string>
  links: Array<ProjectLink>
  metrics: Array<ProjectMetric>
  cover: ImageAsset
  gallery: Array<ImageAsset>
  /** Case study in markdown. */
  body: string
  featured: boolean
  published: boolean
  sortOrder: number
}

/** List item without the heavy fields. */
export type ProjectSummary = Omit<Project, 'body' | 'gallery'>

/* ---------- Writing ---------- */

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  cover: ImageAsset | null
  /** Markdown. */
  body: string
  tags: Array<string>
  published: boolean
  publishedAt: string | null
  readingMinutes: number
}

export type PostSummary = Omit<Post, 'body'>

/* ---------- About ---------- */

export const EXPERIENCE_KINDS = ['work', 'education'] as const

export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number]

export interface Experience {
  id: string
  kind: ExperienceKind
  organisation: string
  title: string
  location: string
  url: string
  /** ISO date (YYYY-MM-DD); only month and year are shown. */
  startDate: string
  /** Null means "present". */
  endDate: string | null
  summary: string
  highlights: Array<string>
  stack: Array<string>
  visible: boolean
  sortOrder: number
}

export interface StackGroup {
  id: string
  title: string
  description: string
  items: Array<string>
  visible: boolean
  sortOrder: number
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
  avatar: ImageAsset | null
  visible: boolean
  sortOrder: number
}

/* ---------- Inquiries ---------- */

export const INQUIRY_STATUSES = ['new', 'read', 'replied', 'archived'] as const

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

export interface Inquiry {
  id: string
  name: string
  email: string
  company: string | null
  projectType: string | null
  budget: string | null
  timeline: string | null
  message: string
  status: InquiryStatus
  createdAt: string
}

/* ---------- Editable page sections (page_content table) ---------- */

export interface HeroContent {
  headline: string
  subheadline: string
  primaryCta: string
  secondaryCta: string
}

export interface IntroContent {
  statement: string
  body: string
}

export interface Capability {
  title: string
  body: string
  points: Array<string>
  image: ImageAsset | null
}

export interface CapabilitiesContent {
  heading: string
  items: Array<Capability>
}

export interface CtaContent {
  heading: string
  body: string
}

export interface HomeContent {
  hero: HeroContent
  intro: IntroContent
  capabilities: CapabilitiesContent
  cta: CtaContent
}

export interface AboutContent {
  heading: string
  lead: string
  /** Markdown paragraphs. */
  story: string
  image: ImageAsset | null
  facts: Array<{ label: string; value: string }>
  principles: Array<{ title: string; body: string }>
}

export interface ContactContent {
  heading: string
  body: string
  responseNote: string
  projectTypes: Array<string>
  budgets: Array<string>
}

export interface PageHeaderContent {
  heading: string
  body: string
}
