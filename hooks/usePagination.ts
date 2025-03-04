import { useMemo } from 'react';
import { useRouter } from 'next/router';

type PaginationItem = number | 'dots';

interface UsePaginationProps {
  totalItems: number;
  pageSize: number;
  siblingCount?: number;
  currentPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  pageItems: PaginationItem[];
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export const usePagination = ({
  totalItems,
  pageSize,
  siblingCount = 1,
  currentPage: propCurrentPage,
}: UsePaginationProps): UsePaginationReturn => {
  const router = useRouter();
  const currentPage = propCurrentPage || Number(router.query.page) || 1;

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  // Generate array of page numbers
  const pageItems = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + first + current + last

    // Case 1: If the number of pages is less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate left and right sibling index
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Should show dots between siblings and ends
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Default case
    if (!shouldShowLeftDots && shouldShowRightDots) {
      // Show first 1, ..., last
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, 'dots', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      // Show first, ..., last n
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );

      return [1, 'dots', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      // Show first, ..., middle, ..., last
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );

      return [1, 'dots', ...middleRange, 'dots', totalPages];
    }

    // Fallback
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages, currentPage, siblingCount]);

  // Check if current page is first or last
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Navigate to a specific page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page: page.toString() },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (!isLastPage) {
      goToPage(currentPage + 1);
    }
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (!isFirstPage) {
      goToPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    pageItems,
    isFirstPage,
    isLastPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
};
