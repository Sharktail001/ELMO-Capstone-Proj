"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { getTableItems } from "@/lib/amplifyConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import withAuth from "../../lib/withAuth";
import { useAuth } from "../../lib/useAuth";
import SearchBar from "./components/SearchBar";
import ErrorAlert from "./components/ErrorAlert";
import ArticleContent from "./components/ArticleContent";
import ArticleGrid from "./components/ArticleGrid";
import LoadingArticles from "./components/LoadingArticles";
import NoArticlesFound from "./components/NoArticlesFound";
import LoadingArticleGeneration from "./components/LoadingArticlesGeneration";
import CategoryFilters from "./components/CategoryFilters";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Star,
  Laptop,
  TestTube,
  Pill,
  Plane,
  Theater,
  Paintbrush,
  Leaf,
  Pizza,
  Trophy,
} from "lucide-react";
import {
  saveUserArticles,
  removeUserSavedArticle,
  getUserSavedArticles,
  saveLastVisitedArticle,
} from "@/lib/amplifyConfig";
import Pagination from "./components/Pagination";

const categories = [
  { name: "Breaking News & Current Events", value: "general", icon: Star },
  { name: "Technology & Innovation 💻", value: "technology", icon: Laptop },
  { name: "Science 🧪", value: "science", icon: TestTube },
  { name: "Health & Wellness 💊", value: "health", icon: Pill },
  { name: "Travel ✈️", value: "travel", icon: Plane },
  { name: "Entertainment & Media 🎭", value: "entertainment", icon: Theater },
  { name: "Arts & Culture 🎨", value: "art", icon: Paintbrush },
  { name: "Opinions & Deep Dives ☘️", value: "min", icon: Leaf },
  { name: "Food 🍕", value: "food", icon: Pizza },
  { name: "Sports & Lifestyle 🏈", value: "sports", icon: Trophy },
];

