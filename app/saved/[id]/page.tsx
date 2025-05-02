"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getTableItemById,
  getUserSavedArticles,
  saveUserArticles,
  removeUserSavedArticle,
} from "@/lib/amplifyConfig";
import {
  ChevronLeft,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/useAuth";

const LOCALHOST_IP = "https://workable-lemur-primary.ngrok-free.app";
const AI_MODEL = "deepseek-r1:14b";

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
];

function ArticleDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [displayedContent, setDisplayedContent] = useState<string | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isContentModified, setIsContentModified] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const data = await getTableItemById(
          "ELMO-Articles-Table",
          decodeURIComponent(id as string)
        );
        if (data) {
          setArticle(data);
          setDisplayedContent(data.full_text || null);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch saved articles from the local storage or database
    const fetchSavedArticles = async () => {
      if (!user) return;
      const saved = await getUserSavedArticles(user.userId);
      setSavedArticles(saved?.map((item: any) => item.title) || []);
    };

    fetchSavedArticles();
    fetchArticle();
  }, [id, user]);

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

  const handleBackClick = () => {
    router.back();
  };

  const handleSaveClick = async () => {
    if (!article) return;
    if (!user) return;

    const tempsavedArticles = await getUserSavedArticles(user.userId);
    console.log("Saved Articles:", tempsavedArticles);
    if (tempsavedArticles) {
      const isSaved = tempsavedArticles.some(
        (savedArticle: any) => savedArticle.title === article.title
      );
      if (!isSaved) {
        await saveUserArticles(user.userId, article);
        setSavedArticles((prev) => [...prev, article.title]);
      } else {
        await removeUserSavedArticle(user.userId, article.title);
        setSavedArticles((prev) =>
          prev.filter((savedId) => savedId !== article.title)
        );
      }
    }
  };

  const handleSimplify = async () => {
    if (!article?.full_text || isSimplifying) return;

    setIsSimplifying(true);
    try {
      const response = await fetch(`${LOCALHOST_IP}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          prompt: `Simplify the following article text to make it more concise and easier to understand. Use simpler language and shorter sentences while maintaining the key points.
          
          Article: ${article.full_text}`,
          stop: ["<think></think>"],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Extract just the response part from the JSON
      let simplifiedText = "";
      if (data && data.response) {
        simplifiedText = data.response.replace(
          /^<think>[\s\S]*?<\/think>\s*/g,
          ""
        );
      }

      setAiResponse(simplifiedText);
      setDisplayedContent(simplifiedText);
      setIsContentModified(true);
    } catch (err) {
      console.error("Failed to simplify text:", err);
      alert("Failed to simplify the article. Please try again.");
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleExpand = async () => {
    if (!article?.full_text || isExpanding) return;

    setIsExpanding(true);
    try {
      const response = await fetch(`${LOCALHOST_IP}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          prompt: `Expand on the following article to provide more detail, context, and explanation. Make it more comprehensive while maintaining the original meaning.
          
          Article: ${article.full_text}`,
          stop: ["<think></think>"],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Extract just the response part from the JSON
      let expandedText = "";
      if (data && data.response) {
        expandedText = data.response.replace(
          /^<think>[\s\S]*?<\/think>\s*/g,
          ""
        );
      }

      setAiResponse(expandedText);
      setDisplayedContent(expandedText);
      setIsContentModified(true);
    } catch (err) {
      console.error("Failed to expand text:", err);
      alert("Failed to expand the article. Please try again.");
    } finally {
      setIsExpanding(false);
    }
  };

  const resetToOriginal = () => {
    setDisplayedContent(article?.full_text || null);
    setAiResponse("");
    setIsContentModified(false);
  };

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
    );
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
          <Button
            className="mt-6 bg-[#FF7E77] hover:bg-[#FF5951]"
            onClick={handleBackClick}
          >
            Return to articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center rounded-lg px-4 md:px-10 py-6 min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Button>

        {article && (
          <article>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  {(() => {
                    const category = categories.find(
                      (i) => i.value === article.category
                    );
                    return category
                      ? `${category.name} ${category.emoji} `
                      : "📰 News";
                  })()}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(article.published_date)}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSaveClick}
                  className="ml-auto"
                >
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
                    src={article.urlToImage}
                    alt={article.title || "Article Image"}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex justify-start mb-4 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-[#FFDED9] text-[#FF7E77] hover:bg-[#FFF5F5] hover:text-[#FF5951]"
                  onClick={handleSimplify}
                  disabled={isSimplifying || isExpanding}
                >
                  {isSimplifying ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Simplifying...
                    </>
                  ) : (
                    "Simplify with ELMO AI"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-[#FFDED9] text-[#FF7E77] hover:bg-[#FFF5F5] hover:text-[#FF5951]"
                  onClick={handleExpand}
                  disabled={isSimplifying || isExpanding}
                >
                  {isExpanding ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Expanding...
                    </>
                  ) : (
                    "Expand with ELMO AI"
                  )}
                </Button>
                {isContentModified && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-600 hover:bg-gray-100"
                    onClick={resetToOriginal}
                  >
                    Reset to original
                  </Button>
                )}
              </div>
              <div className="prose prose-lg max-w-none">
                {displayedContent ? (
                  <>
                    {aiResponse ? (
                      <div>{aiResponse}</div>
                    ) : (
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {displayedContent}
                      </Markdown>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">
                    {article?.full_text || "No content available."}
                  </p>
                )}
              </div>

              {article.url && (
                <div className="mt-12 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="gap-2 text-[#FF7E77] hover:text-[#FF5951] hover:bg-[#FFF5F5] border-[#FFDED9]"
                    asChild
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
  );
}

export default ArticleDetail;
