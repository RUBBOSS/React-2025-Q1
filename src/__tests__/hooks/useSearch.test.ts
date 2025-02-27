import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useSearch } from '../../hooks/useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty search', () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.searchTerm).toBe('');
  });

  it('updates search term', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('pikachu');
    });

    expect(result.current.searchTerm).toBe('pikachu');
    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
  });

  it('loads persisted search term', () => {
    localStorage.setItem('searchTerm', 'bulbasaur');
    const { result } = renderHook(() => useSearch());
    expect(result.current.searchTerm).toBe('bulbasaur');
  });

  it('handles localStorage errors', () => {
    // Mock localStorage.getItem to throw
    const mockError = new Error('Storage error');
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw mockError;
    };

    const { result } = renderHook(() => useSearch());
    expect(result.current.searchTerm).toBe('');

    Storage.prototype.getItem = originalGetItem;
  });

  it('handles empty search term', () => {
    const { result } = renderHook(() => useSearch());
    act(() => {
      result.current.setSearchTerm('');
    });
    expect(result.current.searchTerm).toBe('');
  });
});
