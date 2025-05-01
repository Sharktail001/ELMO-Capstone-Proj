"use client"

import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { getLastVisitedArticles, removeLastVisitedArticle } from "@/lib/amplifyConfig"
import { useAuth } from "@/lib/useAuth"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function NavProjects() {
  const [projects, setProjects] = useState<{ name: string; url: string; icon: LucideIcon }[]>([])
  const [loading, setLoading] = useState(true)
  const { isMobile } = useSidebar()
  const { user } = useAuth()
  const router = useRouter()

  const fetchLastVisitedArticles = async () => {
    if (user) {
      const lastVisitedArticles = await getLastVisitedArticles(user.userId)

      if (!lastVisitedArticles) {
        setLoading(false)
        return
      }

      const oneHourAgo = Date.now() - 60 * 60 * 1000
      const filteredArticles = lastVisitedArticles.filter(
        (article) => new Date(article.lastVisited).getTime() > oneHourAgo
      )

      lastVisitedArticles
        .filter((article) => new Date(article.lastVisited).getTime() <= oneHourAgo)
        .forEach((article) => removeLastVisitedArticle(user.userId, article.title))

      setProjects(
        filteredArticles.map((article) => ({
          name: article.title,
          url: `/explore/${article.title}`,
          icon: Folder,
        }))
      )

      setLoading(false)
    //   console.log("Filtered Articles:", filteredArticles)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLastVisitedArticles()
  }, [user])

  // Re-fetch data when the route changes
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    fetchLastVisitedArticles()
  }, [pathname])

if (loading) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recently Viewed</SidebarGroupLabel>
      <div className="flex justify-center items-center h-20">
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
        </div>
      </div>
    </SidebarGroup>
  );
}


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recently Viewed</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Article</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Article</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Article</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem></SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}