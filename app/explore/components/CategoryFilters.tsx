"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Dialog } from "@headlessui/react"
import { ArrowDownAZ, ArrowUpAZ, CalendarClock, Filter, SlidersHorizontal, X } from "lucide-react"

interface CategoryFiltersProps {
  articles: any[]
  onFilterChange: (category: string | null) => void
  activeCategory: string[]
  onSortChange?: (sortOption: string) => void
  activeSortOption?: string
}

const categories = [
  { name: "Breaking News & Current Events 🌟", value: "general" }, //YES - General
  { name: "Technology & Innovation 🎮", value: "technology" }, //YES
  { name: "Science 🧪", value: "science" }, //YES
  { name: "Health & Wellness 💊", value: "health" }, //YES
  { name: "Travel ✈️", value: "travel" },
  { name: "Entertainment & Media 🎭", value: "entertainment" }, //YES
  { name: "Arts & Culture 🎨", value: "art" },
  { name: "Opinions & Deep Dives ☘️", value: "min" },
  { name: "Food 🍕", value: "food" },
  { name: "Sports & Lifestyle 🏈", value: "sports" }, //YES
];

export default function CategoryFilters({
  articles,
  onFilterChange,
  activeCategory,
  onSortChange,
  activeSortOption = "newest",
}: CategoryFiltersProps) {
  // const [categories, setCategories] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [localSortOption, setLocalSortOption] = useState(activeSortOption)

  // Extract unique categories from articles
  // useEffect(() => {
  //   if (articles.length > 0) {
  //     const uniqueCategories = Array.from(
  //       new Set(articles.map((article) => article.category || "Uncategorized").filter(Boolean)),
  //     ) as string[]
  //     setCategories(uniqueCategories)
  //   }
  // }, [articles])

  const handleSortChange = (option: string) => {
    setLocalSortOption(option)
    if (onSortChange) {
      onSortChange(option)
    }
  }

  const handleApply = () => {
    if (onSortChange && localSortOption !== activeSortOption) {
      onSortChange(localSortOption)
    }
    setIsOpen(false)
  }

  if (categories.length === 0) return null

  const hasActiveFilters = activeCategory !== null || activeSortOption !== "newest"

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium shadow transition flex items-center gap-2",
          hasActiveFilters
            ? "bg-[#FF7E77] text-white hover:bg-[#ff5c50]"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium bg-white text-[#FF7E77] rounded-full">
            {(activeCategory ? 1 : 0) + (activeSortOption !== "newest" ? 1 : 0)}
          </span>
        )}
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xl transition-all transform">
            <div className="border-b border-gray-100">
              <div className="flex justify-between items-center p-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">Filters</Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onFilterChange(null)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      activeCategory.length === 0
                        ? "bg-[#FF7E77] text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    All
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => onFilterChange(category.value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        activeCategory.includes(category.value)
                          ? "bg-[#FF7E77] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CalendarClock className="w-4 h-4" />
                  Sort by date
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="newest"
                      checked={localSortOption === "newest"}
                      onChange={() => handleSortChange("newest")}
                      className="text-[#FF7E77] focus:ring-[#FF7E77]"
                    />
                    <div className="flex items-center gap-2">
                      <ArrowDownAZ className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Newest first</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="oldest"
                      checked={localSortOption === "oldest"}
                      onChange={() => handleSortChange("oldest")}
                      className="text-[#FF7E77] focus:ring-[#FF7E77]"
                    />
                    <div className="flex items-center gap-2">
                      <ArrowUpAZ className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Oldest first</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 rounded-md bg-[#FF7E77] text-white text-sm font-medium shadow hover:bg-[#ff5c50] transition"
              >
                Apply
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
