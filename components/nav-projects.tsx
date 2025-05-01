"use client";

import {
  Star,
  Laptop,
  TestTubeDiagonal,
  Pill,
  Plane,
  Drama,
  Paintbrush,
  Leaf,
  Pizza,
  Medal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  getLastVisitedArticles,
  removeLastVisitedArticle,
} from "@/lib/amplifyConfig";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function NavProjects() {
  const [projects, setProjects] = useState<
    { name: string; url: string; categoryIcon: LucideIcon }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Category mapping with Lucide icons
  const categories = [
    { icon: Star, value: "general" },
    { icon: Laptop, value: "technology" },
    { icon: TestTubeDiagonal, value: "science" },
    { icon: Pill, value: "health" },
    { icon: Plane, value: "travel" },
    { icon: Drama, value: "entertainment" },
    { icon: Paintbrush, value: "art" },
    { icon: Leaf, value: "min" },
    { icon: Pizza, value: "food" },
    { icon: Medal, value: "sports" },
  ];

  // Helper function to get icon for a category
  const getIconForCategory = (category: string): LucideIcon => {
    const foundCategory = categories.find((c) => c.value === category);
    return foundCategory ? foundCategory.icon : Star; // Default to Star icon if category not found
  };

  const fetchLastVisitedArticles = async () => {
    if (user) {
      const lastVisitedArticles = await getLastVisitedArticles(user.userId);

      if (!lastVisitedArticles) {
        setLoading(false);
        return;
      }

      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const filteredArticles = lastVisitedArticles.filter(
        (article) => new Date(article.lastVisited).getTime() > oneHourAgo
      );

      lastVisitedArticles
        .filter(
          (article) => new Date(article.lastVisited).getTime() <= oneHourAgo
        )
        .forEach((article) =>
          removeLastVisitedArticle(user.userId, article.title)
        );

      // Sort articles by lastVisited timestamp, most recent first
      const sortedArticles = [...filteredArticles].sort(
        (a, b) =>
          new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
      );

      setProjects(
        sortedArticles.map((article) => ({
          name: article.title,
          url: `/explore/${article.title}`,
          categoryIcon: getIconForCategory(article.category || "general"),
        }))
      );

      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastVisitedArticles();
  }, [user]);

  // Re-fetch data when the route changes
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    fetchLastVisitedArticles();
  }, [pathname]);

  // Function to handle article deletion
  const handleDeleteArticle = async (articleName: string) => {
    if (user) {
      await removeLastVisitedArticle(user.userId, articleName);
      // Update the state to reflect the deletion
      setProjects(projects.filter((project) => project.name !== articleName));
    }
  };

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
                <item.categoryIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuAction
              showOnHover
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteArticle(item.name);
              }}
              title="Remove from recently viewed"
            >
              <Trash2 className="text-muted-foreground hover:text-destructive transition-colors" />
              <span className="sr-only">Delete</span>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem></SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
