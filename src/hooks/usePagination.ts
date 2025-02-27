interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  currentPage,
}: PaginationProps) {
  const validItemsPerPage = Math.max(1, Math.abs(itemsPerPage));
  const validTotalItems = isNaN(totalItems) ? 0 : Math.max(0, totalItems);
  const totalPages = Math.ceil(validTotalItems / validItemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  return {
    totalPages,
    currentPage: validCurrentPage,
    nextPage: validCurrentPage < totalPages ? validCurrentPage + 1 : null,
    prevPage: validCurrentPage > 1 ? validCurrentPage - 1 : null,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
  };
}
