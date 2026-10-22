import { Link } from '@tanstack/react-router'

import NavGroup from './nav-group'
import NavUser from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { BrandMark } from '@/components/shared/admin/brand-mark'
import { adminNav } from '@/constants/admin-navigation'

export default function AdminSidebar({
  brand,
  email,
  badges,
}: {
  brand: string
  email: string
  badges: Record<string, number>
}) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <BrandMark brand={brand} />
                <span className="grid leading-tight">
                  <span className="font-display text-base">{brand}</span>
                  <span className="text-xs text-mute">Website admin</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {adminNav.map((group) => (
          <NavGroup key={group.label} group={group} badges={badges} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
