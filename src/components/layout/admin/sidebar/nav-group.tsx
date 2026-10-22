import { Link, useRouterState } from '@tanstack/react-router'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import type { AdminNavGroup } from '@/constants/admin-navigation'

export default function NavGroup({ group, badges }: { group: AdminNavGroup; badges: Record<string, number> }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, '') || '/' })
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-label text-[0.625rem] text-mute">{group.label}</SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map((item) => {
          const to = String(item.to)
          const active = item.exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
          const badge = item.badge ? badges[item.badge] : 0
          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="data-[active=true]:text-cobalt">
                <Link to={item.to} onClick={() => setOpenMobile(false)}>
                  <item.icon strokeWidth={1.75} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
              {badge ? (
                <SidebarMenuBadge className="rounded-full bg-cobalt px-1.5 text-[0.65rem] text-cobalt-ink peer-hover/menu-button:text-cobalt-ink peer-data-[active=true]/menu-button:text-cobalt-ink">
                  {badge}
                </SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
