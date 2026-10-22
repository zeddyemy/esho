import { ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-paper/80 px-4 backdrop-blur-xl lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="truncate text-sm font-medium">{title}</h1>
      <Button asChild variant="ghost" size="sm" className="ml-auto text-mute hover:text-ink">
        <a href="/" target="_blank" rel="noreferrer">
          <ExternalLink /> <span className="hidden sm:inline">View website</span>
        </a>
      </Button>
    </header>
  )
}
