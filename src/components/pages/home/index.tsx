import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import Capabilities from './capabilities'
import Cta from './cta'
import Experience from './experience'
import Hero from './hero'
import Intro from './intro'
import LatestWriting from './latest-writing'
import SelectedWork from './selected-work'
import Testimonials from './testimonials'
import { postsQuery, projectsQuery } from '@/hooks/api/content'
import { experiencesQuery, homeContentQuery, settingsQuery, testimonialsQuery } from '@/hooks/api/site'
import { CONTACT_CTA } from '@/constants/navigation'
import { SECTION_GROUPS, isSectionVisible } from '@/lib/sections'
import type { SectionKey } from '@/lib/sections'

/** Featured projects lead; if none are featured, the first four are shown. */
const FEATURED_FALLBACK = 4

export default function Home() {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { data: content } = useSuspenseQuery(homeContentQuery())
  const { data: projects } = useSuspenseQuery(projectsQuery())
  const { data: experiences } = useSuspenseQuery(experiencesQuery())
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery())
  const { data: posts } = useSuspenseQuery(postsQuery({ limit: 3 }))

  const featured = projects.filter((p) => p.featured)
  const selected = featured.length ? featured : projects.slice(0, FEATURED_FALLBACK)

  const show = (key: SectionKey) => isSectionVisible(settings, key)

  // Every section switched off: the homepage still says who this is.
  if (!SECTION_GROUPS[0].sections.some((s) => show(s.key))) {
    return (
      <section className="container-site flex min-h-[60dvh] flex-col justify-center py-24">
        <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">{settings.ownerName}</h1>
        <p className="mt-6 text-lg text-mute">{settings.roleTitle}</p>
        <Link to="/contact" className="link-static mt-8 w-fit">
          {CONTACT_CTA}
        </Link>
      </section>
    )
  }

  return (
    <>
      {show('home.hero') ? (
        <Hero content={content.hero} settings={settings} workHref={show('home.work') ? '#work' : '/work'} />
      ) : (
        <h1 className="sr-only">
          {settings.ownerName}, {settings.roleTitle}
        </h1>
      )}
      {show('home.intro') ? <Intro content={content.intro} /> : null}
      {show('home.work') ? <SelectedWork projects={selected} total={projects.length} /> : null}
      {show('home.capabilities') ? <Capabilities content={content.capabilities} /> : null}
      {show('home.experience') ? <Experience items={experiences} linkHash={show('about.experience') ? 'experience' : undefined} /> : null}
      {show('home.testimonials') ? <Testimonials items={testimonials} /> : null}
      {show('home.writing') ? <LatestWriting posts={posts} /> : null}
      {show('home.cta') ? <Cta content={content.cta} email={settings.email} /> : null}
    </>
  )
}
