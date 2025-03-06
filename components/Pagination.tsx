import { useRouter } from 'next/router';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const router = useRouter();
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      if (start > 2) {
        pages.push('ellipsis1');
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push('ellipsis2');
      }
      pages.push(totalPages);
    }
    return pages;
  };
  const handlePageClick = (page: number) => {
    onPageChange(page);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    }, undefined, { shallow: true });
  };
  return (
    <div className="flex items-center justify-center space-x-1 pt-8">
      {}
      <button
        onClick={() => currentPage !== 1 && handlePageClick(1)}
        disabled={currentPage === 1}
        className={`flex h-10 items-center justify-center rounded-md px-2 ${
          currentPage === 1
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-blue-100'
        }`}
        aria-label="Go to first page"
      >
        <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M9.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline">First</span>
      </button>
      {}
      <button
        onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex h-10 w-10 items-center justify-center rounded-md ${
          currentPage === 1
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-blue-100'
        }`}
        aria-label="Previous page"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {}
      {getPageNumbers().map((page, index) => {
        if (page === 'ellipsis1' || page === 'ellipsis2') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-gray-700"
            >
              &hellip;
            </span>
          );
        }
        return (
          <button
            key={`page-${page}`}
            onClick={() => handlePageClick(page as number)}
            className={`flex h-10 w-10 items-center justify-center rounded-md ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-blue-100'
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      {}
      <button
        onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex h-10 w-10 items-center justify-center rounded-md ${
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-blue-100'
        }`}
        aria-label="Next page"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {}
      <button
        onClick={() => currentPage !== totalPages && handlePageClick(totalPages)}
        disabled={currentPage === totalPages}
        className={`flex h-10 items-center justify-center rounded-md px-2 ${
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-blue-100'
        }`}
        aria-label="Go to last page"
      >
        <span className="hidden sm:inline">Last</span>
        <svg className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
export default Pagination;
