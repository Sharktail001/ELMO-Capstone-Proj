import { Sidebar } from "@/components/sidebar"
import { NewsGrid } from "@/components/news-grid"
import { SidebarProvider } from "@/components/sidebar-context"
import { SidebarToggle } from "@/components/sidebar-toggle"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8 flex items-center gap-4">
            <SidebarToggle />
            <h1 className="text-4xl font-medium">Breaking News & Current Events</h1>
          </div>
          <NewsGrid />
        </main>
      </div>
    </SidebarProvider>
  )
}

