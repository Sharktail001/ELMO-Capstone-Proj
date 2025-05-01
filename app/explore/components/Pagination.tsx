// src/app/explore/components/Pagination.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust range if at start or end
    if (currentPage <= 3) {
      rangeEnd = Math.min(totalPages - 1, 4);
    } else if (currentPage >= totalPages - 2) {
      rangeStart = Math.max(2, totalPages - 3);
    }
    
    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pageNumbers.push('...');
    }
    
    // Add page numbers in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if not showing just a single page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      {/* Previous button */}
      <button 
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md flex items-center justify-center ${
          currentPage === 1 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === page
                  ? 'bg-[#FF7E77] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md flex items-center justify-center ${
          currentPage === totalPages 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;