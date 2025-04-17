"use client"

import type * as React from "react"
import { useEffect, useState } from "react"
import { Frame, Map, PieChart, Settings2, SquareTerminal, Newspaper, Search } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarInput,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/AuthContext" // Import useAuth hook

const data = {
  user: {
    name: "user",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated } = useAuth(); // Get authentication state
  const [isClient, setIsClient] = useState(false);

  // Wait for the component to mount before checking authentication
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isAuthenticated) {
    return null; // Do not render sidebar if the user is not authenticated
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF5951] to-[#FF7E77] text-white">
                  <Newspaper className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-lg">ELMO</span>
                  <span className="text-xs text-muted-foreground">AI News Assistant</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="[&_.sidebar-group-label]:text-xs [&_.sidebar-group-label]:font-medium [&_.sidebar-group-label]:text-muted-foreground [&_[data-active=true]]:text-[#FF7E77] [&_[data-active=true]_svg]:text-[#FF7E77] [&_a:hover_svg]:text-[#FF7E77]">
        <NavMain items={data.navMain} />
        <SidebarSeparator className="my-2" />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
