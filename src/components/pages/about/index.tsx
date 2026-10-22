import { useSuspenseQuery } from '@tanstack/react-query'

import AboutIntro from './intro'
import ResumeCta from './resume'
import Stack from './stack'
import Story from './story'
import Timeline from './timeline'
import { aboutContentQuery, experiencesQuery, settingsQuery, stackGroupsQuery } from '@/hooks/api/site'

export default function About() {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { data: about } = useSuspenseQuery(aboutContentQuery())
  const { data: experiences } = useSuspenseQuery(experiencesQuery())
  const { data: stack } = useSuspenseQuery(stackGroupsQuery())

  return (
    <>
      <AboutIntro content={about} />
      <Story storyHtml={about.storyHtml} principles={about.principles} />
      <Timeline items={experiences} />
      <Stack groups={stack} />
      <ResumeCta settings={settings} />
    </>
  )
}