function Explore() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [rawArticle, setRawArticle] = useState("");
  const [processedArticle, setProcessedArticle] = useState("");
  const [thoughtContent, setThoughtContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedThought, setExpandedThought] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("search");
  const [activeCategory, setActiveCategory] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [GeneratedArticles, setGeneratedArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchGeneratedArticles = async () => {
      if (user && activeTab === "generated") {
        try {
          const data = await getTableItems("ELMO-GeneratedArticles-Table"); // Replace with your actual table name
          const filtered =
            data.filter((article) => article.userId === user.userId) || [];
          setGeneratedArticles(filtered);
        } catch (err) {
          console.error("Failed to load generated articles", err);
        }
      }
    };

    fetchGeneratedArticles();
  }, [activeTab, user]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(12); // Number of articles per page
  const [paginatedArticles, setPaginatedArticles] = useState<any[]>([]);

  // Reference to track if article is currently being generated
  const generatingRef = useRef(false);
  // Add a cursor effect for token-by-token generation
  // Set up cursor blink effect during generation
  useEffect(() => {
    let cursorInterval: NodeJS.Timeout | null = null;

    return () => {
      if (cursorInterval) clearInterval(cursorInterval);
    };
  }, [isLoading]);

  // Memoized function to fetch articles
  const fetchArticles = useCallback(async () => {
    if (isArticlesLoading) {
      try {
        const data = await getTableItems("ELMO-Articles-Table");
        if (data) {
          setArticles(data);
          // We'll set filtered articles in the useEffect that depends on articles
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setIsArticlesLoading(false);
      }
    }
  }, [isArticlesLoading]);

  // Fetch articles on component mount only
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Process raw article once when it changes
  useEffect(() => {
    if (rawArticle) {
      const thoughtMatch = rawArticle.match(/<Thinking>(.*?)<\/think>/s);
      const markdownContent = rawArticle
        .replace(/<Thinking>.*?<\/think>/s, "")
        .trim();

      if (thoughtMatch) {
        setThoughtContent(thoughtMatch[1].trim());
      }
      setProcessedArticle(markdownContent);
    }
  }, [rawArticle]);

  // Memoize the filtered articles computation
  const computeFilteredArticles = useMemo(() => {
    let filtered = [...articles];

    if (prompt.trim()) {
      filtered = filtered.filter(
        (article) =>
          article.title?.toLowerCase().includes(prompt.toLowerCase()) ||
          article.description?.toLowerCase().includes(prompt.toLowerCase())
      );
    }

    if (activeCategory.length > 0) {
      filtered = filtered.filter((article) => {
        const articleCategory = article.category || "Uncategorized";
        return activeCategory.includes(articleCategory);
      });
    } else {
      filtered = filtered.filter((article) => article.category !== null);
    }

    // Sort after filtering to improve performance
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.published_date).getTime() || 0;
      const dateB = new Date(b.published_date).getTime() || 0;

      return sortOption === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [prompt, articles, activeCategory, sortOption]);

  // Update filtered articles when computation changes
  useEffect(() => {
    setFilteredArticles(computeFilteredArticles);
    setCurrentPage(1); // Reset to first page when filters change
  }, [computeFilteredArticles]);

  // Update paginated articles when filtered articles or current page changes
  useEffect(() => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    setPaginatedArticles(
      filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)
    );
  }, [filteredArticles, currentPage, articlesPerPage]);

  // Fetch saved articles only once when user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchSavedArticles = async () => {
      const saved = await getUserSavedArticles(user.userId);
      setSavedArticles(saved?.map((item: any) => item.title) || []);
    };
    fetchSavedArticles();
  }, [user]);

  useEffect(() => {
    const fetchGeneratedArticles = async () => {
      if (user && activeTab === "generated") {
        try {
          const data = await getTableItems("ELMO-GeneratedArticles-Table"); // Replace with your actual table name
          const filtered = data.filter(
            (article) => article.userId === user.userId
          );
          setGeneratedArticles(filtered);
        } catch (err) {
          console.error("Failed to load generated articles", err);
        }
      }
    };

    fetchGeneratedArticles();
  }, [activeTab, user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setIsLoading(true);
    setRawArticle("");
    setProcessedArticle("");
    setThoughtContent("");
    setError(null);
    setExpandedThought(false);
    setActiveTab("generated");

    // Set generating flag
    generatingRef.current = true;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate article");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      // For token-by-token display, we add each token directly to the state
      while (generatingRef.current) {
        const { done, value } = await reader.read();

        if (done) {
          generatingRef.current = false;
          break;
        }

        const chunk = decoder.decode(value);

        // Add each token directly to the raw article state
        setRawArticle((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error generating article:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate article"
      );
    } finally {
      setIsLoading(false);
      generatingRef.current = false;
    }
  };

  const generateNewArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!user) return;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user.userId }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/explore/${encodeURIComponent(data.title)}`);
      } else {
        console.error("Generation failed", data.error);
      }
    } catch (err) {
      console.error("Error generating new article", err);
    }
  };

  const handleCategoryChange = useCallback((category: string | null) => {
    if (category === null) {
      setActiveCategory([]);
      return;
    }

    setActiveCategory((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  const handleArticleClick = useCallback(
    (article: any) => {
      if (!user) return;
      saveLastVisitedArticle(user.userId, article);
      router.push(`/explore/${encodeURIComponent(article.title)}`);
    },
    [user, router]
  );

  const resetFilters = useCallback(() => {
    setPrompt("");
    setActiveCategory([]);
  }, []);

  // Page change handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results when page changes
    window.scrollTo({
      top: document.getElementById("results-header")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const storedPreferencesApplied = localStorage.getItem("preferencesApplied");
    if (storedPreferencesApplied === "true") {
      setPreferencesApplied(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && user && !preferencesApplied) {
      if (user && Array.isArray(user.preferences)) {
        setActiveCategory(user.preferences);
      } else {
        setActiveCategory([]);
      }
      setPreferencesApplied(true);
      localStorage.setItem("preferencesApplied", "true");
    }
  }, [loading, user, preferencesApplied]);

  const handleSaveClick = useCallback(
    async (article: any) => {
      if (!user) return;

      try {
        const isSaved = savedArticles.includes(article.title);
        if (!isSaved) {
          await saveUserArticles(user.userId, article);
          setSavedArticles((prev) => [...prev, article.title]);
        } else {
          await removeUserSavedArticle(user.userId, article.title);
          setSavedArticles((prev) =>
            prev.filter((title) => title !== article.title)
          );
        }
      } catch (err) {
        console.error("Error saving/removing article:", err);
      }
    },
    [user, savedArticles]
  );

  // Memoize active category badges
  const activeCategoryBadges = useMemo(() => {
    return categories
      .filter((cat) => activeCategory.includes(cat.value))
      .map((cat) => {
        const IconComponent = cat.icon;
        return (
          <Badge
            key={cat.value}
            variant="secondary"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 ml-2 flex items-center gap-1"
          >
            <IconComponent size={14} />
            {cat.name}
          </Badge>
        );
      });
  }, [activeCategory]);

  if (loading) {
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

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col items-center rounded-lg px-4 md:px-10 py-6 min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
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
          handleSubmit={
            activeTab === "search" ? handleSubmit : generateNewArticle
          }
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
            categories={categories}
          />
        )}

        {error && <ErrorAlert message={error} />}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-7xl mx-auto"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="generated">Generated Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="generated" className="space-y-6">
            {isLoading && <LoadingArticleGeneration />}
            {(processedArticle || isLoading) && (
              <ArticleContent
                processedArticle={processedArticle}
                thoughtContent={thoughtContent}
                expandedThought={expandedThought}
                setExpandedThought={setExpandedThought}
                isGenerating={isLoading}
              />
            )}

            {!isLoading && processedArticle === "" && (
              <>
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Generated Articles
                </h2>
                <div className="border-b border-gray-200"></div>
                <ArticleGrid
                  articles={GeneratedArticles}
                  handleArticleClick={handleArticleClick}
                  savedArticles={savedArticles}
                  handleSaveClick={handleSaveClick}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="search">
            <div className="mb-6" id="results-header">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {prompt || activeCategory.length > 0 ? (
                    <>
                      Results {prompt ? `for "${prompt}"` : ""}
                      {activeCategory.length > 0 && (
                        <>
                          {prompt ? " in " : "in "}
                          {categories
                            .filter((cat) => activeCategory.includes(cat.value))
                            .map((cat) => {
                              const IconComponent = cat.icon;
                              return (
                                <Badge
                                  key={cat.value}
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 ml-2 flex items-center gap-1"
                                >
                                  <IconComponent size={14} />
                                  {cat.name}
                                </Badge>
                              );
                            })}
                        </>
                      )}
                    </>
                  ) : (
                    "Latest Articles"
                  )}
                </h2>
                <div className="flex items-center gap-3">
                  {(prompt || activeCategory.length > 0) && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-[#FF7E77] hover:text-[#FF5951] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                  {filteredArticles.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {filteredArticles.length} article
                      {filteredArticles.length !== 1 ? "s" : ""} found
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
                hasFilters={!!(prompt || activeCategory.length > 0)}
                onResetFilters={resetFilters}
              />
            ) : (
              <>
                <ArticleGrid
                  articles={paginatedArticles}
                  handleArticleClick={handleArticleClick}
                  savedArticles={savedArticles}
                  handleSaveClick={handleSaveClick}
                />
                {filteredArticles.length > articlesPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      filteredArticles.length / articlesPerPage
                    )}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default withAuth(Explore);
