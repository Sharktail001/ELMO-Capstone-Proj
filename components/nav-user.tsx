"use client"

import { useAuth } from "../lib/useAuth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronsUpDown, LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

export function NavUser() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { isMobile } = useSidebar()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      console.log("Logging out...")
      localStorage.removeItem("preferencesApplied")
      await logout()
      router.replace("/")
      window.location.reload() // Force a full page reload
      console.log("Logged out")
    } catch (error) {
      console.error("Error during logout:", error)
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[150px] space-y-2">
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      )}
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-full border-2 border-background shadow-sm">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} className="object-cover" />
                  <AvatarFallback className="rounded-full bg-primary/10 text-primary font-medium">
                    {user.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                  <Avatar className="h-9 w-9 rounded-full border border-border shadow-sm">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} className="object-cover" />
                    <AvatarFallback className="rounded-full bg-primary/10 text-primary font-medium">
                      {user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup></DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
