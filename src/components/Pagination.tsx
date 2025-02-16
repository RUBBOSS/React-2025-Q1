import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', page.toString());
      setSearchParams(newParams);
    }
  };

  return (
    <div className="flex justify-center gap-2 my-4" data-testid="pagination">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        data-testid="first-page"
      >
        First
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        data-testid="prev-page"
      >
        Previous
      </button>
      <span className="px-3 py-1" data-testid="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        data-testid="next-page"
      >
        Next
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        data-testid="last-page"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
