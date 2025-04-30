// src/app/explore/components/ArticleContent.tsx
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleContentProps {
  processedArticle: string;
  thoughtContent: string;
  expandedThought: boolean;
  setExpandedThought: (value: boolean) => void;
}

export default function ArticleContent({
  processedArticle,
  thoughtContent,
  expandedThought,
  setExpandedThought,
}: ArticleContentProps) {
  return (
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
            <CardTitle className="text-2xl font-bold">
              Generated Article
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-[#FFF5F5] text-[#FF7E77] border-[#FFDED9]"
            >
              AI Generated
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none p-8 md:p-12">
          <Markdown remarkPlugins={[remarkGfm]}>{processedArticle}</Markdown>
        </CardContent>
      </Card>
    </div>
  );
}
