"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Loader2, AlertTriangle, ChevronRight, ExternalLink, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import withAuth from "../../lib/withAuth"
import { getTableItems } from "@/lib/amplifyConfig"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function Explore() {
  const [prompt, setPrompt] = useState("")
  const [rawArticle, setRawArticle] = useState("")
  const [processedArticle, setProcessedArticle] = useState("")
  const [thoughtContent, setThoughtContent] = useState("s")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedThought, setExpandedThought] = useState(false)
  const [articles, setArticles] = useState<any[]>([])
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [isArticlesLoading, setIsArticlesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("search")

  useEffect(() => {
    const fetchArticles = async () => {
      setIsArticlesLoading(true)
      try {
        const data = await getTableItems("ELMO-Articles-Table")
        console.log("Fetched articles:", data)
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
    if (prompt.trim()) {
      const filtered = articles.filter(
        (article) =>
          article.title?.toLowerCase().includes(prompt.toLowerCase()) ||
          article.description?.toLowerCase().includes(prompt.toLowerCase()),
      )
      setFilteredArticles(filtered)
    } else {
      setFilteredArticles(articles)
    }
  }, [prompt, articles])

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

        if (done) {
          break
        }

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5951] to-[#FF7E77] mb-3">
            ELMO
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your AI-powered news assistant. Search, discover, and generate articles on any topic.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="group">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="pl-12 pr-12 py-7 text-lg rounded-full border-gray-200 shadow-lg bg-white focus-visible:ring-[#FF7E77] focus-visible:ring-offset-2 transition-all duration-300"
              placeholder="What would you like to learn about today?"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 transition-all duration-300 group-focus-within:text-[#FF7E77]">
              <Search />
            </div>
            <button
              type="submit"
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-[#FF7E77] text-white rounded-full transition-all duration-300 ease-in-out ${
                prompt ? "opacity-100 scale-100" : "opacity-0 scale-90"
              } hover:bg-[#FF5951]`}
              disabled={!prompt.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 max-w-4xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs for Generated Content and Search Results */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="generated" disabled={!processedArticle && !isLoading}>
              Generated Article
            </TabsTrigger>
          </TabsList>

          {/* Generated Article Tab */}
          <TabsContent value="generated" className="space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-[#FF7E77] mb-4" />
                <p className="text-gray-600">Generating your article...</p>
              </div>
            )}

            {processedArticle && (
              <div className="space-y-6">
                {thoughtContent && (
                  <Card className="border border-gray-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                      <CardTitle className="flex items-center text-base font-medium">
                        <button
                          onClick={() => setExpandedThought(!expandedThought)}
                          className="flex items-center hover:text-[#FF7E77] transition-colors"
                        >
                          <ChevronRight
                            className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                              expandedThought ? "rotate-90" : ""
                            }`}
                          />
                          AI Thought Process
                        </button>
                      </CardTitle>
                    </CardHeader>
                    {expandedThought && (
                      <CardContent className="bg-gray-50/50 p-4 text-sm">
                        <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700 bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                          {thoughtContent}
                        </pre>
                      </CardContent>
                    )}
                  </Card>
                )}

                <Card className="border-0 shadow-xl overflow-hidden bg-white">
                  <CardHeader className="border-b border-gray-100 bg-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">Generated Article</CardTitle>
                      <Badge variant="outline" className="bg-[#FFF5F5] text-[#FF7E77] border-[#FFDED9]">
                        AI Generated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none p-8 md:p-12">
                    <Markdown remarkPlugins={[remarkGfm]}>{processedArticle}</Markdown>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Search Results Tab */}
          <TabsContent value="search">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {prompt ? `Results for "${prompt}"` : "Latest Articles"}
                </h2>
                {filteredArticles.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>

            {isArticlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden border-0 shadow-md">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-5">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="px-5 pb-5 pt-0">
                      <Skeleton className="h-4 w-1/4" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No articles found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try searching with different keywords or generate a new article using the search bar above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group"
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
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {article.category || "News"}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(article.published_date)}
                        </div>
                      </div>
                      <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-[#FF7E77] transition-colors">
                        {article.title || "Untitled"}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {article.description || "No description available."}
                      </p>
                    </CardContent>
                    <CardFooter className="px-5 pb-5 pt-0 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#FF7E77] hover:text-[#FF5951] hover:bg-[#FFF5F5] gap-1"
                        asChild
                      >
                        <a href={article.url || "#"} target="_blank" rel="noopener noreferrer">
                          Read more <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default withAuth(Explore);