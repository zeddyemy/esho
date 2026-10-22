import { useRouterState } from '@tanstack/react-router'

import AdminHeader from './header'
import AdminSidebar from './sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { adminNav } from '@/constants/admin-navigation'

function useAdminTitle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, '') })
  const items = adminNav.flatMap((g) => g.items)
  const match =
    items.find((i) => i.exact && String(i.to) === pathname) ??
    items.filter((i) => !i.exact && pathname.startsWith(String(i.to))).sort((a, b) => String(b.to).length - String(a.to).length)
      .at(0)
  return match?.label ?? 'Admin'
}

export default function AdminLayout({
  brand,
  email,
  badges,
  children,
}: {
  brand: string
  email: string
  badges: Record<string, number>
  children: React.ReactNode
}) {
  const title = useAdminTitle()
  return (
    <TooltipProvider delayDuration={300}>
      <SidebarProvider>
        <AdminSidebar brand={brand} email={email} badges={badges} />
        <SidebarInset className="min-w-0 bg-paper">
          <AdminHeader title={title} />
          <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
