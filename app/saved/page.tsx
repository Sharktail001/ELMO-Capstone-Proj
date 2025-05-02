"use client";

import { useEffect, useState, useCallback } from "react";
import ArticleGrid from "../explore/components/ArticleGrid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Article } from "../../app/explore/types";
import { useAuth } from "@/lib/useAuth";
import {
  getUserSavedArticles,
  removeUserSavedArticle,
} from "@/lib/amplifyConfig";

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchSavedArticles = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const saved = await getUserSavedArticles(user.userId);
      setSavedArticles(saved || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch saved articles.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSavedArticles();
    }
  }, [user, fetchSavedArticles]);

  const handleArticleClick = (article: Article) => {
    router.push(`/saved/${encodeURIComponent(article.title)}`);
  };

  const handleSaveClick = async (article: Article) => {
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      await removeUserSavedArticle(user.userId, article.title);
      await fetchSavedArticles();
    } catch (err) {
      console.error("Failed to remove saved article:", err);
      setError("Could not update saved articles.");
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center rounded-lg px-4 md:px-10 py-6 min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Saved Articles</h1>
        {savedArticles.length > 0 ? (
          <ArticleGrid
            articles={savedArticles}
            savedArticles={savedArticles.map((a) => a.title)}
            handleArticleClick={handleArticleClick}
            handleSaveClick={handleSaveClick}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">You have no saved articles yet.</p>
            <Button onClick={() => router.push("/explore")}>Explore Articles</Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedArticles;
