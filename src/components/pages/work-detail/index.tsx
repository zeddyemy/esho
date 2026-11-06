import { useSuspenseQuery } from '@tanstack/react-query'

import CaseStudy from './case-study'
import NextProject from './next-project'
import ProjectHeader from './project-header'
import { projectQuery } from '@/hooks/api/content'
import { settingsQuery } from '@/hooks/api/site'
import { isSectionVisible } from '@/lib/sections'

export default function WorkDetail({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(projectQuery(slug))
  const { data: settings } = useSuspenseQuery(settingsQuery())
  return (
    <article>
      <ProjectHeader project={data.project} />
      <CaseStudy
        project={data.project}
        bodyHtml={data.bodyHtml}
        showOutcomes={isSectionVisible(settings, 'project.outcomes')}
        showGallery={isSectionVisible(settings, 'project.gallery')}
      />
      {data.next && isSectionVisible(settings, 'project.next') ? <NextProject project={data.next} /> : null}
    </article>
  )
}
