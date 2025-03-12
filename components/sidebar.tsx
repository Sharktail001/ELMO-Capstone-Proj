"use client"

import { Home, Search, MessageSquare, Bookmark, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "./sidebar-context"
import { UserProfile } from "./user-profile"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Ask ELMO", href: "/ask", icon: MessageSquare },
  { name: "Saved", href: "/saved", icon: Bookmark },
  { name: "Settings", href: "/settings", icon: Settings },
]

const recentReads = [
  "Israel-Gaza Conflict",
  "Ukraine-Russia Conflict",
  "World's 50 Best Restaurants",
  "SAG Awards 2025",
  "Sotheby's Auction",
  "Super Bowl 2025",
]

// Mock user data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
}

export function Sidebar() {
  const pathname = usePathname()
  const { isExpanded } = useSidebar()

  return (
    <div
      className={`bg-gray-50 overflow-hidden transition-all duration-300 flex flex-col h-screen sticky top-0 ${
        isExpanded ? "w-64" : "w-0"
      }`}
    >
      <div className="p-4 w-64 flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">ELMO</h1>
        </div>

        <nav className="mb-8">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-pink-100 text-pink-900" : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex-1 overflow-y-auto pr-2">
          <h2 className="mb-4 text-lg font-medium">Recent Reads</h2>
          <ul className="space-y-2">
            {recentReads.map((item) => (
              <li key={item}>
                <Link href="#" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User profile at the bottom */}
        <div className="mt-4 pt-4 border-t">
          <UserProfile user={userData} />
        </div>
      </div>
    </div>
  )
}

