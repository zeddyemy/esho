import { useSuspenseQuery } from '@tanstack/react-query'

import AboutIntro from './intro'
import ResumeCta from './resume'
import Stack from './stack'
import Story from './story'
import Timeline from './timeline'
import { aboutContentQuery, experiencesQuery, settingsQuery, stackGroupsQuery } from '@/hooks/api/site'
import { isSectionVisible } from '@/lib/sections'
import type { SectionKey } from '@/lib/sections'

export default function About() {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { data: about } = useSuspenseQuery(aboutContentQuery())
  const { data: experiences } = useSuspenseQuery(experiencesQuery())
  const { data: stack } = useSuspenseQuery(stackGroupsQuery())

  const show = (key: SectionKey) => isSectionVisible(settings, key)
  const timeline = experiences.filter((e) => show(e.kind === 'work' ? 'about.experience' : 'about.education'))

  return (
    <>
      <AboutIntro content={about} />
      <Story storyHtml={show('about.story') ? about.storyHtml : null} principles={show('about.principles') ? about.principles : []} />
      <Timeline items={timeline} />
      {show('about.stack') ? <Stack groups={stack} /> : null}
      {show('about.closing') ? <ResumeCta settings={settings} /> : null}
    </>
  )
}
