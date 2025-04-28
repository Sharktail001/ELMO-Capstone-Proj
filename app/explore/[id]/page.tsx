"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getTableItemById } from "@/lib/amplifyConfig"
import { ChevronLeft, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import withAuth from "../../../lib/withAuth"
import { Skeleton } from "@/components/ui/skeleton"


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

function ArticleDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true)
      try {
        const data = await getTableItemById("ELMO-Articles-Table", decodeURIComponent(params.id))
        if (data) {
          setArticle(data)
        } else {
          setError("Article not found")
        }
      } catch (err) {
        console.error("Error fetching article:", err)
        setError("Failed to load article")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchArticle()
  }, [params.id])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "Unknown date"
    }
  }

  const handleBackClick = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Button>
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button className="mt-6 bg-[#FF7E77] hover:bg-[#FF5951]" onClick={handleBackClick}>
            Return to articles
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-6">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Button>

        {article && (
          <article>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {(() => {
                      const category = categories.find((i) => i.value === article.category);
                      return category ? `${category.name} ${category.emoji} ` : "📰 News";
                    })()}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(article.published_date)}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {article.title || "Untitled Article"}
              </h1>
              
              {article.urlToImage && (
                <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-8">
                  <Image
                    fill={true}
                    src={article.urlToImage}
                    alt={article.title || "Article Image"}
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                {article.full_text ? (
                  <Markdown remarkPlugins={[remarkGfm]}>{article.full_text}</Markdown>
                ) : (
                  <p className="text-gray-600">{article.description || "No content available."}</p>
                )}
              </div>
              
              {article.url && (
                <div className="mt-12 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="gap-2 text-[#FF7E77] hover:text-[#FF5951] hover:bg-[#FFF5F5] border-[#FFDED9]"
                    asChild
                  >
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      View original source <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </main>
  )
}

export default ArticleDetail;