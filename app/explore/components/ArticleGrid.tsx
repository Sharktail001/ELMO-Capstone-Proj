// src/app/explore/components/ArticleGrid.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Star,
  Laptop,
  TestTubeDiagonal,
  Pill,
  Plane,
  Drama,
  Paintbrush,
  Leaf,
  Pizza,
  Award,
} from "lucide-react";
import Image from "next/image";

interface ArticleGridProps {
  articles: any[];
  handleArticleClick: (article: any) => void;
  savedArticles: string[];
  handleSaveClick: (article: any) => void;
}

const categories = [
  { name: "Breaking News & Current Events", value: "general", icon: Star },
  { name: "Technology & Innovation", value: "technology", icon: Laptop },
  { name: "Science", value: "science", icon: TestTubeDiagonal },
  { name: "Health & Wellness", value: "health", icon: Pill },
  { name: "Travel", value: "travel", icon: Plane },
  { name: "Entertainment & Media", value: "entertainment", icon: Drama },
  { name: "Arts & Culture", value: "art", icon: Paintbrush },
  { name: "Opinions & Deep Dives", value: "min", icon: Leaf },
  { name: "Food", value: "food", icon: Pizza },
  { name: "Sports & Lifestyle", value: "sports", icon: Award },
];

export default function ArticleGrid({
  articles,
  handleArticleClick,
  savedArticles,
  handleSaveClick,
}: ArticleGridProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <Card
          key={index}
          className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer"
          onClick={() => handleArticleClick(article || [])}
        >
          <div className="h-48 bg-gray-100 relative overflow-hidden">
            <Image
              fill={true}
              src={
                article.urlToImage || "/placeholder.svg?height=400&width=600"
              }
              alt={article.title || "Article Image"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              {(() => {
                const category = categories.find(
                  (i) => i.value === article.category
                );
                return (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 max-w-[90%] truncate"
                  >
                    {category?.icon && (
                      <category.icon className="w-3.5 h-3.5" />
                    )}
                    <span className="truncate">{category?.name || "News"}</span>
                  </Badge>
                );
              })()}
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(article.published_date)}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  handleSaveClick(article);
                }}
                className="ml-auto"
              >
                {savedArticles.includes(article.title) ? (
                  <BookmarkCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <Bookmark className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            </div>
            <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-[#FF7E77] transition-colors">
              {article.title || "Untitled"}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {article.description || "No description available."}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
