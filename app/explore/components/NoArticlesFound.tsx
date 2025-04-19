// src/app/explore/components/NoArticlesFound.tsx
import { Search } from "lucide-react"

interface NoArticlesFoundProps {
  hasFilters?: boolean
  onResetFilters?: () => void
}

export default function NoArticlesFound({ hasFilters = false, onResetFilters }: NoArticlesFoundProps) {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">No articles found</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {hasFilters ? (
          <>
            No articles match your current filters. 
            {onResetFilters && (
              <button 
                onClick={onResetFilters} 
                className="text-[#FF7E77] hover:text-[#FF5951] font-medium ml-1 hover:underline"
              >
                Clear filters
              </button>
            )}
          </>
        ) : (
          "Try searching with different keywords or generate a new article using the search bar above."
        )}
      </p>
    </div>
  )
}