"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ArticleContent from "../../components/ArticleContent";

const GeneratedArticlePage = () => {
  const router = useRouter();
  const params = useParams();
  const title = decodeURIComponent(params?.title || "");
  const [article, setArticle] = useState<string>("");
  const [thoughtContent, setThoughtContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedThought, setExpandedThought] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      if (!title) return;

      setIsGenerating(true);
      setArticle(""); // Clear previous content on new request

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: title }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Generation failed");
        }

        const result = await response.json();
        setArticle(result.article);
        setThoughtContent(result.thoughtContent || "");
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [title]);

  if (!title) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <ArticleContent
        processedArticle={article}
        thoughtContent={thoughtContent}
        expandedThought={expandedThought}
        setExpandedThought={setExpandedThought}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default GeneratedArticlePage;
