// src/app/explore/components/SortOptions.tsx
import React from "react";

type SortOption = "newest" | "oldest";

interface SortOptionsProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortOption, onSortChange }) => {
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
          onClick={() => onSortChange("newest")}
        >
          Newest
        </button>
        <button
          className={`px-3 py-1 text-sm ${
            sortOption === "oldest"
              ? "bg-[#FF7E77] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onSortChange("oldest")}
        >
          Oldest
        </button>
      </div>
    </div>
  );
};

export default SortOptions;