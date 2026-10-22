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

  return (
    <>
      <Hero content={content.hero} settings={settings} />
      <Intro content={content.intro} />
      <SelectedWork projects={selected} total={projects.length} />
      <Capabilities content={content.capabilities} />
      <Experience items={experiences} />
      {settings.showTestimonials ? <Testimonials items={testimonials} /> : null}
      {settings.showWriting ? <LatestWriting posts={posts} /> : null}
      <Cta content={content.cta} email={settings.email} />
    </>
  )
}
