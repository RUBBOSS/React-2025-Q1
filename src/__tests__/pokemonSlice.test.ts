import { describe, it, expect } from 'vitest';
import reducer, {
  setItems,
  setLoading,
  setError,
  setPage,
} from '../features/pokemonSlice';

describe('pokemonSlice', () => {
  const initialState = {
    items: [],
    selectedItems: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchTerm: '',
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setItems', () => {
    const items = [{ name: 'bulbasaur', url: 'test-url' }];
    const actual = reducer(initialState, setItems(items));
    expect(actual.items).toEqual(items);
  });

  it('should handle setLoading', () => {
    const actual = reducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it('should handle setError', () => {
    const errorMessage = 'Test error';
    const actual = reducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
  });

  it('should handle setPage', () => {
    const actual = reducer(initialState, setPage(2));
    expect(actual.currentPage).toBe(2);
  });
});
