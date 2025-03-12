"use client"

import { useState, useRef, useEffect } from "react"
import { User, Settings, LogOut, ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UserProfileProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image
            src={user.avatar || "/placeholder.svg?height=32&width=32"}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate">{user.name}</p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
        </div>
        <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? "" : "rotate-180"}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border bg-white shadow-lg">
          <div className="p-2">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/account-settings"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </Link>
            <hr className="my-1" />
            <Link
              href="/logout"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

