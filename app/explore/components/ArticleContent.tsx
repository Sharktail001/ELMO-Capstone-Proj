import { useState } from "react";
import { ChevronRight, ChevronDown, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleContentProps {
  processedArticle: string;
  thoughtContent: string;
  expandedThought: boolean;
  setExpandedThought: (value: boolean) => void;
  isGenerating?: boolean;
}

function CollapsibleThink({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600 hover:text-[#FF7E77] transition-colors"
      >
        <Lightbulb size={16} />
        <span>AI Thought</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && (
        <div className="bg-gray-50 rounded-md p-4 border border-gray-100 mb-4 overflow-auto max-h-96 text-sm text-gray-700">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
      )}
    </div>
  );
}

export default function ArticleContent({
  processedArticle,
  thoughtContent,
  expandedThought,
  setExpandedThought,
  isGenerating = false,
}: ArticleContentProps) {
  const renderWithThinks = () => {
    const parts: React.ReactNode[] = [];
    const regex = /<think>([\s\S]*?)<\/think>/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(processedArticle)) !== null) {
      const before = processedArticle.slice(lastIndex, match.index);
      if (before.trim()) {
        parts.push(
          <div key={lastIndex} className="prose max-w-none mb-4">
            <Markdown remarkPlugins={[remarkGfm]}>{before}</Markdown>
          </div>
        );
      }

      parts.push(
        <CollapsibleThink key={match.index} content={match[1].trim()} />
      );
      lastIndex = regex.lastIndex;
    }

    const remaining = processedArticle.slice(lastIndex);
    if (remaining.trim()) {
      parts.push(
        <div key="end" className="prose max-w-none mb-4">
          <Markdown remarkPlugins={[remarkGfm]}>{remaining}</Markdown>
        </div>
      );
    }

    return parts;
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-white border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Generated Article
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-[#FFF5F4] text-[#FF7E77] border-[#FFE5E3]"
          >
            AI Generated
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-8 px-6">
        {thoughtContent && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setExpandedThought(!expandedThought)}
              className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600 hover:text-[#FF7E77] transition-colors"
            >
              <Lightbulb size={16} />
              <span>AI Thought Process</span>
              {expandedThought ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {expandedThought && (
              <div className="bg-gray-50 rounded-md p-4 border border-gray-100 mb-4 overflow-auto max-h-96 text-sm text-gray-700">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {thoughtContent}
                </Markdown>
              </div>
            )}
          </div>
        )}

        {renderWithThinks()}
      </CardContent>
    </Card>
  );
}
