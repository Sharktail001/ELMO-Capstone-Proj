"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getTableItemById, getUserSavedArticles, saveUserArticles, removeUserSavedArticle, getUserSavedArticle } from "@/lib/amplifyConfig"
import { ChevronLeft, Clock, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Skeleton } from "@/components/ui/skeleton"
import { saveArticle, removeArticle, getSavedArticles } from "@/lib/savedArticles"
import { useAuth } from "@/lib/useAuth"

const categories = [
  { name: "Breaking News & Current Events", emoji: "🌟", value: "general" },
  { name: "Technology & Innovation", emoji: "🎮", value: "technology" },
  { name: "Science", emoji: "🧪", value: "science" },
  { name: "Health & Wellness", emoji: "💊", value: "health" },
  { name: "Travel", emoji: "✈️", value: "travel" },
  { name: "Entertainment & Media", emoji: "🎭", value: "entertainment" },
  { name: "Arts & Culture", emoji: "🎨", value: "art" },
  { name: "Opinions & Deep Dives", emoji: "☘️", value: "min" },
  { name: "Food", emoji: "🍕", value: "food" },
  { name: "Sports & Lifestyle", emoji: "🏈", value: "sports" },
]

function ArticleDetail() {
  const router = useRouter()
  const { id } = useParams()
  const { user, loading } = useAuth();
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const [readingMode, setReadingMode] = useState<"brief" | "standard" | "deep">("standard")

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true)
      try {
        if (!user) return
        const data = await getUserSavedArticle(user.userId, decodeURIComponent(id as string))
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

    // Fetch saved articles from the local storage or database
    const fetchSavedArticles = async () => {
      if (!user) return
      const saved = await getUserSavedArticles(user.userId)
      setSavedArticles(saved?.map((item: any) => item.title) || [])
      console.log("Saved Articles2:", savedArticles)
    }

    fetchSavedArticles()
    fetchArticle()
  }, [id, user])

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

  const handleSaveClick = async () => {
    if(!article) return
    if (!user) return;

    const tempsavedArticles = await getUserSavedArticles(user.userId);
    console.log("Saved Articles:", tempsavedArticles);
    if (tempsavedArticles){
      const isSaved = tempsavedArticles.some((savedArticle: any) => savedArticle.title === article.title);
      if (!isSaved) {
        await saveUserArticles(user.userId, article);
        setSavedArticles((prev) => [...prev, article.title]);
      } else {
        await removeUserSavedArticle(user.userId, article.title)
        setSavedArticles((prev) => prev.filter((savedId) => savedId !== article.title))
      }
    }
  }

  const getArticleContent = () => {
    if (!article) return ""

    switch (readingMode) {
      case "brief":
        return article.summary || article.description || article.full_text || "No summary available."
      case "standard":
        return article.full_text || "No content available for this article."
      case "deep":
        return article.full_text
          ? `${article.full_text}\n\n## Analysis\n${article.analysis || "No in-depth analysis available for this article."}`
          : "No content available for this article."
      default:
        return article.full_text || "No content available for this article."
    }
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
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  {(() => {
                    const category = categories.find((i) => i.value === article.category)
                    return category ? `${category.name} ${category.emoji}` : "📰 News"
                  })()}
                </Badge>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(article.published_date)}
                </div>

                <Button variant="outline" size="icon" onClick={handleSaveClick} className="ml-auto">
                  {savedArticles.includes(article.title) ? (
                    <BookmarkCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {article.title || "Untitled Article"}
              </h1>

              {article.urlToImage && (
                <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-8">
                  <Image
                    fill={true}
                    src={article.urlToImage || "/placeholder.svg"}
                    alt={article.title || "Article Image"}
                    className="object-cover"
                  />
                </div>
              )}

               {/* Reading Modes */}
               <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Reading Modes</h2>
                <div className="grid gap-3">
                  <button
                    className={`text-left p-4 rounded-lg border transition ${readingMode === "brief" ? "bg-pink-100 border-pink-200" : "bg-white hover:bg-gray-50"}`}
                    onClick={() => setReadingMode("brief")}
                  >
                    <span className="font-bold">Brief-</span> Quick, easy-to-read summaries with key takeaways
                  </button>

                  <button
                    className={`text-left p-4 rounded-lg border transition ${readingMode === "standard" ? "bg-gray-100 border-gray-200" : "bg-white hover:bg-gray-50"}`}
                    onClick={() => setReadingMode("standard")}
                  >
                    <span className="font-bold">Standard-</span> Our standard news articles with essential details
                  </button>

                  <button
                    className={`text-left p-4 rounded-lg border transition ${readingMode === "deep" ? "bg-gray-100 border-gray-200" : "bg-white hover:bg-gray-50"}`}
                    onClick={() => setReadingMode("deep")}
                  >
                    <span className="font-bold">Deep Dive-</span> Comprehensive analysis and in-depth reporting
                  </button>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <Markdown remarkPlugins={[remarkGfm]}>{getArticleContent()}</Markdown>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  )
}

export default ArticleDetail
