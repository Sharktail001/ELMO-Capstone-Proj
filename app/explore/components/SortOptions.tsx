// src/app/explore/components/SortOptions.tsx
import React from "react";

type SortOption = "newest" | "oldest";

interface SortOptionsProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  articles: any[]; // Add articles prop to handle sorting
  setFilteredArticles: (articles: any[]) => void; // Function to update filtered articles
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortOption,
  onSortChange,
  articles,
  setFilteredArticles,
}) => {
  const handleSortChange = (option: SortOption) => {
    onSortChange(option);

    // Sort articles based on the selected option
    const sortedArticles = [...articles].sort((a, b) => {
      const dateA = new Date(a.published_date).getTime() || 0;
      const dateB = new Date(b.published_date).getTime() || 0;

      return option === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredArticles(sortedArticles);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <div className="flex rounded-md border border-gray-200 overflow-hidden">
        <button
          className={`px-3 py-1 text-sm ${
            sortOption === "newest"
              ? "bg-[#FF7E77] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => handleSortChange("newest")}
        >
          Newest
        </button>
        <button
          className={`px-3 py-1 text-sm ${
            sortOption === "oldest"
              ? "bg-[#FF7E77] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => handleSortChange("oldest")}
        >
          Oldest
        </button>
      </div>
    </div>
  );
};

export default SortOptions;