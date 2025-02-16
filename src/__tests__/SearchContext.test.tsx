import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from '@testing-library/react';
import { SearchProvider, useSearch } from '../context/SearchContext';
import { SearchComponentProps } from '../context/searchTypes';

const TestComponent = ({ onSearch }: SearchComponentProps) => {
  const { searchTerm, setSearchTerm } = useSearch();

  const handleClick = () => {
    setSearchTerm('pikachu');
    onSearch?.('pikachu');
  };

  return (
    <div>
      <div data-testid="search-term">{searchTerm}</div>
      <button onClick={handleClick}>Set Term</button>
    </div>
  );
};

describe('SearchContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides search context to children', () => {
    const mockOnSearch = vi.fn();
    render(
      <SearchProvider>
        <TestComponent onSearch={mockOnSearch} />
      </SearchProvider>
    );

    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    fireEvent.click(screen.getByText('Set Term'));
    expect(screen.getByTestId('search-term')).toHaveTextContent('pikachu');
  });

  it('provides search context', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    expect(result.current.searchTerm).toBe('');
    expect(typeof result.current.setSearchTerm).toBe('function');
  });

  it('updates search term', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    act(() => {
      result.current.setSearchTerm('pikachu');
    });

    expect(result.current.searchTerm).toBe('pikachu');
  });

  it('persists search term to localStorage', async () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    act(() => {
      result.current.setSearchTerm('bulbasaur');
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(localStorage.getItem('searchTerm')).toBe('bulbasaur');
  });

  it('provides default search term', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });
    expect(result.current.searchTerm).toBe('');
  });

  it('persists search term to localStorage', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    act(() => {
      result.current.setSearchTerm('charizard');
    });

    expect(localStorage.getItem('searchTerm')).toBe('charizard');
  });
});
