"use client"

import { useEffect, useState } from "react"
import { getSavedArticles } from "@/lib/savedArticles"
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
    } catch (error) {
      setError("Failed to fetch saved articles.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedArticles()
  }, [user])

  const handleArticleClick = (id: string) => {
    router.push(`/saved/${id}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Articles</h1>
      {savedArticles.length > 0 ? (
        <ArticleGrid
          articles={savedArticles}
          handleArticleClick={handleArticleClick} // Pass the click handler to the grid
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
