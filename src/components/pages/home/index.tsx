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
import { isSectionVisible } from '@/lib/sections'
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

  // A section appears only when it is switched on and has something to show.
  const showWork = show('home.work') && selected.length > 0
  const showCapabilities = show('home.capabilities') && content.capabilities.items.length > 0
  const showExperience = show('home.experience') && experiences.some((e) => e.kind === 'work')
  const showTestimonials = show('home.testimonials') && testimonials.length > 0
  const showWriting = show('home.writing') && posts.length > 0
  const hasSections =
    show('home.hero') || show('home.intro') || show('home.cta') || showWork || showCapabilities || showExperience || showTestimonials || showWriting

  // Nothing to render: the homepage still says who this is.
  if (!hasSections) {
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
        <Hero content={content.hero} settings={settings} workHref={showWork ? '#work' : '/work'} />
      ) : (
        <h1 className="sr-only">
          {settings.ownerName}, {settings.roleTitle}
        </h1>
      )}
      {show('home.intro') ? <Intro content={content.intro} /> : null}
      {showWork ? <SelectedWork projects={selected} total={projects.length} /> : null}
      {showCapabilities ? <Capabilities content={content.capabilities} /> : null}
      {showExperience ? <Experience items={experiences} linkHash={show('about.experience') ? 'experience' : undefined} /> : null}
      {showTestimonials ? <Testimonials items={testimonials} /> : null}
      {showWriting ? <LatestWriting posts={posts} /> : null}
      {show('home.cta') ? <Cta content={content.cta} email={settings.email} /> : null}
    </>
  )
}
