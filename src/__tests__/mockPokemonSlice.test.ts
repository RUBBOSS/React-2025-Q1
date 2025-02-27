import { describe, it, expect } from 'vitest';
import reducer, {
  setLoading,
  setError,
  setItems,
  toggleSelected,
} from '../store/mockPokemonSlice';

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

  it('should handle setLoading', () => {
    expect(reducer(initialState, setLoading(true))).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle setError', () => {
    const error = 'Error message';
    expect(reducer(initialState, setError(error))).toEqual({
      ...initialState,
      error,
    });
  });

  it('should handle setItems', () => {
    const items = [{ id: '1', name: 'bulbasaur', url: 'url' }];
    expect(reducer(initialState, setItems(items))).toEqual({
      ...initialState,
      items,
    });
  });

  it('should handle toggleSelected', () => {
    const stateWithToggle = reducer(initialState, toggleSelected('1'));
    expect(stateWithToggle.selectedItems).toContain('1');

    const stateWithRemoval = reducer(stateWithToggle, toggleSelected('1'));
    expect(stateWithRemoval.selectedItems).not.toContain('1');
  });
});
