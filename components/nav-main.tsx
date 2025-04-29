"use client"

import { Home, Search, MessageSquare, Bookmark, Settings, LogOut, ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const mainNavItems = [
  {
    title: "Home",
    url: "/onboarding",
    icon: Home,
  },
  {
    title: "Explore",
    url: "/explore",
    icon: Search,
    isActive: true,
  },
  {
    title: "Saved",
    url: "/saved",
    icon: Bookmark,
  },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {mainNavItems.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
