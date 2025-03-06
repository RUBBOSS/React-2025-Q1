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
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );
  const pageItems = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3; 
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'dots', totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, 'dots', ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, 'dots', ...middleRange, 'dots', totalPages];
    }
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages, currentPage, siblingCount]);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
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
  const goToNextPage = () => {
    if (!isLastPage) {
      goToPage(currentPage + 1);
    }
  };
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
