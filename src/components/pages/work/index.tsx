import { useSuspenseQuery } from '@tanstack/react-query'

import ProjectGrid from './project-grid'
import TagFilter from './tag-filter'
import { PageIntro } from '@/components/shared/page-intro'
import { projectsQuery } from '@/hooks/api/content'
import { pageHeaderQuery } from '@/hooks/api/site'

export default function Work({ tag }: { tag?: string }) {
  const { data: header } = useSuspenseQuery(pageHeaderQuery('work'))
  const { data: projects } = useSuspenseQuery(projectsQuery())

  const tags = [...new Set(projects.flatMap((p) => p.tags))]
  const visible = tag ? projects.filter((p) => p.tags.includes(tag)) : projects

  return (
    <>
      <PageIntro heading={header.heading} body={header.body}>
        <TagFilter tags={tags} active={tag} />
      </PageIntro>
      <ProjectGrid projects={visible} />
    </>
  )
}
