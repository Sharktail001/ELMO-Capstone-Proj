"use client"

import { useEffect, useState } from "react"
import ArticleGrid from "../explore/components/ArticleGrid"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Article } from "../../app/explore/types" // Adjusted the path to locate the types file
import { useAuth } from "@/lib/useAuth"
import { getUserSavedArticles, saveUserArticles, removeUserSavedArticle } from "@/lib/amplifyConfig"

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()

  const fetchSavedArticles = async () => {
    setIsLoading(true)
    try {
      if (!user) return
      const saved = await getUserSavedArticles(user.userId)
      setSavedArticles(saved || [])
      setIsLoading(false)
    } catch (error) {
      setError("Failed to fetch saved articles.")
    }
  }

  useEffect(() => {
    fetchSavedArticles()
  }, [user])

  const handleArticleClick = (article: any) => {
    router.push(`/saved/${article.title}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <main className="flex flex-col items-center rounded-lg px-4 md:px-10 py-6 min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Articles</h1>
      {savedArticles.length > 0 ? (
        <ArticleGrid
          articles={savedArticles}
          savedArticles={savedArticles.map(article => article.title).filter((id): id is string => id !== undefined)} // Pass only the IDs as required
          handleArticleClick={handleArticleClick} // Pass the click handler to the grid
          handleSaveClick={(article: any) => {
            if (user?.userId) {
              removeUserSavedArticle(user.userId, article.title)
              setIsLoading(true)
              setTimeout(() => {
                fetchSavedArticles()
              }, 200)
            }
          }}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">You have no saved articles yet.</p>
          <Button onClick={() => router.push("/explore")}>Explore Articles</Button>
        </div>
      )}
    </div>
  )
}

export default SavedArticles
