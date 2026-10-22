/**
 * Data access for public content (Supabase, publishable key + RLS).
 *
 * Every function returns app domain types, so server functions, query
 * options and components are unaware of the database. Editable page sections
 * fall back to the seed defaults if a row is missing, so the site never
 * renders an empty section.
 *
 * Server-only: import this from `src/server/functions/*` only.
 */
import {
  seedAbout,
  seedContact,
  seedHome,
  seedSettings,
  seedWorkHeader,
  seedWritingHeader,
} from '@/lib/seed/site'
import {
  toExperience,
  toPost,
  toPostSummary,
  toProject,
  toProjectSummary,
  toSettings,
  toStackGroup,
  toTestimonial,
} from '@/server/mappers'
import { renderMarkdown } from '@/server/markdown'
import { getPublicClient } from '@/server/supabase'
import type {
  AboutContent,
  ContactContent,
  Experience,
  HomeContent,
  PageHeaderContent,
  Post,
  PostSummary,
  Project,
  ProjectSummary,
  SiteSettings,
  StackGroup,
  Testimonial,
} from '@/types'

function fail(scope: string, error: { message: string }): never {
  throw new Error(`[repository:${scope}] ${error.message}`)
}

const PROJECT_LIST_COLUMNS =
  'id, slug, title, summary, role, client, year, tags, stack, links, metrics, cover, featured, published, sort_order, created_at, updated_at'
const POST_LIST_COLUMNS =
  'id, slug, title, excerpt, cover, tags, reading_minutes, published, published_at, created_at, updated_at'

export async function findSettings(): Promise<SiteSettings> {
  const { data, error } = await getPublicClient().from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) fail('settings', error)
  return data ? toSettings(data) : seedSettings
}

/** Loads all sections of a page as a { section: data } map. */
async function findPageSections(page: string): Promise<Record<string, unknown>> {
  const { data, error } = await getPublicClient().from('page_content').select('section, data').eq('page', page)
  if (error) fail(`page:${page}`, error)
  return Object.fromEntries(data.map((row) => [row.section, row.data]))
}

/** Shallow-merges stored section data over the seed default (new fields stay filled). */
function section<T extends object>(stored: unknown, fallback: T): T {
  return stored && typeof stored === 'object' ? { ...fallback, ...(stored as Partial<T>) } : fallback
}

export async function findHomeContent(): Promise<HomeContent> {
  const s = await findPageSections('home')
  return {
    hero: section(s.hero, seedHome.hero),
    intro: section(s.intro, seedHome.intro),
    capabilities: section(s.capabilities, seedHome.capabilities),
    cta: section(s.cta, seedHome.cta),
  }
}

export async function findAboutContent(): Promise<AboutContent & { storyHtml: string }> {
  const s = await findPageSections('about')
  const about = section(s.main, seedAbout)
  return { ...about, storyHtml: await renderMarkdown(about.story) }
}

export async function findContactContent(): Promise<ContactContent> {
  const s = await findPageSections('contact')
  return section(s.main, seedContact)
}

export async function findPageHeader(page: 'work' | 'writing'): Promise<PageHeaderContent> {
  const s = await findPageSections(page)
  return section(s.header, page === 'work' ? seedWorkHeader : seedWritingHeader)
}

/* ---------- Projects ---------- */

export async function findProjects(filter: { featured?: boolean } = {}): Promise<Array<ProjectSummary>> {
  let query = getPublicClient().from('projects').select(PROJECT_LIST_COLUMNS).eq('published', true).order('sort_order')
  if (filter.featured) query = query.eq('featured', true)
  const { data, error } = await query
  if (error) fail('projects', error)
  return data.map(toProjectSummary)
}

export async function findProjectBySlug(
  slug: string,
): Promise<{ project: Project; bodyHtml: string; next: ProjectSummary | null } | null> {
  const db = getPublicClient()
  const { data: row, error } = await db.from('projects').select('*').eq('slug', slug).eq('published', true).maybeSingle()
  if (error) fail('project', error)
  if (!row) return null

  // Next project in display order, wrapping around to the first.
  const siblings = await findProjects()
  const index = siblings.findIndex((p) => p.id === row.id)
  const next = siblings.length > 1 ? siblings[(index + 1) % siblings.length] : null

  const project = toProject(row)
  return { project, bodyHtml: await renderMarkdown(project.body), next }
}

/* ---------- Writing ---------- */

export async function findPosts(filter: { limit?: number } = {}): Promise<Array<PostSummary>> {
  let query = getPublicClient()
    .from('posts')
    .select(POST_LIST_COLUMNS)
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (filter.limit) query = query.limit(filter.limit)
  const { data, error } = await query
  if (error) fail('posts', error)
  return data.map(toPostSummary)
}

export async function findPostBySlug(
  slug: string,
): Promise<{ post: Post; bodyHtml: string; more: Array<PostSummary> } | null> {
  const { data: row, error } = await getPublicClient()
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) fail('post', error)
  if (!row) return null

  const post = toPost(row)
  const more = (await findPosts({ limit: 3 })).filter((p) => p.id !== post.id).slice(0, 2)
  return { post, bodyHtml: await renderMarkdown(post.body), more }
}

/* ---------- About ---------- */

export async function findExperiences(): Promise<Array<Experience>> {
  const { data, error } = await getPublicClient()
    .from('experiences')
    .select('*')
    .eq('visible', true)
    .order('sort_order')
  if (error) fail('experiences', error)
  return data.map(toExperience)
}

export async function findStackGroups(): Promise<Array<StackGroup>> {
  const { data, error } = await getPublicClient()
    .from('stack_groups')
    .select('*')
    .eq('visible', true)
    .order('sort_order')
  if (error) fail('stack', error)
  return data.map(toStackGroup)
}

/** RLS already hides testimonials when they are switched off in settings. */
export async function findTestimonials(): Promise<Array<Testimonial>> {
  const { data, error } = await getPublicClient()
    .from('testimonials')
    .select('*')
    .eq('visible', true)
    .order('sort_order')
  if (error) fail('testimonials', error)
  return data.map(toTestimonial)
}
