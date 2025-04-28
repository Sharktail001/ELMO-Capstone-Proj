// src/app/explore/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTableItems } from "@/lib/amplifyConfig"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import withAuth from "../../lib/withAuth"
import SearchBar from "./components/SearchBar"
import ErrorAlert from "./components/ErrorAlert"
import ArticleContent from "./components/ArticleContent"
import ArticleGrid from "./components/ArticleGrid"
import LoadingArticles from "./components/LoadingArticles"
import NoArticlesFound from "./components/NoArticlesFound"
import LoadingArticleGeneration from "./components/LoadingArticlesGeneration"
import CategoryFilters from "./components/CategoryFilters"

function Explore() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [rawArticle, setRawArticle] = useState("")
  const [processedArticle, setProcessedArticle] = useState("")
  const [thoughtContent, setThoughtContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedThought, setExpandedThought] = useState(false)
  const [articles, setArticles] = useState<any[]>([])
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [isArticlesLoading, setIsArticlesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("search")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("newest")

  useEffect(() => {
    const fetchArticles = async () => {
      setIsArticlesLoading(true)
      try {
        const data = await getTableItems("ELMO-Articles-Table")
        // console.log("Fetched articles:", data)
        if (data) {
          setArticles(data)
          setFilteredArticles(data)
        }
      } catch (err) {
        console.error("Error fetching articles:", err)
      } finally {
        setIsArticlesLoading(false)
      }
    }
    fetchArticles()
  }, [])

  useEffect(() => {
    if (rawArticle) {
      const thoughtMatch = rawArticle.match(/<Thinking>(.*?)<\/think>/s)
      const markdownContent = rawArticle.replace(/<Thinking>.*?<\/think>/s, "").trim()

      if (thoughtMatch) {
        setThoughtContent(thoughtMatch[1].trim())
      }
      setProcessedArticle(markdownContent)
    }
  }, [rawArticle])

  useEffect(() => {
    let filtered = [...articles]

    if (prompt.trim()) {
      filtered = filtered.filter(
        (article) =>
          article.title?.toLowerCase().includes(prompt.toLowerCase()) ||
          article.description?.toLowerCase().includes(prompt.toLowerCase())
      )
    }

    if (activeCategory) {
      filtered = filtered.filter(
        (article) => (article.category || "Uncategorized") === activeCategory
      )
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime() || 0;
      const dateB = new Date(b.published_date).getTime() || 0;
      
      return sortOption === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredArticles(filtered)
    console.log("Filtered articles:", filtered)
  }, [prompt, articles, activeCategory, sortOption])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) return

    setIsLoading(true)
    setRawArticle("")
    setProcessedArticle("")
    setThoughtContent("")
    setError(null)
    setExpandedThought(false)
    setActiveTab("generated")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate article")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value)
        setRawArticle((prev) => prev + chunk)
      }
    } catch (error) {
      console.error("Error generating article:", error)
      setError(error instanceof Error ? error.message : "Failed to generate article")
      setRawArticle("")
      setProcessedArticle("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category)
    // const filter
  }

  const handleArticleClick = (articleId: string) => {
    router.push(`/explore/${encodeURIComponent(articleId)}`)
  }

  const resetFilters = () => {
    setPrompt("")
    setActiveCategory(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Search, discover, and generate articles on any topic.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          prompt={prompt} 
          setPrompt={setPrompt} 
          handleSubmit={handleSubmit} 
          isLoading={isLoading} 
        />

        {/* Category Filters */}
        {!isArticlesLoading && (
          <CategoryFilters 
            articles={articles}
            onFilterChange={handleCategoryChange}
            activeCategory={activeCategory}
            onSortChange={setSortOption}
            activeSortOption={sortOption}
          />
        )}

        {error && <ErrorAlert message={error} />}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="generated" disabled={!processedArticle && !isLoading}>
              Generated Article
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generated" className="space-y-6">
            {isLoading && <LoadingArticleGeneration />}
            {processedArticle && (
              <ArticleContent 
                processedArticle={processedArticle}
                thoughtContent={thoughtContent}
                expandedThought={expandedThought}
                setExpandedThought={setExpandedThought}
              />
            )}
          </TabsContent>

          <TabsContent value="search">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {(prompt || activeCategory) ? 
                    `Results ${prompt ? `for "${prompt}"` : ""} ${activeCategory ? `in ${activeCategory}` : ""}` : 
                    "Latest Articles"}
                </h2>
                <div className="flex items-center gap-3">
                  {(prompt || activeCategory) && (
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-[#FF7E77] hover:text-[#FF5951] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                  {filteredArticles.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>

            {isArticlesLoading ? (
              <LoadingArticles />
            ) : filteredArticles.length === 0 ? (
              <NoArticlesFound 
                hasFilters={!!(prompt || activeCategory)} 
                onResetFilters={resetFilters} 
              />
            ) : (
              <ArticleGrid 
                articles={filteredArticles} 
                handleArticleClick={handleArticleClick} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default withAuth(Explore)
