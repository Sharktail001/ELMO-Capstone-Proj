// src/app/explore/components/ArticleGrid.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Bookmark, BookmarkCheck } from "lucide-react";

interface ArticleGridProps {
  articles: any[]
  handleArticleClick: (article: any) => void
  savedArticles: string[]
  handleSaveClick: (article: any) => void
}

const categories = [
  { name: "Breaking News & Current Events", emoji: "🌟", value: "general" }, //YES - General
  { name: "Technology & Innovation", emoji: "🎮", value: "technology" }, //YES
  { name: "Science", emoji: "🧪", value: "science" }, //YES
  { name: "Health & Wellness", emoji: "💊", value: "health" }, //YES
  { name: "Travel", emoji: "✈️", value: "travel" },
  { name: "Entertainment & Media", emoji: "🎭", value: "entertainment" }, //YES
  { name: "Arts & Culture", emoji: "🎨", value: "art" },
  { name: "Opinions & Deep Dives", emoji: "☘️", value: "min" },
  { name: "Food", emoji: "🍕", value: "food" },
  { name: "Sports & Lifestyle", emoji: "🏈", value: "sports" }, //YES
];

export default function ArticleGrid({ articles, handleArticleClick, savedArticles, handleSaveClick }: ArticleGridProps) {
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
              src={article.urlToImage || "/placeholder.svg?height=400&width=600"}
              alt={article.title || "Article Image"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200, max-w-[50%]">
                {(() => {
                  const category = categories.find((i) => i.value === article.category);
                  return category ? `${category.name} ${category.emoji}` : "📰 News";
                })()}
              </Badge>
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