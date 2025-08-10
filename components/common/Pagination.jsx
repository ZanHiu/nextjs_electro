import React from 'react';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showInfo = true,
  total = 0,
  limit = 12
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4 mt-8">
      {showInfo && (
        <div className="text-sm text-gray-600">
          Hiển thị {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, total)} của {total} sản phẩm
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center px-3 py-2 text-sm font-medium rounded-md
            ${currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
            }
          `}
        >
          <ArrowLeftOutlinedIcon className="w-4 h-4 mr-1" />
          Trước
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${currentPage === page
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
                }
              `}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center px-3 py-2 text-sm font-medium rounded-md
            ${currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
            }
          `}
        >
          Sau
          <ArrowRightOutlinedIcon className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;