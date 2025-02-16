import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '../../hooks/usePagination';

describe('usePagination', () => {
  it('calculates correct pagination values', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 2,
      })
    );

    expect(result.current.totalPages).toBe(10);
    expect(result.current.nextPage).toBe(3);
    expect(result.current.prevPage).toBe(1);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(true);
  });

  it('handles first page correctly', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 30,
        itemsPerPage: 10,
        currentPage: 1,
      })
    );

    expect(result.current.hasPrevPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('handles last page correctly', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 30,
        itemsPerPage: 10,
        currentPage: 3,
      })
    );

    expect(result.current.hasPrevPage).toBe(true);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('handles zero items', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 0, itemsPerPage: 10, currentPage: 1 })
    );
    expect(result.current.totalPages).toBe(0);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPrevPage).toBe(false);
  });

  it('handles invalid current page', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10, currentPage: -1 })
    );
    expect(result.current.currentPage).toBe(1);
  });

  it('handles decimal numbers correctly', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 95, itemsPerPage: 10, currentPage: 1 })
    );
    expect(result.current.totalPages).toBe(10);
  });

  it('handles NaN values', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: NaN,
        itemsPerPage: 10,
        currentPage: 1,
      })
    );

    expect(result.current.totalPages).toBe(0);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('handles negative itemsPerPage', () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 100,
        itemsPerPage: -1,
        currentPage: 1,
      })
    );

    expect(result.current.totalPages).toBe(100);
  });
});
