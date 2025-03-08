'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type PaginationItem = number | 'dots';

interface UsePaginationProps {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
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
  totalPages,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPage = 1;
    const lastPage = totalPages;
    const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPage);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage);

    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from({ length: 4 }, (_, i) => i + 1);
      return [...leftRange, 'dots', lastPage];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from({ length: 4 }, (_, i) => lastPage - 3 + i);
      return [firstPage, 'dots', ...rightRange];
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
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`/?${params.toString()}`);
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
