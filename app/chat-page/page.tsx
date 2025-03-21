"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
// import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, ChevronRight } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import withAuth from "../../lib/withAuth";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [rawArticle, setRawArticle] = useState("");
  const [processedArticle, setProcessedArticle] = useState("");
  const [thoughtContent, setThoughtContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedThought, setExpandedThought] = useState(false);

  useEffect(() => {
    // Process the raw article when it changes
    if (rawArticle) {
      const thoughtMatch = rawArticle.match(/<think>(.*?)<\/think>/s);
      const markdownContent = rawArticle
        .replace(/<think>.*?<\/think>/s, "")
        .trim();

      if (thoughtMatch) {
        setThoughtContent(thoughtMatch[1].trim());
      }
      setProcessedArticle(markdownContent);
    }
  }, [rawArticle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setIsLoading(true);
    setRawArticle("");
    setProcessedArticle("");
    setThoughtContent("");
    setError(null);
    setExpandedThought(false);

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

      // Create a reader for streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      // Stream the response token by token
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and update the article text
        const chunk = decoder.decode(value);
        setRawArticle((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error generating article:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate article"
      );
      setRawArticle("");
      setProcessedArticle("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow container w-full px-4 py-8 mx-auto bg-light">
      <h1 className="text-3xl font-bold text-center">ELMO</h1>
      <p className="text-center text-gray-600 mb-6">
        Generate articles with AI
        <span className="text-gray-400"> (Powered by Deepseek)</span>
      </p>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="relative max-w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="pl-10 pr-12 py-6 text-lg rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#FF7E77] focus:ring focus:ring-[#FF7E77] focus:ring-opacity-20"
            placeholder="What would you like to learn about today?"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-all duration-200 ease-in-out cursor-pointer ${
              prompt ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            style={{ color: "#FF7E77" }}
          >
            <ArrowRight />
          </button>
        </form>
      </div>
      {processedArticle && (
        <div className="space-y-4">
          {thoughtContent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <button
                    onClick={() => setExpandedThought(!expandedThought)}
                    className="flex items-center hover:bg-accent hover:text-accent-foreground p-1 rounded"
                  >
                    <ChevronRight
                      className={`mr-2 transition-transform ${
                        expandedThought ? "rotate-90" : ""
                      }`}
                    />
                    AI Thought Process
                  </button>
                </CardTitle>
              </CardHeader>
              {expandedThought && (
                <CardContent className="bg-muted/50 p-4 rounded-b-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {thoughtContent}
                  </pre>
                </CardContent>
              )}
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Generated Article</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none p-12">
              <Markdown remarkPlugins={[remarkGfm]}>
                {processedArticle}
              </Markdown>
            </CardContent>
          </Card>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Latest Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="h-48 bg-gray-200 relative">
              <Image
                fill={true}
                src="/placeholder.svg?height=192&width=384"
                alt="AI and Machine Learning"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2 text-gray-900">
                AI and Machine Learning Fundamentals
              </h3>
              <p className="text-gray-600 text-sm">
                Learn the basics of artificial intelligence and how machine
                learning is transforming industries.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
              <span className="text-xs text-gray-500">5 min read</span>
              <button
                className="text-sm hover:text-[#FF5951] transition-colors"
                style={{ color: "#FF7E77" }}
              >
                Read more
              </button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="h-48 bg-gray-200 relative">
              <Image
                fill={true}
                src="/placeholder.svg?height=192&width=384"
                alt="Data Science"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2 text-gray-900">
                Data Science for Beginners
              </h3>
              <p className="text-gray-600 text-sm">
                Discover how to analyze and interpret complex data sets to drive
                business decisions.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
              <span className="text-xs text-gray-500">8 min read</span>
              <button
                className="text-sm hover:text-[#FF5951] transition-colors"
                style={{ color: "#FF7E77" }}
              >
                Read more
              </button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="h-48 bg-gray-200 relative">
              <Image
                fill={true}
                src="/placeholder.svg?height=192&width=384"
                alt="Natural Language Processing"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2 text-gray-900">
                Natural Language Processing
              </h3>
              <p className="text-gray-600 text-sm">
                Explore how computers understand and generate human language
                through NLP techniques.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
              <span className="text-xs text-gray-500">6 min read</span>
              <button
                className="text-sm hover:text-[#FF5951] transition-colors"
                style={{ color: "#FF7E77" }}
              >
                Read more
              </button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="h-48 bg-gray-200 relative">
              <Image
                fill={true}
                src="/placeholder.svg?height=192&width=384"
                alt="Computer Vision"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2 text-gray-900">
                Computer Vision Applications
              </h3>
              <p className="text-gray-600 text-sm">
                Learn how machines interpret visual information and the
                real-world applications.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
              <span className="text-xs text-gray-500">7 min read</span>
              <button
                className="text-sm hover:text-[#FF5951] transition-colors"
                style={{ color: "#FF7E77" }}
              >
                Read more
              </button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="h-48 bg-gray-200 relative">
              <Image
                fill={true}
                src="/placeholder.svg?height=192&width=384"
                alt="Reinforcement Learning"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2 text-gray-900">
                Reinforcement Learning Explained
              </h3>
              <p className="text-gray-600 text-sm">
                Understand how AI agents learn to make decisions through trial
                and error.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
              <span className="text-xs text-gray-500">10 min read</span>
              <button
                className="text-sm hover:text-[#FF5951] transition-colors"
                style={{ color: "#FF7E77" }}
              >
                Read more
              </button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="h-48 bg-gray-200 relative">
              <Image
                fill={true}
                src="/placeholder.svg?height=192&width=384"
                alt="AI Ethics"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2 text-gray-900">
                Ethics in Artificial Intelligence
              </h3>
              <p className="text-gray-600 text-sm">
                Explore the ethical considerations and challenges in developing
                responsible AI systems.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
              <span className="text-xs text-gray-500">9 min read</span>
              <button
                className="text-sm hover:text-[#FF5951] transition-colors"
                style={{ color: "#FF7E77" }}
              >
                Read more
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default withAuth(Home);