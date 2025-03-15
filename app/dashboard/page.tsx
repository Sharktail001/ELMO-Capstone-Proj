"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import ChatPage from "../chat-page/page";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ChatPage />
      </SidebarInset>
    </SidebarProvider>
  );
}
