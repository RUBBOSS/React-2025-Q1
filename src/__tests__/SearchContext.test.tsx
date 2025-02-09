import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchProvider, useSearch } from '../context/SearchContext';

const TestComponent = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  return (
    <div>
      <div data-testid="search-term">{searchTerm}</div>
      <button onClick={() => setSearchTerm('pikachu')}>Set Term</button>
    </div>
  );
};

describe('SearchContext', () => {
  it('provides search context to children', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    fireEvent.click(screen.getByText('Set Term'));
    expect(screen.getByTestId('search-term')).toHaveTextContent('pikachu');
  });
});
