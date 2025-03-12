"use client"

import { useSidebar } from "./sidebar-context"

export function SidebarToggle() {
  const { toggleSidebar, isExpanded } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className="rounded-full p-2 hover:bg-gray-100 transition-colors"
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
    >
      <svg
        className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </button>
  )
}

