import { useSuspenseQuery } from '@tanstack/react-query'

import CaseStudy from './case-study'
import NextProject from './next-project'
import ProjectHeader from './project-header'
import { projectQuery } from '@/hooks/api/content'

export default function WorkDetail({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(projectQuery(slug))
  return (
    <article>
      <ProjectHeader project={data.project} />
      <CaseStudy project={data.project} bodyHtml={data.bodyHtml} />
      {data.next ? <NextProject project={data.next} /> : null}
    </article>
  )
}
