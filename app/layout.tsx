import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elmo",
  description: "Big Stories Little Details",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Wrap the entire app with the SidebarProvider */}
          <SidebarProvider>
            {/* Add Sidebar for all pages */}
            <div className="flex">
              <AppSidebar />
              <SidebarInset>
                {/* Render the content for authenticated users */}
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
