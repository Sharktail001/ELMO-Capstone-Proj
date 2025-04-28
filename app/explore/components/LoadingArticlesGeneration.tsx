// src/app/explore/components/LoadingArticleGeneration.tsx
import { Loader2 } from "lucide-react"

export default function LoadingArticleGeneration() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-[#FF7E77] mb-4" />
      <p className="text-gray-600">Generating your article...</p>
    </div>
  )
}
